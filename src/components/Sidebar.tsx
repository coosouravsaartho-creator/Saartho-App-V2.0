import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, ThemeConfig, UserAccount } from '../types';
import {
  Home,
  Users,
  Package,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Landmark,
  Settings,
  BarChart3,
  Layers,
  Database,
  RefreshCw,
  Crown,
  Headphones,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Building2,
  Edit3,
  LogOut,
  UserPlus,
  Truck,
  FolderTree
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  user: UserAccount;
  currentTheme: ThemeConfig;
  lowStockCount: number;
  unpaidSaleCount: number;
  onOpenCompanyProfile?: () => void;
  onLogout?: () => void;
  onOpenAddBuyer?: () => void;
  onOpenAddSupplier?: () => void;
  onOpenPartyGrouping?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  user,
  currentTheme,
  lowStockCount,
  unpaidSaleCount,
  onOpenCompanyProfile,
  onLogout,
  onOpenAddBuyer,
  onOpenAddSupplier,
  onOpenPartyGrouping,
}: SidebarProps) {
  const [isPartiesDropdownOpen, setIsPartiesDropdownOpen] = useState(false);

  const menuItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'home', label: 'Home (Dashboard)', icon: Home },
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'items', label: 'Items & Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { id: 'sale', label: 'Sale Bills', icon: TrendingUp, badge: unpaidSaleCount > 0 ? `${unpaidSaleCount} Due` : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'purchase', label: 'Purchase Bills', icon: ShoppingCart },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'cash_bank', label: 'Cash & Bank', icon: Landmark },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'report', label: 'Reports (GSTR & P&L)', icon: BarChart3 },
    { id: 'additional_options', label: 'Additional Options', icon: Layers },
    { id: 'backup_restore', label: 'Back up & Restore', icon: Database },
    { id: 'data_sync', label: 'Data Sync', icon: RefreshCw, badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'plan_pricing', label: 'Plan & Pricing', icon: Crown, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold' },
    { id: 'contact_us', label: 'Contact Us', icon: Headphones },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`w-64 h-full shrink-0 flex flex-col justify-between ${currentTheme.sidebarBg} select-none border-r border-slate-800/80 shadow-xl z-20 overflow-hidden`}
    >
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
        <button
          type="button"
          onClick={onOpenCompanyProfile}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all text-left group cursor-pointer"
          title="Click to Open Company Profile Drawer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-base flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              {user.businessName ? user.businessName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-xs text-white leading-tight truncate group-hover:text-blue-300">
                {user.businessName || 'Saartho Business'}
              </h1>
              <p className="text-[10px] text-slate-400 truncate">Edit Company Profile</p>
            </div>
          </div>
          <div className="p-1 rounded bg-slate-800 text-slate-400 group-hover:text-white shrink-0">
            <Edit3 className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 custom-scrollbar">
        <div className="px-3 mb-1.5 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
          Main Menu
        </div>
        {menuItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Special Parties Menu Item with Dropdown on click
          if (item.id === 'parties') {
            return (
              <div key={item.id} className="relative" ref={partiesDropdownRef}>
                <div className="flex items-center">
                  <button
                    id="nav-tab-parties"
                    onClick={() => {
                      onSelectTab('parties');
                      setIsPartiesDropdownOpen((prev) => !prev);
                    }}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPartiesDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>
                </div>

                  {/* Dropdown Menu when Parties is clicked */}
                {isPartiesDropdownOpen && (
                  <div className="mt-1 mb-2 ml-4 pl-2 border-l-2 border-blue-500/40 bg-slate-900/90 rounded-r-xl p-1.5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
                    {/* Option 1: Add Buyer */}
                    <button
                      id="sidebar-parties-add-buyer"
                      onClick={() => {
                        onSelectTab('parties');
                        if (onOpenAddBuyer) onOpenAddBuyer();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-300 hover:text-white hover:bg-blue-600/30 transition-colors text-left cursor-pointer group"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>1. Add Buyer</span>
                    </button>

                    {/* Option 2: Add Supplier */}
                    <button
                      id="sidebar-parties-add-supplier"
                      onClick={() => {
                        onSelectTab('parties');
                        if (onOpenAddSupplier) onOpenAddSupplier();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-colors text-left cursor-pointer group"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>2. Add Supplier</span>
                    </button>

                    {/* Option 3: Party Grouping */}
                    <button
                      id="sidebar-parties-grouping"
                      onClick={() => {
                        if (onOpenPartyGrouping) onOpenPartyGrouping();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 hover:text-white hover:bg-amber-600/30 transition-colors text-left cursor-pointer group"
                    >
                      <FolderTree className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>3. Party Grouping</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                setIsPartiesDropdownOpen(false);
                onSelectTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-3 mt-4 mb-1.5 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
          System &amp; Tools
        </div>
        {menuItems.slice(7).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                setIsPartiesDropdownOpen(false);
                onSelectTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Sync and Version Footer */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400">v4.2.0 Desktop Pro</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">SMB Build</span>
      </div>
    </aside>
  );
}
