import React, { useState, useEffect, useRef } from 'react';
import { Company, CompanyPhone, CompanyAddress, CompanyEmail, CompanySignature } from '../types';
import { validateGSTIN, BUSINESS_CATEGORIES } from '../utils/gstHelper';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  PenTool,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  Layers,
  FileText,
  BadgeCheck,
  RefreshCw,
  Stamp,
  Sliders,
  ExternalLink
} from 'lucide-react';

interface CompanyProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSaveCompany: (updatedCompany: Company) => void;
}

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=120&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60',
];

export function CompanyProfileDrawer({
  isOpen,
  onClose,
  company,
  onSaveCompany,
}: CompanyProfileDrawerProps) {
  // Form State
  const [name, setName] = useState(company.name || '');
  const [tradeName, setTradeName] = useState(company.tradeName || '');
  const [logoUrl, setLogoUrl] = useState(company.logoUrl || '');
  const [gstin, setGstin] = useState(company.gstin || '');
  const [category, setCategory] = useState(company.category || 'Wholesale & Bulk Distribution');
  const [description, setDescription] = useState(
    company.description || company.tagline || 'Authorized Wholesale Distributors & Industrial Hardware Solutions.'
  );
  const [tagline, setTagline] = useState(company.tagline || 'Har business ka Bharosa');

  // Contact Numbers (Multiple with max 2 selectable for invoice)
  const [phones, setPhones] = useState<CompanyPhone[]>(() => {
    if (company.phones && company.phones.length > 0) {
      return company.phones;
    }
    return [
      { id: 'phone-1', number: company.phoneNumber || '+91 98765 43210', label: 'Primary / WhatsApp', isSelectedForInvoice: true },
      { id: 'phone-2', number: '+91 98110 99887', label: 'Accounts Desk', isSelectedForInvoice: true },
      { id: 'phone-3', number: '+91 11 2681 4455', label: 'Landline Office', isSelectedForInvoice: false },
    ];
  });

  // Emails
  const [emails, setEmails] = useState<CompanyEmail[]>(() => {
    if (company.emails && company.emails.length > 0) {
      return company.emails;
    }
    return [
      { id: 'email-1', email: company.email || 'accounts@sharmaenterprises.in', label: 'Billing & Accounts', isPrimary: true },
      { id: 'email-2', email: 'sales@sharmaenterprises.in', label: 'Sales Support', isPrimary: false },
    ];
  });

  // Addresses (1 Auto GST seeded + Multiple extra, with 1 selected for invoice)
  const [addresses, setAddresses] = useState<CompanyAddress[]>(() => {
    if (company.addresses && company.addresses.length > 0) {
      return company.addresses;
    }
    return [
      {
        id: 'addr-gstin-1',
        label: 'Registered GST Principal Place of Business',
        addressLine: company.address || 'Plot 42, Okhla Industrial Area Phase-III',
        city: company.city || 'New Delhi',
        state: company.state || 'Delhi (07)',
        pincode: '110020',
        isSelectedForInvoice: true,
        isAutoGstin: true,
      },
      {
        id: 'addr-extra-2',
        label: 'Central Warehouse & Dispatch Hub',
        addressLine: 'Shed 18, Udyog Vihar Phase IV',
        city: 'Gurugram',
        state: 'Haryana (06)',
        pincode: '122015',
        isSelectedForInvoice: false,
        isAutoGstin: false,
      },
    ];
  });

  // Signature state
  const [signatureType, setSignatureType] = useState<'upload' | 'digital'>(
    company.signature?.type || 'digital'
  );
  const [signatureUploadUrl, setSignatureUploadUrl] = useState<string>(
    company.signature?.uploadUrl || company.signature?.drawnDataUrl || ''
  );
  const [digitalSignerName, setDigitalSignerName] = useState<string>(
    company.signature?.digitalSignerName || company.ownerName || 'Rajesh Sharma'
  );
  const [digitalDesignation, setDigitalDesignation] = useState<string>(
    company.signature?.digitalDesignation || 'Authorized Signatory'
  );
  const [digitalCertificateId, setDigitalCertificateId] = useState<string>(
    company.signature?.digitalCertificateId || 'DSC-IND-2026-8891B'
  );
  const [digitalStyleIndex, setDigitalStyleIndex] = useState<number>(
    company.signature?.digitalStyleIndex || 0
  );

  // Drawing canvas ref for signature drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'general' | 'contacts' | 'gst_address' | 'signature'>('general');
  const [saveToast, setSaveToast] = useState(false);

  // GSTIN live verification result
  const gstValidation = validateGSTIN(gstin);

  // Auto-fill address when a valid GSTIN is typed/verified if user wants or first time
  const handleAutoFillFromGstin = () => {
    if (gstValidation.isValid && gstValidation.seededAddress) {
      setAddresses((prev) => {
        const updated = [...prev];
        const gstinIndex = updated.findIndex((a) => a.isAutoGstin);
        const newGstinAddr: CompanyAddress = {
          id: gstinIndex >= 0 ? updated[gstinIndex].id : `addr-gstin-${Date.now()}`,
          label: 'Registered GST Principal Place of Business',
          addressLine: gstValidation.seededAddress!.addressLine,
          city: gstValidation.seededAddress!.city,
          state: gstValidation.seededAddress!.state,
          pincode: gstValidation.seededAddress!.pincode,
          isSelectedForInvoice: gstinIndex >= 0 ? updated[gstinIndex].isSelectedForInvoice : true,
          isAutoGstin: true,
        };

        if (gstinIndex >= 0) {
          updated[gstinIndex] = newGstinAddr;
          return updated;
        } else {
          return [newGstinAddr, ...updated];
        }
      });
    }
  };

  // Re-sync when drawer opens or company changes
  useEffect(() => {
    if (isOpen) {
      setName(company.name || '');
      setTradeName(company.tradeName || '');
      setLogoUrl(company.logoUrl || '');
      setGstin(company.gstin || '');
      setCategory(company.category || 'Wholesale & Bulk Distribution');
      setDescription(company.description || company.tagline || 'Authorized Wholesale Distributors & Industrial Hardware Solutions.');
      setTagline(company.tagline || 'Har business ka Bharosa');
      if (company.phones && company.phones.length > 0) setPhones(company.phones);
      if (company.emails && company.emails.length > 0) setEmails(company.emails);
      if (company.addresses && company.addresses.length > 0) setAddresses(company.addresses);
      if (company.signature) {
        setSignatureType(company.signature.type);
        setSignatureUploadUrl(company.signature.uploadUrl || company.signature.drawnDataUrl || '');
        setDigitalSignerName(company.signature.digitalSignerName || company.ownerName || 'Rajesh Sharma');
        setDigitalDesignation(company.signature.digitalDesignation || 'Authorized Signatory');
        setDigitalCertificateId(company.signature.digitalCertificateId || 'DSC-IND-2026-8891B');
        setDigitalStyleIndex(company.signature.digitalStyleIndex || 0);
      }
    }
  }, [isOpen, company]);

  // Phone invoice selection handler: max 2 allowed
  const togglePhoneInvoiceSelection = (phoneId: string) => {
    const selectedCount = phones.filter((p) => p.isSelectedForInvoice).length;
    setPhones((prev) =>
      prev.map((p) => {
        if (p.id === phoneId) {
          if (!p.isSelectedForInvoice && selectedCount >= 2) {
            // Already 2 selected, do not allow 3rd without unselecting one
            alert('You can select a maximum of 2 contact numbers to appear on Invoices.');
            return p;
          }
          return { ...p, isSelectedForInvoice: !p.isSelectedForInvoice };
        }
        return p;
      })
    );
  };

  // Address invoice selection handler: only 1 selected for invoice
  const selectInvoiceAddress = (addrId: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isSelectedForInvoice: a.id === addrId,
      }))
    );
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature file upload handler
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSignatureUploadUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureUploadUrl(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureUploadUrl('');
  };

  // Save handler
  const handleSave = () => {
    const selectedAddress = addresses.find((a) => a.isSelectedForInvoice) || addresses[0];
    const selectedPhones = phones.filter((p) => p.isSelectedForInvoice);

    const updatedCompany: Company = {
      ...company,
      name: name.trim() || 'My Business',
      tradeName: tradeName.trim() || name.trim(),
      logoUrl,
      gstin: gstin.trim().toUpperCase(),
      gstinVerified: gstValidation.isValid,
      phoneNumber: selectedPhones.length > 0 ? selectedPhones.map((p) => p.number).join(', ') : phones[0]?.number,
      phones,
      email: emails[0]?.email || company.email,
      emails,
      tagline,
      description,
      category,
      address: selectedAddress ? `${selectedAddress.addressLine}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}` : company.address,
      addresses,
      city: selectedAddress?.city || company.city,
      state: selectedAddress?.state || company.state,
      signature: {
        type: signatureType,
        uploadUrl: signatureType === 'upload' ? signatureUploadUrl : undefined,
        drawnDataUrl: signatureType === 'upload' ? signatureUploadUrl : undefined,
        digitalSignerName: digitalSignerName.trim(),
        digitalDesignation: digitalDesignation.trim(),
        digitalCertificateId: digitalCertificateId.trim(),
        digitalTimestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        digitalStyleIndex,
      },
    };

    onSaveCompany(updatedCompany);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Slide-over Right Panel */}
      <div
        id="company-profile-drawer"
        className="w-full max-w-2xl sm:max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-lg shadow-inner">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Company Profile &amp; Business Settings
                </h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configure your business identity, GST details, multiple invoices contacts, and official signature.
              </p>
            </div>
          </div>

          <button
            id="close-company-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs for Profile Sections */}
        <div className="bg-slate-100/80 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTabSection('general')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabSection === 'general'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Identity &amp; Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('contacts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabSection === 'contacts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>2. Contacts &amp; Email ({phones.filter((p) => p.isSelectedForInvoice).length}/2 Selected)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('gst_address')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabSection === 'gst_address'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>3. GSTIN &amp; Addresses ({addresses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('signature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabSection === 'signature'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>4. Official Signature</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          {/* ========================================================
              SECTION 1: BUSINESS IDENTITY, LOGO, CATEGORY & DESCRIPTION
             ======================================================== */}
          {activeTabSection === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 1. Logo Management */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      1. Company Logo
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add or edit your business logo. This logo appears on headers, bills, estimates, and tax invoices.
                    </p>
                  </div>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Logo Preview box */}
                  <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner group">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Building2 className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px] font-medium block">No Logo Set</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions & Presets */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo File (PNG / JPG / SVG)</span>
                        <input
                          id="company-logo-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-600 block">
                        Or choose from preset brand badges:
                      </span>
                      <div className="flex items-center gap-2">
                        {PRESET_LOGOS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setLogoUrl(preset)}
                            className={`w-10 h-10 rounded-xl border p-1 overflow-hidden transition-all cursor-pointer ${
                              logoUrl === preset
                                ? 'border-blue-600 ring-2 ring-blue-500/30'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Business Name & Trade Name */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    2. Business Name &amp; Trade Name
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your official legal registered business name and optional trading banner name.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Legal Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="company-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sharma Enterprises Pvt Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-semibold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Trade / Brand Name (Optional)
                    </label>
                    <input
                      id="company-trade-name-input"
                      type="text"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      placeholder="e.g. Sharma Industrial Supplies"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Business Slogan / Tagline
                  </label>
                  <input
                    id="company-tagline-input"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Har business ka Bharosa"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs text-slate-700 bg-white"
                  />
                </div>
              </div>

              {/* 8. Business Category Dropdown */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    8. Business Category
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select the business industry category that best describes your core commercial operations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Industry / Business Category
                  </label>
                  <select
                    id="company-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-semibold text-slate-800 bg-white cursor-pointer"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 9. Business Description */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    9. Business Description
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide an overview of products/services offered, certifications, and terms for invoices.
                  </p>
                </div>

                <div>
                  <textarea
                    id="company-description-textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter comprehensive business overview, standard sales terms, or ISO certifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-slate-800 bg-white leading-relaxed resize-y"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Appears in reports &amp; company invoice footer terms.</span>
                    <span>{description.length} characters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 2: CONTACT NUMBERS (MULTIPLE WITH 2 SELECTED FOR INVOICE) & EMAILS
             ======================================================== */}
          {activeTabSection === 'contacts' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 3. Contact Numbers */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      3. Business Contact Numbers (Multiple)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add multiple contact numbers. You can select <strong className="text-blue-700">any 2 numbers</strong> to reflect on your invoices.
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shrink-0">
                    {phones.filter((p) => p.isSelectedForInvoice).length} / 2 Selected for Invoice
                  </div>
                </div>

                <div className="space-y-3">
                  {phones.map((phoneItem, index) => {
                    const isSelected = phoneItem.isSelectedForInvoice;
                    return (
                      <div
                        key={phoneItem.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/30'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Phone Number #{index + 1}
                              </label>
                              <input
                                type="tel"
                                value={phoneItem.number}
                                onChange={(e) => {
                                  const newPhones = [...phones];
                                  newPhones[index].number = e.target.value;
                                  setPhones(newPhones);
                                }}
                                placeholder="+91 98765 43210"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-semibold bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Phone Label / Purpose
                              </label>
                              <input
                                type="text"
                                value={phoneItem.label || ''}
                                onChange={(e) => {
                                  const newPhones = [...phones];
                                  newPhones[index].label = e.target.value;
                                  setPhones(newPhones);
                                }}
                                placeholder="e.g. Sales Desk / WhatsApp"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                              />
                            </div>
                          </div>

                          {/* Invoice Selection Toggle */}
                          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => togglePhoneInvoiceSelection(phoneItem.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>On Invoice</span>
                                </>
                              ) : (
                                <span>+ Use On Invoice</span>
                              )}
                            </button>

                            {phones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setPhones(phones.filter((p) => p.id !== phoneItem.id))}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove phone"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    id="add-phone-number-btn"
                    type="button"
                    onClick={() => {
                      const newId = `phone-${Date.now()}`;
                      const selectedCount = phones.filter((p) => p.isSelectedForInvoice).length;
                      setPhones([
                        ...phones,
                        {
                          id: newId,
                          number: '+91 ',
                          label: 'Branch Line',
                          isSelectedForInvoice: selectedCount < 2,
                        },
                      ]);
                    }}
                    className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Phone Number</span>
                  </button>
                </div>
              </div>

              {/* 4. Email ID Management */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    4. Email Address
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add or edit company email addresses used for sending invoices and receiving customer queries.
                  </p>
                </div>

                <div className="space-y-3">
                  {emails.map((emailItem, index) => (
                    <div key={emailItem.id} className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            type="email"
                            value={emailItem.email}
                            onChange={(e) => {
                              const newEmails = [...emails];
                              newEmails[index].email = e.target.value;
                              setEmails(newEmails);
                            }}
                            placeholder="accounts@business.com"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={emailItem.label || ''}
                            onChange={(e) => {
                              const newEmails = [...emails];
                              newEmails[index].label = e.target.value;
                              setEmails(newEmails);
                            }}
                            placeholder="e.g. Billing & Accounts"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-600 bg-white"
                          />
                        </div>
                      </div>

                      {emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEmails(emails.filter((e) => e.id !== emailItem.id))}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setEmails([
                        ...emails,
                        { id: `email-${Date.now()}`, email: '', label: 'Support Desk', isPrimary: false },
                      ]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Additional Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 3: GSTIN (WITH LIVE VERIFICATION & AUTO-FILL) + MULTIPLE ADDRESSES
             ======================================================== */}
          {activeTabSection === 'gst_address' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 5. GSTIN Verification Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      5. Company GSTIN (Automated Live Verification)
                    </h3>
                    {gstValidation.isValid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>GSTIN Verified ✓</span>
                      </span>
                    ) : gstin.trim() ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect GSTIN</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">15 Characters Required</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your 15-character GSTIN. It will be verified automatically in real-time.
                  </p>
                </div>

                <div>
                  <div className="relative">
                    <input
                      id="company-gstin-input"
                      type="text"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/\s/g, ''))}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-mono font-bold tracking-wider uppercase transition-colors ${
                        gstValidation.isValid
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                          : gstin.trim()
                          ? 'border-rose-400 bg-rose-50/20 text-rose-950 focus:border-rose-500'
                          : 'border-slate-300 bg-white focus:border-blue-600'
                      }`}
                    />
                    {gstValidation.isValid && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        <Check className="w-4 h-4" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Status Feedback Box */}
                  {gstValidation.isValid ? (
                    <div className="mt-3 p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-xs text-emerald-950">
                            GSTIN format is valid and active for: {gstValidation.stateName} (State Code {gstValidation.stateCode})
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                          PAN: {gstValidation.pan}
                        </span>
                      </div>

                      {/* 6. Auto-fill trigger banner */}
                      <div className="pt-2 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-xs text-emerald-800">
                          Seeded address for this GSTIN: <strong>{gstValidation.seededAddress?.addressLine}, {gstValidation.seededAddress?.city}</strong>
                        </p>
                        <button
                          type="button"
                          onClick={handleAutoFillFromGstin}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                        >
                          Auto-fill Business Address
                        </button>
                      </div>
                    </div>
                  ) : gstin.trim() ? (
                    <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-rose-950 mb-0.5">
                          Entered GSTIN is incorrect
                        </strong>
                        <span>{gstValidation.error}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 6 & 7. Business Addresses (Auto-filled + Multiple with 1 selected for Invoices) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      6 &amp; 7. Multiple Business Addresses &amp; Invoice Address Selection
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add multiple branch/factory addresses. Choose which address will appear on your customer invoices.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `addr-extra-${Date.now()}`;
                      setAddresses([
                        ...addresses,
                        {
                          id: newId,
                          label: 'Branch / Warehouse Location',
                          addressLine: '',
                          city: 'New Delhi',
                          state: 'Delhi (07)',
                          pincode: '110001',
                          isSelectedForInvoice: false,
                          isAutoGstin: false,
                        },
                      ]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Extra Address</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr, index) => {
                    const isSelected = addr.isSelectedForInvoice;
                    return (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={addr.label}
                              onChange={(e) => {
                                const newAddresses = [...addresses];
                                newAddresses[index].label = e.target.value;
                                setAddresses(newAddresses);
                              }}
                              placeholder="Address Label (e.g. Head Office / Warehouse)"
                              className="font-bold text-xs text-slate-800 border-b border-dashed border-slate-300 focus:border-blue-600 bg-transparent px-1 py-0.5"
                            />
                            {addr.isAutoGstin && (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Auto-seeded from GSTIN
                              </span>
                            )}
                          </div>

                          {/* Radio Selector: Choose for Invoice */}
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="invoice-selected-address"
                                checked={isSelected}
                                onChange={() => selectInvoiceAddress(addr.id)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                                {isSelected ? '✓ Appears on Invoices' : 'Select for Invoices'}
                              </span>
                            </label>

                            {addresses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title="Delete address"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Street / Building / Industrial Plot Address
                            </label>
                            <input
                              type="text"
                              value={addr.addressLine}
                              onChange={(e) => {
                                const newAddresses = [...addresses];
                                newAddresses[index].addressLine = e.target.value;
                                setAddresses(newAddresses);
                              }}
                              placeholder="e.g. Plot 42, Okhla Industrial Area Phase-III"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                              <input
                                type="text"
                                value={addr.city}
                                onChange={(e) => {
                                  const newAddresses = [...addresses];
                                  newAddresses[index].city = e.target.value;
                                  setAddresses(newAddresses);
                                }}
                                placeholder="New Delhi"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">State &amp; Code</label>
                              <input
                                type="text"
                                value={addr.state}
                                onChange={(e) => {
                                  const newAddresses = [...addresses];
                                  newAddresses[index].state = e.target.value;
                                  setAddresses(newAddresses);
                                }}
                                placeholder="Delhi (07)"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">PIN Code</label>
                              <input
                                type="text"
                                maxLength={6}
                                value={addr.pincode}
                                onChange={(e) => {
                                  const newAddresses = [...addresses];
                                  newAddresses[index].pincode = e.target.value;
                                  setAddresses(newAddresses);
                                }}
                                placeholder="110020"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 4: OFFICIAL SIGNATURE (UPLOAD & DIGITAL SIGNATURE)
             ======================================================== */}
          {activeTabSection === 'signature' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-blue-600" />
                    10. Add Official Signature
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your signature method for invoice generation. You can either <strong className="text-blue-700">upload/draw a manual signature</strong> or choose a <strong className="text-blue-700">cryptographic Digital Signature (DSC)</strong>.
                  </p>
                </div>

                {/* 2 Ways Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSignatureType('upload')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      signatureType === 'upload'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Option 1: Upload or Draw Signature</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignatureType('digital')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      signatureType === 'digital'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Option 2: Digital Signature (e-Sign / DSC)</span>
                  </button>
                </div>

                {/* OPTION 1: Upload or Draw Signature */}
                {signatureType === 'upload' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Upload box */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                        <span className="text-xs font-bold text-slate-700 block">Upload Signature Image</span>
                        <div className="h-28 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center relative overflow-hidden">
                          {signatureUploadUrl ? (
                            <img
                              src={signatureUploadUrl}
                              alt="Signature"
                              className="max-h-full max-w-full object-contain p-2"
                            />
                          ) : (
                            <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                              <PenTool className="w-5 h-5 text-slate-300" />
                              <span>PNG / JPG with transparent background</span>
                            </div>
                          )}
                        </div>

                        <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Interactive Drawing Pad */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Or Draw Live Signature</span>
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            Clear Pad
                          </button>
                        </div>

                        <canvas
                          ref={canvasRef}
                          width={260}
                          height={112}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="w-full h-28 bg-white border border-slate-300 rounded-lg cursor-crosshair touch-none shadow-inner"
                        />
                        <span className="text-[10px] text-slate-400 block text-center">
                          Use mouse or touchpad to sign above.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* OPTION 2: Digital Signature (DSC / e-Sign Certificate) */}
                {signatureType === 'digital' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-700" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-950">
                            Legally Compliant Digital Signature Certificate (DSC)
                          </h4>
                          <p className="text-[11px] text-blue-800">
                            Embedded tamper-proof cryptographic stamp with authorized signatory name and certificate authority metadata.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Signatory Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={digitalSignerName}
                          onChange={(e) => setDigitalSignerName(e.target.value)}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Designation / Role
                        </label>
                        <input
                          type="text"
                          value={digitalDesignation}
                          onChange={(e) => setDigitalDesignation(e.target.value)}
                          placeholder="Authorized Signatory / Director"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          DSC Certificate ID / Serial
                        </label>
                        <input
                          type="text"
                          value={digitalCertificateId}
                          onChange={(e) => setDigitalCertificateId(e.target.value)}
                          placeholder="DSC-IND-2026-8891B"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Certifying Authority
                        </label>
                        <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-600 font-medium">
                          CCA India / e-Mudhra Class 3
                        </div>
                      </div>
                    </div>

                    {/* Choose Digital Signature Style */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">
                        Choose Digital Stamp Visual Style:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Style 0: Official Blue Border Seal */}
                        <button
                          type="button"
                          onClick={() => setDigitalStyleIndex(0)}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            digitalStyleIndex === 0
                              ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="border border-blue-700/60 p-2.5 rounded-lg bg-blue-50/70 text-blue-950 font-sans">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1 mb-1">
                              <span>Digitally Signed by</span>
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="font-bold text-xs text-slate-900">{digitalSignerName || 'Signatory Name'}</div>
                            <div className="text-[10px] text-slate-600">{digitalDesignation}</div>
                            <div className="text-[9px] font-mono text-blue-700 mt-1">ID: {digitalCertificateId}</div>
                          </div>
                          <span className="text-[11px] font-bold text-blue-700 mt-1.5 block text-center">
                            Style A: Standard Corporate Ribbon
                          </span>
                        </button>

                        {/* Style 1: Golden Seal */}
                        <button
                          type="button"
                          onClick={() => setDigitalStyleIndex(1)}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            digitalStyleIndex === 1
                              ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="border border-amber-600/70 p-2.5 rounded-lg bg-amber-50/70 text-amber-950 font-sans">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-1">
                              <span>Verified e-Sign</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <div className="font-bold text-xs text-slate-900">{digitalSignerName || 'Signatory Name'}</div>
                            <div className="text-[10px] text-slate-600">{company.name}</div>
                            <div className="text-[9px] font-mono text-amber-800 mt-1">Authenticity Guaranteed</div>
                          </div>
                          <span className="text-[11px] font-bold text-amber-800 mt-1.5 block text-center">
                            Style B: Golden Security Shield
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            {saveToast && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold animate-in fade-in duration-100">
                <Check className="w-3.5 h-3.5" />
                <span>Profile Saved Successfully!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="save-company-profile-btn"
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Apply to Invoices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
