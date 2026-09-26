import React, { useState, useEffect } from 'react';
import { SpendingReport } from '../types';
import { formatINR } from '../utils/formatters';
import {
  Sparkles,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Download,
  Mail,
  Lightbulb,
  PieChart,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface MonthlyReportViewProps {
  onGenerateReport: (monthYear: string) => Promise<SpendingReport | null>;
  initialReport: SpendingReport | null;
  isGenerating: boolean;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  onGenerateReport,
  initialReport,
  isGenerating,
}) => {
  const [report, setReport] = useState<SpendingReport | null>(initialReport);
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [emailSent, setEmailSent] = useState<boolean>(false);

  useEffect(() => {
    if (initialReport) {
      setReport(initialReport);
    } else {
      handleFetchReport(selectedMonth);
    }
  }, []);

  const handleFetchReport = async (mYear: string) => {
    const data = await onGenerateReport(mYear);
    if (data) {
      setReport(data);
    }
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Automated Monthly Spending Report (INR)
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                AI Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Deep Rupee cash flow analysis by Gemini 3.8 Flash Financial Intelligence
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              handleFetchReport(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="September 2026">September 2026 (Current)</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          <button
            onClick={() => handleFetchReport(selectedMonth)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Analyzing Data...' : 'Regenerate'}</span>
          </button>

          {report && (
            <>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Print or Export PDF"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleSendEmail}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors relative"
                title="Email Monthly Digest"
              >
                <Mail className="w-4 h-4" />
                {emailSent && (
                  <span className="absolute -top-8 right-0 px-2 py-1 text-[10px] bg-emerald-500 text-slate-950 font-bold rounded shadow-lg whitespace-nowrap animate-bounce">
                    Digest Sent!
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isGenerating && (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Synthesizing Monthly Financial Intelligence...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Analyzing transactions, detecting savings leakage, and calculating budget health in Rupees.
            </p>
          </div>
        </div>
      )}

      {/* Report Content */}
      {!isGenerating && report && (
        <div className="space-y-6">
          {/* Health Score & Key Metrics Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Score Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Financial Health Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tabular-nums">
                    {report.overallScore}
                  </span>
                  <span className="text-lg font-bold text-slate-500">/ 100</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{report.scoreLabel}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Generated {new Date(report.generatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Income Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Income Inflow</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-3">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {formatINR(report.totalIncome)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Salary & Freelance Deposits
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-full"></div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Outflow Expenses</span>
                <TrendingDown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="my-3">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {formatINR(report.totalExpenses)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Fixed & Discretionary
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full"
                  style={{
                    width: `${Math.min(100, (report.totalExpenses / (report.totalIncome || 1)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Savings Rate Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Net Savings Accumulation</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="my-3">
                <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                  +{formatINR(report.netSavings)}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  {report.savingsRate}% Net Savings Rate
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full"
                  style={{ width: `${Math.min(100, report.savingsRate * 3)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Executive Summary & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Executive Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {report.executiveSummary}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Key Highlights
              </h3>
              <ul className="space-y-2.5">
                {report.topHighlights?.map((highlight, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Automated Savings Opportunities */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Automated Savings Opportunities
                </h3>
                <p className="text-xs text-slate-400">
                  AI identified potential expense leaks and quick wins
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.savingsOpportunities?.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-white">{opp.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 shrink-0">
                        +{formatINR(opp.potentialSavings)}/mo
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mb-3">
                      {opp.actionStep}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-semibold text-slate-500 uppercase">
                    <span>Impact: {opp.impactLevel}</span>
                    <span className="text-emerald-400 font-bold">1-Click Optimize</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown & Actionable Wealth Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-400" />
                Category Variance Breakdown
              </h3>

              <div className="space-y-3">
                {report.categoryBreakdown?.map((cat, idx) => {
                  const pct = cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0;
                  const isOver = pct > 100;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-white">{cat.category}</span>
                        <div className="flex items-center gap-2 font-mono tabular-nums">
                          <span className="text-slate-300">{formatINR(cat.spent)}</span>
                          <span className="text-slate-500">/ {formatINR(cat.budget)}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isOver ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        ></div>
                      </div>

                      <p className="text-[11px] text-slate-400">{cat.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wealth Building AI Tips */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Wealth-Building AI Directives
              </h3>

              <div className="space-y-3">
                {report.actionableTips?.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
