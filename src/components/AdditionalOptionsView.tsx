import React, { useState } from 'react';
import { Layers, QrCode, Truck, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export function AdditionalOptionsView() {
  const [activeTab, setActiveTab] = useState<'challan' | 'barcode' | 'audit'>('challan');

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Additional Business Tools &amp; Options</h1>
          <p className="text-xs text-slate-500">Delivery Challans, SKU Barcode label generators, and detailed audit log trails.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('challan')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'challan' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Delivery Challans
        </button>
        <button
          onClick={() => setActiveTab('barcode')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'barcode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Barcode &amp; QR Label Generator
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Audit Trail Log
        </button>
      </div>

      {activeTab === 'challan' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Goods Outward Delivery Challans</h3>
              <p className="text-xs text-slate-500">Dispatch materials without immediate tax invoices for job-work or approval.</p>
            </div>
            <button
              onClick={() => alert('New Delivery Challan generated: DC-2026-003')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              + Create Challan
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-slate-900">DC-2026-001</span> &bull; To Apex Infotech Solutions
                <p className="text-[11px] text-slate-500">Driver: Rakesh Kumar (Vehicle: DL-1AB-4491) &bull; Status: Delivered</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                Delivered
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-slate-900">DC-2026-002</span> &bull; To Vanguard Industrial Ltd
                <p className="text-[11px] text-slate-500">Driver: Suresh Singh (Vehicle: HR-26-8802) &bull; Status: In Transit</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px]">
                In Transit
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'barcode' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900">Print Product Barcode Labels</h3>
            <p className="text-xs text-slate-500">Generate thermal sticky tags (Code 128 / EAN 13 / QR Code) for retail stock scanning.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold text-slate-900">DRL-850 (Drill 850W)</span>
              <div className="bg-slate-100 p-3 rounded font-mono text-lg tracking-widest font-black">
                ||| | |||| || |||
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
              >
                Print 50 Stickers
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold text-slate-900">CAB-CU4C6 (Copper Cable)</span>
              <div className="bg-slate-100 p-3 rounded font-mono text-lg tracking-widest font-black">
                || ||| | ||| || ||
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
              >
                Print 50 Stickers
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold text-slate-900">MCB-63A (Schneider 63A)</span>
              <div className="bg-slate-100 p-3 rounded font-mono text-lg tracking-widest font-black">
                |||| | || ||| || |
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs"
              >
                Print 50 Stickers
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900">System Audit Trail &amp; Edit History</h3>
            <p className="text-xs text-slate-500">Immutable ledger log fulfilling statutory MCA and auditor tracking requirements.</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <div>
                <span className="font-bold text-slate-900">Sale Bill Created: INV-2026-0089</span>
                <span className="text-slate-400 ml-2">by Rajesh Sharma (Admin)</span>
              </div>
              <span className="font-mono text-slate-500">22-08-2026 14:32:10</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <div>
                <span className="font-bold text-slate-900">Payment In Received: ₹174,021</span>
                <span className="text-slate-400 ml-2">by Rajesh Sharma (Admin)</span>
              </div>
              <span className="font-mono text-slate-500">18-08-2026 11:15:44</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
              <div>
                <span className="font-bold text-slate-900">Inventory Stock Adjusted: GI-PIPE-2IN (+50)</span>
                <span className="text-slate-400 ml-2">by Store Manager</span>
              </div>
              <span className="font-mono text-slate-500">15-08-2026 09:40:02</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
