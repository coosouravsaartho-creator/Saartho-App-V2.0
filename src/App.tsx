import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  ThemeKey,
  FiscalYear,
  Invoice,
  Party,
  Item,
  Expense,
  BankAccount,
  TaxConfiguration,
  ActiveTab,
  ViewMode,
  Company,
  PartyGroup,
  UnitMaster,
} from './types';
import { THEMES } from './theme';
import {
  INITIAL_USER,
  INITIAL_PARTIES,
  INITIAL_PARTY_GROUPS,
  INITIAL_ITEMS,
  INITIAL_UNITS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TAX_CONFIG,
  INITIAL_COMPANIES,
} from './mockData';

// Component imports
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { DashboardView } from './components/DashboardView';
import { PartiesView } from './components/PartiesView';
import { PartyGroupingView } from './components/PartyGroupingView';
import { PartyFormDrawer } from './components/PartyFormDrawer';
import { ItemsView } from './components/ItemsView';
import { SalesView } from './components/SalesView';
import { PurchasesView } from './components/PurchasesView';
import { ExpensesView } from './components/ExpensesView';
import { CashBankView } from './components/CashBankView';
import { SettingsView } from './components/SettingsView';
import { ReportsView } from './components/ReportsView';
import { AdditionalOptionsView } from './components/AdditionalOptionsView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { DataSyncView } from './components/DataSyncView';
import { PlanPricingView } from './components/PlanPricingView';
import { ContactUsView } from './components/ContactUsView';

// Modals
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { BulkPrintModal } from './components/BulkPrintModal';
import { CreateCompanyModal, ChangeCompanyModal } from './components/CompanyModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { CompanyProfileDrawer } from './components/CompanyProfileDrawer';
import {
  SaleBillModal,
  PurchaseBillModal,
  PaymentInModal,
  PaymentOutModal,
  InvoiceDetailModal,
} from './components/QuickActionModals';

export default function App() {
  // App State - Default to null so user arrives first at the Login / Registration screen
  const [user, setUser] = useState<UserAccount | null>(null);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(INITIAL_COMPANIES[0].id);
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('royal_blue');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [dashboardViewMode, setDashboardViewMode] = useState<ViewMode>('advanced');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>('FY 2026-27');

  // Business Data State
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [parties, setParties] = useState<Party[]>(INITIAL_PARTIES);
  const [partyGroups, setPartyGroups] = useState<PartyGroup[]>(INITIAL_PARTY_GROUPS);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [units, setUnits] = useState<UnitMaster[]>(INITIAL_UNITS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [taxConfig, setTaxConfig] = useState<TaxConfiguration>(INITIAL_TAX_CONFIG);

  // Modals & Drawer state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBulkPrintModalOpen, setIsBulkPrintModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPaymentInModalOpen, setIsPaymentInModalOpen] = useState(false);
  const [isPaymentOutModalOpen, setIsPaymentOutModalOpen] = useState(false);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
  const [isChangeCompanyModalOpen, setIsChangeCompanyModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Party Drawer state (Add Buyer / Add Supplier)
  const [selectedSaleType, setSelectedSaleType] = useState<string>('Sale invoices');
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
  const [partyDrawerType, setPartyDrawerType] = useState<'Customer' | 'Supplier'>('Customer');
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [isGroupingViewOpen, setIsGroupingViewOpen] = useState(false);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];
  const currentTheme = THEMES[currentThemeKey] || THEMES.royal_blue;

  // Counts for sidebar badges
  const lowStockCount = items.filter((i) => i.stockQty <= i.minStockLevel).length;
  const unpaidSaleCount = invoices.filter((i) => i.type === 'Sale' && i.balanceDue > 0).length;

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (!isInput) {
          e.preventDefault();
          setIsBulkPrintModalOpen(true);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setPrivacyMode((prev) => !prev);
      } else if (e.key === 'F1' || (e.ctrlKey && e.key === '1')) {
        e.preventDefault();
        setIsSaleModalOpen(true);
      } else if (e.key === 'F2' || (e.ctrlKey && e.key === '2')) {
        e.preventDefault();
        setIsPurchaseModalOpen(true);
      } else if (e.key === 'F3' || (e.ctrlKey && e.key === '3')) {
        e.preventDefault();
        setIsPaymentInModalOpen(true);
      } else if (e.key === 'F4' || (e.ctrlKey && e.key === '4')) {
        e.preventDefault();
        setIsPaymentOutModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSelectCompany = (comp: Company) => {
    setActiveCompanyId(comp.id);
    setUser((prev) =>
      prev
        ? {
            ...prev,
            businessName: comp.name,
            gstin: comp.gstin || prev.gstin,
            phoneNumber: comp.phoneNumber || prev.phoneNumber,
            email: comp.email || prev.email,
            tagline: comp.tagline || prev.tagline,
            address: comp.address || prev.address,
            ownerName: comp.ownerName || prev.ownerName,
          }
        : prev
    );
  };

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies([newCompany, ...companies]);
    handleSelectCompany(newCompany);
  };

  const handleSaveCompanyProfile = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
    );
    setUser((prev) =>
      prev
        ? {
            ...prev,
            businessName: updatedCompany.name,
            gstin: updatedCompany.gstin || prev.gstin,
            phoneNumber: updatedCompany.phoneNumber || prev.phoneNumber,
            email: updatedCompany.email || prev.email,
            tagline: updatedCompany.tagline || prev.tagline,
            address: updatedCompany.address || prev.address,
            ownerName: updatedCompany.ownerName || prev.ownerName,
          }
        : prev
    );
  };

  const handleSaveInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === newInv.partyId) {
          return {
            ...p,
            totalInvoiced: p.totalInvoiced + newInv.grandTotal,
            balance: newInv.type === 'Sale' ? p.balance + newInv.balanceDue : p.balance - newInv.balanceDue,
          };
        }
        return p;
      })
    );
  };

  const handleAddOrUpdateParty = (partyToSave: Party) => {
    setParties((prev) => {
      const exists = prev.some((p) => p.id === partyToSave.id);
      if (exists) {
        return prev.map((p) => (p.id === partyToSave.id ? partyToSave : p));
      }
      return [partyToSave, ...prev];
    });
  };

  const handleOpenAddBuyer = () => {
    setEditingParty(null);
    setPartyDrawerType('Customer');
    setIsPartyDrawerOpen(true);
  };

  const handleOpenAddSupplier = () => {
    setEditingParty(null);
    setPartyDrawerType('Supplier');
    setIsPartyDrawerOpen(true);
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setPartyDrawerType(party.type === 'Supplier' ? 'Supplier' : 'Customer');
    setIsPartyDrawerOpen(true);
  };

  const handleAddPartyGroup = (newGroup: PartyGroup) => {
    setPartyGroups((prev) => [...prev, newGroup]);
  };

  const handleUpdatePartyGroup = (updatedGroup: PartyGroup) => {
    setPartyGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
  };

  const handleDeletePartyGroup = (groupId: string) => {
    setPartyGroups((prev) => prev.filter((g) => g.id !== groupId));
    // Unassign parties from this deleted group
    setParties((prev) =>
      prev.map((p) => (p.groupId === groupId ? { ...p, groupId: undefined, groupName: undefined } : p))
    );
  };

  const handleMovePartiesToGroup = (partyIds: string[], targetGroupId: string | null) => {
    const targetGroup = targetGroupId ? partyGroups.find((g) => g.id === targetGroupId) : null;
    setParties((prev) =>
      prev.map((p) => {
        if (partyIds.includes(p.id)) {
          return {
            ...p,
            groupId: targetGroupId || undefined,
            groupName: targetGroup ? targetGroup.name : undefined,
          };
        }
        return p;
      })
    );
  };

  const handleSaveItem = (itemToSave: Item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === itemToSave.id);
      if (exists) {
        return prev.map((i) => (i.id === itemToSave.id ? itemToSave : i));
      }
      return [itemToSave, ...prev];
    });
  };

  const handleAddUnit = (newUnit: UnitMaster) => {
    setUnits((prev) => [...prev, newUnit]);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleRecordPaymentIn = (partyId: string, amount: number) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, balance: Math.max(0, p.balance - amount) } : p))
    );
    setBankAccounts((prev) =>
      prev.map((b, idx) => (idx === 0 ? { ...b, currentBalance: b.currentBalance + amount } : b))
    );
  };

  const handleRecordPaymentOut = (partyId: string, amount: number) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, balance: p.balance + amount } : p))
    );
    setBankAccounts((prev) =>
      prev.map((b, idx) => (idx === 0 ? { ...b, currentBalance: Math.max(0, b.currentBalance - amount) } : b))
    );
  };

  const handleTransferFunds = (fromId: string, toId: string, amount: number) => {
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId) return { ...acc, currentBalance: acc.currentBalance - amount };
        if (acc.id === toId) return { ...acc, currentBalance: acc.currentBalance + amount };
        return acc;
      })
    );
  };

  // If user is logged out, render the Login & Registration screen
  if (!user) {
    return (
      <LoginScreen
        currentTheme={currentTheme}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
        onRestoreBackup={() => setActiveTab('backup_restore')}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 select-none">
      {/* 1. Left Sidebar with 14-item navigation menu */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setIsGroupingViewOpen(false);
          setActiveTab(tab);
        }}
        user={user}
        currentTheme={currentTheme}
        lowStockCount={lowStockCount}
        unpaidSaleCount={unpaidSaleCount}
        onOpenCompanyProfile={() => setIsCompanyProfileOpen(true)}
        onLogout={() => setUser(null)}
        onOpenAddBuyer={handleOpenAddBuyer}
        onOpenAddSupplier={handleOpenAddSupplier}
        onOpenPartyGrouping={() => {
          setActiveTab('parties');
          setIsGroupingViewOpen(true);
        }}
        selectedSaleType={selectedSaleType}
        onSelectSaleType={setSelectedSaleType}
      />

      {/* 2. Main Desktop App Workspace */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50">
        {/* Top Header: Desktop Window controls, Search, Quick Actions, Privacy mode & Theme trigger */}
        <DesktopHeader
          currentTheme={currentTheme}
          selectedThemeKey={currentThemeKey}
          onChangeTheme={(key) => setCurrentThemeKey(key)}
          viewMode={dashboardViewMode}
          onToggleViewMode={(mode) => setDashboardViewMode(mode)}
          privacyMode={privacyMode}
          onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
          fiscalYear={fiscalYear}
          onChangeFiscalYear={(fy) => setFiscalYear(fy)}
          onOpenUniversalSearch={() => setIsSearchModalOpen(true)}
          onOpenBulkPrint={() => setIsBulkPrintModalOpen(true)}
          onOpenSaleModal={() => setIsSaleModalOpen(true)}
          onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
          onOpenPaymentInModal={() => setIsPaymentInModalOpen(true)}
          onOpenPaymentOutModal={() => setIsPaymentOutModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          companies={companies}
          activeCompany={activeCompany}
          onSelectCompany={handleSelectCompany}
          onOpenCreateCompany={() => setIsCreateCompanyModalOpen(true)}
          onOpenChangeCompany={() => setIsChangeCompanyModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          onOpenCompanyProfile={() => setIsCompanyProfileOpen(true)}
          onLogout={() => setUser(null)}
        />

        {/* Dynamic Main Viewport Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-100/70 custom-scrollbar">
          {activeTab === 'home' && (
            <DashboardView
              invoices={invoices}
              parties={parties}
              items={items}
              expenses={expenses}
              bankAccounts={bankAccounts}
              fiscalYear={fiscalYear}
              viewMode={dashboardViewMode}
              privacyMode={privacyMode}
              currentTheme={currentTheme}
              onNavigateToTab={(tab) => {
                setIsGroupingViewOpen(false);
                setActiveTab(tab);
              }}
              onOpenSaleModal={() => setIsSaleModalOpen(true)}
              onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
              onOpenPaymentInModal={() => setIsPaymentInModalOpen(true)}
              onOpenPaymentOutModal={() => setIsPaymentOutModalOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
            />
          )}

          {activeTab === 'parties' && (
            isGroupingViewOpen ? (
              <PartyGroupingView
                parties={parties}
                partyGroups={partyGroups}
                onAddGroup={handleAddPartyGroup}
                onUpdateGroup={handleUpdatePartyGroup}
                onDeleteGroup={handleDeletePartyGroup}
                onMovePartiesToGroup={handleMovePartiesToGroup}
                onOpenAddBuyer={handleOpenAddBuyer}
                onOpenAddSupplier={handleOpenAddSupplier}
              />
            ) : (
              <PartiesView
                parties={parties}
                partyGroups={partyGroups}
                onOpenAddBuyer={handleOpenAddBuyer}
                onOpenAddSupplier={handleOpenAddSupplier}
                onOpenPartyGrouping={() => setIsGroupingViewOpen(true)}
                onEditParty={handleEditParty}
                onOpenPaymentIn={() => setIsPaymentInModalOpen(true)}
                onOpenPaymentOut={() => setIsPaymentOutModalOpen(true)}
              />
            )
          )}

          {activeTab === 'items' && (
            <ItemsView
              items={items}
              units={units}
              onAddItem={handleSaveItem}
              onSaveItem={handleSaveItem}
              onAddUnit={handleAddUnit}
            />
          )}

          {activeTab === 'sale' && (
            <SalesView
              invoices={invoices}
              onOpenSaleModal={() => setIsSaleModalOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
              selectedSaleType={selectedSaleType}
              onSelectSaleType={setSelectedSaleType}
            />
          )}

          {activeTab === 'purchase' && (
            <PurchasesView
              invoices={invoices}
              onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForDetail(inv)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView expenses={expenses} onAddExpense={handleAddExpense} />
          )}

          {activeTab === 'cash_bank' && (
            <CashBankView
              bankAccounts={bankAccounts}
              onAddAccount={(acc) => setBankAccounts([...bankAccounts, acc])}
              onTransferFunds={handleTransferFunds}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              taxConfig={taxConfig}
              onUpdateTaxConfig={(cfg) => setTaxConfig(cfg)}
              user={user}
              onUpdateUser={(u) => setUser(u)}
            />
          )}

          {activeTab === 'report' && (
            <ReportsView invoices={invoices} expenses={expenses} fiscalYear={fiscalYear} />
          )}

          {activeTab === 'additional_options' && <AdditionalOptionsView />}

          {activeTab === 'backup_restore' && (
            <BackupRestoreView invoices={invoices} parties={parties} items={items} />
          )}

          {activeTab === 'data_sync' && <DataSyncView />}

          {activeTab === 'plan_pricing' && <PlanPricingView />}

          {activeTab === 'contact_us' && <ContactUsView />}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      {/* Create Company Modal */}
      <CreateCompanyModal
        isOpen={isCreateCompanyModalOpen}
        onClose={() => setIsCreateCompanyModalOpen(false)}
        onCreateCompany={handleCreateCompany}
      />

      {/* Change Company Modal */}
      <ChangeCompanyModal
        isOpen={isChangeCompanyModalOpen}
        onClose={() => setIsChangeCompanyModalOpen(false)}
        companies={companies}
        activeCompanyId={activeCompany.id}
        onSelectCompany={handleSelectCompany}
        onOpenCreateCompany={() => setIsCreateCompanyModalOpen(true)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onOpenSale={() => setIsSaleModalOpen(true)}
        onOpenPurchase={() => setIsPurchaseModalOpen(true)}
        onOpenPaymentIn={() => setIsPaymentInModalOpen(true)}
        onOpenPaymentOut={() => setIsPaymentOutModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenBulkPrint={() => setIsBulkPrintModalOpen(true)}
        onTogglePrivacy={() => setPrivacyMode((prev) => !prev)}
      />

      {/* Theme Selector Modal (8 requested color schemes) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        selectedThemeKey={currentThemeKey}
        onSelectTheme={(key) => setCurrentThemeKey(key)}
      />

      {/* Universal Search Modal (Ctrl+K) */}
      <UniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        invoices={invoices}
        parties={parties}
        items={items}
        expenses={expenses}
        onSelectInvoice={(inv) => {
          setSelectedInvoiceForDetail(inv);
          setIsSearchModalOpen(false);
        }}
        onSelectParty={() => {
          setActiveTab('parties');
          setIsSearchModalOpen(false);
        }}
        onSelectItem={() => {
          setActiveTab('items');
          setIsSearchModalOpen(false);
        }}
      />

      {/* Bulk Print Modal (Ctrl+P) */}
      <BulkPrintModal
        isOpen={isBulkPrintModalOpen}
        onClose={() => setIsBulkPrintModalOpen(false)}
        invoices={invoices}
        user={user}
      />

      {/* Sale Bill Quick Modal */}
      <SaleBillModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        parties={parties}
        items={items}
        fiscalYear={fiscalYear}
        onSaveInvoice={handleSaveInvoice}
        saleType={selectedSaleType}
      />

      {/* Purchase Bill Quick Modal */}
      <PurchaseBillModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        parties={parties}
        items={items}
        fiscalYear={fiscalYear}
        onSaveInvoice={handleSaveInvoice}
      />

      {/* Payment In Quick Modal */}
      <PaymentInModal
        isOpen={isPaymentInModalOpen}
        onClose={() => setIsPaymentInModalOpen(false)}
        parties={parties}
        onRecordPaymentIn={handleRecordPaymentIn}
      />

      {/* Payment Out Quick Modal */}
      <PaymentOutModal
        isOpen={isPaymentOutModalOpen}
        onClose={() => setIsPaymentOutModalOpen(false)}
        parties={parties}
        onRecordPaymentOut={handleRecordPaymentOut}
      />

      {/* Invoice Detail / Print Preview */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForDetail}
        onClose={() => setSelectedInvoiceForDetail(null)}
        user={user}
      />

      {/* Right-Side Company Profile Drawer */}
      <CompanyProfileDrawer
        isOpen={isCompanyProfileOpen}
        onClose={() => setIsCompanyProfileOpen(false)}
        company={activeCompany}
        onSaveCompany={handleSaveCompanyProfile}
      />

      {/* Right-Side Add/Edit Party Drawer (Add Buyer / Add Supplier) */}
      <PartyFormDrawer
        isOpen={isPartyDrawerOpen}
        onClose={() => {
          setIsPartyDrawerOpen(false);
          setEditingParty(null);
        }}
        partyType={partyDrawerType}
        initialParty={editingParty}
        partyGroups={partyGroups}
        onSaveParty={handleAddOrUpdateParty}
        onOpenCreateGroup={() => {
          setIsPartyDrawerOpen(false);
          setActiveTab('parties');
          setIsGroupingViewOpen(true);
        }}
      />
    </div>
  );
}
