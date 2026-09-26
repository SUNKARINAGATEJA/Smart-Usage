import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Plus } from 'lucide-react';
import { Transaction, BankAccount, BudgetCategory } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Partial<Transaction>) => void;
  bankAccounts: BankAccount[];
  budgetCategories: BudgetCategory[];
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  bankAccounts,
  budgetCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'receipt'>('manual');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(budgetCategories[0]?.category || 'Groceries & Dining');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Receipt Scan state
  const [receiptText, setReceiptText] = useState('');
  const [receiptImageBase64, setReceiptImageBase64] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const selectedAcc = bankAccounts.find((a) => a.id === bankAccountId) || bankAccounts[0];

    onAddTransaction({
      merchant,
      description: merchant,
      amount: parseFloat(amount),
      category,
      type,
      status: 'cleared',
      bankAccountId: selectedAcc.id,
      accountName: selectedAcc.accountName,
      date: new Date(date).toISOString(),
      notes,
      tags: tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Manual'],
    });

    handleReset();
    onClose();
  };

  const handleScanReceipt = async () => {
    if (!receiptText && !receiptImageBase64) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const res = await fetch('/api/gemini/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptText,
          receiptImageBase64,
        }),
      });

      const data = await res.json();
      if (data.merchant) setMerchant(data.merchant);
      if (data.amount) setAmount(data.amount.toString());
      if (data.category) setCategory(data.category);
      if (data.notes) setNotes(data.notes);
      if (data.tags) setTagsInput(data.tags.join(', '));
      if (data.date) setDate(data.date);

      setActiveTab('manual');
    } catch (err: any) {
      setScanError('Failed to parse receipt. Please complete fields manually.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const cleanBase64 = base64.split(',')[1];
      setReceiptImageBase64(cleanBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setMerchant('');
    setAmount('');
    setNotes('');
    setTagsInput('');
    setReceiptText('');
    setReceiptImageBase64(null);
    setScanError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Add Transaction Entry (INR ₹)
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'manual'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'receipt'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Receipt OCR</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'receipt' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300">
                <span className="font-semibold">Gemini Receipt OCR:</span> Paste text from your Indian receipt or upload an image to automatically parse merchant, total amount in ₹, category, date, and notes.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upload Receipt Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Or Paste Receipt Text / SMS Alert
                </label>
                <textarea
                  rows={4}
                  value={receiptText}
                  onChange={(e) => setReceiptText(e.target.value)}
                  placeholder="e.g. Spent Rs. 485.00 on Swiggy using ICICI Card 4081 on Sep 26..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {scanError && (
                <div className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{scanError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleScanReceipt}
                disabled={isScanning || (!receiptText && !receiptImageBase64)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning Receipt...' : 'Scan & Auto-Fill'}</span>
              </button>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Merchant / Description
                </label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Swiggy, Zomato, Reliance Fresh, Petrol Pump"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {type === 'income' ? (
                      <option value="Income">Income / Salary</option>
                    ) : (
                      budgetCategories.map((b) => (
                        <option key={b.id} value={b.category}>
                          {b.category}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bank Account</label>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {bankAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.institutionName} ({a.accountName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. UPI, Lunch"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. UPI Ref #893021"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
