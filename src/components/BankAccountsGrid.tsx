import React from 'react';
import { BankAccount } from '../types';
import { formatINR } from '../utils/formatters';
import { Building2, RefreshCw, Plus, ShieldCheck } from 'lucide-react';

interface BankAccountsGridProps {
  accounts: BankAccount[];
  onOpenConnectModal: () => void;
  onSyncAccount: (accountId: string) => void;
  isSyncing: boolean;
}

export const BankAccountsGrid: React.FC<BankAccountsGridProps> = ({
  accounts,
  onOpenConnectModal,
  onSyncAccount,
  isSyncing,
}) => {
  const totalBalance = accounts.reduce((sum, acc) => {
    return acc.accountType === 'credit' ? sum - Math.abs(acc.balance) : sum + acc.balance;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Total Net Liquid Position (INR)
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {formatINR(totalBalance)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Real-time Monitored
            </span>
            <span>·</span>
            <span>{accounts.length} Active Connected Indian Bank Accounts</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Link Indian Bank</span>
          </button>
        </div>
      </div>

      {/* Grid of Bank Account Cards */}
      {accounts.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">No Indian Bank Accounts Linked Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Link your HDFC, ICICI, SBI, Axis, or Kotak account to activate real-time transaction syncing and automated AI reports.
            </p>
          </div>
          <button
            onClick={onOpenConnectModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Link Your First Bank Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isCredit = acc.accountType === 'credit';

            return (
              <div
                key={acc.id}
                className="group relative p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between shadow-xl"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-[10px] tracking-tight shadow-md shrink-0"
                        style={{ backgroundColor: acc.institutionColor }}
                      >
                        {acc.institutionLogoText}
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white truncate">{acc.institutionName}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{acc.accountName}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      •••• {acc.accountNumberLast4}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="mb-4">
                    <div className="text-[11px] text-slate-400 font-medium">
                      {isCredit ? 'Current Statement Due' : 'Available Funds'}
                    </div>
                    <div
                      className={`text-2xl font-bold tabular-nums mt-0.5 ${
                        isCredit ? 'text-amber-400' : 'text-white'
                      }`}
                    >
                      {formatINR(Math.abs(acc.balance))}
                    </div>
                  </div>
                </div>

                {/* Footer Sync Details */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-medium capitalize">{acc.syncStatus}</span>
                  </div>

                  <button
                    onClick={() => onSyncAccount(acc.id)}
                    disabled={isSyncing}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    title="Trigger instant sync for this account"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
