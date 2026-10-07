import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Check, 
  X, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { CatalogItem, Friend } from '../../types/roblox';

export const TradeView: React.FC = () => {
  const { 
    user, 
    friends, 
    trades, 
    createTradeOffer, 
    acceptTradeOffer, 
    declineTradeOffer, 
    catalogItems 
  } = useRoblox();

  const [isCreatingTrade, setIsCreatingTrade] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(friends[0] || null);
  const [selectedYourItems, setSelectedYourItems] = useState<CatalogItem[]>([]);
  const [selectedTheirItems, setSelectedTheirItems] = useState<CatalogItem[]>([]);
  const [yourRobuxInput, setYourRobuxInput] = useState<number>(0);
  const [tradeMessage, setTradeMessage] = useState<{ success: boolean; msg: string } | null>(null);

  // Available partner items pool (from catalog limited items)
  const availablePartnerItems = catalogItems.filter(i => i.isLimited);

  const toggleYourItem = (item: CatalogItem) => {
    setSelectedYourItems(prev => 
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  const toggleTheirItem = (item: CatalogItem) => {
    setSelectedTheirItems(prev => 
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  const handleSendTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend) return;

    const res = createTradeOffer(selectedFriend, selectedYourItems, selectedTheirItems, yourRobuxInput, 0);
    setTradeMessage({ success: res.success, msg: res.message });
    if (res.success) {
      setIsCreatingTrade(false);
      setSelectedYourItems([]);
      setSelectedTheirItems([]);
      setYourRobuxInput(0);
    }
    setTimeout(() => setTradeMessage(null), 3500);
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Trading System</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Safely trade Limited items and collectibles with verified friends.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTrade(true)}
          className="px-4 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Trade Offer</span>
        </button>
      </div>

      {tradeMessage && (
        <div className={`p-3 rounded-xl text-xs font-bold text-center animate-fade-in ${
          tradeMessage.success ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
        }`}>
          {tradeMessage.msg}
        </div>
      )}

      {/* Security Tip Box */}
      <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-[#00A2FF] shrink-0" />
        <div className="text-xs text-zinc-300">
          <strong className="text-white">Roblox Safe Trade Protection:</strong> Trades are protected by automated value assessment. Always review item IDs before confirming any transaction.
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active & Recent Trades</h2>

        {trades.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 bg-[#191b1d] rounded-3xl border border-[#2d3035]">
            <p className="text-sm font-semibold">No active trade requests.</p>
            <p className="text-xs text-zinc-500 mt-1">Click "New Trade Offer" above to begin exchanging items with a friend.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map(trade => (
              <div 
                key={trade.id}
                className="bg-[#191b1d] border border-[#2d3035] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={trade.partnerAvatar} alt="" className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
                  <div>
                    <h3 className="font-bold text-sm text-white">Trade with {trade.partnerName}</h3>
                    <div className="text-xs text-zinc-400">{trade.timestamp}</div>
                  </div>
                </div>

                {/* Items preview summary */}
                <div className="flex items-center gap-6 text-xs text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Your Offering:</span>
                    <span className="font-semibold text-white">
                      {trade.yourItems.map(i => i.name).join(', ') || 'R$ ' + trade.yourRobuxOffer}
                    </span>
                  </div>

                  <ArrowLeftRight className="w-4 h-4 text-zinc-500" />

                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Their Offering:</span>
                    <span className="font-semibold text-white">
                      {trade.theirItems.map(i => i.name).join(', ') || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {trade.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => acceptTradeOffer(trade.id)}
                        className="px-3.5 py-1.5 bg-[#00B06F] hover:bg-[#009b62] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineTradeOffer(trade.id)}
                        className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      trade.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Trade Modal */}
      {isCreatingTrade && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 text-white shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3035]">
              <h2 className="text-lg font-black">Create Trade Request</h2>
              <button 
                onClick={() => setIsCreatingTrade(false)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Partner Friend */}
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Select Trading Partner
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                      selectedFriend?.id === friend.id 
                        ? 'border-[#00A2FF] bg-[#24272e]' 
                        : 'border-[#2d3035] bg-[#16171a] hover:bg-[#202227]'
                    }`}
                  >
                    <img src={friend.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-white">{friend.displayName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Two Column Exchange Builder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Your Inventory Items to Offer */}
              <div className="bg-[#141518] border border-[#2b2d31] p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase">What You Will Give:</span>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {user.inventory.map(item => {
                    const isSelected = selectedYourItems.some(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleYourItem(item)}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition ${
                          isSelected ? 'border-[#00A2FF] bg-[#00A2FF]/20' : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img src={item.thumbnail} alt="" className="w-12 h-12 mx-auto rounded-lg object-cover mb-1" />
                        <span className="text-[10px] font-bold block truncate">{item.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Add Robux to offer:</label>
                  <input
                    type="number"
                    min="0"
                    max={user.robux}
                    value={yourRobuxInput}
                    onChange={(e) => setYourRobuxInput(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1c1d22] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                </div>
              </div>

              {/* What You Want In Return */}
              <div className="bg-[#141518] border border-[#2b2d31] p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase">What You Will Request:</span>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availablePartnerItems.map(item => {
                    const isSelected = selectedTheirItems.some(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTheirItem(item)}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition ${
                          isSelected ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img src={item.thumbnail} alt="" className="w-12 h-12 mx-auto rounded-lg object-cover mb-1" />
                        <span className="text-[10px] font-bold block truncate">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreatingTrade(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTrade}
                className="px-6 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-[#00A2FF]/25"
              >
                Send Trade Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
