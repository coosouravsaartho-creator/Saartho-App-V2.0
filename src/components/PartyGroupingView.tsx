import React, { useState } from 'react';
import { Party, PartyGroup } from '../types';
import {
  Layers,
  Plus,
  MapPin,
  Filter,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  ArrowRightLeft,
  Users,
  ShieldCheck,
  Building2,
  X,
  ChevronRight,
  FolderPlus,
  Map,
  Hash,
  Sparkles
} from 'lucide-react';

interface PartyGroupingViewProps {
  parties: Party[];
  partyGroups: PartyGroup[];
  onAddGroup: (group: PartyGroup) => void;
  onUpdateGroup: (group: PartyGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onMovePartiesToGroup: (partyIds: string[], targetGroupId: string | null) => void;
  onOpenAddBuyer: () => void;
  onOpenAddSupplier: () => void;
}

export function PartyGroupingView({
  parties,
  partyGroups,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
  onMovePartiesToGroup,
  onOpenAddBuyer,
  onOpenAddSupplier,
}: PartyGroupingViewProps) {
  // Filters
  const [filterType, setFilterType] = useState<'All' | 'Customer' | 'Supplier'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | 'all' | 'ungrouped'>('all');

  // Party Selection for manual bulk assignment
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const [targetMoveGroupId, setTargetMoveGroupId] = useState<string>('');

  // Create/Edit Group Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PartyGroup | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'All' | 'Customer' | 'Supplier'>('All');
  const [groupBy, setGroupBy] = useState<'State' | 'District' | 'Area' | 'Pincode' | 'Custom'>('State');
  const [locationValue, setLocationValue] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupColor, setGroupColor] = useState('#2563eb');

  const openCreateGroupModal = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupType('All');
    setGroupBy('State');
    setLocationValue('');
    setGroupDesc('');
    setGroupColor('#2563eb');
    setIsGroupModalOpen(true);
  };

  const openEditGroupModal = (grp: PartyGroup) => {
    setEditingGroup(grp);
    setGroupName(grp.name);
    setGroupType(grp.groupType);
    setGroupBy(grp.groupBy);
    setLocationValue(grp.locationValue || '');
    setGroupDesc(grp.description || '');
    setGroupColor(grp.color || '#2563eb');
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    if (editingGroup) {
      onUpdateGroup({
        ...editingGroup,
        name: groupName.trim(),
        groupType,
        groupBy,
        locationValue: locationValue.trim(),
        description: groupDesc.trim(),
        color: groupColor,
      });
    } else {
      const newGrp: PartyGroup = {
        id: `grp-${Date.now()}`,
        name: groupName.trim(),
        groupType,
        groupBy,
        locationValue: locationValue.trim(),
        description: groupDesc.trim(),
        color: groupColor,
      };
      onAddGroup(newGrp);
    }
    setIsGroupModalOpen(false);
  };

  // Filter parties by Type (Buyers / Suppliers)
  const filteredByType = parties.filter((p) => {
    if (filterType === 'All') return true;
    if (filterType === 'Customer') return p.type === 'Customer' || p.type === 'Both';
    if (filterType === 'Supplier') return p.type === 'Supplier' || p.type === 'Both';
    return true;
  });

  // Filter parties by Group and Search
  const displayParties = filteredByType.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.gstin && p.gstin.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    if (selectedGroupId === 'all') return true;
    if (selectedGroupId === 'ungrouped') return !p.groupId;
    return p.groupId === selectedGroupId;
  });

  // Toggle Single Selection
  const togglePartySelect = (id: string) => {
    setSelectedPartyIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Select/Deselect All visible
  const handleSelectAllVisible = () => {
    if (selectedPartyIds.length === displayParties.length && displayParties.length > 0) {
      setSelectedPartyIds([]);
    } else {
      setSelectedPartyIds(displayParties.map((p) => p.id));
    }
  };

  // Move selected parties
  const handleExecuteMove = () => {
    if (selectedPartyIds.length === 0) return;
    const target = targetMoveGroupId === 'remove' ? null : targetMoveGroupId;
    onMovePartiesToGroup(selectedPartyIds, target);
    setSelectedPartyIds([]);
    setTargetMoveGroupId('');
  };

  const groupColors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#db2777'];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. Header & Quick Creation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Party Grouping &amp; Regional Organization
              </h1>
              <p className="text-xs text-slate-500">
                Segment Buyers and Suppliers by State, District, Area, or Pincode and manually reassign accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenAddBuyer}
            className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Buyer</span>
          </button>

          <button
            onClick={onOpenAddSupplier}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Supplier</span>
          </button>

          <button
            id="create-new-group-btn"
            onClick={openCreateGroupModal}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create Party Group</span>
          </button>
        </div>
      </div>

      {/* 2. Top Filter Bar: Filter Buyers vs Suppliers vs All */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buyer/Supplier Segment Tabs */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Filter Account Role (Buyers vs Suppliers)
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Customer', 'Supplier'] as const).map((type) => {
              const label = type === 'Customer' ? 'Buyers' : type === 'Supplier' ? 'Suppliers' : 'All Parties';
              const count = parties.filter((p) => {
                if (type === 'All') return true;
                if (type === 'Customer') return p.type === 'Customer' || p.type === 'Both';
                if (type === 'Supplier') return p.type === 'Supplier' || p.type === 'Both';
                return true;
              }).length;
              return (
                <button
                  key={type}
                  id={`filter-party-role-${type}`}
                  onClick={() => setFilterType(type)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                    filterType === type
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Groups Summary */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Party Groups</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{partyGroups.length} Groups</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
              {parties.filter((p) => p.groupId).length} Parties Assigned
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {parties.filter((p) => !p.groupId).length} accounts unassigned in general pool
          </span>
        </div>

        {/* Quick Search */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search Directory</label>
          <div className="relative mt-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by party name, phone, city, GSTIN..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: Groups Sidebar & Parties Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Group Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Location / Category Groups</span>
            </h2>
            <button
              onClick={openCreateGroupModal}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {/* View All Option */}
            <div
              onClick={() => setSelectedGroupId('all')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedGroupId === 'all'
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  ★
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">All Parties ({parties.length})</div>
                  <div className="text-[10px] text-slate-500">Full party register without filtering</div>
                </div>
              </div>
            </div>

            {/* View Ungrouped Option */}
            <div
              onClick={() => setSelectedGroupId('ungrouped')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedGroupId === 'ungrouped'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  !
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Ungrouped / Unassigned ({parties.filter((p) => !p.groupId).length})
                  </div>
                  <div className="text-[10px] text-slate-500">Parties with no assigned location group</div>
                </div>
              </div>
            </div>

            {/* Configured Groups List */}
            {partyGroups.map((grp) => {
              const partyCount = parties.filter((p) => p.groupId === grp.id).length;
              const isSelected = selectedGroupId === grp.id;
              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroupId(grp.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: grp.color || '#2563eb' }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600">
                          {grp.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold">
                            By {grp.groupBy}
                          </span>
                          <span className="truncate">{grp.locationValue || 'All Regions'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditGroupModal(grp)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Edit Group"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGroup(grp.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {grp.description && (
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                      "{grp.description}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                    <span className="font-bold text-slate-700">{partyCount} parties enrolled</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {grp.groupType === 'Customer' ? 'Buyers only' : grp.groupType === 'Supplier' ? 'Suppliers only' : 'All Roles'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Parties List & Manual Assignment Toolbar (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Action Ribbon when parties are selected */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedPartyIds.length === displayParties.length && displayParties.length > 0}
                onChange={handleSelectAllVisible}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                {selectedPartyIds.length > 0
                  ? `${selectedPartyIds.length} parties selected`
                  : `Showing ${displayParties.length} parties`}
              </span>
            </div>

            {/* Move to Group Controls */}
            <div className="flex items-center gap-2">
              <select
                id="move-target-group-select"
                value={targetMoveGroupId}
                onChange={(e) => setTargetMoveGroupId(e.target.value)}
                disabled={selectedPartyIds.length === 0}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 disabled:opacity-50 outline-none cursor-pointer"
              >
                <option value="">-- Choose Target Group to Move --</option>
                {partyGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    Move to: {g.name} ({g.groupBy})
                  </option>
                ))}
                <option value="remove">Remove from Group (Unassign)</option>
              </select>

              <button
                id="execute-move-group-btn"
                onClick={handleExecuteMove}
                disabled={selectedPartyIds.length === 0 || !targetMoveGroupId}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-40 cursor-pointer shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Move Selected</span>
              </button>
            </div>
          </div>

          {/* Party Cards / Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {displayParties.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No parties found matching criteria</p>
                <p className="text-[11px] text-slate-400">
                  Try adjusting the filter tab, search query, or selected location group.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayParties.map((party) => {
                  const isChecked = selectedPartyIds.includes(party.id);
                  const isBuyer = party.type === 'Customer';
                  const assignedGroup = partyGroups.find((g) => g.id === party.groupId);

                  return (
                    <div
                      key={party.id}
                      onClick={() => togglePartySelect(party.id)}
                      className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            togglePartySelect(party.id);
                          }}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">{party.name}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                isBuyer ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isBuyer ? 'Buyer' : 'Supplier'}
                            </span>
                            {party.gstin && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                GST: {party.gstin}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                            <span>📞 {party.phone}</span>
                            <span>📍 {party.city || 'Delhi'}</span>
                            {party.customFields && party.customFields.length > 0 && (
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                                {party.customFields[0].key}: {party.customFields[0].value}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Current Group Tag */}
                      <div className="shrink-0 text-right flex items-center gap-2">
                        {assignedGroup ? (
                          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-left">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: assignedGroup.color || '#2563eb' }}
                            />
                            <div>
                              <div className="font-bold text-[11px] text-slate-800">{assignedGroup.name}</div>
                              <div className="text-[9px] text-slate-400">
                                {assignedGroup.groupBy}: {assignedGroup.locationValue}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg italic">
                            No group
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Modal: Add / Edit Party Group */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingGroup ? 'Edit Party Group' : 'Create New Party Group'}
                  </h3>
                  <p className="text-xs text-slate-500">Group by location (State, District, Area, Pincode) or custom tag.</p>
                </div>
              </div>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4 text-xs text-slate-800">
              {/* Group Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Group Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. North Delhi Industrial Corridors / South Zone Retailers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 font-semibold text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Group For: Buyers, Suppliers, All */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Applies To (Target Type)
                  </label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="All">All Parties (Buyers &amp; Suppliers)</option>
                    <option value="Customer">Buyers / Customers Only</option>
                    <option value="Supplier">Suppliers / Vendors Only</option>
                  </select>
                </div>

                {/* Group By criteria */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Group By Criteria
                  </label>
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="State">Location - State Wise</option>
                    <option value="District">Location - District Wise</option>
                    <option value="Area">Location - Area / City Wise</option>
                    <option value="Pincode">Location - Pincode Wise</option>
                    <option value="Custom">Custom Commercial Category</option>
                  </select>
                </div>
              </div>

              {/* Location / Criteria Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Location Value / Parameter Target
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder={`e.g. ${
                      groupBy === 'State'
                        ? 'Delhi, Haryana, Uttar Pradesh'
                        : groupBy === 'Pincode'
                        ? '110020, 110019, 122015'
                        : groupBy === 'District'
                        ? 'South Delhi, Gurugram'
                        : 'Okhla Phase 3, Udyog Vihar'
                    }`}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="Optional context about this grouping..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Color Tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Group Color Indicator
                </label>
                <div className="flex items-center gap-2">
                  {groupColors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setGroupColor(col)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        groupColor === col ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
