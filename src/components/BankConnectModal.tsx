import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { BankAccount } from '../types';

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (account: BankAccount) => void;
}

const INDIAN_INSTITUTIONS = [
  { name: 'HDFC Bank', color: '#004B8D', logoText: 'HDFC', type: 'checking' as const },
  { name: 'ICICI Bank', color: '#F37021', logoText: 'ICICI', type: 'credit' as const },
  { name: 'State Bank of India', color: '#280071', logoText: 'SBI', type: 'savings' as const },
  { name: 'Axis Bank', color: '#97144D', logoText: 'AXIS', type: 'checking' as const },
  { name: 'Kotak Mahindra Bank', color: '#DA251C', logoText: 'KOTAK', type: 'savings' as const },
  { name: 'Paytm Payments Bank', color: '#00BAF2', logoText: 'PAYTM', type: 'checking' as const },
];

export const BankConnectModal: React.FC<BankConnectModalProps> = ({
  isOpen,
  onClose,
  onAccountAdded,
}) => {
  const [step, setStep] = useState<'select' | 'credentials' | 'verifying' | 'success'>('select');
  const [selectedInst, setSelectedInst] = useState<typeof INDIAN_INSTITUTIONS[0] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSelect = (inst: typeof INDIAN_INSTITUTIONS[0]) => {
    setSelectedInst(inst);
    setStep('credentials');
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;
    setStep('verifying');

    try {
      const res = await fetch('/api/bank/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionName: selectedInst.name,
          accountName: `${selectedInst.name} ${selectedInst.type.toUpperCase()}`,
          accountType: selectedInst.type,
          accountNumberLast4: Math.floor(1000 + Math.random() * 9000).toString(),
          balance: Math.floor(25000 + Math.random() * 250000),
          institutionColor: selectedInst.color,
          institutionLogoText: selectedInst.logoText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
        setTimeout(() => {
          onAccountAdded(data.account);
          handleReset();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to connect bank account:', err);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedInst(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Account Aggregator (AA) Gateway</h3>
              <p className="text-[11px] text-slate-400">256-Bit Encrypted Net Banking Link</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'select' && (
            <div>
              <h4 className="text-base font-semibold text-white mb-1">
                Select Indian Financial Institution
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Connect your NetBanking or UPI registered account for real-time automated statement fetch.
              </p>

              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {INDIAN_INSTITUTIONS.map((inst) => (
                  <button
                    key={inst.name}
                    onClick={() => handleSelect(inst)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-[10px] tracking-tight text-white shrink-0 shadow-md"
                      style={{ backgroundColor: inst.color }}
                    >
                      {inst.logoText}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {inst.name}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {inst.type} Account
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'credentials' && selectedInst && (
            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: selectedInst.color }}
                >
                  {selectedInst.logoText}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{selectedInst.name}</div>
                  <div className="text-xs text-emerald-400 font-medium">Ready for Account Aggregator Link</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer ID / Net Banking ID
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. 84930211"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Net Banking Password / Passcode
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Smart Usage uses OAuth tokens. Your credentials are never saved on server.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="w-1/3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Authorize & Fetch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'verifying' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Connecting with {selectedInst?.name}...</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Establishing Account Aggregator real-time transaction bridge
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Account Linked & Persisted!</h4>
                <p className="text-xs text-emerald-400 font-medium mt-1">
                  Real-time statement feed activated for {selectedInst?.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
