import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, AlertCircle, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import type { FuelType, Vehicle } from '../../types';

const vehicleSchema = z.object({
  category: z.enum(['bike', 'car', 'auto'] as const),
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.number().int().min(1990).max(new Date().getFullYear()),
  registrationNumber: z.string().trim().min(4, 'Registration number required'),
  colour: z.string().trim().min(1, 'Colour is required'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  engineCC: z.number().optional().or(z.nan()).transform(v => (v === undefined || Number.isNaN(v) ? undefined : Number(v))),
  transmission: z.string().optional().default(''),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] as const),
  seats: z.number().int().min(1).max(12),
  hasAC: z.boolean().optional().default(false),
  pickupAddress: z.string().trim().min(5, 'Pickup address is required'),
  area: z.string().trim().min(2, 'Area/Locality is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pinCode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  pricePerHour: z.number().min(10, 'Price must be at least ₹10/hr'),
  minRentalHours: z.number().int().or(z.nan()).transform(v => (v === undefined || Number.isNaN(v) ? 1 : Number(v))).default(1),
  securityDeposit: z.number().or(z.nan()).transform(v => (v === undefined || Number.isNaN(v) ? 0 : Number(v))).default(0),
  selfDrive: z.boolean().default(true),
  withDriver: z.boolean().default(false),
  availDays: z.array(z.number()).optional().default([0, 1, 2, 3, 4, 5, 6]),
  startTime: z.string().default('08:00'),
  endTime: z.string().default('20:00'),
  isActive: z.boolean().default(true),
}).refine(d => d.selfDrive || d.withDriver, {
  message: 'At least one rental mode must be selected',
  path: ['selfDrive'],
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SL = 'w-full h-10 px-3 rounded-xl border border-white/15 bg-[#111] text-white text-sm focus:outline-none focus:border-white/40 transition-all appearance-none';
const IN = 'w-full h-10 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all';
const IN_ERR = 'border-white/60';
const LABEL = 'text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1"><AlertCircle size={11} />{msg}</p>;
}

export default function HostAddVehiclePage() {
  const { currentUser } = useAuth();
  const { vehicles, addVehicle, updateVehicle } = useApp();
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId?: string }>();
  const isEdit = !!vehicleId;
  const existing = isEdit ? vehicles.find(v => v.id === vehicleId) : undefined;

  const [images, setImages] = useState<string[]>(existing?.images || []);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      category: existing?.category ?? 'bike',
      brand: existing?.brand ?? '',
      model: existing?.model ?? '',
      year: existing?.year ?? new Date().getFullYear() - 1,
      registrationNumber: existing?.registrationNumber ?? '',
      colour: existing?.colour ?? '',
      description: existing?.description ?? '',
      engineCC: existing?.specs?.engineCC ?? undefined,
      transmission: (existing?.specs?.transmission ?? '') as any,
      fuelType: (existing?.specs?.fuelType as FuelType) ?? 'Petrol',
      seats: existing?.specs?.seats ?? 2,
      hasAC: existing?.specs?.hasAC ?? false,
      pickupAddress: existing?.pickupAddress ?? '',
      area: existing?.area ?? '',
      city: existing?.city ?? '',
      state: existing?.state ?? '',
      pinCode: existing?.pinCode ?? '',
      pricePerHour: existing?.pricePerHour ?? undefined,
      minRentalHours: existing?.minRentalHours ?? 4,
      securityDeposit: existing?.securityDeposit ?? 0,
      selfDrive: existing?.rentalModes.includes('self-drive') ?? true,
      withDriver: existing?.rentalModes.includes('with-driver') ?? false,
      availDays: existing?.availability?.days ?? [0, 1, 2, 3, 4, 5, 6],
      startTime: existing?.availability?.startTime ?? '08:00',
      endTime: existing?.availability?.endTime ?? '20:00',
      isActive: existing?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        category: existing.category,
        brand: existing.brand,
        model: existing.model,
        year: existing.year,
        registrationNumber: existing.registrationNumber,
        colour: existing.colour,
        description: existing.description,
        engineCC: existing.specs?.engineCC,
        transmission: (existing.specs?.transmission ?? '') as any,
        fuelType: (existing.specs?.fuelType as FuelType) ?? 'Petrol',
        seats: existing.specs?.seats ?? 2,
        hasAC: existing.specs?.hasAC ?? false,
        pickupAddress: existing.pickupAddress,
        area: existing.area,
        city: existing.city,
        state: existing.state,
        pinCode: existing.pinCode,
        pricePerHour: existing.pricePerHour,
        minRentalHours: existing.minRentalHours ?? 4,
        securityDeposit: existing.securityDeposit ?? 0,
        selfDrive: existing.rentalModes?.includes('self-drive') ?? true,
        withDriver: existing.rentalModes?.includes('with-driver') ?? false,
        availDays: existing.availability?.days ?? [0, 1, 2, 3, 4, 5, 6],
        startTime: existing.availability?.startTime ?? '08:00',
        endTime: existing.availability?.endTime ?? '20:00',
        isActive: existing.isActive ?? true,
      });
      if (existing.images && existing.images.length > 0) {
        setImages(existing.images);
      }
    }
  }, [existing, reset]);

  const category = watch('category');
  const availDays = watch('availDays') || [0, 1, 2, 3, 4, 5, 6];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSubmitError(null);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Photo exceeds 5MB size limit. Please choose a smaller image or select one of the presets.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => (prev.length < 5 ? [...prev, reader.result as string] : prev));
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const toggleDay = (d: number) => {
    const current = availDays || [];
    if (current.includes(d)) {
      setValue('availDays', current.filter((x: number) => x !== d));
    } else {
      setValue('availDays', [...current, d].sort());
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    setSubmitError(null);
    if (!currentUser) {
      setSubmitError('You must be logged in as a host to list a vehicle.');
      return;
    }
    if (images.length === 0) {
      setSubmitError('Please add at least one vehicle photograph (upload from device or choose a preset photo).');
      return;
    }

    const rentalModes: Vehicle['rentalModes'] = [];
    if (data.selfDrive) rentalModes.push('self-drive');
    if (data.withDriver) rentalModes.push('with-driver');

    const payload = {
      hostId: currentUser.id,
      ownerId: currentUser.id,
      name: `${data.brand} ${data.model}`,
      category: data.category,
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      registrationNumber: data.registrationNumber,
      colour: data.colour,
      description: data.description,
      specs: {
        engineCC: data.category === 'bike' && data.engineCC ? Number(data.engineCC) : undefined,
        transmission: data.transmission || undefined,
        fuelType: data.fuelType,
        seats: Number(data.seats),
        hasAC: data.category === 'car' ? Boolean(data.hasAC) : undefined,
      },
      pickupAddress: data.pickupAddress,
      area: data.area,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      location: `${data.area}, ${data.city}`,
      pricePerHour: Number(data.pricePerHour),
      minRentalHours: Number(data.minRentalHours) || 1,
      securityDeposit: Number(data.securityDeposit) || 0,
      rentalModes,
      availability: {
        days: Array.isArray(data.availDays) && data.availDays.length > 0 ? data.availDays : [0, 1, 2, 3, 4, 5, 6],
        startTime: data.startTime || '08:00',
        endTime: data.endTime || '20:00',
      },
      images,
      isActive: data.isActive !== false,
    };

    if (isEdit && existing) {
      updateVehicle({ ...existing, ...payload, updatedAt: new Date().toISOString() });
    } else {
      addVehicle(payload);
    }

    setSaved(true);
    setTimeout(() => navigate('/host/vehicles'), 800);
  };

  const onInvalid = (formErrors: FieldErrors<VehicleFormData>) => {
    console.warn('Vehicle form validation errors:', formErrors);
    if (images.length === 0) {
      setSubmitError('Please add at least one vehicle photo before listing.');
      return;
    }
    const firstKey = Object.keys(formErrors)[0];
    const firstMsg = formErrors[firstKey as keyof VehicleFormData]?.message;
    setSubmitError(firstMsg ? String(firstMsg) : 'Please check all required fields marked with an asterisk (*).');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-0.5">Fill in all the details to list your vehicle.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-3 text-white">
            <CheckCircle2 size={18} />
            <span className="font-semibold text-sm">Vehicle {isEdit ? 'updated' : 'listed'} successfully! Redirecting...</span>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/30 flex items-center gap-3 text-white">
            <AlertCircle size={18} className="shrink-0" />
            <span className="font-semibold text-sm">{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <section className="glass-card rounded-2xl p-6 border border-white/15">
            <h2 className="text-base font-black text-white mb-5 pb-3 border-b border-white/10">Vehicle Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Category *</label>
                <div className="relative">
                  <select {...register('category')} className={SL}>
                    <option value="bike">Bike / Scooter</option>
                    <option value="car">Car / SUV</option>
                    <option value="auto">Auto-Rickshaw</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
                </div>
                <FieldError msg={errors.category?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Brand / Manufacturer *</label>
                <input {...register('brand')} placeholder="e.g. Royal Enfield" className={`${IN} ${errors.brand ? IN_ERR : ''}`} />
                <FieldError msg={errors.brand?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Model *</label>
                <input {...register('model')} placeholder="e.g. Classic 350" className={`${IN} ${errors.model ? IN_ERR : ''}`} />
                <FieldError msg={errors.model?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Year *</label>
                <input type="number" {...register('year', { valueAsNumber: true })} min={1990} max={new Date().getFullYear()} className={`${IN} ${errors.year ? IN_ERR : ''}`} />
                <FieldError msg={errors.year?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Registration Number *</label>
                <input {...register('registrationNumber')} placeholder="KA01AB1234" className={`${IN} ${errors.registrationNumber ? IN_ERR : ''}`} />
                <FieldError msg={errors.registrationNumber?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Colour *</label>
                <input {...register('colour')} placeholder="e.g. Stealth Black" className={`${IN} ${errors.colour ? IN_ERR : ''}`} />
                <FieldError msg={errors.colour?.message as string} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Description *</label>
                <textarea {...register('description')} rows={3} placeholder="Describe your vehicle, its condition, and any included accessories..."
                  className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all resize-none" />
                <FieldError msg={errors.description?.message as string} />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 border border-white/15">
            <h2 className="text-base font-black text-white mb-5 pb-3 border-b border-white/10">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category === 'bike' && (
                <div>
                  <label className={LABEL}>Engine Capacity (cc)</label>
                  <input type="number" {...register('engineCC', { valueAsNumber: true })} placeholder="e.g. 350" className={IN} />
                </div>
              )}
              {category !== 'auto' && (
                <div>
                  <label className={LABEL}>Transmission</label>
                  <div className="relative">
                    <select {...register('transmission')} className={SL}>
                      <option value="">Not specified</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                      <option value="CVT">CVT</option>
                      <option value="Semi-Automatic">Semi-Automatic</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
                  </div>
                </div>
              )}
              <div>
                <label className={LABEL}>Fuel Type *</label>
                <div className="relative">
                  <select {...register('fuelType')} className={SL}>
                    {(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] as FuelType[]).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={LABEL}>Seating Capacity *</label>
                <input type="number" {...register('seats', { valueAsNumber: true })} min={1} max={12} className={`${IN} ${errors.seats ? IN_ERR : ''}`} />
                <FieldError msg={errors.seats?.message as string} />
              </div>
              {category === 'car' && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="hasAC" {...register('hasAC')} className="w-4 h-4 rounded accent-white cursor-pointer" />
                  <label htmlFor="hasAC" className="text-sm font-semibold text-white cursor-pointer">Air Conditioning available</label>
                </div>
              )}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 border border-white/15">
            <h2 className="text-base font-black text-white mb-5 pb-3 border-b border-white/10">Pickup Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={LABEL}>Street Address / Landmark *</label>
                <input {...register('pickupAddress')} placeholder="e.g. 12, 5th Cross, Koramangala" className={`${IN} ${errors.pickupAddress ? IN_ERR : ''}`} />
                <FieldError msg={errors.pickupAddress?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Area / Locality *</label>
                <input {...register('area')} placeholder="e.g. Koramangala" className={`${IN} ${errors.area ? IN_ERR : ''}`} />
                <FieldError msg={errors.area?.message as string} />
              </div>
              <div>
                <label className={LABEL}>City *</label>
                <input {...register('city')} placeholder="e.g. Bangalore" className={`${IN} ${errors.city ? IN_ERR : ''}`} />
                <FieldError msg={errors.city?.message as string} />
              </div>
              <div>
                <label className={LABEL}>State *</label>
                <input {...register('state')} placeholder="e.g. Karnataka" className={`${IN} ${errors.state ? IN_ERR : ''}`} />
                <FieldError msg={errors.state?.message as string} />
              </div>
              <div>
                <label className={LABEL}>PIN Code *</label>
                <input {...register('pinCode')} placeholder="560034" maxLength={6} className={`${IN} ${errors.pinCode ? IN_ERR : ''}`} />
                <FieldError msg={errors.pinCode?.message as string} />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 border border-white/15">
            <h2 className="text-base font-black text-white mb-5 pb-3 border-b border-white/10">Rental Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className={LABEL}>Price Per Hour (₹) *</label>
                <input type="number" {...register('pricePerHour', { valueAsNumber: true })} placeholder="e.g. 80" min={10}
                  className={`${IN} ${errors.pricePerHour ? IN_ERR : ''}`} />
                <FieldError msg={errors.pricePerHour?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Min. Rental Hours *</label>
                <input type="number" {...register('minRentalHours', { valueAsNumber: true })} min={1} max={24}
                  className={`${IN} ${errors.minRentalHours ? IN_ERR : ''}`} />
                <FieldError msg={errors.minRentalHours?.message as string} />
              </div>
              <div>
                <label className={LABEL}>Security Deposit (₹)</label>
                <input type="number" {...register('securityDeposit', { valueAsNumber: true })} min={0}
                  className={`${IN} ${errors.securityDeposit ? IN_ERR : ''}`} />
              </div>
            </div>

            <div className="mb-5">
              <label className={LABEL}>Rental Mode *</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('selfDrive')} className="w-4 h-4 rounded accent-white cursor-pointer" />
                  <span className="text-sm font-semibold text-white">Self Drive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('withDriver')} className="w-4 h-4 rounded accent-white cursor-pointer" />
                  <span className="text-sm font-semibold text-white">With Driver</span>
                </label>
              </div>
              <FieldError msg={errors.selfDrive?.message as string} />
            </div>

            <div className="mb-5">
              <label className={LABEL}>Available Days</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAY_NAMES.map((d, i) => (
                  <button key={i} type="button" onClick={() => toggleDay(i)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${(availDays || []).includes(i) ? 'bg-white text-black border-white' : 'border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Available From</label>
                <input type="time" {...register('startTime')} className={IN} />
              </div>
              <div>
                <label className={LABEL}>Available Until</label>
                <input type="time" {...register('endTime')} className={IN} />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 border border-white/15">
            <h2 className="text-base font-black text-white mb-5 pb-3 border-b border-white/10">Vehicle Images *</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20">
                  <img src={img} alt="vehicle" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/90">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-xl border border-dashed border-white/25 hover:border-white/60 flex flex-col items-center justify-center gap-1.5 text-[#A1A1AA] hover:text-white transition-all cursor-pointer bg-white/[0.02]">
                  <Upload size={20} />
                  <span className="text-[10px] font-semibold">Upload</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            {images.length === 0 && (
              <p className="text-xs text-neutral-400 flex items-center gap-1"><AlertCircle size={11} />At least one image is required.</p>
            )}
            <p className="text-[10px] text-[#A1A1AA] mt-2">Max 5 images · Up to 5MB each · JPG/PNG/WebP</p>

            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Or select high-res preset photo:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Royal Enfield', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80' },
                  { name: 'KTM Duke', url: 'https://images.unsplash.com/photo-1558980395-be7c2ed2edf7?w=800&q=80' },
                  { name: 'Toyota Innova', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80' },
                  { name: 'Hyundai Creta', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80' },
                  { name: 'Auto-Rickshaw', url: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=800&q=80' },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSubmitError(null);
                      if (images.length < 5 && !images.includes(p.url)) {
                        setImages((prev) => [...prev, p.url]);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5 border border-white/15">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 rounded accent-white cursor-pointer" />
              <div>
                <label htmlFor="isActive" className="text-sm font-bold text-white cursor-pointer">List as Active</label>
                <p className="text-[10px] text-[#A1A1AA] mt-0.5">Uncheck to save as inactive (not visible to renters).</p>
              </div>
            </div>
          </section>

          <button type="submit" disabled={isSubmitting || saved}
            className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-xl">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Saving...</> : (isEdit ? 'Update Vehicle' : 'List Vehicle')}
          </button>
        </form>
      </div>
    </div>
  );
}
