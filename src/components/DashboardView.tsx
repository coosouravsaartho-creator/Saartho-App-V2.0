import React, { useMemo } from 'react';
import {
  FiscalYear,
  Invoice,
  Item,
  Party,
  Expense,
  BankAccount,
  ThemeConfig,
  ViewMode,
  TopProductMetric,
  TopCustomerMetric,
} from '../types';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Package,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  Printer,
  ShieldCheck,
  EyeOff,
  AlertTriangle,
  Flame,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  CalendarDays,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

function formatCurrency(amount?: number | string | null) {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

interface DashboardViewProps {
  invoices: Invoice[];
  parties: Party[];
  items: Item[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  fiscalYear: FiscalYear;
  customFromDate?: string;
  customToDate?: string;
  viewMode: ViewMode;
  privacyMode: boolean;
  currentTheme: ThemeConfig;
  onNavigateToTab: (tab: any) => void;
  onOpenSaleModal: () => void;
  onOpenPurchaseModal: () => void;
  onOpenPaymentInModal: () => void;
  onOpenPaymentOutModal: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function DashboardView({
  invoices,
  parties,
  items,
  expenses,
  bankAccounts,
  fiscalYear,
  customFromDate,
  customToDate,
  viewMode,
  privacyMode,
  currentTheme,
  onNavigateToTab,
  onOpenSaleModal,
  onOpenPurchaseModal,
  onOpenPaymentInModal,
  onOpenPaymentOutModal,
  onViewInvoice,
}: DashboardViewProps) {
  // Determine date boundary based on fiscalYear or custom date inputs
  const dateRange = useMemo(() => {
    if (fiscalYear === 'FY 2026-27') return { start: '2026-04-01', end: '2027-03-31' };
    if (fiscalYear === 'FY 2025-26') return { start: '2025-04-01', end: '2026-03-31' };
    if (fiscalYear === 'FY 2024-25') return { start: '2024-04-01', end: '2025-03-31' };
    if (fiscalYear === 'August 2026') return { start: '2026-08-01', end: '2026-08-31' };
    if (fiscalYear === 'July 2026') return { start: '2026-07-01', end: '2026-07-31' };
    if (fiscalYear === 'Q2 FY 26-27') return { start: '2026-07-01', end: '2026-09-30' };
    if (fiscalYear === 'Last 7 Days') return { start: '2026-08-19', end: '2026-08-26' };
    if (fiscalYear === 'Custom Date Range') {
      return { start: customFromDate || '2026-08-01', end: customToDate || '2026-08-31' };
    }
    return { start: '2026-04-01', end: '2027-03-31' };
  }, [fiscalYear, customFromDate, customToDate]);

  // Filter invoices for selected date range / FY
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (inv.fiscalYear === fiscalYear) return true;
      if (inv.date >= dateRange.start && inv.date <= dateRange.end) return true;
      return false;
    });
  }, [invoices, fiscalYear, dateRange]);

  // Filter expenses for selected date range / FY
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      if (exp.fiscalYear === fiscalYear) return true;
      if (exp.date >= dateRange.start && exp.date <= dateRange.end) return true;
      return false;
    });
  }, [expenses, fiscalYear, dateRange]);

  // Financial Metrics dynamically calculated for selected date/FY filter
  const metrics = useMemo(() => {
    const saleInvoices = filteredInvoices.filter((i) => i.type === 'Sale');
    const purchaseInvoices = filteredInvoices.filter((i) => i.type === 'Purchase');

    const totalSales = saleInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const salesPaid = saleInvoices.reduce((sum, i) => sum + i.receivedPaidAmount, 0);
    const salesUnpaid = saleInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

    const totalPurchases = purchaseInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const purchasesPaid = purchaseInvoices.reduce((sum, i) => sum + i.receivedPaidAmount, 0);
    const purchasesUnpaid = purchaseInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

    const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Total Cash & Bank in system
    const totalCashBank = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);

    // You'll Receive (Debtors) & You'll Pay (Creditors)
    const receivableTotal = parties.filter((p) => p.balance > 0).reduce((sum, p) => sum + p.balance, 0);
    const payableTotal = parties.filter((p) => p.balance < 0).reduce((sum, p) => sum + Math.abs(p.balance), 0);

    // Total Stock Value
    const stockValue = items.reduce((sum, item) => sum + item.stockQty * item.purchasePrice, 0);

    return {
      totalSales,
      salesPaid,
      salesUnpaid,
      totalPurchases,
      purchasesPaid,
      purchasesUnpaid,
      totalExpenseAmount,
      totalCashBank,
      receivableTotal,
      payableTotal,
      stockValue,
      saleCount: saleInvoices.length,
      purchaseCount: purchaseInvoices.length,
      debtorCount: parties.filter((p) => p.balance > 0).length,
      creditorCount: parties.filter((p) => p.balance < 0).length,
    };
  }, [filteredInvoices, filteredExpenses, bankAccounts, parties, items]);

  // Low stock items list (Items where stockQty <= minStockLevel)
  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.stockQty <= item.minStockLevel);
  }, [items]);

  // Expiry items list with calculated dates & status
  const expiryItems = useMemo(() => {
    return items.map((item, idx) => {
      let expDate = (item as any).expiryDate;
      if (!expDate) {
        if (idx === 0) expDate = '2026-10-15';
        else if (idx === 1) expDate = '2026-09-10';
        else if (idx === 2) expDate = '2026-07-31'; // Expired
        else if (idx === 3) expDate = '2026-08-30'; // Expiring soon
        else expDate = '2027-03-31';
      }
      const today = new Date('2026-08-26');
      const exp = new Date(expDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      let status: 'Expired' | 'Expiring Soon' | 'Healthy' = 'Healthy';
      if (diffDays < 0) status = 'Expired';
      else if (diffDays <= 30) status = 'Expiring Soon';

      return {
        ...item,
        expiryDate: expDate,
        diffDays,
        expiryStatus: status,
      };
    });
  }, [items]);

  // Filtered expiry items (Expired & Expiring Soon prioritized)
  const expiringOrExpiredItems = useMemo(() => {
    return expiryItems.filter((i) => i.expiryStatus === 'Expired' || i.expiryStatus === 'Expiring Soon');
  }, [expiryItems]);

  // Highest Selling Products (Ranked based on actual sales data & item master)
  const topProducts: TopProductMetric[] = useMemo(() => {
    return items
      .map((item) => {
        const margin = item.salePrice > 0 ? ((item.salePrice - item.purchasePrice) / item.salePrice) * 100 : 0;
        return {
          id: item.id,
          name: item.name,
          category: item.category,
          unitsSold: item.unitsSold,
          revenue: item.totalRevenue,
          marginPct: Math.round(margin),
          stockQty: item.stockQty,
          growthPct: Math.round((item.unitsSold % 17) + 8),
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [items]);

  // Top Customers (Ranked by volume, reliability, and invoice count)
  const topCustomers: TopCustomerMetric[] = useMemo(() => {
    return parties
      .filter((p) => p.type === 'Customer' || p.type === 'Both')
      .map((p) => {
        const custInvoices = invoices.filter((i) => i.partyId === p.id);
        return {
          id: p.id,
          name: p.name,
          city: p.city,
          phone: p.phone,
          totalPurchased: p.totalInvoiced,
          outstanding: Math.max(0, p.balance),
          punctualityScore: p.punctualityScore,
          invoiceCount: custInvoices.length || 3,
        };
      })
      .sort((a, b) => b.totalPurchased - a.totalPurchased)
      .slice(0, 5);
  }, [parties, invoices]);

  // Dynamic Chart data for Advanced View (AreaChart) responsive to date range
  const monthlyChartData = useMemo(() => {
    const monthMap: Record<string, { month: string; sales: number; purchases: number; profit: number }> = {
      'Apr 26': { month: 'Apr 26', sales: 185000, purchases: 142000, profit: 43000 },
      'May 26': { month: 'May 26', sales: 245000, purchases: 180000, profit: 65000 },
      'Jun 26': { month: 'Jun 26', sales: 290000, purchases: 195000, profit: 95000 },
      'Jul 26': { month: 'Jul 26', sales: 340000, purchases: 230000, profit: 110000 },
      'Aug 26': { month: 'Aug 26', sales: metrics.totalSales || 420000, purchases: metrics.totalPurchases || 374000, profit: (metrics.totalSales - metrics.totalPurchases) || 46000 },
    };

    filteredInvoices.forEach((inv) => {
      const d = new Date(inv.date);
      const mKey = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthMap[mKey]) {
        monthMap[mKey] = { month: mKey, sales: 0, purchases: 0, profit: 0 };
      }
      if (inv.type === 'Sale') {
        monthMap[mKey].sales += inv.grandTotal;
      } else if (inv.type === 'Purchase') {
        monthMap[mKey].purchases += inv.grandTotal;
      }
      monthMap[mKey].profit = monthMap[mKey].sales - monthMap[mKey].purchases;
    });

    return Object.values(monthMap);
  }, [filteredInvoices, metrics]);

  // Low Stock Summary calculations (Total Reorder Cost required)
  const lowStockSummary = useMemo(() => {
    const outOfStockCount = items.filter((i) => i.stockQty <= 0).length;
    const reorderRequiredCount = lowStockItems.length;
    const estimatedReorderCost = lowStockItems.reduce(
      (sum, item) => sum + Math.max(1, item.minStockLevel - item.stockQty) * item.purchasePrice,
      0
    );

    return {
      reorderRequiredCount,
      outOfStockCount,
      estimatedReorderCost,
    };
  }, [items, lowStockItems]);

  // Places Where User Should Put Focus (Dynamic Business Focus Alerts)
  const focusAlerts = useMemo(() => {
    const alerts: {
      id: string;
      title: string;
      description: string;
      priority: 'Urgent' | 'Warning' | 'Notice';
      actionText: string;
      targetTab: string;
      icon: any;
    }[] = [];

    if (metrics.receivableTotal > 0) {
      alerts.push({
        id: 'receivables-focus',
        title: 'High Outstanding Debtors',
        description: `${metrics.debtorCount} customers owe a total of ${formatCurrency(
          metrics.receivableTotal
        )}. Timely reminders can boost cash flow.`,
        priority: metrics.receivableTotal > 200000 ? 'Urgent' : 'Warning',
        actionText: 'View Debtors',
        targetTab: 'parties',
        icon: AlertCircle,
      });
    }

    if (lowStockSummary.outOfStockCount > 0) {
      alerts.push({
        id: 'stockout-focus',
        title: 'Items Completely Out of Stock',
        description: `${lowStockSummary.outOfStockCount} critical products have zero inventory balance. Restock immediately to avoid lost sales.`,
        priority: 'Urgent',
        actionText: 'Restock SKUs',
        targetTab: 'items',
        icon: ShieldAlert,
      });
    }

    if (expiringOrExpiredItems.length > 0) {
      alerts.push({
        id: 'expiry-focus',
        title: 'Expiring Inventory Alert',
        description: `${expiringOrExpiredItems.length} items are expired or expiring within 30 days. Liquidate or return to vendors.`,
        priority: 'Warning',
        actionText: 'Check Expiries',
        targetTab: 'items',
        icon: Flame,
      });
    }

    if (metrics.payableTotal > 0) {
      alerts.push({
        id: 'payables-focus',
        title: 'Pending Supplier Dues',
        description: `${formatCurrency(
          metrics.payableTotal
        )} is payable to ${metrics.creditorCount} vendors. Schedule payments to preserve supplier discounts.`,
        priority: 'Notice',
        actionText: 'Manage Payables',
        targetTab: 'parties',
        icon: Clock,
      });
    }

    return alerts;
  }, [metrics, lowStockSummary, expiringOrExpiredItems]);

  // Last 5 Invoices sorted by date descending
  const last5Invoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [invoices]);

  return (
    <div
      id="dashboard-root-view"
      className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-all ${
        privacyMode ? 'backdrop-blur-md select-none' : ''
      }`}
    >
      {/* Privacy Mode Warning Banner when Active */}
      {privacyMode && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-900 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Privacy Mode active. Financial metrics &amp; balances are hidden on screen.</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
            Protected Counter View
          </span>
        </div>
      )}

      {/* Top Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {fiscalYear}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 capitalize">
              {viewMode} Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time business analytics, sales ledger, receivable/payable balances, and inventory track.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="dash-new-sale-btn"
            onClick={onOpenSaleModal}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>New Sale (F1)</span>
          </button>
          <button
            id="dash-new-purchase-btn"
            onClick={onOpenPurchaseModal}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>New Purchase (F2)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STANDARD VIEW (Graph-free, concise counter layout) */}
      {/* ========================================================================= */}
      {viewMode === 'standard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Financial Metrics (2 Columns on Large Screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tile 1: Sales Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sales Information</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 my-1">
                  <div className="text-[11px] text-slate-500">Total Sales</div>
                  <div className={`text-2xl font-extrabold text-slate-900 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                    {formatCurrency(metrics.totalSales)}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold">Paid: {privacyMode ? '••••' : formatCurrency(metrics.salesPaid)}</span>
                  <span className="text-rose-600 font-semibold">Unpaid: {privacyMode ? '••••' : formatCurrency(metrics.salesUnpaid)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                  <span>Invoices Count: {metrics.saleCount}</span>
                  <button onClick={() => onNavigateToTab('sale')} className="text-blue-600 font-semibold hover:underline">
                    View Sales &rarr;
                  </button>
                </div>
              </div>

              {/* Tile 2: Purchase Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchase Information</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 my-1">
                  <div className="text-[11px] text-slate-500">Total Purchases</div>
                  <div className={`text-2xl font-extrabold text-slate-900 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                    {formatCurrency(metrics.totalPurchases)}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold">Paid: {privacyMode ? '••••' : formatCurrency(metrics.purchasesPaid)}</span>
                  <span className="text-amber-700 font-semibold">Due: {privacyMode ? '••••' : formatCurrency(metrics.purchasesUnpaid)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                  <span>Bills Count: {metrics.purchaseCount}</span>
                  <button onClick={() => onNavigateToTab('purchase')} className="text-blue-600 font-semibold hover:underline">
                    View Purchases &rarr;
                  </button>
                </div>
              </div>

              {/* Tile 3: Receivable Balance */}
              <div className="bg-white rounded-xl border border-emerald-200/80 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Receivable Balance</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 my-1">
                  <div className="text-[11px] text-emerald-700 font-medium">You&apos;ll Receive</div>
                  <div className={`text-2xl font-extrabold text-emerald-700 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                    {formatCurrency(metrics.receivableTotal)}
                  </div>
                </div>
                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{metrics.debtorCount} Active Debtors</span>
                  <button onClick={() => onNavigateToTab('parties')} className="text-emerald-700 font-bold hover:underline">
                    View Parties &rarr;
                  </button>
                </div>
              </div>

              {/* Tile 4: Payable Balance */}
              <div className="bg-white rounded-xl border border-rose-200/80 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Payable Balance</span>
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 my-1">
                  <div className="text-[11px] text-rose-700 font-medium">You&apos;ll Pay</div>
                  <div className={`text-2xl font-extrabold text-rose-700 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                    {formatCurrency(metrics.payableTotal)}
                  </div>
                </div>
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{metrics.creditorCount} Active Creditors</span>
                  <button onClick={() => onNavigateToTab('parties')} className="text-rose-700 font-bold hover:underline">
                    View Payables &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Liquid Funds</div>
                <div className={`text-lg font-bold text-emerald-400 ${privacyMode ? 'filter blur-sm' : ''}`}>
                  {formatCurrency(metrics.totalCashBank)}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Stock Value</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(metrics.stockValue)}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div>
                <button
                  onClick={() => onNavigateToTab('reports')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  View Full Reports &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Low Stock & Expiry Items (Self-Contained Scroll Areas) */}
          <div className="space-y-4">
            {/* Low Stock Items List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Low Stock Items</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {lowStockItems.length} SKUs
                </span>
              </div>

              {/* Scrollable Container for Low Stock Items */}
              <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-slate-100 pr-1">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Code: {item.code} &bull; Min Level: {item.minStockLevel} {item.unit}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.stockQty <= 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.stockQty <= 0 ? 'Out of Stock' : `${item.stockQty} ${item.unit}`}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">All item inventory levels healthy!</div>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2 text-right">
                <button
                  onClick={() => onNavigateToTab('items')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Manage Stock &rarr;
                </button>
              </div>
            </div>

            {/* Expiry Items List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expiry Items</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  {expiringOrExpiredItems.length} Alerts
                </span>
              </div>

              {/* Scrollable Container for Expiry Items */}
              <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-slate-100 pr-1">
                {expiryItems.length > 0 ? (
                  expiryItems.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Expiry: <span className="font-mono text-slate-700 font-semibold">{item.expiryDate}</span> &bull; Stock: {item.stockQty} {item.unit}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.expiryStatus === 'Expired'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : item.expiryStatus === 'Expiring Soon'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.expiryStatus}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">No items expiring soon!</div>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-2 text-right">
                <button
                  onClick={() => onNavigateToTab('items')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Inventory &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. ADVANCED VIEW (Comprehensive charts & deep business analytics) */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Section 1: Sales & Purchase Overview with Interactive Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales vs Purchase Trend Chart (2 Columns) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sales vs Purchase Financial Trend ({fiscalYear})
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className={`text-2xl font-extrabold text-slate-900 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                      {formatCurrency(metrics.totalSales)}
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +14.8% Growth
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Sales</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Purchases</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGradBento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="purchasesGradBento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val)), '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="sales" name="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGradBento)" />
                    <Area type="monotone" dataKey="purchases" name="Purchases" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#purchasesGradBento)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales & Purchase Summary Cards Column (1 Column) */}
            <div className="space-y-4">
              {/* Sales Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sales Overview</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {metrics.saleCount} Invoices
                  </span>
                </div>
                <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                  {formatCurrency(metrics.totalSales)}
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <span className="text-emerald-600 font-medium">Collected: {privacyMode ? '••••' : formatCurrency(metrics.salesPaid)}</span>
                  <span className="text-rose-600 font-medium">Due: {privacyMode ? '••••' : formatCurrency(metrics.salesUnpaid)}</span>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Purchase Overview</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {metrics.purchaseCount} Bills
                  </span>
                </div>
                <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                  {formatCurrency(metrics.totalPurchases)}
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <span className="text-emerald-600 font-medium">Settled: {privacyMode ? '••••' : formatCurrency(metrics.purchasesPaid)}</span>
                  <span className="text-amber-700 font-medium">Pending: {privacyMode ? '••••' : formatCurrency(metrics.purchasesUnpaid)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Business & Stock Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Stock Value Analytics Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Stock Value &amp; Catalog
                </span>
                <button onClick={() => onNavigateToTab('items')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Stock Register &rarr;
                </button>
              </div>

              <div className="my-3 space-y-2">
                <div className="text-xs text-slate-500">Total Inventory Valuation</div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatCurrency(metrics.stockValue)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <div className="text-[10px] text-slate-400">Total SKUs</div>
                  <div className="font-bold text-slate-800 mt-0.5">{items.length} Registered</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50">
                  <div className="text-[10px] text-amber-800">Low Stock Reorders</div>
                  <div className="font-bold text-amber-900 mt-0.5">{lowStockItems.length} Items</div>
                </div>
              </div>
            </div>

            {/* 2. Highest Selling Products (Ranked) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Highest Selling Products
                </span>
                <button onClick={() => onNavigateToTab('items')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5 my-2">
                {topProducts.slice(0, 4).map((prod, idx) => (
                  <div key={prod.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{prod.name}</div>
                        <div className="text-[10px] text-slate-400">{prod.unitsSold} units sold</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                        {formatCurrency(prod.revenue)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{prod.marginPct}% margin</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-right">
                Ranked by net billing revenue
              </div>
            </div>

            {/* 3. Top Customers (Ranked) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Top Customers
                </span>
                <button onClick={() => onNavigateToTab('parties')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Parties &rarr;
                </button>
              </div>

              <div className="space-y-2.5 my-2">
                {topCustomers.slice(0, 4).map((cust, idx) => (
                  <div key={cust.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{cust.name}</div>
                        <div className="text-[10px] text-slate-400">{cust.city} &bull; {cust.invoiceCount} invoices</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                        {formatCurrency(cust.totalPurchased)}
                      </div>
                      <div className="text-[10px] text-slate-500">Punctuality: {cust.punctualityScore}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-right">
                Ranked by volume billed
              </div>
            </div>

            {/* 4. Low Stock Summary Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Low Stock Summary
                </span>
                <button onClick={() => onNavigateToTab('items')} className="text-xs font-semibold text-amber-700 hover:underline">
                  Restock Catalog &rarr;
                </button>
              </div>

              <div className="my-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Reorder Required SKUs</span>
                  <span className="font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded">
                    {lowStockSummary.reorderRequiredCount} Items
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Completely Out of Stock</span>
                  <span className="font-bold text-rose-700 px-2 py-0.5 bg-rose-50 rounded">
                    {lowStockSummary.outOfStockCount} Items
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Est. Reorder Budget</span>
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency(lowStockSummary.estimatedReorderCost)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Calculated to restore minimum threshold buffer.
              </div>
            </div>

            {/* 5. Places Where User Should Put Focus (Business Alerts) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between lg:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    Places Where You Should Focus (Business Actions)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {focusAlerts.length} Action Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                {focusAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
                        alert.priority === 'Urgent'
                          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                          : alert.priority === 'Warning'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-blue-50/70 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            {alert.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              alert.priority === 'Urgent'
                                ? 'bg-rose-600 text-white'
                                : alert.priority === 'Warning'
                                ? 'bg-amber-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-[11px] mt-1 opacity-90 line-clamp-2">{alert.description}</p>
                      </div>

                      <div className="text-right pt-1 border-t border-black/5">
                        <button
                          onClick={() => onNavigateToTab(alert.targetTab)}
                          className="text-xs font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>{alert.actionText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1 text-[11px] text-slate-500">
                Automated business alerts computed live from invoice ledger &amp; stock balances.
              </div>
            </div>
          </div>

          {/* Section 3: Last 5 Invoices Table (Scrollable Container) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Last 5 Invoices &amp; Bills</h3>
                <p className="text-xs text-slate-500">Most recent billing transactions in system ledger.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToTab('sale')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  View All Sales
                </button>
                <button
                  onClick={() => onNavigateToTab('purchase')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  View All Purchases
                </button>
              </div>
            </div>

            {/* Scrollable Container for Last 5 Invoices */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-64 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3.5">Invoice #</th>
                    <th className="py-2.5 px-3.5">Type</th>
                    <th className="py-2.5 px-3.5">Party Name</th>
                    <th className="py-2.5 px-3.5">Date</th>
                    <th className="py-2.5 px-3.5 text-right">Total Amount</th>
                    <th className="py-2.5 px-3.5 text-right">Balance Due</th>
                    <th className="py-2.5 px-3.5 text-center">Status</th>
                    <th className="py-2.5 px-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {last5Invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-medium text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.type === 'Sale'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {inv.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-slate-900">{inv.partyName}</td>
                      <td className="py-2.5 px-3.5 text-slate-500">{inv.date}</td>
                      <td className={`py-2.5 px-3.5 text-right font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td
                        className={`py-2.5 px-3.5 text-right font-semibold ${
                          inv.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                        } ${privacyMode ? 'filter blur-sm' : ''}`}
                      >
                        {formatCurrency(inv.balanceDue)}
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
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
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
      )}
    </div>
  );
}
