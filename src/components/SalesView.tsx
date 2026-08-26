import React, { useState } from 'react';
import { Invoice, ThemeConfig } from '../types';
import { TrendingUp, Plus, Search, Filter, Printer, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface SalesViewProps {
  invoices: Invoice[];
  onOpenSaleModal: () => void;
  onViewInvoice: (inv: Invoice) => void;
  selectedSaleType?: string;
  onSelectSaleType?: (type: string) => void;
  currentTheme?: ThemeConfig;
}

export function SalesView({
  invoices,
  onOpenSaleModal,
  onViewInvoice,
  selectedSaleType = 'Sale invoices',
  onSelectSaleType,
  currentTheme,
}: SalesViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Overdue'>('All');

  const saleCategories = [
    'Sale invoices',
    'Estimate/ Quotation',
    'Proforma Invoice',
    'Sale Order',
    'Delivery Challan',
    'Sale Return',
    'Credit Note',
    'Payment In',
    'Sale Fixed Assets',
  ];

  const currentCategory = selectedSaleType || 'Sale invoices';

  const saleInvoices = invoices.filter((i) => i.type === 'Sale');

  const filteredSales = saleInvoices.filter((inv) => {
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.partyName.toLowerCase().includes(search.toLowerCase()) ||
      inv.partyPhone.includes(search);
    return matchStatus && matchSearch;
  });

  const totalSaleAmount = saleInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalPaid = saleInvoices.reduce((sum, i) => sum + i.receivedPaidAmount, 0);
  const totalDue = saleInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Options Bar for Sale Sub-types */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar border-b border-slate-200">
        {saleCategories.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              id={`sale-category-tab-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectSaleType && onSelectSaleType(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
              style={isSelected ? { backgroundColor: currentTheme?.primaryColor || '#2563eb' } : undefined}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentCategory}</h1>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              Sale Module
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage, and dispatch GST-compliant customer {currentCategory.toLowerCase()} records.
          </p>
        </div>
        <button
          onClick={onOpenSaleModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create {currentCategory}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Billed Volume</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(totalSaleAmount ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400">{saleInvoices.length} invoices issued</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800">Total Payments Received</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">₹{(totalPaid ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-600">Settled via UPI / Bank / Cash</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-800">Total Pending Realization</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">₹{(totalDue ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-rose-600">Follow-up required</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            {(['All', 'Paid', 'Unpaid', 'Overdue'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number, party name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Invoice #</th>
                <th className="py-2.5 px-3.5">Customer Name</th>
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5">Payment Mode</th>
                <th className="py-2.5 px-3.5 text-right">Invoice Total</th>
                <th className="py-2.5 px-3.5 text-right">Balance Due</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
                <th className="py-2.5 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold font-mono text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-900">
                    <div>{inv.partyName}</div>
                    <div className="text-[10px] text-slate-400">{inv.partyPhone}</div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500">{inv.date}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{inv.paymentMode}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">
                    ₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className={`py-2.5 px-3.5 text-right font-semibold ${(inv.balanceDue ?? 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{(inv.balanceDue ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
