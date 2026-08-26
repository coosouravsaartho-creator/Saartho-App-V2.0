import React, { useState, useMemo } from 'react';
import { Invoice, UserAccount } from '../types';
import { Printer, X, CheckSquare, Square, FileText, Download, CheckCircle2 } from 'lucide-react';

interface BulkPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  user: UserAccount;
}

export function BulkPrintModal({ isOpen, onClose, invoices, user }: BulkPrintModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => invoices.slice(0, 3).map((i) => i.id));
  const [printFormat, setPrintFormat] = useState<'a4' | 'thermal' | 'modern'>('a4');
  const [filterType, setFilterType] = useState<'All' | 'Sale' | 'Purchase'>('All');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const displayInvoices = useMemo(() => {
    if (filterType === 'All') return invoices;
    return invoices.filter((i) => i.type === filterType);
  }, [invoices, filterType]);

  if (!isOpen) return null;

  const handleToggleSelectAll = () => {
    if (selectedIds.length === displayInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayInvoices.map((i) => i.id));
    }
  };

  const handleToggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleTriggerPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      setTimeout(() => setPrintSuccess(false), 3000);
      try {
        window.print();
      } catch (e) {
        // iframe fallback safe
      }
    }, 600);
  };

  const selectedInvoicesList = invoices.filter((i) => selectedIds.includes(i.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk Print &amp; Statement Export</h3>
              <p className="text-xs text-slate-500">
                Print multiple tax invoices, POS slips, and customer receipts simultaneously.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Selection Column */}
          <div className="w-full md:w-5/12 p-4 border-r border-slate-200 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
            {/* Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Print Layout Format</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPrintFormat('a4')}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    printFormat === 'a4' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standard A4
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('thermal')}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    printFormat === 'thermal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  80mm POS
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('modern')}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    printFormat === 'modern' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Modern GST
                </button>
              </div>
            </div>

            {/* Invoices List to Select */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  Select Documents ({selectedIds.length} chosen)
                </span>
                <button
                  onClick={handleToggleSelectAll}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  {selectedIds.length === displayInvoices.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {displayInvoices.map((inv) => {
                  const isChecked = selectedIds.includes(inv.id);
                  return (
                    <div
                      key={inv.id}
                      onClick={() => handleToggleOne(inv.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-500/10'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5 text-blue-600">
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                          <span className="text-xs font-bold text-slate-900">₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">{inv.partyName}</p>
                        <p className="text-[10px] text-slate-400">{inv.date} &bull; {inv.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Print Preview */}
          <div className="w-full md:w-7/12 p-4 bg-slate-200/60 overflow-y-auto flex flex-col items-center custom-scrollbar">
            <span className="text-xs font-semibold text-slate-500 mb-2">Live Batch Print Preview</span>
            {selectedInvoicesList.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select at least one invoice on the left to preview print output.
              </div>
            ) : (
              <div className="w-full space-y-4 max-w-md">
                {selectedInvoicesList.map((inv) => (
                  <div
                    key={inv.id}
                    className={`bg-white rounded-lg shadow-md border border-slate-300 p-4 text-slate-900 ${
                      printFormat === 'thermal' ? 'font-mono text-[10px] max-w-xs mx-auto' : 'text-xs'
                    }`}
                  >
                    {/* Header of bill */}
                    <div className="text-center border-b pb-2 mb-2 border-slate-200">
                      <h4 className="font-bold text-sm text-slate-900 uppercase">{user.businessName}</h4>
                      <p className="text-[10px] text-slate-500">{user.address}</p>
                      <p className="text-[10px] text-slate-500">GSTIN: {user.gstin || '07AAAAA0000A1Z5'}</p>
                      <span className="inline-block mt-1 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded">
                        TAX INVOICE
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between text-[11px] mb-2 text-slate-600">
                      <div>
                        <strong>Bill To:</strong> {inv.partyName}
                        <br />
                        Phone: {inv.partyPhone}
                      </div>
                      <div className="text-right">
                        <strong>Invoice:</strong> {inv.invoiceNumber}
                        <br />
                        Date: {inv.date}
                      </div>
                    </div>

                    {/* Items table */}
                    <table className="w-full text-left text-[10px] border-t border-b border-slate-200 my-2">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600">
                          <th className="py-1">Item</th>
                          <th className="py-1 text-center">Qty</th>
                          <th className="py-1 text-right">Rate</th>
                          <th className="py-1 text-right">Amt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((it, idx) => (
                          <tr key={idx} className="border-b border-slate-100">
                            <td className="py-1">{it.itemName}</td>
                            <td className="py-1 text-center">{it.qty} {it.unit}</td>
                            <td className="py-1 text-right">₹{it.rate}</td>
                            <td className="py-1 text-right font-medium">₹{it.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="space-y-0.5 text-[10px] text-right">
                      <div>Subtotal: ₹{(inv.subtotal ?? 0).toLocaleString('en-IN')}</div>
                      <div>GST Tax (18%): ₹{(inv.taxTotal ?? 0).toLocaleString('en-IN')}</div>
                      <div className="font-bold text-xs pt-1 border-t border-slate-300 text-slate-900">
                        Grand Total: ₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {printSuccess && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Printed {selectedIds.length} documents successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTriggerPrint}
              disabled={selectedIds.length === 0 || isPrinting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Printing...' : `Print (${selectedIds.length}) Invoices`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
