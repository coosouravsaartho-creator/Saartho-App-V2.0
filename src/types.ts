export type ThemeKey =
  | 'royal_blue'
  | 'teal_gray'
  | 'purple_lavender'
  | 'emerald_mint'
  | 'amber_orange'
  | 'coral_peach'
  | 'slate_gray'
  | 'indigo_sky';

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  sidebarBg: string;
  sidebarText: string;
  accentBg: string;
  accentText: string;
  cardBorder: string;
  buttonClass: string;
  activeNavClass: string;
  badgeClass: string;
  appBg: string;
  cardBorderHex: string;
  badgeBgHex: string;
  badgeTextHex: string;
  tableHeaderBg: string;
  headerBg: string;
  activeTabClass: string;
  chartColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
}

export type ViewMode = 'standard' | 'advanced';

export type FiscalYear = 'FY 2026-27' | 'FY 2025-26' | 'FY 2024-25' | 'Q2 FY 26-27' | 'August 2026' | 'July 2026' | 'Last 7 Days' | 'Custom Date Range';

export type ActiveTab =
  | 'home'
  | 'parties'
  | 'items'
  | 'sale'
  | 'purchase'
  | 'expenses'
  | 'cash_bank'
  | 'settings'
  | 'report'
  | 'additional_options'
  | 'backup_restore'
  | 'data_sync'
  | 'plan_pricing'
  | 'contact_us';

export type UserRole = 'Admin' | 'Accountant' | 'Biller' | 'Manager' | 'Auditor';

export interface CompanyPhone {
  id: string;
  number: string;
  label?: string;
  isSelectedForInvoice: boolean;
}

export interface CompanyEmail {
  id: string;
  email: string;
  label?: string;
  isPrimary: boolean;
}

export interface CompanyAddress {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isSelectedForInvoice: boolean;
  isAutoGstin?: boolean;
}

export interface CompanySignature {
  type: 'upload' | 'digital';
  uploadUrl?: string;
  drawnDataUrl?: string;
  digitalSignerName?: string;
  digitalDesignation?: string;
  digitalCertificateId?: string;
  digitalTimestamp?: string;
  digitalStyleIndex?: number;
}

export interface Company {
  id: string;
  name: string;
  tradeName?: string;
  logoUrl?: string;
  gstin?: string;
  gstinVerified?: boolean;
  phoneNumber?: string;
  phones?: CompanyPhone[];
  email?: string;
  emails?: CompanyEmail[];
  tagline?: string;
  description?: string;
  category?: string;
  address?: string;
  addresses?: CompanyAddress[];
  city?: string;
  state?: string;
  businessType?: 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'LLP' | 'Retailer' | 'Wholesaler' | 'Manufacturer' | 'Service Provider';
  ownerName?: string;
  currency?: string;
  financialYearStart?: string;
  signature?: CompanySignature;
  createdAt?: string;
  isActive?: boolean;
}

export interface UserAccount {
  businessName: string;
  phoneNumber?: string;
  email?: string;
  gstin?: string;
  tagline?: string;
  address?: string;
  ownerName?: string;
  role: UserRole;
  isLoggedIn: boolean;
}

export interface PartyAddress {
  id: string;
  label?: string; // e.g. "Head Office", "Warehouse #1", "Factory Unit"
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface PartyGroup {
  id: string;
  name: string;
  groupType: 'All' | 'Customer' | 'Supplier';
  groupBy: 'State' | 'District' | 'Area' | 'Pincode' | 'Custom';
  locationValue?: string; // e.g. "Delhi", "North Zone", "110020"
  description?: string;
  color?: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Supplier' | 'Both';
  phone: string;
  email: string;
  gstin?: string;
  gstinVerified?: boolean;
  city: string;
  state?: string;
  pincode?: string;
  billingAddresses?: PartyAddress[];
  shippingAddresses?: PartyAddress[];
  openingBalance?: number;
  openingBalanceDate?: string;
  balance: number; // Positive means receivable (they owe us), negative means payable (we owe them)
  creditLimit: number;
  paymentTermsDays: number;
  totalInvoiced: number;
  punctualityScore: number; // 0 - 100
  customFields?: CustomField[];
  groupId?: string; // assigned party group id
  groupName?: string;
}

export type ItemType = 'Product' | 'Service' | 'Raw Material';

export interface UnitMaster {
  id: string;
  code: string; // e.g., 'PCS', 'BOX', 'KG'
  name: string; // e.g., 'Pieces', 'Boxes', 'Kilograms'
  uqcCode?: string; // e.g. 'PCS-PIECES', 'BOX-BOXES'
  description?: string;
  defaultConversion?: string;
}

export interface Item {
  id: string;
  name: string;
  code: string;
  category: string;
  hsn: string;
  salePrice: number;
  purchasePrice: number;
  stockQty: number;
  unit: string; // Primary Unit (e.g. 'BOX')
  secondaryUnit1?: string; // Secondary Unit 1 (e.g. 'PACK')
  secondaryUnit1Rate?: number; // 1 Primary Unit = X Secondary Unit 1 (e.g. 10)
  secondaryUnit2?: string; // Secondary Unit 2 (e.g. 'PCS')
  secondaryUnit2Rate?: number; // 1 Secondary Unit 1 = Y Secondary Unit 2 (e.g. 10)
  itemType?: ItemType; // 'Product' | 'Service' | 'Raw Material'
  minStockLevel: number;
  taxRate: number; // in percentage e.g. 18
  unitsSold: number;
  totalRevenue: number;
  description?: string;
}

export interface InvoiceItem {
  itemId: string;
  itemName: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  taxRate: number;
  discountPct: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'Sale' | 'Purchase' | 'Quotation' | 'Sale Return' | 'Purchase Return';
  partyId: string;
  partyName: string;
  partyPhone: string;
  partyGstin?: string;
  date: string;
  dueDate: string;
  fiscalYear: FiscalYear;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  roundOff: number;
  grandTotal: number;
  receivedPaidAmount: number;
  balanceDue: number;
  paymentMode: 'Cash' | 'Bank Transfer / NEFT' | 'UPI' | 'Cheque' | 'Credit';
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  notes?: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  date: string;
  fiscalYear: FiscalYear;
  category: 'Rent' | 'Electricity & Utility' | 'Staff Salary' | 'Freight & Logistics' | 'Marketing & Promo' | 'Office Supplies' | 'Maintenance' | 'Professional Fees';
  payee: string;
  amount: number;
  taxRate: number;
  paymentMode: 'Cash' | 'Bank' | 'UPI' | 'Cheque';
  status: 'Paid' | 'Pending';
  taxDeductible: boolean;
  notes?: string;
}

export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountType: 'Current' | 'Savings' | 'Overdraft' | 'Cash In Hand';
  currentBalance: number;
  upiId?: string;
  isPrimary?: boolean;
}

export interface TaxConfiguration {
  defaultGstRate: number;
  enabledSlabs: number[];
  enableCess: boolean;
  enableCompositionScheme: boolean;
  enableAutoRoundOff: boolean;
  enableEInvoice: boolean;
  enableEWayBill: boolean;
  reverseChargeApplicable: boolean;
  invoicePrefix: string;
  financialYearStart: string;
}

export interface TopProductMetric {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  marginPct: number;
  stockQty: number;
  growthPct: number;
}

export interface TopCustomerMetric {
  id: string;
  name: string;
  city: string;
  phone: string;
  totalPurchased: number;
  outstanding: number;
  punctualityScore: number;
  invoiceCount: number;
}

export interface MonthlyChartData {
  month: string;
  sales: number;
  purchases: number;
  expenses: number;
  profit: number;
}
