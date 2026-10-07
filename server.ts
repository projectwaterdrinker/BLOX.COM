import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Player & Room data structures
interface PlayerState {
  id: string;
  ws: WebSocket;
  username: string;
  displayName: string;
  avatarConfig: any;
  gameId: string;
  roomId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: number;
  score: number;
  ping: number;
  joinedAt: number;
}

interface RoomChat {
  sender: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

// Active players by room (e.g. "blox-fruits:default" or "tower-of-hell:default")
const rooms = new Map<string, Map<string, PlayerState>>();
const roomChats = new Map<string, RoomChat[]>();

// WebSocket Server attached to same HTTP server (port 3000)
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  let currentPlayerId: string | null = null;
  let currentRoomId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'join') {
        const { playerId, username, displayName, avatarConfig, gameId, roomId = 'public-1', x = 80, y = 280 } = msg.payload;
        currentPlayerId = playerId;
        currentRoomId = `${gameId}:${roomId}`;

        if (!rooms.has(currentRoomId)) {
          rooms.set(currentRoomId, new Map());
        }
        if (!roomChats.has(currentRoomId)) {
          roomChats.set(currentRoomId, [
            { sender: 'Server', text: `Welcome to public multiplayer server [${roomId}]!`, timestamp: 'Now', isSystem: true }
          ]);
        }

        const room = rooms.get(currentRoomId)!;
        const player: PlayerState = {
          id: playerId,
          ws,
          username,
          displayName,
          avatarConfig,
          gameId,
          roomId,
          x,
          y,
          vx: 0,
          vy: 0,
          facing: 1,
          score: 0,
          ping: 25,
          joinedAt: Date.now()
        };

        room.set(playerId, player);

        // Send room initialization data to the joining client
        const otherPlayers = Array.from(room.values())
          .filter(p => p.id !== playerId)
          .map(p => ({
            id: p.id,
            username: p.username,
            displayName: p.displayName,
            avatarConfig: p.avatarConfig,
            x: p.x,
            y: p.y,
            vx: p.vx,
            vy: p.vy,
            facing: p.facing,
            score: p.score
          }));

        ws.send(JSON.stringify({
          type: 'room:init',
          payload: {
            roomId: currentRoomId,
            players: otherPlayers,
            chatHistory: roomChats.get(currentRoomId) || []
          }
        }));

        // Broadcast player join to other connected players in the room
        const joinPayload = JSON.stringify({
          type: 'player:joined',
          payload: {
            id: playerId,
            username,
            displayName,
            avatarConfig,
            x,
            y,
            score: 0
          }
        });

        room.forEach(p => {
          if (p.id !== playerId && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(joinPayload);
          }
        });
      }

      else if (msg.type === 'move' && currentRoomId && currentPlayerId) {
        const room = rooms.get(currentRoomId);
        if (!room) return;
        const player = room.get(currentPlayerId);
        if (!player) return;

        player.x = msg.payload.x;
        player.y = msg.payload.y;
        player.vx = msg.payload.vx || 0;
        player.vy = msg.payload.vy || 0;
        player.facing = msg.payload.facing || 1;

        // Broadcast movement delta to all other peers in the room
        const movePayload = JSON.stringify({
          type: 'player:moved',
          payload: {
            id: currentPlayerId,
            x: player.x,
            y: player.y,
            vx: player.vx,
            vy: player.vy,
            facing: player.facing
          }
        });

        room.forEach(p => {
          if (p.id !== currentPlayerId && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(movePayload);
          }
        });
      }

      else if (msg.type === 'action' && currentRoomId && currentPlayerId) {
        const room = rooms.get(currentRoomId);
        if (!room) return;

        const actionPayload = JSON.stringify({
          type: 'player:action',
          payload: {
            id: currentPlayerId,
            action: msg.payload.action,
            x: msg.payload.x,
            y: msg.payload.y
          }
        });

        room.forEach(p => {
          if (p.id !== currentPlayerId && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(actionPayload);
          }
        });
      }

      else if (msg.type === 'score' && currentRoomId && currentPlayerId) {
        const room = rooms.get(currentRoomId);
        if (!room) return;
        const player = room.get(currentPlayerId);
        if (player) {
          player.score = msg.payload.score;
        }

        const scorePayload = JSON.stringify({
          type: 'player:scored',
          payload: {
            id: currentPlayerId,
            score: msg.payload.score
          }
        });

        room.forEach(p => {
          if (p.id !== currentPlayerId && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(scorePayload);
          }
        });
      }

      else if (msg.type === 'chat' && currentRoomId) {
        const room = rooms.get(currentRoomId);
        if (!room) return;

        const chatObj: RoomChat = {
          sender: msg.payload.sender,
          text: msg.payload.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const chats = roomChats.get(currentRoomId) || [];
        chats.push(chatObj);
        if (chats.length > 50) chats.shift();
        roomChats.set(currentRoomId, chats);

        const chatPayload = JSON.stringify({
          type: 'chat:message',
          payload: chatObj
        });

        room.forEach(p => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(chatPayload);
          }
        });
      }
    } catch (err) {
      console.error('Error handling websocket message:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && currentPlayerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.delete(currentPlayerId);
        const leavePayload = JSON.stringify({
          type: 'player:left',
          payload: { id: currentPlayerId }
        });

        room.forEach(p => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(leavePayload);
          }
        });

        if (room.size === 0) {
          rooms.delete(currentRoomId);
        }
      }
    }
  });
});

// REST API endpoint to report live multiplayer server statistics
app.get('/api/multiplayer/stats', (_req, res) => {
  let totalOnline = 0;
  const activeServers: Array<{ room: string; count: number }> = [];

  rooms.forEach((room, roomKey) => {
    totalOnline += room.size;
    activeServers.push({ room: roomKey, count: room.size });
  });

  res.json({
    status: 'online',
    totalOnline,
    activeServers
  });
});

// Vite middleware integration in development vs static serving in production
async function setupViteOrStatic() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }
}

setupViteOrStatic().then(() => {
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Roblox Multiplayer Web Server is running on port ${PORT}`);
  });
});
