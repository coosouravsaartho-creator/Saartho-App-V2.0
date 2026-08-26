import React, { useState } from 'react';
import { Item } from '../types';
import { Package, Plus, Search, AlertTriangle, CheckCircle2, ArrowUpDown, X, Tag } from 'lucide-react';

interface ItemsViewProps {
  items: Item[];
  onAddItem: (item: Item) => void;
}

export function ItemsView({ items, onAddItem }: ItemsViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Item State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('General');
  const [hsn, setHsn] = useState('84672100');
  const [salePrice, setSalePrice] = useState('1500');
  const [purchasePrice, setPurchasePrice] = useState('1100');
  const [stockQty, setStockQty] = useState('20');
  const [unit, setUnit] = useState('PCS');
  const [taxRate, setTaxRate] = useState(18);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((it) => {
    const matchCat = categoryFilter === 'All' || it.category === categoryFilter;
    const matchSearch =
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.code.toLowerCase().includes(search.toLowerCase()) ||
      it.hsn.includes(search);
    return matchCat && matchSearch;
  });

  const totalStockValuation = items.reduce((sum, it) => sum + it.stockQty * it.purchasePrice, 0);
  const lowStockItems = items.filter((it) => it.stockQty <= it.minStockLevel);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: Item = {
      id: `item-${Date.now()}`,
      name,
      code: code || `ITEM-${Math.floor(100 + Math.random() * 900)}`,
      category: category || 'General',
      hsn: hsn || '84818030',
      salePrice: Number(salePrice),
      purchasePrice: Number(purchasePrice),
      stockQty: Number(stockQty),
      unit,
      minStockLevel: 10,
      taxRate,
      unitsSold: 0,
      totalRevenue: 0,
    };
    onAddItem(newItem);
    setIsAddModalOpen(false);
    setName('');
    setCode('');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Items &amp; Inventory Management</h1>
          <p className="text-xs text-slate-500">Track stock quantities, HSN codes, GST tax rates, and purchase values.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product / Item</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Products Registered</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{items.length}</div>
          <span className="text-[11px] text-slate-400">Across {categories.length - 1} categories</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Inventory Valuation</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(totalStockValuation ?? 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-600 font-medium">At weighted cost price</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-800">Low Stock Re-order Alert</span>
          <div className="text-2xl font-bold text-amber-900 mt-1">{lowStockItems.length} Items</div>
          <span className="text-[11px] text-amber-700">Stock below safety threshold</span>
        </div>
      </div>

      {/* Items Table */}
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
              placeholder="Search item, item code or HSN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Item Name &amp; Code</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5 text-center">HSN</th>
                <th className="py-2.5 px-3.5 text-right">Sale Price</th>
                <th className="py-2.5 px-3.5 text-right">Purchase Price</th>
                <th className="py-2.5 px-3.5 text-center">GST Rate</th>
                <th className="py-2.5 px-3.5 text-right">Stock Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((it) => {
                const isLow = it.stockQty <= it.minStockLevel;
                return (
                  <tr key={it.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3.5">
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">Code: {it.code}</div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {it.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-600">{it.hsn}</td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-900">₹{it.salePrice}</td>
                    <td className="py-2.5 px-3.5 text-right text-slate-600">₹{it.purchasePrice}</td>
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-700">{it.taxRate}%</td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                          {it.stockQty} {it.unit}
                        </span>
                        {isLow && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" title="Low stock warning" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Inventory Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item / Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Copper Armoured Cable 4-Core"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Item Code / SKU</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CAB-4C6"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Electricals"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Qty</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={hsn}
                    onChange={(e) => setHsn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GST Tax Slab</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST (Standard)</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>
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
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
