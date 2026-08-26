import React, { useState } from 'react';
import { Party, PartyGroup, ThemeConfig } from '../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  X,
  UserPlus,
  Truck,
  FolderTree,
  Edit2,
  ShieldCheck,
  ChevronDown,
  Layers
} from 'lucide-react';

interface PartiesViewProps {
  parties: Party[];
  partyGroups: PartyGroup[];
  onOpenAddBuyer: () => void;
  onOpenAddSupplier: () => void;
  onOpenPartyGrouping: () => void;
  onEditParty: (party: Party) => void;
  onOpenPaymentIn: () => void;
  onOpenPaymentOut: () => void;
  currentTheme?: ThemeConfig;
}

export function PartiesView({
  parties,
  partyGroups,
  onOpenAddBuyer,
  onOpenAddSupplier,
  onOpenPartyGrouping,
  onEditParty,
  onOpenPaymentIn,
  onOpenPaymentOut,
  currentTheme,
}: PartiesViewProps) {
  const [filterType, setFilterType] = useState<'All' | 'Customer' | 'Supplier'>('All');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const filteredParties = parties.filter((p) => {
    const matchType =
      filterType === 'All' || p.type === filterType || p.type === 'Both';
    const matchGroup =
      selectedGroupFilter === 'All'
        ? true
        : selectedGroupFilter === 'ungrouped'
        ? !p.groupId
        : p.groupId === selectedGroupFilter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.city && p.city.toLowerCase().includes(search.toLowerCase())) ||
      (p.gstin && p.gstin.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchGroup && matchSearch;
  });

  const totalReceivables = parties
    .filter((p) => (p.balance ?? 0) > 0)
    .reduce((sum, p) => sum + (p.balance ?? 0), 0);
  const totalPayables = parties
    .filter((p) => (p.balance ?? 0) < 0)
    .reduce((sum, p) => sum + Math.abs(p.balance ?? 0), 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. Header with Actions & Party Grouping access */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Parties &amp; Ledger Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Manage buyers, suppliers, verified GSTINs, multiple billing/shipping addresses, and location groups.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Party Grouping Quick Button */}
          <button
            id="parties-top-party-grouping-btn"
            onClick={onOpenPartyGrouping}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Party Grouping</span>
          </button>

          {/* Add Supplier Button */}
          <button
            id="parties-top-add-supplier-btn"
            onClick={onOpenAddSupplier}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. + Add Supplier</span>
          </button>

          {/* Add Buyer Button */}
          <button
            id="parties-top-add-buyer-btn"
            onClick={onOpenAddBuyer}
            className="px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            style={{ backgroundColor: currentTheme?.primaryColor || '#2563eb' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>1. + Add Buyer</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Accounts</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {partyGroups.length} Groups
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{parties.length} Total</div>
          <span className="text-[11px] text-slate-400">
            {parties.filter((p) => p.type === 'Customer').length} Buyers &bull;{' '}
            {parties.filter((p) => p.type === 'Supplier').length} Suppliers
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Total Receivables (To Collect)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ₹{(totalReceivables ?? 0).toLocaleString('en-IN')}
          </div>
          <button
            onClick={onOpenPaymentIn}
            className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1 mt-1"
          >
            <span>Record Inward Payment (Receipt)</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Total Payables (To Pay)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            ₹{(totalPayables ?? 0).toLocaleString('en-IN')}
          </div>
          <button
            onClick={onOpenPaymentOut}
            className="text-[11px] font-bold text-rose-800 hover:underline cursor-pointer flex items-center gap-1 mt-1"
          >
            <span>Record Outward Payment (Voucher)</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* 3. Table & Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left filters: Type tabs & Group filter dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Buyer/Supplier tab */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(['All', 'Customer', 'Supplier'] as const).map((t) => (
                <button
                  key={t}
                  id={`parties-filter-${t}`}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterType === t
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'All' ? 'All Roles' : t === 'Customer' ? 'Buyers (Customers)' : 'Suppliers'}
                </button>
              ))}
            </div>

            {/* Location / Group Filter */}
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Location Groups</option>
              <option value="ungrouped">Ungrouped / General Pool</option>
              {partyGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.groupBy}: {g.locationValue})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by party name, city, phone, GSTIN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Party / Business Name</th>
                <th className="py-3 px-3.5">Role</th>
                <th className="py-3 px-3.5">Phone &amp; Email</th>
                <th className="py-3 px-3.5">GSTIN &amp; Verification</th>
                <th className="py-3 px-3.5">Assigned Group</th>
                <th className="py-3 px-3.5">Addresses</th>
                <th className="py-3 px-3.5 text-right">Ledger Balance</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No parties found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredParties.map((p) => {
                  const assignedGroup = partyGroups.find((g) => g.id === p.groupId);
                  const isBuyer = p.type === 'Customer';
                  const billingCount = p.billingAddresses?.length || 1;
                  const shippingCount = p.shippingAddresses?.length || 1;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>📍 {p.city || 'Delhi'}</span>
                          {p.customFields && p.customFields.length > 0 && (
                            <span className="text-blue-600 bg-blue-50 px-1 rounded font-semibold">
                              {p.customFields[0].key}: {p.customFields[0].value}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isBuyer
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isBuyer ? 'Buyer' : 'Supplier'}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600">
                        <div className="font-semibold text-slate-800">{p.phone}</div>
                        <div className="text-[10px] text-slate-400">{p.email || '—'}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        {p.gstin ? (
                          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800 font-semibold">
                            <span>{p.gstin}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="GSTIN Verified" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unregistered</span>
                        )}
                      </td>

                      <td className="py-3 px-3.5">
                        {assignedGroup ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border"
                            style={{
                              backgroundColor: `${assignedGroup.color}15`,
                              borderColor: `${assignedGroup.color}40`,
                              color: assignedGroup.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: assignedGroup.color }}
                            />
                            <span>{assignedGroup.name}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Ungrouped</span>
                        )}
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 text-[11px]">
                        <div>🏢 {billingCount} Billing</div>
                        <div className="text-[10px] text-slate-400">🚚 {shippingCount} Shipping</div>
                      </td>

                      <td
                        className={`py-3 px-3.5 text-right font-bold ${
                          (p.balance ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        <div>₹{Math.abs(p.balance ?? 0).toLocaleString('en-IN')}</div>
                        <span className="text-[9px] font-normal text-slate-500">
                          {(p.balance ?? 0) >= 0 ? 'To Receive (Dr)' : 'To Pay (Cr)'}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => onEditParty(p)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 mx-auto cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
