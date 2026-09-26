import React, { useState } from 'react';
import { BudgetCategory, Transaction } from '../types';
import { formatINR } from '../utils/formatters';
import { Sparkles } from 'lucide-react';

interface BudgetsManagerProps {
  categories: BudgetCategory[];
  transactions: Transaction[];
  onRebalanceAI: () => Promise<any>;
  isRebalancing: boolean;
}

export const BudgetsManager: React.FC<BudgetsManagerProps> = ({
  categories,
  transactions,
  onRebalanceAI,
  isRebalancing,
}) => {
  const [rebalanceResult, setRebalanceResult] = useState<any[] | null>(null);

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spentAmount, 0);

  const handleTriggerRebalance = async () => {
    const res = await onRebalanceAI();
    if (res) {
      setRebalanceResult(res);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview & AI Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Monthly Budget Allocation (INR)
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
              {formatINR(totalSpent)}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              of {formatINR(totalAllocated)} Allocated
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3 max-w-md">
            <div
              className={`h-full transition-all duration-500 ${
                totalSpent > totalAllocated ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (totalSpent / (totalAllocated || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerRebalance}
            disabled={isRebalancing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>{isRebalancing ? 'Analyzing Trends...' : 'Smart AI Rebalance'}</span>
          </button>
        </div>
      </div>

      {/* AI Rebalance Insights Panel if triggered */}
      {rebalanceResult && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Gemini AI Recommended Budget Optimization
            </h3>
            <button
              onClick={() => setRebalanceResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rebalanceResult.map((item: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="font-bold text-white mb-1">{item.category}</div>
                <div className="flex items-center gap-2 text-slate-400 font-mono mb-1">
                  <span>Current: {formatINR(item.currentAllocation)}</span>
                  <span>→</span>
                  <span className="text-emerald-400 font-bold">New: {formatINR(item.recommendedNewAllocation)}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const pct = Math.round((cat.spentAmount / (cat.allocatedAmount || 1)) * 100);
          const isOver = pct >= 100;
          const isNear = pct >= 80 && pct < 100;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <h4 className="text-sm font-bold text-white">{cat.category}</h4>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      isOver
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isNear
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {pct}% Used
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono tabular-nums mb-2">
                  <span className="text-2xl font-bold text-white">{formatINR(cat.spentAmount)}</span>
                  <span className="text-slate-400">/ {formatINR(cat.allocatedAmount)}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: isOver ? '#EF4444' : isNear ? '#F59E0B' : cat.color,
                    }}
                  ></div>
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {isOver
                    ? 'Over allocated budget!'
                    : isNear
                    ? 'Approaching limit'
                    : `${formatINR(cat.allocatedAmount - cat.spentAmount)} remaining`}
                </span>
                <span className="text-slate-500 text-[10px]">Monthly Reset</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
