import React, { useState } from 'react';
import { FinancialGoal, AutomationRule } from '../types';
import { formatINR } from '../utils/formatters';
import { Target, Zap, Plus } from 'lucide-react';

interface GoalsAndAutomationProps {
  goals: FinancialGoal[];
  rules: AutomationRule[];
  onToggleRule: (ruleId: string) => void;
  onAddGoal: (goal: Partial<FinancialGoal>) => void;
}

export const GoalsAndAutomation: React.FC<GoalsAndAutomationProps> = ({
  goals,
  rules,
  onToggleRule,
  onAddGoal,
}) => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('2027-12-31');

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount) return;

    onAddGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline,
      category: 'Savings',
      iconName: 'Target',
      color: '#10B981',
    });

    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsGoalModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Financial Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Wealth & Savings Goals (INR)
            </h3>
            <p className="text-xs text-slate-400">
              Track progress toward key financial milestones in Indian Rupees
            </p>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / (g.targetAmount || 1)) * 100));

            return (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                    {g.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{pct}%</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{g.name}</h4>
                  <div className="flex items-baseline justify-between font-mono tabular-nums text-xs">
                    <span className="text-xl font-extrabold text-white">
                      {formatINR(g.currentAmount)}
                    </span>
                    <span className="text-slate-400">/ {formatINR(g.targetAmount)}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Target Date: {g.deadline}</span>
                  <span className="text-emerald-400 font-medium">On Track</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated Financial Rules Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Automated Financial Guards & Rules
          </h3>
          <p className="text-xs text-slate-400">
            Smart triggers that execute UPI micro-savings, dining alerts, and salary SIP splitters
          </p>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{rule.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 bg-slate-950 text-slate-400 rounded border border-slate-800">
                    Executed {rule.triggerCount} times
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                  <span className="text-emerald-400 font-semibold">IF: {rule.condition}</span>
                  <span>→</span>
                  <span className="text-slate-200">THEN: {rule.action}</span>
                </div>
              </div>

              <button
                onClick={() => onToggleRule(rule.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  rule.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <span>{rule.enabled ? 'Rule Active' : 'Paused'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-white">Create New Financial Goal</h3>
            <form onSubmit={handleGoalSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Home Renovation, SIP Target"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="w-1/3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
