export type TransactionType = 'expense' | 'income';
export type TransactionStatus = 'cleared' | 'pending' | 'flagged';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD HH:mm
  description: string;
  merchant: string;
  amount: number; // positive number in INR (₹)
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  bankAccountId: string;
  accountName: string;
  receiptText?: string;
  notes?: string;
  tags?: string[];
  isRecurring?: boolean;
}

export interface BankAccount {
  id: string;
  institutionName: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  accountNumberLast4: string;
  balance: number; // in INR (₹)
  currency: string; // 'INR'
  lastSynced: string;
  syncStatus: 'synced' | 'syncing' | 'error' | 'paused';
  institutionColor: string;
  institutionLogoText: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  allocatedAmount: number; // in INR (₹)
  spentAmount: number; // in INR (₹)
  color: string;
  iconName: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number; // in INR (₹)
  currentAmount: number; // in INR (₹)
  deadline: string;
  category: string;
  iconName: string;
  color: string;
}

export interface SavingsOpportunity {
  title: string;
  potentialSavings: number; // in INR (₹)
  impactLevel: 'high' | 'medium' | 'low';
  actionStep: string;
}

export interface CategoryReportItem {
  category: string;
  budget: number;
  spent: number;
  status: 'under' | 'near' | 'over';
  note: string;
}

export interface SpendingReport {
  monthYear: string; // e.g. "September 2026"
  generatedAt: string;
  overallScore: number;
  scoreLabel: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  executiveSummary: string;
  topHighlights: string[];
  savingsOpportunities: SavingsOpportunity[];
  categoryBreakdown: CategoryReportItem[];
  actionableTips: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  triggerCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedCategory?: string;
}
