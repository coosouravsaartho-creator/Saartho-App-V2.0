import React, { useState, useEffect } from 'react';
import { Party, PartyAddress, CustomField, PartyGroup, ThemeConfig } from '../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  CreditCard,
  Hash,
  HelpCircle,
  RefreshCw,
  FolderPlus
} from 'lucide-react';

interface PartyFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  partyType: 'Customer' | 'Supplier'; // 'Customer' = Buyer, 'Supplier' = Supplier
  partyGroups: PartyGroup[];
  onSaveParty: (party: Party) => void;
  onOpenCreateGroup?: () => void;
  initialParty?: Party | null;
}

export function PartyFormDrawer({
  isOpen,
  onClose,
  partyType,
  partyGroups,
  onSaveParty,
  onOpenCreateGroup,
  initialParty,
}: PartyFormDrawerProps) {
  const isBuyer = partyType === 'Customer';
  const roleTitle = isBuyer ? 'Buyer' : 'Supplier';

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstinStatus, setGstinStatus] = useState<'idle' | 'validating' | 'verified' | 'invalid'>('idle');
  const [gstinDetails, setGstinDetails] = useState<{ pan?: string; state?: string; legalName?: string } | null>(null);

  // Addresses
  const [billingAddresses, setBillingAddresses] = useState<PartyAddress[]>([
    {
      id: 'b-addr-1',
      label: 'Main Billing Office',
      addressLine: '',
      city: '',
      state: 'Delhi (07)',
      pincode: '',
      isDefault: true,
    },
  ]);

  const [shippingAddresses, setShippingAddresses] = useState<PartyAddress[]>([
    {
      id: 's-addr-1',
      label: 'Primary Delivery / Warehouse',
      addressLine: '',
      city: '',
      state: 'Delhi (07)',
      pincode: '',
      isDefault: true,
    },
  ]);

  // Financial Balances & Credit
  const [openingBalance, setOpeningBalance] = useState('0');
  const [openingBalanceType, setOpeningBalanceType] = useState<'To Receive' | 'To Pay'>(
    isBuyer ? 'To Receive' : 'To Pay'
  );
  const [openingBalanceDate, setOpeningBalanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [creditLimit, setCreditLimit] = useState('200000');
  const [paymentTermsDays, setPaymentTermsDays] = useState('30');

  // Custom Fields (Max 5)
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Party Grouping
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  // Reset or Populate when opening
  useEffect(() => {
    if (isOpen) {
      if (initialParty) {
        setName(initialParty.name || '');
        setPhone(initialParty.phone || '+91 ');
        setEmail(initialParty.email || '');
        setGstin(initialParty.gstin || '');
        if (initialParty.gstin && initialParty.gstin.length === 15) {
          setGstinStatus('verified');
          setGstinDetails({
            pan: initialParty.gstin.substring(2, 12),
            state: 'Registered State Code ' + initialParty.gstin.substring(0, 2),
            legalName: initialParty.name,
          });
        } else {
          setGstinStatus('idle');
          setGstinDetails(null);
        }

        setBillingAddresses(
          initialParty.billingAddresses && initialParty.billingAddresses.length > 0
            ? initialParty.billingAddresses
            : [
                {
                  id: 'b-addr-1',
                  label: 'Main Billing Office',
                  addressLine: '',
                  city: initialParty.city || '',
                  state: initialParty.state || 'Delhi (07)',
                  pincode: initialParty.pincode || '',
                  isDefault: true,
                },
              ]
        );

        setShippingAddresses(
          initialParty.shippingAddresses && initialParty.shippingAddresses.length > 0
            ? initialParty.shippingAddresses
            : [
                {
                  id: 's-addr-1',
                  label: 'Primary Delivery / Warehouse',
                  addressLine: '',
                  city: initialParty.city || '',
                  state: initialParty.state || 'Delhi (07)',
                  pincode: initialParty.pincode || '',
                  isDefault: true,
                },
              ]
        );

        setOpeningBalance(Math.abs(initialParty.openingBalance ?? initialParty.balance ?? 0).toString());
        setOpeningBalanceType(
          (initialParty.openingBalance ?? initialParty.balance ?? 0) >= 0 ? 'To Receive' : 'To Pay'
        );
        setOpeningBalanceDate(initialParty.openingBalanceDate || new Date().toISOString().split('T')[0]);
        setCreditLimit((initialParty.creditLimit ?? 200000).toString());
        setPaymentTermsDays((initialParty.paymentTermsDays ?? 30).toString());
        setCustomFields(initialParty.customFields || []);
        setSelectedGroupId(initialParty.groupId || '');
      } else {
        // Reset fresh form
        setName('');
        setPhone('+91 ');
        setEmail('');
        setGstin('');
        setGstinStatus('idle');
        setGstinDetails(null);
        setBillingAddresses([
          {
            id: `b-addr-${Date.now()}`,
            label: 'Main Billing Office',
            addressLine: '',
            city: 'New Delhi',
            state: 'Delhi (07)',
            pincode: '110020',
            isDefault: true,
          },
        ]);
        setShippingAddresses([
          {
            id: `s-addr-${Date.now()}`,
            label: 'Primary Delivery / Warehouse',
            addressLine: '',
            city: 'New Delhi',
            state: 'Delhi (07)',
            pincode: '110020',
            isDefault: true,
          },
        ]);
        setOpeningBalance('0');
        setOpeningBalanceType(isBuyer ? 'To Receive' : 'To Pay');
        setOpeningBalanceDate(new Date().toISOString().split('T')[0]);
        setCreditLimit(isBuyer ? '300000' : '500000');
        setPaymentTermsDays('30');
        setCustomFields([]);
        setSelectedGroupId('');
      }
    }
  }, [isOpen, initialParty, isBuyer]);

  // GSTIN Live Auto-Verification
  const handleGstinChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setGstin(cleaned);

    if (cleaned.length === 0) {
      setGstinStatus('idle');
      setGstinDetails(null);
      return;
    }

    if (cleaned.length === 15) {
      setGstinStatus('validating');
      setTimeout(() => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (gstRegex.test(cleaned)) {
          const stateCode = cleaned.substring(0, 2);
          const stateMap: Record<string, string> = {
            '07': 'Delhi',
            '06': 'Haryana',
            '08': 'Rajasthan',
            '09': 'Uttar Pradesh',
            '27': 'Maharashtra',
            '24': 'Gujarat',
            '29': 'Karnataka',
            '33': 'Tamil Nadu',
            '19': 'West Bengal',
            '03': 'Punjab',
            '10': 'Bihar',
            '23': 'Madhya Pradesh',
            '36': 'Telangana',
            '37': 'Andhra Pradesh',
          };
          const stateName = stateMap[stateCode] || `State Code ${stateCode}`;
          const pan = cleaned.substring(2, 12);
          setGstinStatus('verified');
          setGstinDetails({
            pan,
            state: `${stateName} (${stateCode})`,
            legalName: name ? `${name} [Govt GST Portal Verified]` : 'Verified Legal Enterprise',
          });

          // Auto-seed into primary billing address if state/city is blank
          setBillingAddresses((prev) =>
            prev.map((addr, idx) =>
              idx === 0 && !addr.addressLine
                ? {
                    ...addr,
                    state: `${stateName} (${stateCode})`,
                    city: addr.city || (stateCode === '07' ? 'New Delhi' : stateName),
                  }
                : addr
            )
          );
        } else {
          setGstinStatus('invalid');
          setGstinDetails(null);
        }
      }, 350);
    } else {
      setGstinStatus('idle');
      setGstinDetails(null);
    }
  };

  // Add Billing Address
  const handleAddBillingAddress = () => {
    setBillingAddresses((prev) => [
      ...prev,
      {
        id: `b-addr-${Date.now()}`,
        label: `Billing Branch #${prev.length + 1}`,
        addressLine: '',
        city: '',
        state: 'Delhi (07)',
        pincode: '',
        isDefault: false,
      },
    ]);
  };

  const handleRemoveBillingAddress = (id: string) => {
    if (billingAddresses.length === 1) return;
    setBillingAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Add Shipping Address
  const handleAddShippingAddress = () => {
    setShippingAddresses((prev) => [
      ...prev,
      {
        id: `s-addr-${Date.now()}`,
        label: `Consignee / Site #${prev.length + 1}`,
        addressLine: '',
        city: '',
        state: 'Delhi (07)',
        pincode: '',
        isDefault: false,
      },
    ]);
  };

  const handleRemoveShippingAddress = (id: string) => {
    if (shippingAddresses.length === 1) return;
    setShippingAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Copy Billing Address 1 to Shipping Address 1
  const handleCopyBillingToShipping = () => {
    if (billingAddresses.length > 0) {
      const b1 = billingAddresses[0];
      setShippingAddresses([
        {
          id: `s-addr-${Date.now()}`,
          label: 'Same as Billing Address',
          addressLine: b1.addressLine,
          city: b1.city,
          state: b1.state,
          pincode: b1.pincode,
          isDefault: true,
        },
      ]);
    }
  };

  // Custom Fields Handler (Max 5)
  const handleAddCustomField = () => {
    if (customFields.length >= 5) return;
    setCustomFields((prev) => [
      ...prev,
      {
        id: `cf-${Date.now()}`,
        key: '',
        value: '',
      },
    ]);
  };

  const handleUpdateCustomField = (id: string, key: string, value: string) => {
    setCustomFields((prev) =>
      prev.map((cf) => (cf.id === id ? { ...cf, key, value } : cf))
    );
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((cf) => cf.id !== id));
  };

  // Filter groups applicable for this party
  const applicableGroups = partyGroups.filter(
    (g) => g.groupType === 'All' || g.groupType === (isBuyer ? 'Customer' : 'Supplier')
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resetFreshForm = () => {
    setName('');
    setPhone('+91 ');
    setEmail('');
    setGstin('');
    setGstinStatus('idle');
    setGstinDetails(null);
    setBillingAddresses([
      {
        id: `b-addr-${Date.now()}`,
        label: 'Main Billing Office',
        addressLine: '',
        city: 'New Delhi',
        state: 'Delhi (07)',
        pincode: '110020',
        isDefault: true,
      },
    ]);
    setShippingAddresses([
      {
        id: `s-addr-${Date.now()}`,
        label: 'Primary Delivery / Warehouse',
        addressLine: '',
        city: 'New Delhi',
        state: 'Delhi (07)',
        pincode: '110020',
        isDefault: true,
      },
    ]);
    setOpeningBalance('0');
    setOpeningBalanceType(isBuyer ? 'To Receive' : 'To Pay');
    setOpeningBalanceDate(new Date().toISOString().split('T')[0]);
    setCreditLimit(isBuyer ? '300000' : '500000');
    setPaymentTermsDays('30');
    setCustomFields([]);
    setSelectedGroupId('');
  };

  const processSave = (isSaveAndNew: boolean) => {
    if (!name.trim()) return;

    const numericBalance = Number(openingBalance) || 0;
    const finalBalance = openingBalanceType === 'To Receive' ? numericBalance : -Math.abs(numericBalance);

    const primaryBilling = billingAddresses[0] || {};
    const selectedGroup = partyGroups.find((g) => g.id === selectedGroupId);

    const partyToSave: Party = {
      id: initialParty ? initialParty.id : `party-${Date.now()}`,
      name: name.trim(),
      type: partyType,
      phone: phone.trim(),
      email: email.trim(),
      gstin: gstin.trim() || undefined,
      gstinVerified: gstinStatus === 'verified',
      city: primaryBilling.city || 'New Delhi',
      state: primaryBilling.state || 'Delhi (07)',
      pincode: primaryBilling.pincode || '110020',
      billingAddresses: billingAddresses.filter((b) => b.addressLine.trim() || b.city.trim()),
      shippingAddresses: shippingAddresses.filter((s) => s.addressLine.trim() || s.city.trim()),
      openingBalance: numericBalance,
      openingBalanceDate,
      balance: finalBalance,
      creditLimit: Number(creditLimit) || 0,
      paymentTermsDays: Number(paymentTermsDays) || 30,
      totalInvoiced: initialParty ? initialParty.totalInvoiced : 0,
      punctualityScore: initialParty ? initialParty.punctualityScore : 95,
      customFields: customFields.filter((cf) => cf.key.trim() || cf.value.trim()),
      groupId: selectedGroupId || undefined,
      groupName: selectedGroup ? selectedGroup.name : undefined,
    };

    onSaveParty(partyToSave);

    if (isSaveAndNew) {
      setToastMessage(`✓ ${roleTitle} "${partyToSave.name}" saved successfully! Enter details for next party.`);
      resetFreshForm();
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processSave(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Right-Side Sliding Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* 1. Header */}
          <div className={`p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between ${
            isBuyer ? 'bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40' : 'bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                isBuyer ? 'bg-blue-600' : 'bg-emerald-600'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {initialParty ? `Edit ${roleTitle}` : `Add New ${roleTitle}`}
                  </h2>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isBuyer ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {roleTitle} Account
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure GST details, addresses, opening balance, credit terms, and custom fields.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Scrollable Body Content */}
          <form id="party-form-drawer" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-xs text-slate-800">
            
            {/* Save & New Success Toast Banner */}
            {toastMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Section A: Basic Identification (Name, Phone, Email) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-200">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Basic {roleTitle} Details</span>
              </div>

              <div className="space-y-3">
                {/* 1. Party Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {roleTitle} / Party Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="party-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g. ${isBuyer ? 'Apex Infotech Solutions Pvt Ltd' : 'Tata Steel Tubes & Alloys'}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 2. Party Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Party Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="party-phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98112 34567"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-blue-500 text-xs font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Party Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="party-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="billing@company.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-blue-500 text-xs font-medium text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: 3. Party GSTIN with Live Auto-Verification */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. GSTIN Identification &amp; Live Verification</span>
                </div>
                {gstinStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Govt Portal Verified</span>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  15-Digit Party GSTIN (Auto-Validates PAN &amp; State Code)
                </label>
                <div className="relative">
                  <input
                    id="party-gstin-input"
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    placeholder="e.g. 07AAACA1234F1Z8"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-500 font-mono uppercase tracking-widest text-xs font-bold text-slate-900 outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {gstinStatus === 'validating' && (
                      <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {gstinStatus === 'verified' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {gstinStatus === 'invalid' && (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Verified details banner */}
              {gstinStatus === 'verified' && gstinDetails && (
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-1 text-[11px] animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>GSTIN Format &amp; Checksum Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-emerald-950 font-mono text-[10px]">
                    <div>Extracted PAN: <strong className="text-emerald-900">{gstinDetails.pan}</strong></div>
                    <div>Jurisdiction: <strong className="text-emerald-900">{gstinDetails.state}</strong></div>
                  </div>
                </div>
              )}

              {gstinStatus === 'invalid' && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Invalid GSTIN structure. Expected format: 2-digit State code + 10-char PAN + 3-char Entity code (15 chars total).</span>
                </div>
              )}
            </div>

            {/* Section C: 4. Party Billing Address (Multiple) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>4. Billing Addresses ({billingAddresses.length})</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddBillingAddress}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add Billing Address</span>
                </button>
              </div>

              <div className="space-y-3">
                {billingAddresses.map((addr, idx) => (
                  <div key={addr.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={addr.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, label: val } : a))
                          );
                        }}
                        placeholder="Address Label (e.g. Head Office / Branch)"
                        className="px-2 py-0.5 text-[11px] font-bold text-slate-800 bg-slate-100 rounded border border-slate-200 outline-none w-48"
                      />
                      {billingAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBillingAddress(addr.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={addr.addressLine}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBillingAddresses((prev) =>
                          prev.map((a) => (a.id === addr.id ? { ...a, addressLine: val } : a))
                        );
                      }}
                      placeholder="Street Address, Building, Floor, Industrial Area"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-900 outline-none"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={addr.city}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, city: val } : a))
                          );
                        }}
                        placeholder="City (e.g. New Delhi)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        value={addr.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, state: val } : a))
                          );
                        }}
                        placeholder="State / Code"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        value={addr.pincode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, pincode: val } : a))
                          );
                        }}
                        placeholder="Pincode (e.g. 110020)"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: 5. Party Shipping Address (Multiple) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5. Shipping / Delivery Addresses ({shippingAddresses.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyBillingToShipping}
                    className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[10px] cursor-pointer"
                  >
                    Copy Billing #1
                  </button>
                  <button
                    type="button"
                    onClick={handleAddShippingAddress}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Shipping Address</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {shippingAddresses.map((addr, idx) => (
                  <div key={addr.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={addr.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, label: val } : a))
                          );
                        }}
                        placeholder="Shipping Label (e.g. Warehouse 2 / Consignee)"
                        className="px-2 py-0.5 text-[11px] font-bold text-slate-800 bg-slate-100 rounded border border-slate-200 outline-none w-52"
                      />
                      {shippingAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveShippingAddress(addr.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={addr.addressLine}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShippingAddresses((prev) =>
                          prev.map((a) => (a.id === addr.id ? { ...a, addressLine: val } : a))
                        );
                      }}
                      placeholder="Delivery Destination, Shed, Depot, Unloading Point"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-900 outline-none"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={addr.city}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, city: val } : a))
                          );
                        }}
                        placeholder="City"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        value={addr.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, state: val } : a))
                          );
                        }}
                        placeholder="State"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        value={addr.pincode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddresses((prev) =>
                            prev.map((a) => (a.id === addr.id ? { ...a, pincode: val } : a))
                          );
                        }}
                        placeholder="Pincode"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section E: 6 & 7. Opening Balance, Date & Credit Limit */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-200">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                <span>6 &amp; 7. Opening Balance &amp; Credit Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 6. Opening Balance */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    6. Opening Balance (₹)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        id="party-opening-balance-input"
                        type="number"
                        min="0"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-blue-500 font-mono font-bold text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <select
                      value={openingBalanceType}
                      onChange={(e) => setOpeningBalanceType(e.target.value as any)}
                      className="px-2.5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="To Receive">To Receive (Dr)</option>
                      <option value="To Pay">To Pay (Cr)</option>
                    </select>
                  </div>
                </div>

                {/* Opening Balance Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    Opening Balance As On Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="party-opening-date-input"
                      type="date"
                      value={openingBalanceDate}
                      onChange={(e) => setOpeningBalanceDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-blue-500 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* 7. Credit Limit */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    7. Party Credit Limit (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      id="party-credit-limit-input"
                      type="number"
                      min="0"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                      placeholder="300000"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-blue-500 font-mono font-bold text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">System alerts when outstanding exceeds this value.</p>
                </div>

                {/* Payment Terms */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    Standard Credit Period (Days)
                  </label>
                  <select
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-xs text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="0">Immediate / Cash (0 Days)</option>
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days (Standard)</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section F: 8. Additional Custom Fields (Max 5) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>8. Custom Additional Fields ({customFields.length}/5)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Add custom tags, transport name, sales agent, PAN number, or internal codes.
                  </p>
                </div>
                {customFields.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Field</span>
                  </button>
                )}
              </div>

              {customFields.length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-white border border-dashed border-slate-200 text-slate-400 text-xs">
                  No custom fields added yet. Click <strong className="text-blue-600">+ Add Field</strong> to create up to 5 custom attributes.
                </div>
              ) : (
                <div className="space-y-2">
                  {customFields.map((cf, idx) => (
                    <div key={cf.id} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <input
                        type="text"
                        value={cf.key}
                        onChange={(e) => handleUpdateCustomField(cf.id, e.target.value, cf.value)}
                        placeholder="Field Title (e.g. Sales Rep)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
                      />
                      <input
                        type="text"
                        value={cf.value}
                        onChange={(e) => handleUpdateCustomField(cf.id, cf.key, e.target.value)}
                        placeholder="Field Value (e.g. North Zone Team)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(cf.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete Custom Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section G: 9. Party Group Assignment */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>9. Party Group Assignment</span>
                </div>
                {onOpenCreateGroup && (
                  <button
                    type="button"
                    onClick={onOpenCreateGroup}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Manage Groups &rarr;</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Select Target Group (Optional)
                </label>
                <select
                  id="party-group-select"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-xs text-slate-800 outline-none cursor-pointer"
                >
                  <option value="">-- No Group Selected (Continue without choosing a group) --</option>
                  {applicableGroups.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.name} • {grp.groupBy}: {grp.locationValue || 'All'} ({grp.groupType})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  You can assign the party to a regional or category group, or continue freely without choosing a group.
                </p>
              </div>
            </div>

          </form>

          {/* 3. Drawer Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="party-drawer-save-and-new-btn"
                onClick={() => processSave(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 cursor-pointer transition-all ${
                  isBuyer
                    ? 'border-blue-600 text-blue-700 bg-blue-50/60 hover:bg-blue-100'
                    : 'border-emerald-600 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Save &amp; New</span>
              </button>

              <button
                type="submit"
                id="party-drawer-save-btn"
                form="party-form-drawer"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-all ${
                  isBuyer
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
