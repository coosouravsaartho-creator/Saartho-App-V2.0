import React from 'react';
import { Award, Check, Zap, Shield, Sparkles } from 'lucide-react';

export function PlanPricingView() {
  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2 pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saartho Desktop Plans &amp; Licenses</h1>
        <p className="text-xs text-slate-500">
          Transparent business pricing with lifetime validity option, automated GST filing, and priority phone support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Basic Standard */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Single PC Desktop</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">₹2,499</span>
              <span className="text-xs text-slate-500">/ year</span>
            </div>
            <p className="text-xs text-slate-500">Essential billing for retail shops &amp; solo proprietors.</p>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited GST Invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Inventory &amp; Stock Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Financial Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 Desktop Terminal Seat</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Plan currently active!')}
            className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Current Plan
          </button>
        </div>

        {/* Pro SMB - Popular */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-5 flex flex-col justify-between relative border-2 border-blue-500">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
            Most Popular for SMBs
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Pro SMB Multi-User</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹4,999</span>
              <span className="text-xs text-slate-400">/ year</span>
            </div>
            <p className="text-xs text-slate-300">Complete multi-terminal software for distributors &amp; growing firms.</p>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>5 Multi-User Desktop Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Real-Time Cloud Synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Advanced Analytics &amp; Trend Charts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>e-Way Bill &amp; e-Invoicing Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Priority 24/7 Phone &amp; WhatsApp Support</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Upgraded to Pro SMB plan!')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 cursor-pointer transition-all"
          >
            Upgrade to Pro SMB
          </button>
        </div>

        {/* Lifetime License */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Lifetime Enterprise</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">₹14,999</span>
              <span className="text-xs text-slate-500">one-time</span>
            </div>
            <p className="text-xs text-slate-500">Pay once, use forever on your desktop with lifetime version upgrades.</p>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lifetime Software License</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited User Accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated Relationship Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom Print Template Designing</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Contacting enterprise sales team...')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-900/20 cursor-pointer"
          >
            Get Lifetime License
          </button>
        </div>
      </div>
    </div>
  );
}
