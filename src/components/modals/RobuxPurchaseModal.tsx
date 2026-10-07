import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';

export const RobuxPurchaseModal: React.FC = () => {
  const { isRobuxModalOpen, setIsRobuxModalOpen, buyRobux, user } = useRoblox();
  const [successReceipt, setSuccessReceipt] = useState<{ amount: number; price: string } | null>(null);

  if (!isRobuxModalOpen) return null;

  const packages = [
    { amount: 400, bonus: 0, price: '$4.99', popular: false },
    { amount: 800, bonus: 0, price: '$9.99', popular: false },
    { amount: 1700, bonus: 100, price: '$19.99', popular: true, tag: 'Most Popular' },
    { amount: 4500, bonus: 500, price: '$49.99', popular: false, tag: 'Best Value' },
    { amount: 10000, bonus: 1500, price: '$99.99', popular: false }
  ];

  const handlePurchase = (pkg: typeof packages[0]) => {
    buyRobux(pkg.amount, pkg.bonus);
    setSuccessReceipt({ amount: pkg.amount + pkg.bonus, price: pkg.price });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsRobuxModalOpen(false);
            setSuccessReceipt(null);
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Coins className="w-4 h-4" />
            <span>Official Roblox Economy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Buy Robux</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Current Balance: <strong className="text-emerald-400 font-mono">R$ {user.robux.toLocaleString()}</strong>
          </p>
        </div>

        {/* Success Receipt State */}
        {successReceipt ? (
          <div className="bg-[#121316] border border-emerald-500/40 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Purchase Complete!</h3>
            <p className="text-xs text-zinc-300">
              <strong className="text-emerald-400 font-mono text-sm">+{successReceipt.amount.toLocaleString()} Robux</strong> has been safely credited to your wallet balance.
            </p>
            <div className="text-[11px] text-zinc-500 font-mono">
              Order ID: RBX-{Math.floor(Math.random() * 900000 + 100000)} • Amount: {successReceipt.price}
            </div>
            <button
              onClick={() => {
                setSuccessReceipt(null);
                setIsRobuxModalOpen(false);
              }}
              className="mt-2 px-6 py-2 bg-[#00A2FF] text-white text-xs font-bold rounded-xl hover:bg-[#008fe0] cursor-pointer"
            >
              Continue to Experiences
            </button>
          </div>
        ) : (
          /* Package Options */
          <div className="space-y-3">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`bg-[#141518] border p-4 rounded-2xl flex items-center justify-between gap-4 transition hover:border-zinc-500 ${
                  pkg.popular ? 'border-[#00A2FF] ring-2 ring-[#00A2FF]/20' : 'border-[#2d3035]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-mono font-bold">
                    R$
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-mono text-white">
                        {(pkg.amount + pkg.bonus).toLocaleString()} Robux
                      </span>
                      {pkg.tag && (
                        <span className="bg-[#00A2FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    {pkg.bonus > 0 && (
                      <span className="text-[11px] text-amber-400 font-semibold">
                        Includes {pkg.bonus} bonus Robux!
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  className="px-5 py-2.5 bg-[#00B06F] hover:bg-[#009b62] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md shadow-[#00B06F]/20"
                >
                  {pkg.price}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Security Footer */}
        <div className="pt-2 border-t border-[#2d3035] flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted 256-bit Secure Transaction Guarantee</span>
        </div>
      </div>
    </div>
  );
};
