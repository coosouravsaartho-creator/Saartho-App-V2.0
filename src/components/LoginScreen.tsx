import React, { useState } from 'react';
import { UserAccount, ThemeConfig } from '../types';
import { SaarthoLogo } from './SaarthoLogo';
import { 
  Building2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  HelpCircle,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';

interface LoginScreenProps {
  currentTheme: ThemeConfig;
  onLoginSuccess: (user: UserAccount) => void;
  onRestoreBackup: () => void;
}

export function LoginScreen({ currentTheme, onLoginSuccess, onRestoreBackup }: LoginScreenProps) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [businessName, setBusinessName] = useState('Sharma Enterprises Pvt Ltd');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('accounts@sharmaenterprises.in');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpValues, setOtpValues] = useState(['7', '2', '2', '7']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation: Between phone number or Email, any one is mandatory
    const hasPhone = phoneNumber.trim().length > 3;
    const hasEmail = email.trim().length > 3;

    if (!hasPhone && !hasEmail) {
      setErrorMessage('Please enter either a valid Phone Number or an Email ID to continue.');
      return;
    }

    if (!businessName.trim() && !isLoginMode) {
      setErrorMessage('Please provide your Business Name.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 450);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage('Please enter all 4 digits of the OTP.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        businessName: businessName || 'My Business Desk',
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
        gstin: gstin || undefined,
        tagline: 'Quality Products & Services',
        address: 'Main Commercial Hub, New Delhi',
        ownerName: 'Administrator',
        role: 'Admin',
        isLoggedIn: true,
      });
    }, 400);
  };

  const handleSkipLogin = () => {
    onLoginSuccess({
      businessName: 'Sharma Enterprises Pvt Ltd',
      phoneNumber: '+91 98765 43210',
      email: 'accounts@sharmaenterprises.in',
      gstin: '07AAAAA0000A1Z5',
      tagline: 'Quality Hardware & Industrial Supplies',
      address: 'Plot 42, Okhla Industrial Area Phase-III, New Delhi',
      ownerName: 'Rajesh Sharma',
      role: 'Admin',
      isLoggedIn: true,
    });
  };

  return (
    <div id="login-screen-wrapper" className="min-h-screen w-full flex flex-col lg:flex-row bg-[#060b18] font-sans text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/12 via-rose-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* Top Floating Demo Access Action */}
      <div className="absolute top-4 right-5 z-20 flex items-center gap-3">
        <button
          id="skip-login-btn"
          onClick={handleSkipLogin}
          type="button"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white text-xs font-semibold tracking-wide border border-slate-700/70 shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-200 cursor-pointer"
        >
          <span>Skip Login (Demo Access)</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LEFT SIDE: EXACT SAARTHO LOGO & UNDERNEATH ADDITIONAL INFORMATION */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-slate-800/70 bg-gradient-to-b from-[#0b1328]/80 via-[#070e1e]/90 to-[#040813]/95 backdrop-blur-md overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center max-w-xl mx-auto w-full">
          
          {/* Saartho Official Logo Card Artwork */}
          <div className="w-full flex justify-center mb-6">
            <SaarthoLogo />
          </div>

          {/* Under Logo: Additional Information, Mission & Feature Capabilities */}
          <div className="w-full space-y-4 text-left">
            
            {/* Goal Overview Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
              <div className="flex items-center gap-2 text-blue-400 mb-1.5 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Core Purpose</span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 leading-snug">
                OUR CORE PURPOSE
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Our goal is to build a complete business management platform that grows with every business, from a simple offline-first solution today to a powerful, connected and intelligent platform for businesses everywhere tomorrow.
              </p>
            </div>

            {/* 3 Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-850 bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Fast Invoicing</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Instant GST bills, proforma, quotations, and thermal prints.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">GST Compliance</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Automated GSTR-1, GSTR-3B summaries, and HSN tax calculation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 bg-slate-900/60 border border-slate-800/70 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">100% Reliable</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Offline-first persistence with seamless cloud backup.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info at bottom of left panel */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 max-w-xl mx-auto w-full">
          <span>Made for Indian &amp; Global SMBs</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Offline + Cloud Sync Active
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: REGISTRATION / LOGIN BOX */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Card Frame for the Login Box */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative">
            {step === 'form' ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {isLoginMode ? 'Welcome back to Saartho' : 'Register Your Business'}
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
                      {isLoginMode ? 'Sign In' : 'New Setup'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    {isLoginMode
                      ? 'Enter your registered details to access your books and invoices.'
                      : 'Create your business profile to start invoicing and accounting immediately.'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleProceed} className="space-y-4">
                  {!isLoginMode && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-business-name"
                          type="text"
                          required={!isLoginMode}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Sharma Enterprises Pvt Ltd"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">Contact &amp; Verification</span>
                      <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                        Phone or Email mandatory
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Enter Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-phone-number"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-700/60" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">OR</span>
                      <div className="h-px flex-1 bg-slate-700/60" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Enter Email ID
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-email-id"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="accounts@sharmaenterprises.in"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {!isLoginMode && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300">GSTIN / Tax ID</label>
                        <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                      </div>
                      <input
                        id="input-gstin"
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="07AAAAA0000A1Z5"
                        maxLength={15}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-blue-500 text-sm text-slate-100 uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder-slate-500 outline-none"
                      />
                    </div>
                  )}

                  <button
                    id="submit-register-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{isLoginMode ? 'Proceed to Sign In' : 'Register & Get OTP'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Mode Toggle & Restore Backup */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <button
                    id="toggle-auth-mode-btn"
                    type="button"
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setErrorMessage('');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline transition-colors cursor-pointer"
                  >
                    {isLoginMode
                      ? 'Need a new setup? Register Business'
                      : 'Already have an account? Sign In'}
                  </button>

                  <button
                    id="restore-backup-btn"
                    type="button"
                    onClick={onRestoreBackup}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restore Backup</span>
                  </button>
                </div>
              </>
            ) : (
              /* OTP VERIFICATION STEP */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Verify with OTP</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    We sent a 4-digit authentication code to <br />
                    <span className="font-semibold text-slate-200">{phoneNumber || email}</span>
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-center">
                  <p className="text-[11px] text-blue-300">
                    Demo Mode Active: Pre-filled code <strong className="font-mono text-white text-xs bg-blue-600/40 px-1.5 py-0.5 rounded">7227</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="flex items-center justify-center gap-3">
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => {
                          const newVals = [...otpValues];
                          newVals[idx] = e.target.value;
                          setOtpValues(newVals);
                          if (e.target.value && idx < 3) {
                            const next = document.getElementById(`otp-input-${idx + 1}`);
                            next?.focus();
                          }
                        }}
                        className="w-12 h-13 text-center text-xl font-bold font-mono rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white outline-none"
                      />
                    ))}
                  </div>

                  <button
                    id="verify-otp-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Verify &amp; Launch Saartho</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    &larr; Change Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpValues(['7', '2', '2', '7']);
                      setErrorMessage('');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Encrypted Offline-First Local Data Storage</span>
          </div>

        </div>
      </div>
    </div>
  );
}
