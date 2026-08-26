import React, { useState } from 'react';
import { Invoice } from '../types';
import { ShoppingCart, Plus, Search, Filter, Printer, FileText } from 'lucide-react';

interface PurchasesViewProps {
  invoices: Invoice[];
  onOpenPurchaseModal: () => void;
  onViewInvoice: (inv: Invoice) => void;
}

export function PurchasesView({ invoices, onOpenPurchaseModal, onViewInvoice }: PurchasesViewProps) {
  const [search, setSearch] = useState('');

  const purchaseInvoices = invoices.filter((i) => i.type === 'Purchase');

  const filteredPurchases = purchaseInvoices.filter((inv) => {
    return (
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.partyName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPurchase = purchaseInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalTaxClaimable = purchaseInvoices.reduce((sum, i) => sum + i.taxTotal, 0);

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Purchase Bills &amp; Inward Stock</h1>
          <p className="text-xs text-slate-500">Record vendor purchases, inward material challans, and GST Input Tax Credit (ITC).</p>
        </div>
        <button
          onClick={onOpenPurchaseModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Purchase (Ctrl+F2)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Purchase Expenses</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(totalPurchase ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400">Total raw materials &amp; resale stock purchased</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800">GST Input Tax Credit (ITC Claimable)</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">₹{(totalTaxClaimable ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Eligible to offset outward tax liability</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor name, bill number..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Bill Number</th>
                <th className="py-2.5 px-3.5">Supplier / Vendor</th>
                <th className="py-2.5 px-3.5">Bill Date</th>
                <th className="py-2.5 px-3.5 text-right">Taxable Amt</th>
                <th className="py-2.5 px-3.5 text-right">GST ITC</th>
                <th className="py-2.5 px-3.5 text-right">Grand Total</th>
                <th className="py-2.5 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3.5 font-bold font-mono text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-900">{inv.partyName}</td>
                  <td className="py-2.5 px-3.5 text-slate-500">{inv.date}</td>
                  <td className="py-2.5 px-3.5 text-right text-slate-600">₹{(inv.subtotal ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3.5 text-right font-medium text-emerald-700">₹{(inv.taxTotal ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      View
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
