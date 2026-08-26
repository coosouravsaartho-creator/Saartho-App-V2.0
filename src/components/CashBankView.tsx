import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Landmark, Plus, ArrowRightLeft, CreditCard, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface CashBankViewProps {
  bankAccounts: BankAccount[];
  onAddAccount: (acc: BankAccount) => void;
  onTransferFunds: (fromId: string, toId: string, amount: number) => void;
}

export function CashBankView({ bankAccounts, onAddAccount, onTransferFunds }: CashBankViewProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [fromAcc, setFromAcc] = useState(bankAccounts[0]?.id || '');
  const [toAcc, setToAcc] = useState(bankAccounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('10000');

  const totalLiquidity = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAcc === toAcc) return;
    onTransferFunds(fromAcc, toAcc, Number(transferAmount));
    setIsTransferModalOpen(false);
  };

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cash &amp; Bank Accounts</h1>
          <p className="text-xs text-slate-500">Track current accounts, cash drawers, UPI handles, and inter-account transfers.</p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Funds</span>
        </button>
      </div>

      {/* Overview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#132338] to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Total Available Liquid Cash &amp; Bank Balance</span>
          <div className="text-3xl font-black tracking-tight mt-1 text-emerald-400">
            ₹{(totalLiquidity ?? 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">Real-time ledger reconciled across {bankAccounts.length} sources</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Bank-Grade Encryption</span>
          </span>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map((acc) => (
          <div key={acc.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {acc.accountType}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{acc.accountName}</h3>
              <p className="text-xs text-slate-500">{acc.bankName}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Account Number:</span>
                <span className="font-mono text-slate-800">{acc.accountNumber}</span>
              </div>
              {acc.ifsc !== 'NA' && (
                <div className="flex justify-between text-slate-500">
                  <span>IFSC Code:</span>
                  <span className="font-mono text-slate-800">{acc.ifsc}</span>
                </div>
              )}
              {acc.upiId && (
                <div className="flex justify-between text-slate-500">
                  <span>UPI ID:</span>
                  <span className="font-mono text-blue-600">{acc.upiId}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Current Balance</span>
              <span className="text-base font-bold text-slate-900">₹{(acc.currentBalance ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Funds Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">Inter-Account Fund Transfer</h3>
            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">From Account (Debit)</label>
                <select
                  value={fromAcc}
                  onChange={(e) => setFromAcc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} (₹{(b.currentBalance ?? 0).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">To Account (Credit)</label>
                <select
                  value={toAcc}
                  onChange={(e) => setToAcc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} (₹{(b.currentBalance ?? 0).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
