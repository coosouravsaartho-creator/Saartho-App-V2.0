import React, { useState } from 'react';
import { Company } from '../types';
import { Building2, X, Plus, Check, MapPin, Phone, Mail, FileText, Briefcase, Globe, Shield, Sparkles } from 'lucide-react';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCompany: (company: Company) => void;
}

export function CreateCompanyModal({ isOpen, onClose, onCreateCompany }: CreateCompanyModalProps) {
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi (07)');
  const [businessType, setBusinessType] = useState<Company['businessType']>('Proprietorship');
  const [ownerName, setOwnerName] = useState('');
  const [currency, setCurrency] = useState('INR (₹)');
  const [financialYearStart, setFinancialYearStart] = useState('2026-04-01');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCompany: Company = {
      id: 'comp-' + Date.now(),
      name: name.trim(),
      tradeName: tradeName.trim() || name.trim(),
      gstin: gstin.trim().toUpperCase(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      businessType,
      ownerName: ownerName.trim(),
      currency,
      financialYearStart,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    onCreateCompany(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Company / Business</h2>
              <p className="text-xs text-slate-500">Add a new business profile to manage separate books and invoices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Legal / Business Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Global Technologies Pvt Ltd"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
            </div>

            {/* Trade Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trade / Brand Name</label>
              <input
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="e.g. Apex Tech"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Constitution</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as Company['businessType'])}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership Firm</option>
                <option value="Pvt Ltd">Private Limited (Pvt Ltd)</option>
                <option value="LLP">Limited Liability Partnership (LLP)</option>
                <option value="Retailer">Retail Trader</option>
                <option value="Wholesaler">Wholesale Distributor</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Service Provider">Service Provider</option>
              </select>
            </div>

            {/* GSTIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN <span className="text-slate-400 font-normal">(15 digits, optional)</span>
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 07AAAAA0000A1Z5"
                maxLength={15}
                className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Owner / Authorized Person */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Director Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. billing@company.in"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* State & City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State &amp; State Code</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Delhi (07)">Delhi (07)</option>
                <option value="Haryana (06)">Haryana (06)</option>
                <option value="Maharashtra (27)">Maharashtra (27)</option>
                <option value="Uttar Pradesh (09)">Uttar Pradesh (09)</option>
                <option value="Karnataka (29)">Karnataka (29)</option>
                <option value="Tamil Nadu (33)">Tamil Nadu (33)</option>
                <option value="Gujarat (24)">Gujarat (24)</option>
                <option value="West Bengal (19)">West Bengal (19)</option>
                <option value="Rajasthan (08)">Rajasthan (08)</option>
                <option value="Punjab (03)">Punjab (03)</option>
                <option value="Telangana (36)">Telangana (36)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tagline */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Slogan / Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Precision Engineering &amp; Industrial Supplies"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Business Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot No 42, Sector 18, Industrial Estate, Pin 110020"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create &amp; Switch to Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ChangeCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  activeCompanyId: string;
  onSelectCompany: (company: Company) => void;
  onOpenCreateCompany: () => void;
}

export function ChangeCompanyModal({
  isOpen,
  onClose,
  companies,
  activeCompanyId,
  onSelectCompany,
  onOpenCreateCompany,
}: ChangeCompanyModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Change Company</h2>
              <p className="text-xs text-slate-500">Switch workspace between your registered companies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company by name, GSTIN, or city..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCreateCompany();
            }}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>
        </div>

        {/* Company List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 custom-scrollbar">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No companies match your search.</div>
          ) : (
            filteredCompanies.map((comp) => {
              const isActive = comp.id === activeCompanyId;
              return (
                <div
                  key={comp.id}
                  onClick={() => {
                    onSelectCompany(comp);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {comp.name ? comp.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{comp.name}</h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                        {comp.gstin && <span className="font-mono">GST: {comp.gstin}</span>}
                        {comp.gstin && comp.city && <span>&bull;</span>}
                        {comp.city && <span>{comp.city}</span>}
                        {comp.businessType && <span>&bull; {comp.businessType}</span>}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 rounded bg-slate-100 hover:bg-blue-50 border border-slate-200 shrink-0"
                    >
                      Switch
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>{companies.length} Registered Companies</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
