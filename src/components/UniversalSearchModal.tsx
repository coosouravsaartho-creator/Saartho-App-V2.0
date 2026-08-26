import React, { useState, useMemo } from 'react';
import { Invoice, Party, Item, Expense } from '../types';
import { Search, X, TrendingUp, Users, Package, Receipt, ArrowRight, CornerDownLeft } from 'lucide-react';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  parties: Party[];
  items: Item[];
  expenses: Expense[];
  onSelectInvoice: (inv: Invoice) => void;
  onSelectParty: (party: Party) => void;
  onSelectItem: (item: Item) => void;
}

export function UniversalSearchModal({
  isOpen,
  onClose,
  invoices,
  parties,
  items,
  expenses,
  onSelectInvoice,
  onSelectParty,
  onSelectItem,
}: UniversalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { invoices: [], parties: [], items: [], expenses: [] };

    const q = searchQuery.toLowerCase().trim();

    const matchedInvoices = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.partyName.toLowerCase().includes(q) ||
        inv.items.some((i) => i.itemName.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedParties = parties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.gstin && p.gstin.toLowerCase().includes(q)) ||
        p.city.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedItems = items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.code.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.hsn.includes(q)
    ).slice(0, 4);

    const matchedExpenses = expenses.filter(
      (exp) =>
        exp.expenseNumber.toLowerCase().includes(q) ||
        exp.payee.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      invoices: matchedInvoices,
      parties: matchedParties,
      items: matchedItems,
      expenses: matchedExpenses,
    };
  }, [searchQuery, invoices, parties, items, expenses]);

  if (!isOpen) return null;

  const totalResultsCount =
    searchResults.invoices.length +
    searchResults.parties.length +
    searchResults.items.length +
    searchResults.expenses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="universal-search-input"
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search Invoices, Parties, Stock Items, Phone numbers..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {!searchQuery.trim() ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="text-xs">Search anything in your business instantly.</p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded border">INV-2026-0089</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border">Apex Infotech</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border">Drill Machine</span>
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No matching records found for &ldquo;<span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;.
            </div>
          ) : (
            <>
              {/* Invoices Result */}
              {searchResults.invoices.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span>Invoices &amp; Bills ({searchResults.invoices.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.invoices.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          onSelectInvoice(inv);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold">
                              {inv.type}
                            </span>
                            <span className="text-xs text-slate-600 font-medium">{inv.partyName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Date: {inv.date} &bull; Status: {inv.status}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">₹{(inv.grandTotal ?? 0).toLocaleString('en-IN')}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Parties Result */}
              {searchResults.parties.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Parties ({searchResults.parties.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.parties.map((party) => (
                      <button
                        key={party.id}
                        onClick={() => {
                          onSelectParty(party);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{party.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                              {party.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{party.city} &bull; {party.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${(party.balance ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Balance: ₹{Math.abs(party.balance ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Result */}
              {searchResults.items.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inventory Items ({searchResults.items.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectItem(item);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{item.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">HSN: {item.hsn} &bull; Category: {item.category}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">₹{item.salePrice}</span>
                          <p className="text-[10px] text-slate-500">Stock: {item.stockQty} {item.unit}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border">ESC</kbd> to exit</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
