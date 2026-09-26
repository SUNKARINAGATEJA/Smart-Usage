import React, { useState, useEffect } from 'react';
import {
  Transaction,
  BankAccount,
  BudgetCategory,
  FinancialGoal,
  SpendingReport,
  AutomationRule,
  User,
} from './types';
import { formatINR } from './utils/formatters';
import { Header } from './components/Header';
import { RealtimeSyncBar } from './components/RealtimeSyncBar';
import { BankAccountsGrid } from './components/BankAccountsGrid';
import { BankConnectModal } from './components/BankConnectModal';
import { MonthlyReportView } from './components/MonthlyReportView';
import { TransactionsTable } from './components/TransactionsTable';
import { AddTransactionModal } from './components/AddTransactionModal';
import { BudgetsManager } from './components/BudgetsManager';
import { GoalsAndAutomation } from './components/GoalsAndAutomation';
import { AICoachChatModal } from './components/AICoachChatModal';
import { LoginPage } from './components/LoginPage';
import {
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('smartusage_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [spendingReport, setSpendingReport] = useState<SpendingReport | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBankConnectOpen, setIsBankConnectOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (currentUser) {
      fetchInitialData();
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smartusage_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartusage_user');
  };

  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setBankAccounts(Array.isArray(data.bankAccounts) ? data.bankAccounts : []);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setBudgetCategories(Array.isArray(data.budgetCategories) ? data.budgetCategories : []);
        setFinancialGoals(Array.isArray(data.financialGoals) ? data.financialGoals : []);
        setAutomationRules(Array.isArray(data.automationRules) ? data.automationRules : []);
      }
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  // Real-time Bank Sync trigger
  const handleTriggerBankSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/bank/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.newTransaction && data.newTransaction.id) {
            setTransactions((prev) => [data.newTransaction, ...prev]);
          }
          if (Array.isArray(data.bankAccounts)) {
            setBankAccounts(data.bankAccounts);
          }
          if (Array.isArray(data.budgetCategories)) {
            setBudgetCategories(data.budgetCategories);
          }
          setLastSyncTime(data.syncedAt || new Date().toISOString());
        }
      }
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Transaction
  const handleAddTransaction = async (txData: Partial<Transaction>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.transaction) {
          setTransactions((prev) => [data.transaction, ...prev]);
          if (Array.isArray(data.bankAccounts)) setBankAccounts(data.bankAccounts);
          if (Array.isArray(data.budgetCategories)) setBudgetCategories(data.budgetCategories);
        }
      }
    } catch (err) {
      console.error('Failed to add transaction', err);
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t && t.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Generate Monthly Report
  const handleGenerateReport = async (monthYear: string) => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthYear }),
      });

      if (res.ok) {
        const reportData: SpendingReport = await res.json();
        setSpendingReport(reportData);
        return reportData;
      }
      return null;
    } catch (err) {
      console.error('Report generation failed', err);
      return null;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // AI Rebalance
  const handleRebalanceAI = async () => {
    setIsRebalancing(true);
    try {
      const res = await fetch('/api/gemini/rebalance', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : null;
      }
      return null;
    } catch (err) {
      console.error('Rebalance failed', err);
      return null;
    } finally {
      setIsRebalancing(false);
    }
  };

  // Add Goal
  const handleAddGoal = (goal: Partial<FinancialGoal>) => {
    const newGoal: FinancialGoal = {
      id: 'g-' + Date.now(),
      name: goal.name || 'New Goal',
      targetAmount: goal.targetAmount || 100000,
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline || '2027-12-31',
      category: goal.category || 'Savings',
      iconName: goal.iconName || 'Target',
      color: goal.color || '#10B981',
    };
    setFinancialGoals((prev) => [...prev, newGoal]);
  };

  // Toggle Rule
  const handleToggleRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Account added
  const handleAccountAdded = (newAcc: BankAccount) => {
    if (newAcc && newAcc.id) {
      setBankAccounts((prev) => [...prev.filter((a) => a.id !== newAcc.id), newAcc]);
    }
  };

  // Summary Metrics calculations
  const totalBalance = (bankAccounts || []).reduce((sum, acc) => {
    if (!acc) return sum;
    return acc.accountType === 'credit' ? sum - Math.abs(acc.balance || 0) : sum + (acc.balance || 0);
  }, 0);

  const monthlyIncome = (transactions || [])
    .filter((t) => t && t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const monthlyExpenses = (transactions || [])
    .filter((t) => t && t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netSavings = monthlyIncome - monthlyExpenses;

  // Render Login Page if not signed in
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBankConnect={() => setIsBankConnectOpen(true)}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onSyncNow={handleTriggerBankSync}
        isSyncing={isSyncing}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Real-time Sync Status Ticker Bar */}
      <RealtimeSyncBar
        bankAccounts={bankAccounts}
        isSyncing={isSyncing}
        onTriggerSync={handleTriggerBankSync}
        onOpenBankConnect={() => setIsBankConnectOpen(true)}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Liquid Position */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Total Net Liquid Position</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-3">
                  <div className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
                    {formatINR(totalBalance)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{bankAccounts.length} Connected Accounts</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  Indian Banking Sync Active
                </div>
              </div>

              {/* Card 2: Income Inflow */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Monthly Income Inflow</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-3">
                  <div className="text-2xl font-extrabold text-emerald-400 tabular-nums tracking-tight">
                    +{formatINR(monthlyIncome)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Payroll & Direct Deposits</div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Tracked In Realtime
                </div>
              </div>

              {/* Card 3: Expenses Outflow */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Monthly Expenses Outflow</span>
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-3">
                  <div className="text-2xl font-extrabold text-slate-100 tabular-nums tracking-tight">
                    -{formatINR(monthlyExpenses)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Fixed & Discretionary</div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Auto-Categorized
                </div>
              </div>

              {/* Card 4: Net Savings */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Net Savings Rate</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-3">
                  <div className="text-2xl font-extrabold text-cyan-400 tabular-nums tracking-tight">
                    {monthlyIncome > 0 ? ((netSavings / monthlyIncome) * 100).toFixed(1) : '0'}%
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    +{formatINR(netSavings > 0 ? netSavings : 0)} Net Saved
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Auto Direct Deposit Split
                </div>
              </div>
            </div>

            {/* AI Automated Monthly Spending Report Spotlight Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    AUTOMATED MONTHLY REPORT
                  </span>
                  <span className="text-xs text-slate-400">September 2026 Digest Ready</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Get Instant Deep Financial Intelligence & Rupee Savings Leakage Breakdown
                </h3>
                <p className="text-xs text-slate-300 leading-normal">
                  Smart Usage AI analyzes your live bank feed, evaluates spending velocity against budget limits, and prescribes 3 high-impact savings steps in Indian Rupees.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('report');
                  handleGenerateReport('September 2026');
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>View Automated AI Report</span>
              </button>
            </div>

            {/* Live Bank Accounts Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  Real-time Linked Accounts (INR)
                </h3>
                <button
                  onClick={() => setIsBankConnectOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  + Link Indian Bank
                </button>
              </div>
              <BankAccountsGrid
                accounts={bankAccounts}
                onOpenConnectModal={() => setIsBankConnectOpen(true)}
                onSyncAccount={handleTriggerBankSync}
                isSyncing={isSyncing}
              />
            </div>

            {/* Recent Live Transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Recent Transactions Feed</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View All ({transactions.length}) →
                </button>
              </div>
              <TransactionsTable
                transactions={transactions.slice(0, 6)}
                budgetCategories={budgetCategories}
                onAddClick={() => setIsAddModalOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {/* BANK ACCOUNTS TAB */}
        {activeTab === 'banks' && (
          <div className="space-y-6">
            <BankAccountsGrid
              accounts={bankAccounts}
              onOpenConnectModal={() => setIsBankConnectOpen(true)}
              onSyncAccount={handleTriggerBankSync}
              isSyncing={isSyncing}
            />
          </div>
        )}

        {/* AUTOMATED MONTHLY REPORT TAB */}
        {activeTab === 'report' && (
          <MonthlyReportView
            onGenerateReport={handleGenerateReport}
            initialReport={spendingReport}
            isGenerating={isGeneratingReport}
          />
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <TransactionsTable
            transactions={transactions}
            budgetCategories={budgetCategories}
            onAddClick={() => setIsAddModalOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {/* BUDGETS TAB */}
        {activeTab === 'budgets' && (
          <BudgetsManager
            categories={budgetCategories}
            transactions={transactions}
            onRebalanceAI={handleRebalanceAI}
            isRebalancing={isRebalancing}
          />
        )}

        {/* GOALS & AUTOMATION TAB */}
        {activeTab === 'goals' && (
          <GoalsAndAutomation
            goals={financialGoals}
            rules={automationRules}
            onToggleRule={handleToggleRule}
            onAddGoal={handleAddGoal}
          />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        bankAccounts={bankAccounts}
        budgetCategories={budgetCategories}
      />

      <BankConnectModal
        isOpen={isBankConnectOpen}
        onClose={() => setIsBankConnectOpen(false)}
        onAccountAdded={handleAccountAdded}
      />

      <AICoachChatModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-[10px]">
              ₹
            </div>
            <span className="font-semibold text-slate-300">Smart Usage</span>
            <span>·</span>
            <span>Smart Expense & Budget Management System (INR)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>256-Bit Encrypted Indian Bank Sync</span>
            <span>·</span>
            <span>Gemini 3.8 Intelligence Engine</span>
            <span>·</span>
            <span>© 2026 Smart Usage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
