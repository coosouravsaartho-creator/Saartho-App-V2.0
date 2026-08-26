import React, { useState } from 'react';
import { TaxConfiguration, UserAccount } from '../types';
import { Settings, CheckCircle2, ShieldCheck, FileSpreadsheet, Building2, Sliders } from 'lucide-react';

interface SettingsViewProps {
  taxConfig: TaxConfiguration;
  onUpdateTaxConfig: (config: TaxConfiguration) => void;
  user: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
}

export function SettingsView({ taxConfig, onUpdateTaxConfig, user, onUpdateUser }: SettingsViewProps) {
  const [config, setConfig] = useState<TaxConfiguration>(taxConfig);
  const [userProfile, setUserProfile] = useState<UserAccount>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTaxConfig(config);
    onUpdateUser(userProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleSlab = (slab: number) => {
    if (config.enabledSlabs.includes(slab)) {
      setConfig({ ...config, enabledSlabs: config.enabledSlabs.filter((s) => s !== slab) });
    } else {
      setConfig({ ...config, enabledSlabs: [...config.enabledSlabs, slab].sort((a, b) => a - b) });
    }
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Software Settings &amp; Tax Configurations</h1>
          <p className="text-xs text-slate-500">Configure customizable GST slabs, invoice numbering series, and company profile.</p>
        </div>
        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Customizable Tax Configurations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">GST &amp; Tax Rate Configurations</h2>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Active GST Slabs for Fast Billing
            </label>
            <div className="flex flex-wrap gap-3">
              {[0, 5, 12, 18, 28].map((slab) => {
                const isEnabled = config.enabledSlabs.includes(slab);
                return (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => toggleSlab(slab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {slab}% GST Slab {isEnabled ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">Auto Round-off Invoices</span>
                <p className="text-[11px] text-slate-500">Automatically rounds decimals to nearest rupee</p>
              </div>
              <input
                type="checkbox"
                checked={config.enableAutoRoundOff}
                onChange={(e) => setConfig({ ...config, enableAutoRoundOff: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">Composition Scheme Mode</span>
                <p className="text-[11px] text-slate-500">For turnover below threshold (1% flat tax)</p>
              </div>
              <input
                type="checkbox"
                checked={config.enableCompositionScheme}
                onChange={(e) => setConfig({ ...config, enableCompositionScheme: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">e-Invoice Portal Integration</span>
                <p className="text-[11px] text-slate-500">Generates IRN and signed QR code</p>
              </div>
              <input
                type="checkbox"
                checked={config.enableEInvoice}
                onChange={(e) => setConfig({ ...config, enableEInvoice: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800">e-Way Bill Generation</span>
                <p className="text-[11px] text-slate-500">For goods shipments exceeding ₹50,000</p>
              </div>
              <input
                type="checkbox"
                checked={config.enableEWayBill}
                onChange={(e) => setConfig({ ...config, enableEWayBill: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* 2. Business Profile Settings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Company &amp; Invoice Header Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Business Name</label>
              <input
                type="text"
                value={userProfile.businessName}
                onChange={(e) => setUserProfile({ ...userProfile, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={userProfile.gstin || ''}
                onChange={(e) => setUserProfile({ ...userProfile, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Phone Number</label>
              <input
                type="text"
                value={userProfile.phoneNumber || ''}
                onChange={(e) => setUserProfile({ ...userProfile, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Email ID</label>
              <input
                type="email"
                value={userProfile.email || ''}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Registered Address (Printed on Invoices)</label>
              <input
                type="text"
                value={userProfile.address || ''}
                onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-900/20 cursor-pointer"
          >
            Save All Configurations
          </button>
        </div>
      </form>
    </div>
  );
}
