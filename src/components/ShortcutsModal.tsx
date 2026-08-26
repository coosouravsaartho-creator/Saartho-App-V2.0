import React from 'react';
import { Keyboard, X, PlusCircle, ArrowDownLeft, ArrowUpRight, Search, Printer, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSale: () => void;
  onOpenPurchase: () => void;
  onOpenPaymentIn: () => void;
  onOpenPaymentOut: () => void;
  onOpenSearch: () => void;
  onOpenBulkPrint: () => void;
  onTogglePrivacy: () => void;
}

export function ShortcutsModal({
  isOpen,
  onClose,
  onOpenSale,
  onOpenPurchase,
  onOpenPaymentIn,
  onOpenPaymentOut,
  onOpenSearch,
  onOpenBulkPrint,
  onTogglePrivacy,
}: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutsList = [
    {
      category: 'Billing & Inward Transactions',
      items: [
        {
          key: 'F1',
          altKey: 'Ctrl + 1',
          title: 'Create Sale Bill',
          description: 'Instant Tax / Cash sale invoice generator',
          icon: PlusCircle,
          actionColor: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
          onClick: () => {
            onClose();
            onOpenSale();
          },
        },
        {
          key: 'F2',
          altKey: 'Ctrl + 2',
          title: 'Record Purchase Bill',
          description: 'Log inward vendor bills and claim GST ITC',
          icon: PlusCircle,
          actionColor: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200',
          onClick: () => {
            onClose();
            onOpenPurchase();
          },
        },
        {
          key: 'F3',
          altKey: 'Ctrl + 3',
          title: 'Payment In (Receipt)',
          description: 'Record customer receipt against outstanding dues',
          icon: ArrowDownLeft,
          actionColor: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
          onClick: () => {
            onClose();
            onOpenPaymentIn();
          },
        },
        {
          key: 'F4',
          altKey: 'Ctrl + 4',
          title: 'Payment Out (Voucher)',
          description: 'Record vendor payment out from Bank / Cash',
          icon: ArrowUpRight,
          actionColor: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
          onClick: () => {
            onClose();
            onOpenPaymentOut();
          },
        },
      ],
    },
    {
      category: 'Navigation & Workspace Tools',
      items: [
        {
          key: 'Ctrl + K',
          altKey: '⌘ + K',
          title: 'Universal Omni-Search',
          description: 'Instant lookup across invoices, parties & inventory items',
          icon: Search,
          actionColor: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
          onClick: () => {
            onClose();
            onOpenSearch();
          },
        },
        {
          key: 'Ctrl + B',
          altKey: '⌘ + B',
          title: 'Toggle Privacy Blur Mode',
          description: 'Obscures sensitive sales & balance numbers during screen share',
          icon: Eye,
          actionColor: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
          onClick: () => {
            onClose();
            onTogglePrivacy();
          },
        },
        {
          key: 'Ctrl + P',
          altKey: '⌘ + P',
          title: 'Bulk Print & Batch Invoices',
          description: 'Print multiple GST compliant tax invoices simultaneously',
          icon: Printer,
          actionColor: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
          onClick: () => {
            onClose();
            onOpenBulkPrint();
          },
        },
        {
          key: 'Escape',
          altKey: 'Esc',
          title: 'Close Modal / Dialog',
          description: 'Dismiss any open form, modal or search popup immediately',
          icon: X,
          actionColor: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
          onClick: onClose,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-500">Speed up your daily billing with instant hotkeys</p>
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

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
          {shortcutsList.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {section.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIdx}
                      type="button"
                      onClick={item.onClick}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${item.actionColor}`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate">{item.title}</h4>
                          <p className="text-[11px] opacity-80 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <kbd className="font-mono text-[11px] font-bold px-2 py-0.5 bg-white text-slate-800 rounded border border-slate-300 shadow-xs">
                          {item.key}
                        </kbd>
                        {item.altKey && (
                          <span className="font-mono text-[9px] text-slate-400 font-medium">
                            {item.altKey}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Click on any shortcut box above to trigger the action directly</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
