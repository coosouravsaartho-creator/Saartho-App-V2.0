import React, { useState } from 'react';
import { Expense } from '../types';
import { Receipt, Plus, Search, Tag, X, CheckCircle2 } from 'lucide-react';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
}

export function ExpensesView({ expenses, onAddExpense }: ExpensesViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New expense state
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('5000');
  const [category, setCategory] = useState<any>('Office Supplies');
  const [paymentMode, setPaymentMode] = useState<any>('UPI');
  const [notes, setNotes] = useState('');

  const categories = [
    'All',
    'Rent',
    'Electricity & Utility',
    'Staff Salary',
    'Freight & Logistics',
    'Marketing & Promo',
    'Office Supplies',
    'Maintenance',
    'Professional Fees',
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchSearch =
      e.payee.toLowerCase().includes(search.toLowerCase()) ||
      e.expenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee.trim()) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      expenseNumber: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: '2026-08-25',
      fiscalYear: 'FY 2026-27',
      category,
      payee,
      amount: Number(amount),
      taxRate: 18,
      paymentMode,
      status: 'Paid',
      taxDeductible: true,
      notes,
    };
    onAddExpense(newExp);
    setIsAddModalOpen(false);
    setPayee('');
    setNotes('');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Expense Tracker</h1>
          <p className="text-xs text-slate-500">Record operating overheads, utilities, salaries, and tax-deductible costs.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Expense</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">Total Recorded Overheads (FY 2026-27)</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(totalExpense ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400">Across {expenses.length} expense vouchers</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            100% Tax Deductible
          </span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  categoryFilter === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payee or notes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Voucher #</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5">Payee / Beneficiary</th>
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5">Paid Via</th>
                <th className="py-2.5 px-3.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold font-mono text-slate-900">{exp.expenseNumber}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-900">
                    <div>{exp.payee}</div>
                    {exp.notes && <div className="text-[10px] text-slate-400 truncate">{exp.notes}</div>}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500">{exp.date}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{exp.paymentMode}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">
                    ₹{(exp.amount ?? 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Business Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Rent">Warehouse / Office Rent</option>
                  <option value="Electricity & Utility">Electricity &amp; Utility</option>
                  <option value="Staff Salary">Staff Payroll / Salary</option>
                  <option value="Freight & Logistics">Freight &amp; Transport</option>
                  <option value="Marketing & Promo">Marketing &amp; Advertising</option>
                  <option value="Office Supplies">Office Stationery &amp; Supplies</option>
                  <option value="Maintenance">Equipment Maintenance</option>
                  <option value="Professional Fees">CA / Legal Professional Fees</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payee / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  placeholder="e.g. BSES Power Ltd or Landlord"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="UPI">UPI QR</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Bill Ref</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Monthly maintenance bill #8892"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
