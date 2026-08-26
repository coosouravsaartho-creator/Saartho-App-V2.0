import React, { useState } from 'react';
import { Invoice, InvoiceItem, Party, Item, UserAccount, FiscalYear } from '../types';
import {
  X,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';

/* ========================================================================= */
/* 1. SALE BILL CREATOR MODAL */
/* ========================================================================= */
interface SaleBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Party[];
  items: Item[];
  fiscalYear: FiscalYear;
  onSaveInvoice: (invoice: Invoice) => void;
  saleType?: string;
}

export function SaleBillModal({
  isOpen,
  onClose,
  parties,
  items,
  fiscalYear,
  onSaveInvoice,
  saleType = 'Sale invoices',
}: SaleBillModalProps) {
  const [selectedPartyId, setSelectedPartyId] = useState(parties[0]?.id || '');
  const [invoiceDate, setInvoiceDate] = useState('2026-08-25');
  const [paymentMode, setPaymentMode] = useState<any>('Bank Transfer / NEFT');
  const [notes, setNotes] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      itemId: items[0]?.id || '',
      itemName: items[0]?.name || 'Drill Machine 850W',
      hsn: items[0]?.hsn || '84672100',
      qty: 2,
      unit: items[0]?.unit || 'PCS',
      rate: items[0]?.salePrice || 4250,
      taxRate: items[0]?.taxRate || 18,
      discountPct: 0,
      amount: (items[0]?.salePrice || 4250) * 2,
    },
  ]);

  if (!isOpen) return null;

  const currentParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const handleAddItemRow = () => {
    const defaultItem = items[0];
    setInvoiceItems([
      ...invoiceItems,
      {
        itemId: defaultItem.id,
        itemName: defaultItem.name,
        hsn: defaultItem.hsn,
        qty: 1,
        unit: defaultItem.unit,
        rate: defaultItem.salePrice,
        taxRate: defaultItem.taxRate,
        discountPct: 0,
        amount: defaultItem.salePrice,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (invoiceItems.length === 1) return;
    setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, itemId: string) => {
    const matched = items.find((i) => i.id === itemId);
    if (!matched) return;
    const newItems = [...invoiceItems];
    newItems[index] = {
      ...newItems[index],
      itemId: matched.id,
      itemName: matched.name,
      hsn: matched.hsn,
      rate: matched.salePrice,
      unit: matched.unit,
      taxRate: matched.taxRate,
      amount: matched.salePrice * newItems[index].qty * (1 - newItems[index].discountPct / 100),
    };
    setInvoiceItems(newItems);
  };

  const handleQtyRateDiscount = (
    index: number,
    field: 'qty' | 'rate' | 'discountPct',
    val: number
  ) => {
    const newItems = [...invoiceItems];
    const item = { ...newItems[index], [field]: val };
    const baseAmt = item.qty * item.rate;
    const discountAmt = (baseAmt * item.discountPct) / 100;
    item.amount = Math.max(0, baseAmt - discountAmt);
    newItems[index] = item;
    setInvoiceItems(newItems);
  };

  const subtotal = invoiceItems.reduce((sum, it) => sum + it.amount, 0);
  const taxTotal = invoiceItems.reduce((sum, it) => sum + (it.amount * it.taxRate) / 100, 0);
  const grandTotal = Math.round(subtotal + taxTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Sale',
      partyId: currentParty.id,
      partyName: currentParty.name,
      partyPhone: currentParty.phone,
      partyGstin: currentParty.gstin,
      date: invoiceDate,
      dueDate: invoiceDate,
      fiscalYear: fiscalYear,
      items: invoiceItems,
      subtotal,
      taxTotal,
      discountTotal: 0,
      roundOff: 0,
      grandTotal,
      receivedPaidAmount: grandTotal,
      balanceDue: 0,
      paymentMode,
      status: 'Paid',
      notes,
    };
    onSaveInvoice(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Create New {saleType}</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  GST Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">Add products, auto-compute taxes, and bill customer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* Party & Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Party</label>
              <select
                value={selectedPartyId}
                onChange={(e) => setSelectedPartyId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              >
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                <option value="UPI">UPI QR / PhonePe</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit">Credit (Pay Later)</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item / Description</th>
                  <th className="p-2.5 w-20 text-center">Qty</th>
                  <th className="p-2.5 w-24 text-right">Price (₹)</th>
                  <th className="p-2.5 w-20 text-center">Disc %</th>
                  <th className="p-2.5 w-20 text-center">GST %</th>
                  <th className="p-2.5 w-24 text-right">Amount</th>
                  <th className="p-2.5 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceItems.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2">
                      <select
                        value={row.itemId}
                        onChange={(e) => handleItemChange(idx, e.target.value)}
                        className="w-full p-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900"
                      >
                        {items.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.name} (Stock: {it.stockQty})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => handleQtyRateDiscount(idx, 'qty', Number(e.target.value))}
                        className="w-full p-1.5 text-xs text-center border border-slate-300 rounded-md"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={0}
                        value={row.rate}
                        onChange={(e) => handleQtyRateDiscount(idx, 'rate', Number(e.target.value))}
                        className="w-full p-1.5 text-xs text-right border border-slate-300 rounded-md"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.discountPct}
                        onChange={(e) => handleQtyRateDiscount(idx, 'discountPct', Number(e.target.value))}
                        className="w-full p-1.5 text-xs text-center border border-slate-300 rounded-md"
                      />
                    </td>
                    <td className="p-2 text-center font-mono font-medium text-slate-600">
                      {row.taxRate}%
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      ₹{(row.amount ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={invoiceItems.length === 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddItemRow}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Another Product Item</span>
          </button>

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Notes / Terms</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Payment due within 15 days. Goods once sold will not be taken back."
                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{(subtotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated GST Tax:</span>
                <span className="font-semibold text-emerald-700">₹{(taxTotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₹{(grandTotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 cursor-pointer transition-colors"
            >
              Save &amp; Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. PURCHASE BILL CREATOR MODAL */
/* ========================================================================= */
interface PurchaseBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Party[];
  items: Item[];
  fiscalYear: FiscalYear;
  onSaveInvoice: (invoice: Invoice) => void;
}

export function PurchaseBillModal({
  isOpen,
  onClose,
  parties,
  items,
  fiscalYear,
  onSaveInvoice,
}: PurchaseBillModalProps) {
  const vendorParties = parties.filter((p) => p.type === 'Supplier' || p.type === 'Both');
  const [selectedPartyId, setSelectedPartyId] = useState(vendorParties[0]?.id || parties[0]?.id || '');
  const [billDate, setBillDate] = useState('2026-08-25');
  const [paymentMode, setPaymentMode] = useState<any>('Bank Transfer / NEFT');
  const [purchaseItems, setPurchaseItems] = useState<InvoiceItem[]>([
    {
      itemId: items[0]?.id || '',
      itemName: items[0]?.name || 'Industrial Heavy Duty Drill',
      hsn: items[0]?.hsn || '84672100',
      qty: 10,
      unit: items[0]?.unit || 'PCS',
      rate: items[0]?.purchasePrice || 3200,
      taxRate: 18,
      discountPct: 0,
      amount: (items[0]?.purchasePrice || 3200) * 10,
    },
  ]);

  if (!isOpen) return null;

  const currentParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const subtotal = purchaseItems.reduce((sum, it) => sum + it.amount, 0);
  const taxTotal = purchaseItems.reduce((sum, it) => sum + (it.amount * it.taxRate) / 100, 0);
  const grandTotal = Math.round(subtotal + taxTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBill: Invoice = {
      id: `pur-${Date.now()}`,
      invoiceNumber: `PUR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Purchase',
      partyId: currentParty.id,
      partyName: currentParty.name,
      partyPhone: currentParty.phone,
      partyGstin: currentParty.gstin,
      date: billDate,
      dueDate: billDate,
      fiscalYear: fiscalYear,
      items: purchaseItems,
      subtotal,
      taxTotal,
      discountTotal: 0,
      roundOff: 0,
      grandTotal,
      receivedPaidAmount: grandTotal,
      balanceDue: 0,
      paymentMode,
      status: 'Paid',
    };
    onSaveInvoice(newBill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Purchase Bill</h3>
              <p className="text-xs text-slate-500">Record inward stock from supplier &amp; claim GST input credit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier / Vendor</label>
              <select
                value={selectedPartyId}
                onChange={(e) => setSelectedPartyId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
              >
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bill Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Paid Via</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-700">Purchased Item Line</span>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={purchaseItems[0]?.itemId}
                onChange={(e) => {
                  const m = items.find((it) => it.id === e.target.value);
                  if (m) {
                    setPurchaseItems([
                      {
                        itemId: m.id,
                        itemName: m.name,
                        hsn: m.hsn,
                        qty: 10,
                        unit: m.unit,
                        rate: m.purchasePrice,
                        taxRate: 18,
                        discountPct: 0,
                        amount: m.purchasePrice * 10,
                      },
                    ]);
                  }
                }}
                className="col-span-2 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name} - ₹{it.purchasePrice}/unit
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                value={purchaseItems[0]?.qty}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  const base = q * purchaseItems[0].rate;
                  setPurchaseItems([{ ...purchaseItems[0], qty: q, amount: base }]);
                }}
                className="px-3 py-2 text-xs text-center border border-slate-300 rounded-lg bg-white"
                placeholder="Quantity"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">Total Inward Bill Value (incl GST):</span>
            <span className="text-base font-bold text-slate-900">₹{(grandTotal ?? 0).toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              Save Purchase Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. PAYMENT IN (RECEIVE MONEY) MODAL */
/* ========================================================================= */
interface PaymentInModalProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Party[];
  onRecordPaymentIn: (partyId: string, amount: number, mode: string) => void;
}

export function PaymentInModal({
  isOpen,
  onClose,
  parties,
  onRecordPaymentIn,
}: PaymentInModalProps) {
  const customerParties = parties.filter((p) => p.type === 'Customer' || p.type === 'Both');
  const [selectedPartyId, setSelectedPartyId] = useState(customerParties[0]?.id || parties[0]?.id || '');
  const [amount, setAmount] = useState('25000');
  const [mode, setMode] = useState('UPI');

  if (!isOpen) return null;

  const currentParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPaymentIn(currentParty.id, Number(amount), mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600 text-white">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Record Payment In</h3>
              <p className="text-[11px] text-slate-500">Receive cash/UPI/bank from debtor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">From Customer</label>
            <select
              value={selectedPartyId}
              onChange={(e) => setSelectedPartyId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              {customerParties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Due: ₹{Math.max(0, p.balance ?? 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Received Amount (₹)</label>
            <input
              type="number"
              min={1}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              <option value="UPI">UPI / QR Code</option>
              <option value="Bank Transfer / NEFT">Bank Transfer (NEFT/RTGS)</option>
              <option value="Cash">Cash in Hand</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 4. PAYMENT OUT (SUPPLIER/EXPENSE PAYOUT) MODAL */
/* ========================================================================= */
interface PaymentOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Party[];
  onRecordPaymentOut: (partyId: string, amount: number, mode: string) => void;
}

export function PaymentOutModal({
  isOpen,
  onClose,
  parties,
  onRecordPaymentOut,
}: PaymentOutModalProps) {
  const vendorParties = parties.filter((p) => p.type === 'Supplier' || p.type === 'Both');
  const [selectedPartyId, setSelectedPartyId] = useState(vendorParties[0]?.id || parties[0]?.id || '');
  const [amount, setAmount] = useState('18000');
  const [mode, setMode] = useState('Bank Transfer / NEFT');

  if (!isOpen) return null;

  const currentParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPaymentOut(currentParty.id, Number(amount), mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-rose-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Record Payment Out</h3>
              <p className="text-[11px] text-slate-500">Pay vendor or supplier invoice</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">To Vendor / Supplier</label>
            <select
              value={selectedPartyId}
              onChange={(e) => setSelectedPartyId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              {vendorParties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Payable: ₹{Math.abs(p.balance ?? 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Disbursed Amount (₹)</label>
            <input
              type="number"
              min={1}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              <option value="Bank Transfer / NEFT">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI Payment</option>
              <option value="Cash">Cash Drawer</option>
              <option value="Cheque">Cheque Issuance</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
            >
              Disburse Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 5. INVOICE DETAIL & PRINT PREVIEW MODAL */
/* ========================================================================= */
interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  user: UserAccount;
}

export function InvoiceDetailModal({ invoice, onClose, user }: InvoiceDetailModalProps) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {invoice.type} Invoice: {invoice.invoiceNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto text-xs text-slate-800 space-y-4 custom-scrollbar bg-white">
          {/* Bill Heading */}
          <div className="flex justify-between items-start border-b pb-4 border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-black text-xl flex items-center justify-center shrink-0 shadow-inner">
                {user.businessName ? user.businessName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase leading-tight">{user.businessName}</h2>
                <p className="text-slate-500 text-[11px] mt-0.5 max-w-md">{user.address}</p>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 font-mono text-[11px] mt-1">
                  <span>GSTIN: <strong>{user.gstin || '07AAAAA0000A1Z5'}</strong></span>
                  {user.phoneNumber && <span>Phone: <strong>{user.phoneNumber}</strong></span>}
                  {user.email && <span>Email: <strong>{user.email}</strong></span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                TAX INVOICE
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm mt-1">{invoice.invoiceNumber}</p>
              <p className="text-slate-500 text-[11px]">Invoice Date: {invoice.date}</p>
              <p className="text-slate-400 text-[10px]">Place of Supply: Delhi (07)</p>
            </div>
          </div>

          {/* Party info */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer / Billed To:</span>
              <p className="font-bold text-sm text-slate-900">{invoice.partyName}</p>
              <p className="text-slate-600 text-xs mt-0.5">{invoice.partyPhone || '+91 98111 22334'}</p>
              {invoice.partyGstin ? (
                <p className="font-mono text-slate-700 font-semibold mt-0.5">GSTIN: {invoice.partyGstin}</p>
              ) : (
                <span className="text-[10px] text-slate-400">Unregistered Consumer</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Invoice Summary:</span>
              <p className="font-bold text-emerald-700 text-xs">{invoice.status} • {invoice.paymentMode}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Due Date: {invoice.dueDate || invoice.date}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <thead className="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th className="p-2.5">Item &amp; Description</th>
                <th className="p-2.5 text-center">HSN/SAC</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right">Rate (₹)</th>
                <th className="p-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5 font-medium text-slate-900">{it.itemName}</td>
                  <td className="p-2.5 text-center font-mono text-slate-500">{it.hsn}</td>
                  <td className="p-2.5 text-center font-semibold">{it.qty} {it.unit}</td>
                  <td className="p-2.5 text-right font-mono">₹{it.rate.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900 font-mono">₹{(it.amount ?? 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Signature Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Terms & Signature Box */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Terms &amp; Conditions:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  1. Goods once sold will not be taken back.<br />
                  2. Payment is due strictly on or before the due date.<br />
                  3. Subject to jurisdiction of local courts.
                </p>
              </div>

              {/* Authorized Signatory Box */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">For {user.businessName}</span>
                  <span className="text-xs font-bold text-blue-900">Authorized Signatory</span>
                </div>
                <div className="px-2.5 py-1 rounded border border-blue-300 bg-blue-50 text-blue-800 text-[10px] font-bold">
                  ✓ Digitally Signed
                </div>
              </div>
            </div>

            {/* Calculations Total */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono font-semibold">₹{(invoice.subtotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IGST / CGST+SGST Tax:</span>
                <span className="font-mono font-semibold">₹{(invoice.taxTotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="font-mono text-blue-700">₹{(invoice.grandTotal ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-emerald-700 pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono">₹{(invoice.receivedPaidAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
