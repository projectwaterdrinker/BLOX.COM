import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  Trophy, 
  Users, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Wifi,
  WifiOff
} from 'lucide-react';
import { GameExperience } from '../../types/roblox';
import { useRoblox } from '../../context/RobloxContext';
import { sounds } from '../../services/soundEffects';

interface PlayableGameClientProps {
  game: GameExperience;
  onClose: () => void;
}

interface RemotePlayer {
  id: string;
  username: string;
  displayName: string;
  avatarConfig: any;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: number;
  score: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const PlayableGameClient: React.FC<PlayableGameClientProps> = ({ game, onClose }) => {
  const { user, awardBadgeToUser, filterSafeText } = useRoblox();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEscMenuOpen, setIsEscMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');

  // Real remote players connected via WebSocket
  const remotePlayersRef = useRef<Map<string, RemotePlayer>>(new Map());
  const [connectedPlayersCount, setConnectedPlayersCount] = useState<number>(1);

  // In-Game Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; timestamp?: string; isSystem?: boolean }>>([
    { sender: 'System', text: `Connecting to ${game.title} live multiplayer server...`, isSystem: true }
  ]);
  const [chatInput, setChatInput] = useState('');

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Gameplay state
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [playerHp, setPlayerHp] = useState(100);
  const [hasWon, setHasWon] = useState(false);

  // Local Player physics state in canvas
  const playerRef = useRef({
    x: 80,
    y: 280,
    vx: 0,
    vy: 0,
    width: 24,
    height: 38,
    isGrounded: false,
    facing: 1, // 1 right, -1 left
    respawnX: 80,
    respawnY: 280
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastMoveSentRef = useRef<number>(0);

  // Collectibles and Platforms
  const collectiblesRef = useRef<Array<{ x: number; y: number; collected: boolean; id: number }>>([
    { x: 180, y: 220, collected: false, id: 1 },
    { x: 330, y: 170, collected: false, id: 2 },
    { x: 470, y: 120, collected: false, id: 3 },
    { x: 620, y: 200, collected: false, id: 4 },
    { x: 740, y: 130, collected: false, id: 5 }
  ]);

  const platformsRef = useRef([
    { x: 0, y: 350, width: 850, height: 50, type: 'ground' },
    { x: 150, y: 270, width: 90, height: 16, type: 'platform' },
    { x: 290, y: 220, width: 90, height: 16, type: 'platform' },
    { x: 430, y: 160, width: 100, height: 16, type: 'platform' },
    { x: 570, y: 230, width: 90, height: 16, type: 'platform' },
    { x: 700, y: 170, width: 110, height: 16, type: 'trophy_stand' }
  ]);

  const hazardsRef = useRef([
    { x: 250, y: 338, width: 120, height: 12, type: 'lava' },
    { x: 530, y: 338, width: 140, height: 12, type: 'lava' }
  ]);

  const playSfx = (fn: () => void) => {
    if (!soundMuted) fn();
  };

  // 1. Establish Real WebSocket Connection for Online Multiplayer
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;
    } catch {
      setConnectionStatus('offline');
      return;
    }

    socket.onopen = () => {
      setConnectionStatus('connected');
      // Send join event with local player identity and customized avatar
      const joinMsg = {
        type: 'join',
        payload: {
          playerId: user.id + '-' + Math.floor(Math.random() * 10000),
          username: user.username,
          displayName: user.displayName,
          avatarConfig: user.avatarConfig,
          gameId: game.id,
          roomId: 'public-server-1',
          x: playerRef.current.x,
          y: playerRef.current.y
        }
      };
      socket.send(JSON.stringify(joinMsg));

      setChatMessages(prev => [
        ...prev,
        { sender: 'Server', text: `🟢 Connected to live online multiplayer server!`, isSystem: true }
      ]);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'room:init') {
          // Initialize existing remote players
          const map = new Map<string, RemotePlayer>();
          msg.payload.players.forEach((p: RemotePlayer) => {
            map.set(p.id, p);
          });
          remotePlayersRef.current = map;
          setConnectedPlayersCount(map.size + 1);

          if (msg.payload.chatHistory) {
            setChatMessages(msg.payload.chatHistory);
          }
        } 
        else if (msg.type === 'player:joined') {
          const p = msg.payload;
          remotePlayersRef.current.set(p.id, p);
          setConnectedPlayersCount(remotePlayersRef.current.size + 1);
          setChatMessages(prev => [
            ...prev,
            { sender: 'Server', text: `👋 ${p.displayName} (@${p.username}) joined the server!`, isSystem: true }
          ]);
        }
        else if (msg.type === 'player:moved') {
          const { id, x, y, vx, vy, facing } = msg.payload;
          const p = remotePlayersRef.current.get(id);
          if (p) {
            p.x = x;
            p.y = y;
            p.vx = vx;
            p.vy = vy;
            p.facing = facing;
          }
        }
        else if (msg.type === 'player:action') {
          const { id, action, x, y } = msg.payload;
          const p = remotePlayersRef.current.get(id);
          if (action === 'oof') {
            playSfx(() => sounds.playOof());
            if (p) {
              // Spawn death particles for remote player
              for (let i = 0; i < 15; i++) {
                particlesRef.current.push({
                  x: x || p.x + 12,
                  y: y || p.y + 19,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: '#ef4444',
                  size: 3,
                  life: 1.0
                });
              }
            }
          }
        }
        else if (msg.type === 'player:scored') {
          const { id, score: newScore } = msg.payload;
          const p = remotePlayersRef.current.get(id);
          if (p) {
            p.score = newScore;
          }
        }
        else if (msg.type === 'chat:message') {
          setChatMessages(prev => [...prev, msg.payload]);
        }
        else if (msg.type === 'player:left') {
          const { id } = msg.payload;
          const leftPlayer = remotePlayersRef.current.get(id);
          if (leftPlayer) {
            remotePlayersRef.current.delete(id);
            setConnectedPlayersCount(remotePlayersRef.current.size + 1);
            setChatMessages(prev => [
              ...prev,
              { sender: 'Server', text: `🚪 ${leftPlayer.displayName} left the server.`, isSystem: true }
            ]);
          }
        }
      } catch (err) {
        console.error('Error parsing ws msg:', err);
      }
    };

    socket.onclose = () => {
      setConnectionStatus('offline');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, game]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      keysRef.current[e.code] = true;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        const p = playerRef.current;
        if (p.isGrounded) {
          p.vy = -12.5;
          p.isGrounded = false;
          playSfx(() => sounds.playJump());
        }
      }
      if (e.code === 'Escape') {
        setIsEscMenuOpen(prev => !prev);
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        setIsLeaderboardOpen(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [soundMuted]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const spawnParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color,
          size: Math.random() * 4 + 2,
          life: 1.0
        });
      }
    };

    const respawnPlayer = () => {
      playSfx(() => sounds.playOof());
      spawnParticles(playerRef.current.x + 12, playerRef.current.y + 19, '#ef4444', 20);

      // Broadcast oof event to other online players
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'action',
          payload: { action: 'oof', x: playerRef.current.x, y: playerRef.current.y }
        }));
      }

      playerRef.current.x = playerRef.current.respawnX;
      playerRef.current.y = playerRef.current.respawnY;
      playerRef.current.vx = 0;
      playerRef.current.vy = 0;
      setPlayerHp(100);
    };

    const loop = () => {
      if (!running) return;

      const p = playerRef.current;
      const keys = keysRef.current;

      // Handle Horizontal input
      const speed = 4.8;
      if (keys['KeyA'] || keys['ArrowLeft']) {
        p.vx = -speed;
        p.facing = -1;
      } else if (keys['KeyD'] || keys['ArrowRight']) {
        p.vx = speed;
        p.facing = 1;
      } else {
        p.vx *= 0.75;
      }

      // Apply Gravity
      p.vy += 0.58;
      if (p.vy > 14) p.vy = 14;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 10) p.x = 10;
      if (p.x > 820) p.x = 820;

      // Platform Collisions
      p.isGrounded = false;
      for (const plat of platformsRef.current) {
        if (
          p.x + p.width > plat.x &&
          p.x < plat.x + plat.width &&
          p.y + p.height >= plat.y &&
          p.y + p.height <= plat.y + 14 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;

          if (plat.type === 'trophy_stand' && !hasWon) {
            setHasWon(true);
            playSfx(() => sounds.playPurchase());
            spawnParticles(plat.x + 50, plat.y, '#facc15', 30);
            awardBadgeToUser(`${game.title} Champion`, '🏆', `Conquered the course in ${game.title}!`);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'chat',
                payload: {
                  sender: 'Server',
                  text: `🏆 [Stage Clear]: ${user.displayName} reached the podium and unlocked the Champion Badge!`
                }
              }));
            }
          }
        }
      }

      // Hazards
      for (const haz of hazardsRef.current) {
        if (
          p.x + p.width > haz.x &&
          p.x < haz.x + haz.width &&
          p.y + p.height > haz.y &&
          p.y < haz.y + haz.height
        ) {
          respawnPlayer();
          break;
        }
      }

      // Collectibles
      for (const coin of collectiblesRef.current) {
        if (!coin.collected) {
          const dist = Math.hypot(p.x + p.width / 2 - coin.x, p.y + p.height / 2 - coin.y);
          if (dist < 26) {
            coin.collected = true;
            playSfx(() => sounds.playCoin());
            spawnParticles(coin.x, coin.y, '#facc15', 10);
            const newScore = score + 100;
            setScore(newScore);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'score',
                payload: { score: newScore }
              }));
            }
          }
        }
      }

      // Pit fall
      if (p.y > 420) {
        respawnPlayer();
      }

      // Send Real-Time Position Delta to WebSocket Server (Throttled ~30ms)
      const now = performance.now();
      if (now - lastMoveSentRef.current > 33) {
        lastMoveSentRef.current = now;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'move',
            payload: {
              x: Math.round(p.x),
              y: Math.round(p.y),
              vx: p.vx,
              vy: p.vy,
              facing: p.facing
            }
          }));
        }
      }

      // DRAW CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.6, '#1e293b');
      skyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stud Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Hazards (Lava)
      for (const haz of hazardsRef.current) {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 10;
        ctx.fillRect(haz.x, haz.y, haz.width, haz.height);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(haz.x + 4, haz.y + 2, haz.width - 8, 3);
      }

      // Platforms
      for (const plat of platformsRef.current) {
        if (plat.type === 'trophy_stand') {
          ctx.fillStyle = '#eab308';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#ca8a04';
          for (let sx = plat.x + 8; sx < plat.x + plat.width - 8; sx += 18) {
            ctx.beginPath();
            ctx.arc(sx, plat.y + 3, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.font = '28px sans-serif';
          ctx.fillText('🏆', plat.x + 40, plat.y - 10);
        } else {
          ctx.fillStyle = '#334155';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#475569';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          ctx.fillStyle = '#64748b';
          for (let sx = plat.x + 10; sx < plat.x + plat.width - 8; sx += 20) {
            ctx.beginPath();
            ctx.arc(sx, plat.y + 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Collectible coins
      for (const coin of collectiblesRef.current) {
        if (!coin.collected) {
          ctx.save();
          ctx.translate(coin.x, coin.y);
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('R$', 0, 1);
          ctx.restore();
        }
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.2;
        pt.life -= 0.03;
        if (pt.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.globalAlpha = 1.0;
      }

      // RENDER OTHER REAL ONLINE PLAYERS!
      remotePlayersRef.current.forEach((remote) => {
        const remoteSkin = remote.avatarConfig?.skinColor || '#facc15';
        const remoteShirt = remote.avatarConfig?.equippedShirt?.colorHex || remote.avatarConfig?.torsoColor || '#0284c7';
        const remotePants = remote.avatarConfig?.equippedPants?.colorHex || remote.avatarConfig?.leftLegColor || '#16a34a';

        ctx.save();
        ctx.translate(remote.x, remote.y);
        if (remote.facing === -1) {
          ctx.scale(-1, 1);
          ctx.translate(-24, 0);
        }

        // Head
        ctx.fillStyle = remoteSkin;
        ctx.fillRect(4, 0, 16, 14);
        ctx.fillStyle = '#09090b';
        ctx.fillRect(14, 4, 3, 3);
        ctx.fillRect(13, 9, 4, 2);

        // Hat
        if (remote.avatarConfig?.equippedHat?.id === 'hat-valk') {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(2, -6, 20, 6);
        } else if (remote.avatarConfig?.equippedHat?.id === 'hat-fedora') {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(0, -3, 24, 4);
          ctx.fillRect(5, -9, 14, 7);
        }

        // Torso
        ctx.fillStyle = remoteShirt;
        ctx.fillRect(3, 14, 18, 14);

        // Legs
        ctx.fillStyle = remotePants;
        ctx.fillRect(3, 28, 8, 10);
        ctx.fillRect(13, 28, 8, 10);

        // Arms
        ctx.fillStyle = remoteShirt;
        ctx.fillRect(0, 14, 4, 12);
        ctx.fillRect(20, 14, 4, 12);

        ctx.restore();

        // Nametag & Online marker above remote player
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(remote.x - 22, remote.y - 20, 68, 14);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`● ${remote.displayName}`, remote.x + 12, remote.y - 10);
      });

      // RENDER LOCAL PLAYER (You)
      const skin = user.avatarConfig.skinColor || '#facc15';
      const shirt = user.avatarConfig.equippedShirt?.colorHex || user.avatarConfig.torsoColor || '#0284c7';
      const pants = user.avatarConfig.equippedPants?.colorHex || user.avatarConfig.leftLegColor || '#16a34a';

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.facing === -1) {
        ctx.scale(-1, 1);
        ctx.translate(-p.width, 0);
      }

      ctx.fillStyle = skin;
      ctx.fillRect(4, 0, 16, 14);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(14, 4, 3, 3);
      ctx.fillRect(13, 9, 4, 2);

      if (user.avatarConfig.equippedHat?.id === 'hat-fedora') {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, -3, 24, 4);
        ctx.fillRect(5, -9, 14, 7);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(5, -4, 14, 2);
      } else if (user.avatarConfig.equippedHat?.id === 'hat-valk') {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(2, -6, 20, 6);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(8, -8, 8, 3);
      }

      ctx.fillStyle = shirt;
      ctx.fillRect(3, 14, 18, 14);

      ctx.fillStyle = pants;
      ctx.fillRect(3, 28, 8, 10);
      ctx.fillRect(13, 28, 8, 10);

      ctx.fillStyle = shirt;
      ctx.fillRect(0, 14, 4, 12);
      ctx.fillRect(20, 14, 4, 12);

      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(p.x - 22, p.y - 20, 68, 14);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`★ ${user.displayName} (You)`, p.x + 12, p.y - 10);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [user, game, hasWon, soundMuted, score]);

  // Handle in-game chat submission via WebSocket
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const filtered = filterSafeText(chatInput.trim());

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        payload: {
          sender: user.displayName,
          text: filtered
        }
      }));
    } else {
      setChatMessages(prev => [
        ...prev,
        { sender: user.displayName, text: filtered }
      ]);
    }

    setChatInput('');
  };

  const handleResetCharacter = () => {
    playSfx(() => sounds.playOof());
    playerRef.current.x = playerRef.current.respawnX;
    playerRef.current.y = playerRef.current.respawnY;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    setIsEscMenuOpen(false);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'action',
        payload: { action: 'oof', x: playerRef.current.x, y: playerRef.current.y }
      }));
    }
  };

  const handleCopyInviteLink = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 bg-black/90 backdrop-blur-md'}`}>
      <div className="relative w-full h-full max-w-6xl mx-auto bg-[#111216] border border-[#2d3035] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Authentic In-Game Roblox TopBar */}
        <div className="h-11 bg-[#191b1d] border-b border-[#2b2d31] flex items-center justify-between px-3 text-white select-none z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEscMenuOpen(!isEscMenuOpen)}
              className="w-7 h-7 bg-[#232527] hover:bg-[#32363b] rounded flex items-center justify-center cursor-pointer transition ring-1 ring-zinc-700/60"
              title="Esc Menu"
            >
              <div className="w-3.5 h-3.5 bg-[#00A2FF] rotate-12 rounded-[2px]" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate max-w-xs">{game.title}</span>
              
              {/* Live Multiplayer Status Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>ONLINE MULTIPLAYER ({connectedPlayersCount})</span>
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Share / Invite Friends Button */}
            <button
              onClick={handleCopyInviteLink}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#232527] hover:bg-[#32363b] text-zinc-200 hover:text-white rounded transition cursor-pointer"
              title="Copy server link to play with friends"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#00A2FF]" />}
              <span className="hidden sm:inline font-semibold">{copiedLink ? 'Link Copied!' : 'Invite Friends'}</span>
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-1.5 rounded transition cursor-pointer ${
                isChatOpen ? 'bg-[#00A2FF] text-white' : 'bg-[#232527] text-zinc-300 hover:text-white'
              }`}
              title="Toggle In-Game Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
              className={`p-1.5 rounded transition cursor-pointer ${
                isLeaderboardOpen ? 'bg-[#00A2FF] text-white' : 'bg-[#232527] text-zinc-300 hover:text-white'
              }`}
              title="Leaderboard (Tab)"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 bg-[#232527] hover:bg-[#32363b] text-zinc-300 hover:text-white rounded transition cursor-pointer"
              title="Mute/Unmute Game Audio"
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-[#232527] hover:bg-[#32363b] text-zinc-300 hover:text-white rounded transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded transition cursor-pointer ml-1"
              title="Leave Experience"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas Engine */}
        <div className="relative flex-1 bg-[#090d16] flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={850}
            height={400}
            className="w-full h-full object-contain max-h-[560px] bg-[#0c1222] select-none"
          />

          {/* Floating Heads-Up Display (HUD) */}
          <div className="absolute top-3 left-3 flex items-center gap-3 pointer-events-none select-none">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-white">
              <span className="text-amber-400 font-bold text-sm">💰 {score}</span>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-white">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-semibold">Stage {stage}: Reach Golden Podium</span>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-white">
              <span className="text-xs font-semibold">HP</span>
              <div className="w-20 h-2.5 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-150" 
                  style={{ width: `${playerHp}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Controls Instruction Card */}
          <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[11px] text-zinc-300 pointer-events-none flex items-center gap-3">
            <span>[A] [D] / [←] [→] Run</span>
            <span>•</span>
            <span>[W] / [Space] Jump</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{connectedPlayersCount} players online</span>
          </div>

          {/* Live In-Game Chat Box */}
          {isChatOpen && (
            <div className="absolute top-3 right-3 w-72 sm:w-80 h-56 bg-black/80 backdrop-blur-md border border-white/15 rounded-xl flex flex-col shadow-2xl pointer-events-auto">
              <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                <span>LIVE SERVER CHAT ({connectedPlayersCount} players)</span>
                <span className="text-[10px] text-zinc-500">Press Enter</span>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-1 text-xs font-mono">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="leading-snug">
                    {msg.isSystem ? (
                      <span className="text-amber-400 font-semibold">{msg.text}</span>
                    ) : (
                      <>
                        <span className="text-[#38bdf8] font-bold">[{msg.sender}]: </span>
                        <span className="text-zinc-200">{msg.text}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-1.5 border-t border-white/10 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Chat with server players..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-black/50 border border-zinc-700 rounded px-2 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00A2FF]"
                />
                <button
                  type="submit"
                  className="p-1 bg-[#00A2FF] text-white rounded hover:bg-[#008fe0] transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Live Online Player Leaderboard (Tab) */}
          {isLeaderboardOpen && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-88 bg-black/90 backdrop-blur-md border border-zinc-700 rounded-xl p-4 shadow-2xl z-30">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-700 text-xs font-bold text-zinc-300">
                <span>CONNECTED PLAYERS ({connectedPlayersCount})</span>
                <span>COINS</span>
              </div>
              <div className="divide-y divide-zinc-800 text-xs max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between py-2 text-white font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">●</span> {user.displayName} (You)
                  </span>
                  <span className="text-amber-400 font-mono">{score}</span>
                </div>

                {Array.from(remotePlayersRef.current.values()).map(rp => (
                  <div key={rp.id} className="flex items-center justify-between py-2 text-zinc-300">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400">●</span> {rp.displayName} (@{rp.username})
                    </span>
                    <span className="text-amber-400 font-mono">{rp.score || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Esc Menu */}
          {isEscMenuOpen && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40">
              <div className="w-full max-w-md bg-[#191b1d] border border-zinc-700 rounded-2xl p-6 text-white shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-4 h-4 bg-[#00A2FF] rotate-12 rounded-[2px]" />
                    <span>Roblox Server Menu</span>
                  </div>
                  <button 
                    onClick={() => setIsEscMenuOpen(false)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleCopyInviteLink}
                    className="w-full py-2.5 px-4 bg-[#00A2FF] hover:bg-[#008fe0] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Invite Link For Friends'}</span>
                  </button>

                  <button
                    onClick={handleResetCharacter}
                    className="w-full py-2.5 px-4 bg-[#232527] hover:bg-[#2d3034] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-zinc-700/60"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Reset Character (Oof!)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-600/20"
                  >
                    <span>Leave Experience</span>
                  </button>
                </div>

                <div className="text-center text-xs text-zinc-400 font-mono">
                  Multiplayer Server: {connectionStatus === 'connected' ? 'Connected (24ms)' : 'Offline'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
