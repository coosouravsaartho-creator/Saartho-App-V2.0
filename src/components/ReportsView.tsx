import React, { useState } from 'react';
import { Invoice, Expense, FiscalYear } from '../types';
import { BarChart3, FileText, Download, Printer, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ReportsViewProps {
  invoices: Invoice[];
  expenses: Expense[];
  fiscalYear: FiscalYear;
}

export function ReportsView({ invoices, expenses, fiscalYear }: ReportsViewProps) {
  const [activeReport, setActiveReport] = useState<'gstr1' | 'pnl' | 'balance_sheet' | 'daybook'>('pnl');

  const sales = invoices.filter((i) => i.type === 'Sale');
  const purchases = invoices.filter((i) => i.type === 'Purchase');

  const totalSalesVal = sales.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalTaxOutput = sales.reduce((sum, i) => sum + i.taxTotal, 0);

  const totalPurchasesVal = purchases.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalTaxInput = purchases.reduce((sum, i) => sum + i.taxTotal, 0);

  const totalOverheads = expenses.reduce((sum, e) => sum + e.amount, 0);

  const netGstPayable = Math.max(0, totalTaxOutput - totalTaxInput);
  const netProfit = totalSalesVal - totalPurchasesVal - totalOverheads;

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Real-Time Financial Reports</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {fiscalYear}
            </span>
          </div>
          <p className="text-xs text-slate-500">Instant GST audit sheets, Profit &amp; Loss statements, and Day Book summaries.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveReport('pnl')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'pnl' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Profit &amp; Loss Statement
        </button>
        <button
          onClick={() => setActiveReport('gstr1')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'gstr1' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          GSTR-1 Tax Summary (Outward Supplies)
        </button>
        <button
          onClick={() => setActiveReport('balance_sheet')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'balance_sheet' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActiveReport('daybook')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeReport === 'daybook' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Day Book
        </button>
      </div>

      {/* Content depending on selected report */}
      {activeReport === 'pnl' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="text-center border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">Profit &amp; Loss Statement ({fiscalYear})</h3>
            <p className="text-xs text-slate-500">Summary of revenue, direct costs, and operational expenditure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Side */}
            <div className="space-y-3 p-4 rounded-xl bg-emerald-50/40 border border-emerald-100">
              <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider">Trading Income (Credit)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Gross Sales Turnover:</span>
                  <span className="font-bold">₹{(totalSalesVal ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Other Operating Receipts:</span>
                  <span className="font-bold">₹0</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-900">
                  <span>Total Revenue:</span>
                  <span>₹{(totalSalesVal ?? 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Expenses Side */}
            <div className="space-y-3 p-4 rounded-xl bg-rose-50/40 border border-rose-100">
              <h4 className="text-xs font-bold uppercase text-rose-800 tracking-wider">Expenditure (Debit)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Cost of Purchases (Raw/Goods):</span>
                  <span className="font-bold">₹{(totalPurchasesVal ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Direct &amp; Indirect Overheads:</span>
                  <span className="font-bold">₹{(totalOverheads ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-rose-200 flex justify-between font-bold text-rose-900">
                  <span>Total Expenditure:</span>
                  <span>₹{((totalPurchasesVal ?? 0) + (totalOverheads ?? 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400">Net Estimated Profit for {fiscalYear}</span>
              <div className="text-2xl font-black text-emerald-400">₹{(netProfit ?? 0).toLocaleString('en-IN')}</div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Profitable Period
            </span>
          </div>
        </div>
      )}

      {activeReport === 'gstr1' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">GSTR-1 Tax Summary ({fiscalYear})</h3>
            <p className="text-xs text-slate-500">Outward B2B and B2C sales tax liability report for monthly return filing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Output Tax Collected (Sales)</span>
              <div className="text-xl font-bold text-blue-700 mt-1">₹{(totalTaxOutput ?? 0).toLocaleString('en-IN')}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Input Tax Credit (Purchases)</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">₹{(totalTaxInput ?? 0).toLocaleString('en-IN')}</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs text-blue-800 font-semibold">Net GST Payable in Cash Ledger</span>
              <div className="text-xl font-bold text-blue-900 mt-1">₹{(netGstPayable ?? 0).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Party GSTIN</th>
                  <th className="p-2.5">Taxable Value</th>
                  <th className="p-2.5">CGST (9%)</th>
                  <th className="p-2.5">SGST (9%)</th>
                  <th className="p-2.5 text-right">Invoice Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2.5 font-mono font-medium text-slate-900">{s.invoiceNumber}</td>
                    <td className="p-2.5 font-mono text-slate-600">{s.partyGstin || 'B2C Consumer'}</td>
                    <td className="p-2.5">₹{(s.subtotal ?? 0).toLocaleString('en-IN')}</td>
                    <td className="p-2.5">₹{((s.taxTotal ?? 0) / 2).toLocaleString('en-IN')}</td>
                    <td className="p-2.5">₹{((s.taxTotal ?? 0) / 2).toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{(s.grandTotal ?? 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'balance_sheet' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">Provisional Balance Sheet</h3>
            <p className="text-xs text-slate-500">Assets and Liabilities statement as on 25 August 2026</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase">Assets (₹)</h4>
              <div className="flex justify-between"><span>Current Stock Value:</span><span>₹1,211,450</span></div>
              <div className="flex justify-between"><span>Sundry Debtors (Receivables):</span><span>₹511,100</span></div>
              <div className="flex justify-between"><span>Bank &amp; Cash Balances:</span><span>₹1,211,400</span></div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase">Liabilities (₹)</h4>
              <div className="flex justify-between"><span>Sundry Creditors (Payables):</span><span>₹341,500</span></div>
              <div className="flex justify-between"><span>GST Output Tax Reserve:</span><span>₹68,450</span></div>
              <div className="flex justify-between"><span>Owner&apos;s Capital &amp; Reserves:</span><span>₹2,524,000</span></div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'daybook' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="text-center border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">Day Book Ledger</h3>
            <p className="text-xs text-slate-500">Chronological ledger of all inward and outward transactions</p>
          </div>
          <div className="space-y-2 text-xs">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span> &bull; {inv.partyName}
                  <span className="text-slate-400 ml-2">({inv.date})</span>
                </div>
                <div className="font-bold text-slate-900">₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
