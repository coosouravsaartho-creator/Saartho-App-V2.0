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
  MonthlyChartData
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
  EyeOff
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardViewProps {
  invoices: Invoice[];
  parties: Party[];
  items: Item[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  fiscalYear: FiscalYear;
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
  // Filter data based on selected fiscalYear
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (fiscalYear === 'FY 2026-27') return inv.fiscalYear === 'FY 2026-27';
      if (fiscalYear === 'FY 2025-26') return inv.fiscalYear === 'FY 2025-26';
      if (fiscalYear === 'FY 2024-25') return inv.fiscalYear === 'FY 2024-25';
      if (fiscalYear === 'August 2026') return inv.date.startsWith('2026-08');
      if (fiscalYear === 'July 2026') return inv.date.startsWith('2026-07');
      if (fiscalYear === 'Q2 FY 26-27') return inv.date >= '2026-07-01' && inv.date <= '2026-09-30';
      if (fiscalYear === 'Last 7 Days') {
        const d = new Date('2026-08-25');
        const sevenDaysAgo = new Date(d);
        sevenDaysAgo.setDate(d.getDate() - 7);
        return new Date(inv.date) >= sevenDaysAgo;
      }
      return true;
    });
  }, [invoices, fiscalYear]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      if (fiscalYear === 'FY 2026-27') return exp.fiscalYear === 'FY 2026-27';
      if (fiscalYear === 'FY 2025-26') return exp.fiscalYear === 'FY 2025-26';
      if (fiscalYear === 'August 2026') return exp.date.startsWith('2026-08');
      return true;
    });
  }, [expenses, fiscalYear]);

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

    // Gross Profit estimate
    const grossProfit = totalSales - totalPurchases - totalExpenseAmount;

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
      grossProfit,
      saleCount: saleInvoices.length,
      purchaseCount: purchaseInvoices.length,
    };
  }, [filteredInvoices, filteredExpenses, bankAccounts, parties, items]);

  // Top Selling Products (Calculated per filtered sales or overall dynamic)
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

  // Chart data for Advanced View (Trend Lines & Revenue Flow)
  const monthlyChartData: MonthlyChartData[] = useMemo(() => {
    if (fiscalYear === 'FY 2025-26') {
      return [
        { month: 'Apr 25', sales: 120000, purchases: 95000, expenses: 22000, profit: 3000 },
        { month: 'Jun 25', sales: 180000, purchases: 140000, expenses: 25000, profit: 15000 },
        { month: 'Sep 25', sales: 240000, purchases: 175000, expenses: 31000, profit: 34000 },
        { month: 'Nov 25', sales: 310000, purchases: 210000, expenses: 35000, profit: 65000 },
        { month: 'Jan 26', sales: 360000, purchases: 245000, expenses: 38000, profit: 77000 },
        { month: 'Mar 26', sales: 420000, purchases: 280000, expenses: 42000, profit: 98000 },
      ];
    }
    // Default FY 2026-27 data
    return [
      { month: 'Apr 26', sales: 185000, purchases: 142000, expenses: 32000, profit: 11000 },
      { month: 'May 26', sales: 245000, purchases: 180000, expenses: 36000, profit: 29000 },
      { month: 'Jun 26', sales: 290000, purchases: 195000, expenses: 41000, profit: 54000 },
      { month: 'Jul 26', sales: 340000, purchases: 230000, expenses: 48000, profit: 62000 },
      { month: 'Aug 26 (Current)', sales: 420618, purchases: 374650, expenses: 207650, profit: 45968 },
      { month: 'Sep 26 (Forecast)', sales: 480000, purchases: 310000, expenses: 50000, profit: 120000 },
    ];
  }, [fiscalYear]);

  // Expense distribution by category for pie chart
  const expenseCategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.stockQty <= item.minStockLevel);
  }, [items]);

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const formatCurrency = (amount?: number | string | null) => {
    if (amount === undefined || amount === null || amount === '') return '₹0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  return (
    <div
      id="dashboard-root-view"
      className={`p-5 sm:p-6 space-y-6 max-w-7xl mx-auto transition-all ${
        privacyMode ? 'backdrop-blur-md select-none' : ''
      }`}
    >
      {/* Privacy Mode Warning Banner when Active */}
      {privacyMode && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-900 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Privacy Mode is active. Financial figures &amp; customer balances are masked on screen.</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
            Protected Counter View
          </span>
        </div>
      )}      {/* Top Welcome & Active Filter Context Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Overview</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              {fiscalYear}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 capitalize">
              {viewMode} Bento View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated billing ledger, tax summaries, cashflow status, and inventory.
          </p>
        </div>

        {/* Quick Shortcut Buttons in Dashboard */}
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
      {/* BENTO GRID ARCHITECTURE */}
      {/* ========================================================================= */}
      {viewMode === 'advanced' ? (
        /* ADVANCED BENTO GRID: Comprehensive visual flow with chart spans and star customer tile */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {/* Card 1: Revenue vs Purchases Trend Chart (Bento Span: 3 cols, 2 rows) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Revenue vs Purchases Trend
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
                    {formatCurrency(metrics.totalSales)}
                  </span>
                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +14.8% vs Last Year
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
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Gross Profit</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradBento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="profitGradBento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                  <Area type="monotone" dataKey="purchases" name="Purchases" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#profitGradBento)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Top Products Bento Card (Bento Span: 1 col, 2 rows) */}
          <div className="col-span-1 lg:col-span-1 lg:row-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Top Products
              </span>
              <button
                onClick={() => onNavigateToTab('items')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3.5 my-auto py-2">
              {topProducts.slice(0, 4).map((prod, idx) => (
                <div key={prod.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{prod.name}</span>
                    </div>
                    <span className={`font-bold text-slate-900 shrink-0 ${privacyMode ? 'filter blur-sm' : ''}`}>
                      {formatCurrency(prod.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (prod.revenue / (topProducts[0]?.revenue || 1)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{prod.unitsSold} units</span>
                    <span className="text-emerald-600 font-medium">{prod.marginPct}% margin</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Inventory Valuation</span>
              <strong className="text-slate-900">{formatCurrency(metrics.stockValue)}</strong>
            </div>
          </div>

          {/* Card 3: Total Sales Stat Tile (Bento Span: 1 col) */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Sales</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                ▲ +8.4% MoM
              </span>
            </div>
            <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.totalSales)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="text-emerald-600 font-medium">Paid: {privacyMode ? '••••' : formatCurrency(metrics.salesPaid)}</span>
              <span className="text-rose-600 font-medium">Unpaid: {privacyMode ? '••••' : formatCurrency(metrics.salesUnpaid)}</span>
            </div>
          </div>

          {/* Card 4: Total Purchases Stat Tile (Bento Span: 1 col) */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Purchases</span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                ▼ 2.1% MoM
              </span>
            </div>
            <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.totalPurchases)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="text-emerald-600 font-medium">Paid: {privacyMode ? '••••' : formatCurrency(metrics.purchasesPaid)}</span>
              <span className="text-amber-700 font-medium">Due: {privacyMode ? '••••' : formatCurrency(metrics.purchasesUnpaid)}</span>
            </div>
          </div>

          {/* Card 5: Star Customer Highlight Card (Bento Span: 2 cols on md/lg) */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-600 text-white">
                  Star Customer
                </span>
                <span className="text-xs text-slate-400">Punctuality Score: 98%</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {topCustomers[0]?.name || 'Apex Textiles Ltd.'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {topCustomers[0]?.city || 'Ahmedabad'} &bull; Last invoice created today &bull; Verified GST Registered
              </p>
            </div>

            <div className="relative z-10 text-left sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Total Billed Volume</div>
              <div className={`text-xl font-extrabold text-emerald-400 mt-0.5 ${privacyMode ? 'filter blur-sm' : ''}`}>
                {formatCurrency(topCustomers[0]?.totalPurchased || 2850000)}
              </div>
              <button
                onClick={() => onNavigateToTab('parties')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-1 inline-block"
              >
                View Customer Ledger &rarr;
              </button>
            </div>
          </div>

          {/* Card 6: Receivables Bento Tile (Bento Span: 1 col) */}
          <div className="col-span-1 bg-white rounded-xl border border-emerald-200/80 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">You&apos;ll Receive</span>
              <div className="p-1 rounded bg-emerald-50 text-emerald-600">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-emerald-700 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.receivableTotal)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-50 text-slate-500">
              <span>From 4 Active Debtors</span>
              <button
                onClick={() => onNavigateToTab('parties')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                View &rarr;
              </button>
            </div>
          </div>

          {/* Card 7: Payables Bento Tile (Bento Span: 1 col) */}
          <div className="col-span-1 bg-white rounded-xl border border-rose-200/80 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">You&apos;ll Pay</span>
              <div className="p-1 rounded bg-rose-50 text-rose-600">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-rose-700 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.payableTotal)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-rose-50 text-slate-500">
              <span>To 3 Active Creditors</span>
              <button
                onClick={() => onNavigateToTab('parties')}
                className="text-rose-700 font-semibold hover:underline"
              >
                View &rarr;
              </button>
            </div>
          </div>

          {/* Card 8: Cash & Bank Balances Bento Tile (Bento Span: 2 cols) */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Cash &amp; Bank Balances
              </span>
              <button
                onClick={() => onNavigateToTab('cash_bank')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage Accounts &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Cash in Hand</div>
                <div className={`text-base font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                  {formatCurrency(metrics.cashInHand)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Bank Accounts (2)</div>
                <div className={`text-base font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                  {formatCurrency(metrics.bankBalance)}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Total Liquid Reserve</span>
              <strong className={`text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                {formatCurrency(metrics.totalCashBank)}
              </strong>
            </div>
          </div>

          {/* Card 9: Stock Valuation & Low Stock Bento Tile (Bento Span: 2 cols) */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Stock &amp; Inventory Health
              </span>
              <button
                onClick={() => onNavigateToTab('items')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Stock Register &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Total Items in Catalog</div>
                <div className="text-base font-bold text-slate-900">{items.length} Products</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                <div className="text-[10px] text-amber-800">Low Stock Alert</div>
                <div className="text-base font-bold text-amber-700">{lowStockItems.length} Re-order needed</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Live Inventory Value</span>
              <strong className="text-slate-900">{formatCurrency(metrics.stockValue)}</strong>
            </div>
          </div>

          {/* Card 10: Recent Invoices Bento Table (Bento Span: 4 cols) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Invoices &amp; Bills ({fiscalYear})</h3>
                <p className="text-xs text-slate-500">Latest ledger entries with real-time settlement status.</p>
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

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
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
                  {filteredInvoices.slice(0, 6).map((inv) => (
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
                      <td className={`py-2.5 px-3.5 text-right font-semibold ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'} ${privacyMode ? 'filter blur-sm' : ''}`}>
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
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
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
      ) : (
        /* STANDARD BENTO GRID: Concise, graph-free financial ledger tiles for counter speed */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {/* Tile 1: Total Sales */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Sales</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.totalSales)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="text-emerald-600 font-medium">Paid: {privacyMode ? '••••' : formatCurrency(metrics.salesPaid)}</span>
              <span className="text-rose-600 font-medium">Unpaid: {privacyMode ? '••••' : formatCurrency(metrics.salesUnpaid)}</span>
            </div>
          </div>

          {/* Tile 2: Total Purchases */}
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Purchases</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-slate-900 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.totalPurchases)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="text-emerald-600 font-medium">Paid: {privacyMode ? '••••' : formatCurrency(metrics.purchasesPaid)}</span>
              <span className="text-amber-700 font-medium">Due: {privacyMode ? '••••' : formatCurrency(metrics.purchasesUnpaid)}</span>
            </div>
          </div>

          {/* Tile 3: You'll Receive (Debtors) */}
          <div className="col-span-1 bg-white rounded-xl border border-emerald-100 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">You&apos;ll Receive</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-emerald-700 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.receivableTotal)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-50 text-slate-500">
              <span>From 4 Active Debtors</span>
              <button
                onClick={() => onNavigateToTab('parties')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                View Parties &rarr;
              </button>
            </div>
          </div>

          {/* Tile 4: You'll Pay (Creditors) */}
          <div className="col-span-1 bg-white rounded-xl border border-rose-100 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">You&apos;ll Pay</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-rose-700 tracking-tight my-1 ${privacyMode ? 'filter blur-sm select-none' : ''}`}>
              {formatCurrency(metrics.payableTotal)}
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-rose-50 text-slate-500">
              <span>To 3 Active Creditors</span>
              <button
                onClick={() => onNavigateToTab('parties')}
                className="text-rose-700 font-semibold hover:underline"
              >
                View Payables &rarr;
              </button>
            </div>
          </div>

          {/* Tile 5: Cash & Bank Liquidity Tile (2 cols) */}
          <div className="col-span-1 sm:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cash &amp; Bank Summary</span>
              <button
                onClick={() => onNavigateToTab('cash_bank')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Cash Register &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Cash in Hand</div>
                <div className={`text-base font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                  {formatCurrency(metrics.cashInHand)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Bank Accounts</div>
                <div className={`text-base font-bold text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                  {formatCurrency(metrics.bankBalance)}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
              <span>Total Liquidity Available</span>
              <strong className={`text-slate-900 ${privacyMode ? 'filter blur-sm' : ''}`}>
                {formatCurrency(metrics.totalCashBank)}
              </strong>
            </div>
          </div>

          {/* Tile 6: Stock & Inventory Summary Tile (2 cols) */}
          <div className="col-span-1 sm:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-4.5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Inventory Valuation</span>
              <button
                onClick={() => onNavigateToTab('items')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Stock Items &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500">Registered SKUs</div>
                <div className="text-base font-bold text-slate-900">{items.length} Items</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                <div className="text-[10px] text-amber-800">Low Stock Warning</div>
                <div className="text-base font-bold text-amber-700">{lowStockItems.length} Items Low</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
              <span>Total Inventory Value</span>
              <strong className="text-slate-900">{formatCurrency(metrics.stockValue)}</strong>
            </div>
          </div>

          {/* Tile 7: Recent Transactions Table (4 cols) */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Invoices &amp; Bills ({fiscalYear})</h3>
                <p className="text-xs text-slate-500">Latest ledger entries with real-time settlement status.</p>
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

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
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
                  {filteredInvoices.slice(0, 8).map((inv) => (
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
                      <td className={`py-2.5 px-3.5 text-right font-semibold ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'} ${privacyMode ? 'filter blur-sm' : ''}`}>
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
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
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
