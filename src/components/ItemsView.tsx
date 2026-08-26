import React, { useState } from 'react';
import { Item, ItemType, UnitMaster } from '../types';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Tag,
  X,
  Ruler,
  Boxes,
  Wrench,
  Layers,
  ArrowRight,
  Edit3,
  TrendingUp,
  ShoppingCart,
  Sparkles,
  Check,
  RotateCcw,
  FileText,
  Info,
} from 'lucide-react';

interface ItemsViewProps {
  items: Item[];
  units?: UnitMaster[];
  onAddItem?: (item: Item) => void;
  onSaveItem?: (item: Item) => void;
  onAddUnit?: (unit: UnitMaster) => void;
}

export function ItemsView({
  items,
  units = [],
  onAddItem,
  onSaveItem,
  onAddUnit,
}: ItemsViewProps) {
  // Main Top Options: Product (default), Services, Raw Material, Unit
  const [activeTab, setActiveTab] = useState<'Product' | 'Service' | 'Raw Material' | 'Unit'>('Product');

  // Search filter for left side scrolling list box
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Item or Unit state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

  // Form State for Product / Service / Raw Material
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formType, setFormType] = useState<ItemType>('Product');
  const [formHsn, setFormHsn] = useState('84672100');
  const [formSalePrice, setFormSalePrice] = useState('1500');
  const [formPurchasePrice, setFormPurchasePrice] = useState('1100');
  const [formStockQty, setFormStockQty] = useState('20');
  const [formTaxRate, setFormTaxRate] = useState(18);
  const [formDescription, setFormDescription] = useState('');

  // Up to 3 Units Configuration
  const [formPrimaryUnit, setFormPrimaryUnit] = useState('BOX');
  const [enableSecUnit1, setEnableSecUnit1] = useState(true);
  const [formSecUnit1, setFormSecUnit1] = useState('PACK');
  const [formSecUnit1Rate, setFormSecUnit1Rate] = useState('10');
  const [enableSecUnit2, setEnableSecUnit2] = useState(true);
  const [formSecUnit2, setFormSecUnit2] = useState('PCS');
  const [formSecUnit2Rate, setFormSecUnit2Rate] = useState('10');

  // New Unit Form State
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [unitUqc, setUnitUqc] = useState('');
  const [unitDesc, setUnitDesc] = useState('');
  const [unitDefaultConv, setUnitDefaultConv] = useState('');

  // Filter Items based on Active Tab & Search
  const filteredItems = items.filter((it) => {
    const itemCategoryType = it.itemType || 'Product';
    const matchesTab = itemCategoryType === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.hsn.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  // Filter Units based on Search
  const filteredUnits = units.filter(
    (u) =>
      searchQuery.trim() === '' ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.uqcCode && u.uqcCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-select first item when tab changes or search updates
  const activeSelectedItem =
    items.find((i) => i.id === selectedItemId) || filteredItems[0] || null;

  const activeSelectedUnit =
    units.find((u) => u.id === selectedUnitId) || filteredUnits[0] || null;

  // Total valuation calculation
  const totalValuation = items.reduce(
    (sum, it) => sum + (it.stockQty > 0 ? it.stockQty * it.purchasePrice : 0),
    0
  );
  const lowStockCount = items.filter((it) => it.stockQty <= (it.minStockLevel || 10)).length;

  // Open Modal to Add New Item/Service/Raw Material
  const handleOpenAddItemModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCode('');
    setFormCategory(
      activeTab === 'Service'
        ? 'Technical Services'
        : activeTab === 'Raw Material'
        ? 'Raw Metals'
        : 'Power Tools'
    );
    setFormType(activeTab === 'Unit' ? 'Product' : activeTab);
    setFormHsn(activeTab === 'Service' ? '998719' : '84672100');
    setFormSalePrice(activeTab === 'Service' ? '2500' : '1500');
    setFormPurchasePrice(activeTab === 'Service' ? '1000' : '1100');
    setFormStockQty(activeTab === 'Service' ? '0' : '20');
    setFormTaxRate(18);
    setFormDescription('');
    setFormPrimaryUnit('BOX');
    setEnableSecUnit1(true);
    setFormSecUnit1('PACK');
    setFormSecUnit1Rate('10');
    setEnableSecUnit2(true);
    setFormSecUnit2('PCS');
    setFormSecUnit2Rate('10');
    setIsItemModalOpen(true);
  };

  // Open Modal to Edit Item
  const handleOpenEditItemModal = (item: Item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormType(item.itemType || 'Product');
    setFormHsn(item.hsn);
    setFormSalePrice(String(item.salePrice));
    setFormPurchasePrice(String(item.purchasePrice));
    setFormStockQty(String(item.stockQty));
    setFormTaxRate(item.taxRate);
    setFormDescription(item.description || '');
    setFormPrimaryUnit(item.unit || 'PCS');
    setEnableSecUnit1(Boolean(item.secondaryUnit1));
    setFormSecUnit1(item.secondaryUnit1 || 'PACK');
    setFormSecUnit1Rate(String(item.secondaryUnit1Rate || 10));
    setEnableSecUnit2(Boolean(item.secondaryUnit2));
    setFormSecUnit2(item.secondaryUnit2 || 'PCS');
    setFormSecUnit2Rate(String(item.secondaryUnit2Rate || 10));
    setIsItemModalOpen(true);
  };

  // Submit Save Item/Service/Raw Material
  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const savedItem: Item = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      name: formName,
      code: formCode || `ITM-${Math.floor(100 + Math.random() * 900)}`,
      category: formCategory || 'General',
      itemType: formType,
      hsn: formHsn || '84672100',
      salePrice: Number(formSalePrice) || 0,
      purchasePrice: Number(formPurchasePrice) || 0,
      stockQty: Number(formStockQty) || 0,
      unit: formPrimaryUnit,
      secondaryUnit1: enableSecUnit1 ? formSecUnit1 : undefined,
      secondaryUnit1Rate: enableSecUnit1 ? Number(formSecUnit1Rate) || 1 : undefined,
      secondaryUnit2: enableSecUnit2 ? formSecUnit2 : undefined,
      secondaryUnit2Rate: enableSecUnit2 ? Number(formSecUnit2Rate) || 1 : undefined,
      minStockLevel: editingItem ? editingItem.minStockLevel : 10,
      taxRate: Number(formTaxRate) || 18,
      unitsSold: editingItem ? editingItem.unitsSold : 0,
      totalRevenue: editingItem ? editingItem.totalRevenue : 0,
      description: formDescription,
    };

    if (onSaveItem) {
      onSaveItem(savedItem);
    } else if (onAddItem) {
      onAddItem(savedItem);
    }

    setSelectedItemId(savedItem.id);
    setIsItemModalOpen(false);
  };

  // Submit Save Master Unit
  const handleSaveUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitCode.trim() || !unitName.trim()) return;

    const newUnit: UnitMaster = {
      id: `unit-${Date.now()}`,
      code: unitCode.toUpperCase().trim(),
      name: unitName.trim(),
      uqcCode: unitUqc.trim() || `${unitCode.toUpperCase()}-${unitName.toUpperCase()}`,
      description: unitDesc.trim() || 'Custom master unit',
      defaultConversion: unitDefaultConv.trim() || 'Base Unit',
    };

    if (onAddUnit) {
      onAddUnit(newUnit);
    }
    setSelectedUnitId(newUnit.id);
    setIsAddUnitModalOpen(false);
    setUnitCode('');
    setUnitName('');
    setUnitUqc('');
    setUnitDesc('');
    setUnitDefaultConv('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden select-none">
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Header Title & Top Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Items &amp; Services
                </h1>
                <p className="text-[11px] text-slate-500">
                  Manage inventory products, services, raw materials &amp; multi-units
                </p>
              </div>
            </div>

            {/* Top Options Tabs: Product, Services, Raw Material, Unit */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                id="item-tab-product"
                onClick={() => {
                  setActiveTab('Product');
                  setSelectedItemId(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Product'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Product</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/10 font-bold">
                  {items.filter((i) => (i.itemType || 'Product') === 'Product').length}
                </span>
              </button>

              <button
                type="button"
                id="item-tab-services"
                onClick={() => {
                  setActiveTab('Service');
                  setSelectedItemId(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Service'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Services</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/10 font-bold">
                  {items.filter((i) => i.itemType === 'Service').length}
                </span>
              </button>

              <button
                type="button"
                id="item-tab-raw-material"
                onClick={() => {
                  setActiveTab('Raw Material');
                  setSelectedItemId(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Raw Material'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Raw Material</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/10 font-bold">
                  {items.filter((i) => i.itemType === 'Raw Material').length}
                </span>
              </button>

              <button
                type="button"
                id="item-tab-unit"
                onClick={() => {
                  setActiveTab('Unit');
                  setSelectedUnitId(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'Unit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Unit</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/10 font-bold">
                  {units.length}
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Action Button beside Header (Add product, Add Services, Add Raw Materials, Add unit) */}
          <div className="flex items-center gap-2">
            {activeTab === 'Product' && (
              <button
                type="button"
                id="add-product-btn"
                onClick={handleOpenAddItemModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === 'Service' && (
              <button
                type="button"
                id="add-services-btn"
                onClick={handleOpenAddItemModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Services</span>
              </button>
            )}

            {activeTab === 'Raw Material' && (
              <button
                type="button"
                id="add-raw-material-btn"
                onClick={handleOpenAddItemModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Raw Materials</span>
              </button>
            )}

            {activeTab === 'Unit' && (
              <button
                type="button"
                id="add-unit-btn"
                onClick={() => setIsAddUnitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Unit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DUAL-PANEL WORKSPACE CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SMALL MENU BAR TYPE BOX WITH SCROLLING BAR */}
        <div className="w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-2xs">
          {/* Header & Search inside the scrolling menu bar box */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                {activeTab === 'Unit' ? 'Master Units List' : `${activeTab} Inventory`}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {activeTab === 'Unit' ? filteredUnits.length : filteredItems.length} listed
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'Unit'
                    ? 'Search unit code, name or UQC...'
                    : `Search ${activeTab.toLowerCase()} by name/code...`
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* SCROLLING LIST BAR */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
            {activeTab !== 'Unit' ? (
              filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <Package className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                  <p>No {activeTab.toLowerCase()} items found.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddItemModal}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    + Add New {activeTab}
                  </button>
                </div>
              ) : (
                filteredItems.map((it) => {
                  const isSelected = activeSelectedItem?.id === it.id;
                  const isStockPositive = it.stockQty > 0;

                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setSelectedItemId(it.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {it.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="font-mono bg-slate-100 px-1 rounded text-[10px] font-semibold text-slate-600">
                            {it.code}
                          </span>
                          <span>•</span>
                          <span className="truncate">{it.category}</span>
                        </div>
                      </div>

                      {/* BESIDE ITEM: CURRENT STOCK QUANTITY REFLECTED IN GREEN (>0) OR RED (<=0) */}
                      <div className="shrink-0 text-right">
                        <div
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border ${
                            isStockPositive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          <span>{it.stockQty}</span>
                          <span className="text-[10px] font-medium uppercase">{it.unit}</span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                          ₹{it.salePrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </button>
                  );
                })
              )
            ) : (
              /* UNIT TAB SCROLLING LIST */
              filteredUnits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <Ruler className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                  <p>No measurement units found.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddUnitModalOpen(true)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    + Add New Unit
                  </button>
                </div>
              ) : (
                filteredUnits.map((u) => {
                  const isSelected = activeSelectedUnit?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUnitId(u.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{u.name}</span>
                          <span className="font-mono bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded text-[10px] font-bold">
                            {u.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {u.uqcCode || u.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {u.defaultConversion || 'Primary'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* RIGHT MAIN DETAIL PANEL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-5">
          {activeTab !== 'Unit' ? (
            activeSelectedItem ? (
              <div className="space-y-5 max-w-5xl">
                {/* Item Summary Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {activeSelectedItem.itemType === 'Service' ? (
                          <Wrench className="w-6 h-6" />
                        ) : activeSelectedItem.itemType === 'Raw Material' ? (
                          <Layers className="w-6 h-6" />
                        ) : (
                          <Boxes className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {activeSelectedItem.itemType || 'Product'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            SKU: {activeSelectedItem.code}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-500">
                            HSN/SAC: {activeSelectedItem.hsn}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mt-1">
                          {activeSelectedItem.name}
                        </h2>
                        {activeSelectedItem.description && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {activeSelectedItem.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditItemModal(activeSelectedItem)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit {activeSelectedItem.itemType || 'Item'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Stock & Pricing Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Current Stock Badge: Green (>0) or Red (<=0) */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Current Stock
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`text-xl font-extrabold px-2.5 py-0.5 rounded-lg border ${
                            activeSelectedItem.stockQty > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          {activeSelectedItem.stockQty}
                        </span>
                        <span className="text-xs font-bold text-slate-700 uppercase">
                          {activeSelectedItem.unit}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Sale Price
                      </span>
                      <div className="text-lg font-extrabold text-slate-900 mt-1">
                        ₹{activeSelectedItem.salePrice.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">
                          / {activeSelectedItem.unit}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Purchase Price
                      </span>
                      <div className="text-lg font-extrabold text-slate-900 mt-1">
                        ₹{activeSelectedItem.purchasePrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        GST Tax Rate
                      </span>
                      <div className="text-lg font-extrabold text-blue-600 mt-1">
                        {activeSelectedItem.taxRate}% GST
                      </div>
                    </div>
                  </div>

                  {/* UP TO 3 UNITS CONFIGURATION CARD DISPLAY */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-blue-700 shrink-0" />
                        <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                          Configured Unit Structure &amp; Conversion Rates (Up to 3 Units)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        {1 +
                          (activeSelectedItem.secondaryUnit1 ? 1 : 0) +
                          (activeSelectedItem.secondaryUnit2 ? 1 : 0)}{' '}
                        Units Configured
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* Unit 1 */}
                      <div className="p-2.5 rounded-lg bg-white border border-blue-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Unit 1 (Primary Base)
                        </span>
                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                          {activeSelectedItem.unit}
                        </div>
                      </div>

                      {/* Unit 2 */}
                      <div className="p-2.5 rounded-lg bg-white border border-blue-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Unit 2 (Secondary 1)
                        </span>
                        {activeSelectedItem.secondaryUnit1 ? (
                          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                            {activeSelectedItem.secondaryUnit1}
                            <span className="text-[11px] font-semibold text-blue-600 block">
                              1 {activeSelectedItem.unit} = {activeSelectedItem.secondaryUnit1Rate}{' '}
                              {activeSelectedItem.secondaryUnit1}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-slate-400 italic mt-0.5">
                            Not Configured
                          </div>
                        )}
                      </div>

                      {/* Unit 3 */}
                      <div className="p-2.5 rounded-lg bg-white border border-blue-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Unit 3 (Secondary 2)
                        </span>
                        {activeSelectedItem.secondaryUnit2 ? (
                          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                            {activeSelectedItem.secondaryUnit2}
                            <span className="text-[11px] font-semibold text-blue-600 block">
                              1 {activeSelectedItem.secondaryUnit1 || activeSelectedItem.unit} ={' '}
                              {activeSelectedItem.secondaryUnit2Rate} {activeSelectedItem.secondaryUnit2}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-slate-400 italic mt-0.5">
                            Not Configured
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conversion Chain Formula */}
                    {activeSelectedItem.secondaryUnit1 && (
                      <div className="p-2 rounded-lg bg-blue-100/70 text-blue-900 font-mono text-xs font-bold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          Live Conversion Chain: 1 {activeSelectedItem.unit} ={' '}
                          {activeSelectedItem.secondaryUnit1Rate} {activeSelectedItem.secondaryUnit1}
                          {activeSelectedItem.secondaryUnit2 && (
                            <>
                              {' '}
                              ={' '}
                              {(activeSelectedItem.secondaryUnit1Rate || 1) *
                                (activeSelectedItem.secondaryUnit2Rate || 1)}{' '}
                              {activeSelectedItem.secondaryUnit2}
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Movement / Transaction Ledger Table */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-slate-900">
                      Recent Stock &amp; Sales Activity
                    </h3>
                    <span className="text-xs text-slate-400">
                      Total Revenue Generated: ₹
                      {(activeSelectedItem.totalRevenue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Transaction Type</th>
                          <th className="py-2.5 px-3">Reference / Party</th>
                          <th className="py-2.5 px-3 text-right">Qty</th>
                          <th className="py-2.5 px-3 text-right">Rate</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium">2026-08-20</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Opening Stock
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">Initial Inventory Batch</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                            +{activeSelectedItem.stockQty} {activeSelectedItem.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium">
                            ₹{activeSelectedItem.purchasePrice}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                            Verified
                          </td>
                        </tr>
                        {activeSelectedItem.unitsSold > 0 && (
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-medium">2026-08-22</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                                Sale Invoice
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">Apex Infotech Solutions</td>
                            <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                              -{Math.min(10, activeSelectedItem.unitsSold)}{' '}
                              {activeSelectedItem.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium">
                              ₹{activeSelectedItem.salePrice}
                            </td>
                            <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                              Completed
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Package className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm">Select an item from the left menu bar to view details.</p>
              </div>
            )
          ) : (
            /* UNIT TAB MAIN CONTENT PANEL */
            <div className="space-y-5 max-w-5xl">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Measurement Units &amp; Conversion Master
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standardized units for billing, GST UQC reporting, and multi-unit item packaging
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddUnitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Unit</span>
                  </button>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {units.map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                          {u.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {u.uqcCode || 'Standard'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {u.description || 'Standard measurement unit'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Default Conversion:</span>
                        <span className="font-bold text-indigo-700">
                          {u.defaultConversion || '1 : 1'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL FOR ADD / EDIT PRODUCT, SERVICE, RAW MATERIAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {editingItem ? `Edit ${formType}` : `Add New ${formType}`}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Configure basic information, stock, pricing, and up to 3 units
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveItemSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
              {/* Type Switcher Tabs */}
              <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1">
                {(['Product', 'Service', 'Raw Material'] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormType(t)}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-center cursor-pointer transition-all ${
                      formType === t
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {formType} Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={`e.g. ${
                      formType === 'Service'
                        ? 'Annual Maintenance Service'
                        : formType === 'Raw Material'
                        ? 'Copper Wire Scrap'
                        : 'Heavy Duty Drill Machine'
                    }`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Code / SKU</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. DRL-850"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Category & HSN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Power Tools / Electricals"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={formHsn}
                    onChange={(e) => setFormHsn(e.target.value)}
                    placeholder="e.g. 84672100"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={formPurchasePrice}
                    onChange={(e) => setFormPurchasePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Stock Qty</label>
                  <input
                    type="number"
                    value={formStockQty}
                    onChange={(e) => setFormStockQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
                  <select
                    value={formTaxRate}
                    onChange={(e) => setFormTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 bg-white"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>
              </div>

              {/* REQUIREMENT 8: UP TO 3 UNITS CONFIGURATION & CONVERSION RATE */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-700" />
                    <span className="font-extrabold text-blue-950 uppercase tracking-wider text-[11px]">
                      Configure Up to 3 Units &amp; Conversion Rates
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded">
                    Primary + 2 Secondary Units
                  </span>
                </div>

                {/* Unit 1: Primary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-800 mb-1">
                      Unit 1: Primary Base Unit <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formPrimaryUnit}
                      onChange={(e) => setFormPrimaryUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.code}>
                          {u.code} - {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Unit 2: Secondary 1 */}
                <div className="pt-2 border-t border-blue-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={enableSecUnit1}
                        onChange={(e) => setEnableSecUnit1(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Enable Unit 2 (Secondary Packaging)</span>
                    </label>
                  </div>

                  {enableSecUnit1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5 border-l-2 border-blue-400">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Unit 2 Name</label>
                        <select
                          value={formSecUnit1}
                          onChange={(e) => setFormSecUnit1(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                        >
                          {units.map((u) => (
                            <option key={u.id} value={u.code}>
                              {u.code} - {u.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Conversion Rate (1 {formPrimaryUnit} = ? {formSecUnit1})
                        </label>
                        <input
                          type="number"
                          value={formSecUnit1Rate}
                          onChange={(e) => setFormSecUnit1Rate(e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Unit 3: Secondary 2 */}
                <div className="pt-2 border-t border-blue-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={enableSecUnit2}
                        disabled={!enableSecUnit1}
                        onChange={(e) => setEnableSecUnit2(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Enable Unit 3 (Tertiary / Loose Quantity)</span>
                    </label>
                  </div>

                  {enableSecUnit1 && enableSecUnit2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5 border-l-2 border-blue-400">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Unit 3 Name</label>
                        <select
                          value={formSecUnit2}
                          onChange={(e) => setFormSecUnit2(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                        >
                          {units.map((u) => (
                            <option key={u.id} value={u.code}>
                              {u.code} - {u.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Conversion Rate (1 {formSecUnit1} = ? {formSecUnit2})
                        </label>
                        <input
                          type="number"
                          value={formSecUnit2Rate}
                          onChange={(e) => setFormSecUnit2Rate(e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Formula Preview */}
                <div className="p-2 rounded-lg bg-blue-100/90 text-blue-900 font-mono text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    Formula: 1 {formPrimaryUnit}
                    {enableSecUnit1 && (
                      <>
                        {' '}
                        = {formSecUnit1Rate || 1} {formSecUnit1}
                      </>
                    )}
                    {enableSecUnit1 && enableSecUnit2 && (
                      <>
                        {' '}
                        ={' '}
                        {(Number(formSecUnit1Rate) || 1) * (Number(formSecUnit2Rate) || 1)}{' '}
                        {formSecUnit2}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Save {formType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL FOR ADD MASTER UNIT */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Add New Measurement Unit</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnitSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Unit Short Code (e.g. STRIP, CAN, DOZ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  placeholder="e.g. STRIP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Unit Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g. Strips / Cans / Dozen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  GST UQC Code (e.g. STP-STRIPS)
                </label>
                <input
                  type="text"
                  value={unitUqc}
                  onChange={(e) => setUnitUqc(e.target.value)}
                  placeholder="e.g. STP-STRIPS"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Description</label>
                <input
                  type="text"
                  value={unitDesc}
                  onChange={(e) => setUnitDesc(e.target.value)}
                  placeholder="e.g. Medical strip packaging unit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Save Master Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
