import React, { useState, useRef, useEffect } from 'react';
import { FiscalYear, ThemeConfig, ThemeKey, ViewMode, Company } from '../types';
import { THEMES } from '../theme';
import {
  Search,
  Printer,
  PlusCircle,
  Eye,
  EyeOff,
  Palette,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Minus,
  Square,
  X,
  ShieldAlert,
  ChevronDown,
  Building2,
  Keyboard,
  Plus,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Briefcase,
  LogOut
} from 'lucide-react';

interface DesktopHeaderProps {
  currentTheme: ThemeConfig;
  selectedThemeKey: ThemeKey;
  onChangeTheme: (theme: ThemeKey) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  fiscalYear: FiscalYear;
  onChangeFiscalYear: (fy: FiscalYear) => void;
  onOpenUniversalSearch: () => void;
  onOpenBulkPrint: () => void;
  onOpenSaleModal: () => void;
  onOpenPurchaseModal: () => void;
  onOpenPaymentInModal: () => void;
  onOpenPaymentOutModal: () => void;
  onOpenThemeModal: () => void;
  companies: Company[];
  activeCompany: Company;
  onSelectCompany: (company: Company) => void;
  onOpenCreateCompany: () => void;
  onOpenChangeCompany: () => void;
  onOpenShortcutsModal: () => void;
  onOpenCompanyProfile: () => void;
  onLogout?: () => void;
}

export function DesktopHeader({
  currentTheme,
  selectedThemeKey,
  onChangeTheme,
  viewMode,
  onToggleViewMode,
  privacyMode,
  onTogglePrivacyMode,
  fiscalYear,
  onChangeFiscalYear,
  onOpenUniversalSearch,
  onOpenBulkPrint,
  onOpenSaleModal,
  onOpenPurchaseModal,
  onOpenPaymentInModal,
  onOpenPaymentOutModal,
  onOpenThemeModal,
  companies,
  activeCompany,
  onSelectCompany,
  onOpenCreateCompany,
  onOpenChangeCompany,
  onOpenShortcutsModal,
  onOpenCompanyProfile,
  onLogout,
}: DesktopHeaderProps) {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  // Close company dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fiscalYears: FiscalYear[] = [
    'FY 2026-27',
    'FY 2025-26',
    'FY 2024-25',
    'Q2 FY 26-27',
    'August 2026',
    'July 2026',
    'Last 7 Days',
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 shrink-0 z-20 select-none shadow-xs">
      {/* 1. Top Bar / Company, Shortcuts, Universal Search & Quick Controls */}
      <div className="h-16 bg-white px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Section: Company Dropdown, Shortcuts & Universal Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl min-w-0">
          {/* Company Menu Dropdown */}
          <div className="relative shrink-0" ref={companyDropdownRef}>
            <div className="flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg p-0.5 shadow-2xs">
              {/* Click to open Right-Side Profile Drawer directly */}
              <button
                id="top-company-profile-direct-btn"
                type="button"
                onClick={onOpenCompanyProfile}
                className="flex items-center gap-2 px-2.5 py-1 text-slate-800 font-semibold text-xs transition-colors cursor-pointer text-left group"
                title="Click to Open Company Profile Drawer (Edit Logo, GSTIN, Contacts, Addresses, Signature)"
              >
                {activeCompany.logoUrl ? (
                  <img
                    src={activeCompany.logoUrl}
                    alt={activeCompany.name}
                    className="w-5 h-5 rounded-md object-contain shrink-0 border border-slate-200"
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                )}
                <div className="flex flex-col text-left max-w-[130px] sm:max-w-[170px]">
                  <span className="text-[9px] text-blue-600 font-bold leading-tight flex items-center gap-1">
                    <span>Company Profile</span>
                    <span className="text-[8px] bg-blue-100 text-blue-800 px-1 rounded font-normal">Edit</span>
                  </span>
                  <span className="truncate text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-700">
                    {activeCompany.name}
                  </span>
                </div>
              </button>

              {/* Arrow button for company dropdown menu */}
              <button
                id="top-company-dropdown-arrow-btn"
                type="button"
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="p-1.5 hover:bg-slate-200/70 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-l border-slate-200/80"
                title="Switch company or create new business"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isCompanyDropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
            </div>

            {/* Company Dropdown Menu */}
            {isCompanyDropdownOpen && (
              <div
                id="company-dropdown-menu"
                className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {/* Header: Active Business Summary with Quick Edit Button */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Current Active Business
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate mt-0.5">
                      {activeCompany.name}
                    </div>
                    {activeCompany.gstin && (
                      <div className="text-[11px] font-mono text-slate-500 truncate">
                        GSTIN: {activeCompany.gstin}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompanyDropdownOpen(false);
                      onOpenCompanyProfile();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Option 1: Change Company list */}
                <div className="p-1.5">
                  <div className="flex items-center justify-between px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <span>Change Company</span>
                    {companies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCompanyDropdownOpen(false);
                          onOpenChangeCompany();
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                      >
                        View All ({companies.length})
                      </button>
                    )}
                  </div>

                  <div className="space-y-0.5 max-h-44 overflow-y-auto custom-scrollbar">
                    {companies.map((comp) => {
                      const isCurrent = comp.id === activeCompany.id;
                      return (
                        <button
                          key={comp.id}
                          id={`select-company-${comp.id}`}
                          type="button"
                          onClick={() => {
                            onSelectCompany(comp);
                            setIsCompanyDropdownOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-xs">{comp.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {comp.city || 'Default Branch'} {comp.gstin ? `• ${comp.gstin}` : ''}
                            </div>
                          </div>
                          {isCurrent ? (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">
                              Switch
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-1" />

                {/* Option 2: Create Company */}
                <div className="p-1.5">
                  <button
                    id="create-company-dropdown-btn"
                    type="button"
                    onClick={() => {
                      setIsCompanyDropdownOpen(false);
                      onOpenCreateCompany();
                    }}
                    className="w-full px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer border border-blue-200/80"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span>Create Company (Add New Business)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shortcuts Top Option */}
          <button
            id="top-shortcuts-btn"
            type="button"
            onClick={onOpenShortcutsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs shrink-0"
            title="View all Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* Universal Search Bar */}
          <div className="flex items-center flex-1 min-w-[140px]">
            <button
              id="universal-search-bar"
              onClick={onOpenUniversalSearch}
              type="button"
              className="relative w-full flex items-center bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 rounded-lg px-3 py-1.5 text-sm text-left transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <span className="text-slate-400 flex-1 truncate text-xs">
                Search parties, invoices, items...
              </span>
              <kbd className="hidden lg:inline-block font-mono text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right Section: Fiscal Year, View Mode, Theme & Privacy */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Financial Year Filter */}
          <div className="relative inline-flex items-center">
            <select
              id="fiscal-year-select"
              value={fiscalYear}
              onChange={(e) => onChangeFiscalYear(e.target.value as FiscalYear)}
              className="pl-2.5 pr-6 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              {fiscalYears.map((fy) => (
                <option key={fy} value={fy}>
                  {fy}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>

          {/* Standard vs Advanced Segmented Pill */}
          <div className="hidden md:flex bg-slate-100 rounded-full p-1 border border-slate-200/60">
            <button
              id="toggle-view-standard-btn"
              onClick={() => onToggleViewMode('standard')}
              type="button"
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-white shadow-xs text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard
            </button>
            <button
              id="toggle-view-advanced-btn"
              onClick={() => onToggleViewMode('advanced')}
              type="button"
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                viewMode === 'advanced'
                  ? 'bg-white shadow-xs text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Theme Button */}
          <button
            id="theme-color-changer-btn"
            onClick={onOpenThemeModal}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
            <span className="hidden xl:inline">Theme</span>
          </button>

          {/* Privacy Mode Button */}
          <button
            id="privacy-mode-toggle-btn"
            onClick={onTogglePrivacyMode}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              privacyMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Privacy Mode (Ctrl+B)"
          >
            {privacyMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Privacy</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Privacy</span>
              </>
            )}
          </button>

          {/* Login Screen / Switch Account Button */}
          {onLogout && (
            <button
              id="top-logout-login-btn"
              onClick={onLogout}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
              title="Lock & Switch Account (Open Login Screen)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Bento Quick Actions Bar (Preserved and untouched) */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0 overflow-x-auto">
        <button
          id="quick-sale-bill-btn"
          onClick={onOpenSaleModal}
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Sale Bill (F1)</span>
        </button>

        <button
          id="quick-purchase-bill-btn"
          onClick={onOpenPurchaseModal}
          type="button"
          className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Purchase (F2)</span>
        </button>

        <button
          id="quick-payment-in-btn"
          onClick={onOpenPaymentInModal}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-blue-200" />
          <span>+ Pay In (F3)</span>
        </button>

        <button
          id="quick-payment-out-btn"
          onClick={onOpenPaymentOutModal}
          type="button"
          className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-200" />
          <span>- Pay Out (F4)</span>
        </button>

        <div className="h-6 w-px bg-slate-300 mx-1 shrink-0" />

        <button
          id="bulk-print-btn"
          onClick={onOpenBulkPrint}
          type="button"
          className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-200/70 border border-slate-200 bg-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Bulk Print</span>
        </button>
      </div>
    </header>
  );
}

