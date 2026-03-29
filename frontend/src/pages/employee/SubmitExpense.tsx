import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Upload, DollarSign, Calendar, Tag, FileText, User, Image as ImageIcon,
  Loader2, CheckCircle2, AlertCircle, Zap, RefreshCw, Coins, Camera, Globe,
  Info, Save, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import api from '@/services/api';

const schema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(1, 'Select currency'),
  country: z.string().min(1, 'Select country'),
  category: z.string().min(1, 'Select category'),
  description: z.string().min(5, 'Description too short'),
  date: z.string().min(1, 'Date required'),
  paidBy: z.string().min(1, 'Select who paid'),
});

const SubmitExpense = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [baseCurrency] = useState({ code: 'USD', symbol: '$' });
  const { saveDraft } = useOfflineMode();

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      currency: 'USD',
      country: 'USA',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: 'Self',
    }
  });

  const amount = watch('amount');
  const currency = watch('currency');
  const selectedCountryCode = watch('country');
  const selectedCountry = countries.find(c => c.country === selectedCountryCode);

  useEffect(() => {
    const fetchCountries = async () => {
       try {
          const res = await api.get('/admin/countries');
          setCountries(res.data);
       } catch (err) {
          console.error('Failed to fetch countries');
       }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setValue('currency', selectedCountry.currency);
    }
  }, [selectedCountryCode, setValue, selectedCountry]);

  useEffect(() => {
    const fetchConversion = async () => {
       if (amount > 0 && currency) {
          try {
             const res = await api.post('/expenses/convert', { amount, fromCurrency: currency, toCurrency: baseCurrency.code });
             setConvertedAmount(res.data.convertedAmount);
          } catch (err) {
             setConvertedAmount(amount);
          }
       }
    };
    fetchConversion();
  }, [amount, currency, baseCurrency.code]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setPreviewUrl(URL.createObjectURL(file));
      
      const formData = new FormData();
      formData.append('receipt', file);

      try {
        const res = await api.post('/expenses/ocr', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data;
        
        setOcrData(data);
        if (data.amount) setValue('amount', data.amount);
        if (data.date) setValue('date', data.date.split('T')[0]);
        if (data.description) setValue('description', data.description);
        if (data.category) setValue('category', data.category);
        if (data.vendor) setValue('description', `Receipt from ${data.vendor}`);
        
      } catch (error) {
        alert('OCR failed, please enter manually');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSaveDraft = () => {
    const data = watch();
    saveDraft(data);
  };

  const onSubmit = async (data: any) => {
    try {
       await api.post('/expenses/submit', { ...data, confidenceScore: ocrData?.confidenceScore });
       alert('Expense submitted successfully!');
    } catch (err) {
       alert('Submission failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-primary tracking-tight">Intelligent Receipt Scan</h1>
           <p className="text-gray-400 font-medium mt-1">Capture, Analyze, and Submit in seconds.</p>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={onSaveDraft} className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-primary transition-all flex items-center gap-2">
              <Save size={18} /> Save Draft
           </button>
           <div className="flex items-center gap-2 px-4 py-3 bg-accent-success/5 text-accent-success rounded-xl border border-accent-success/10 group">
              <Zap size={18} fill="currentColor" className="group-hover:animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Fusion AI Enabled</span>
                 <span className="text-[9px] font-bold opacity-70">OCR + Behavior Analysis</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
           <div className="card border-none shadow-2xl min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed border-gray-100 relative group overflow-hidden bg-gray-50/30">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              
              <AnimatePresence mode="wait">
                {previewUrl ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 w-full h-full p-6">
                     <img src={previewUrl} className="w-full h-full object-contain rounded-2xl shadow-lg" alt="Receipt preview" />
                     {isUploading && (
                       <div className="absolute inset-0 bg-primary/60 backdrop-blur-md flex flex-col items-center justify-center text-white px-8 text-center ring-4 ring-primary ring-inset">
                          <Loader2 className="animate-spin mb-6 text-white" size={64} />
                          <h2 className="text-2xl font-black tracking-tight mb-2">Neural OCR Scan...</h2>
                          <p className="text-sm opacity-80 leading-relaxed font-mono">EXTRACTING METADATA...</p>
                       </div>
                     )}
                     {!isUploading && ocrData && (
                        <div className="absolute top-8 left-8 p-3 bg-accent-success/90 backdrop-blur-sm text-white rounded-xl shadow-xl flex items-center gap-2 border border-white/20">
                           <CheckCircle2 size={16} />
                           <span className="text-xs font-bold font-mono uppercase">OCR CONFIDENCE: {ocrData.confidenceScore.toFixed(1)}%</span>
                        </div>
                     )}
                  </motion.div>
                ) : (
                  <div className="text-center group-hover:scale-105 transition-transform duration-500">
                    <div className="w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center text-primary mb-6 mx-auto border border-gray-50 ring-8 ring-primary/5">
                       <Upload size={32} />
                    </div>
                    <p className="text-2xl font-black text-primary">Capture Receipt</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-[250px] mx-auto">Upload an image to auto-fill your reimbursement request.</p>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
           <div className="card border-none shadow-2xl bg-white p-8">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                 <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <FileText size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-primary">Reimbursement Details</h3>
                    <p className="text-xs text-gray-400 font-medium italic">Verified by Intelligent Decision Engine.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <InputWrapper label="Country" error={errors.country} icon={Globe}>
                    <select {...register('country')} className="input-field pl-12 h-14 appearance-none bg-white cursor-pointer font-bold border-gray-100 hover:border-primary/30">
                       {countries.map(c => (
                          <option key={c.country} value={c.country}>{c.country} ({c.currency})</option>
                       ))}
                    </select>
                 </InputWrapper>

                 <InputWrapper label="Amount" error={errors.amount} icon={DollarSign}>
                    <div className="relative w-full">
                       <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className="input-field pl-12 h-14 text-xl font-black border-gray-100" />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary/30">{selectedCountry?.symbol}</span>
                    </div>
                 </InputWrapper>
              </div>

              <div className="mt-8 flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group overflow-hidden">
                 <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
                       <RefreshCw className="animate-spin-slow" size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Base Conversion</p>
                       <p className="text-2xl font-black text-primary leading-tight mt-1">
                          {selectedCountry?.symbol}{amount} <ChevronRight size={20} className="inline text-gray-300" /> <span className="underline decoration-accent-success decoration-4">{baseCurrency.symbol}{convertedAmount?.toFixed(2)}</span>
                       </p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                 <InputWrapper label="Category" error={errors.category} icon={Tag}>
                    <select {...register('category')} className="input-field pl-12 h-14 appearance-none bg-white cursor-pointer border-gray-100">
                       <option value="Travel">Travel</option>
                       <option value="Meals">Meals</option>
                       <option value="Supplies">Supplies</option>
                       <option value="Others">Others</option>
                    </select>
                 </InputWrapper>

                 <InputWrapper label="Expense Date" error={errors.date} icon={Calendar}>
                    <input type="date" {...register('date')} className="input-field pl-12 h-14 border-gray-100 font-bold" />
                 </InputWrapper>
              </div>

              <div className="mt-8 space-y-4">
                 <InputWrapper label="Description" error={errors.description} icon={FileText}>
                    <textarea {...register('description')} className="input-field pl-12 pt-4 h-28 resize-none border-gray-100" />
                 </InputWrapper>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={!isValid || isUploading}
                className="w-full h-16 bg-primary text-white rounded-2xl text-lg font-black mt-10 shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {isUploading ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={24} strokeWidth={3} />}
                 Submit Reimbursement Request
              </motion.button>
           </div>
        </form>
      </div>
    </div>
  );
};

const InputWrapper = ({ label, error, icon: Icon, children }: any) => (
  <div className="space-y-1 flex-1">
    <div className="flex items-center justify-between px-1">
       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
       {error && <span className="text-[10px] text-accent-risk font-black italic">! {error.message}</span>}
    </div>
    <div className={twMerge(
      "relative flex items-center group transition-all duration-300",
      error ? "text-accent-risk" : "text-gray-300 focus-within:text-primary"
    )}>
      <Icon size={18} className="absolute left-4 z-10" />
      {children}
    </div>
  </div>
);

export default SubmitExpense;
