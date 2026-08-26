import React, { useState } from 'react';
import { RefreshCw, Cloud, Users, ShieldCheck, CheckCircle2, Laptop } from 'lucide-react';

export function DataSyncView() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Just now (Real-time)');

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync('Just now (All devices synchronized)');
    }, 1500);
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cloud Synchronization &amp; Multi-User</h1>
          <p className="text-xs text-slate-500">Multi-device sync status, user role permissions, and active desktop nodes.</p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing with Cloud...' : 'Sync Cloud Now'}</span>
        </button>
      </div>

      {/* Cloud Status */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Cloud className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-base font-bold">Saartho Cloud Sync: Online</h3>
            </div>
            <p className="text-xs text-slate-300">Continuous end-to-end encrypted delta synchronization active.</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-slate-400">Last Synced:</span>
          <p className="font-bold text-emerald-300">{lastSync}</p>
        </div>
      </div>

      {/* Multi-User Role Management */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Multi-User Seats &amp; Roles</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            3 of 5 Seats Active
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                RS
              </div>
              <div>
                <span className="font-bold text-slate-900">Rajesh Sharma (You)</span>
                <p className="text-[11px] text-slate-500">Device: Main Desktop Terminal (Delhi Office)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
              SUPER ADMIN
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                AK
              </div>
              <div>
                <span className="font-bold text-slate-900">Amit Kumar</span>
                <p className="text-[11px] text-slate-500">Device: Counter POS Desktop 2 &bull; View Invoices &amp; Create Bills only</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              BILLER / CASHIER
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                CA
              </div>
              <div>
                <span className="font-bold text-slate-900">Pooja Verma (CA Associates)</span>
                <p className="text-[11px] text-slate-500">Device: Remote CA Portal &bull; GSTR Reports &amp; Ledger Audit</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
              ACCOUNTANT / AUDITOR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
