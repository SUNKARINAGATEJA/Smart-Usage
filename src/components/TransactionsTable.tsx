import React, { useState, useMemo } from 'react';
import { Transaction, BudgetCategory } from '../types';
import { formatINR } from '../utils/formatters';
import {
  Search,
  Plus,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  onAddClick: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  budgetCategories = [],
  onAddClick,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filtered = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return transactions
      .filter((t) => {
        if (!t || typeof t !== 'object') return false;

        const merchant = t.merchant || t.description || '';
        const notes = t.notes || '';

        const matchesSearch =
          merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notes.toLowerCase().includes(searchTerm.toLowerCase());

        const category = t.category || '';
        const matchesCat =
          selectedCategory === 'all' ||
          category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesType = selectedType === 'all' || t.type === selectedType;

        return matchesSearch && matchesCat && matchesType;
      })
      .sort((a, b) => {
        const amtA = Number(a.amount || 0);
        const amtB = Number(b.amount || 0);
        if (sortBy === 'amount') {
          return sortOrder === 'desc' ? amtB - amtA : amtA - amtB;
        } else {
          const timeA = new Date(a.date || Date.now()).getTime();
          const timeB = new Date(b.date || Date.now()).getTime();
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
        }
      });
  }, [transactions, searchTerm, selectedCategory, selectedType, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, UPI reference, description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="Income">Income</option>
            {Array.isArray(budgetCategories) &&
              budgetCategories.map((b) => (
                <option key={b.id} value={b.category}>
                  {b.category}
                </option>
              ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* New Transaction CTA */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap ml-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">
                  <button
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <span>Date / Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Merchant & Notes</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 ml-auto hover:text-white transition-colors"
                  >
                    <span>Amount (INR)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No transactions recorded yet. Click &quot;Add Entry&quot; to log your first transaction.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const dateFormatted = new Date(tx.date || Date.now()).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeFormatted = new Date(tx.date || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={tx.id || Math.random()}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{dateFormatted}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{timeFormatted}</div>
                      </td>

                      {/* Merchant & Notes */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {tx.merchant || tx.description || 'Transaction'}
                          </span>
                          {tx.isRecurring && (
                            <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                              Recurring
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {tx.notes}
                          </div>
                        )}
                        {Array.isArray(tx.tags) && tx.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {tx.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-950 text-slate-200 border border-slate-800">
                          {tx.category || 'General'}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        <div className="text-xs font-medium text-slate-300">
                          {tx.accountName || 'Primary Account'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums text-sm font-bold">
                        <span className={isIncome ? 'text-emerald-400' : 'text-slate-100'}>
                          {isIncome ? '+' : '-'}{formatINR(Number(tx.amount || 0))}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
