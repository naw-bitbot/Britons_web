
import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Home, Info, ShieldCheck, Truck, Package, Plus, Minus, ChevronDown, ChevronUp, Trash2, ArrowRight, ListChecks, Calendar, PlusCircle, AlertTriangle, Mail, Save, CheckCircle } from 'lucide-react';
import { CALCULATOR_OPTIONS, INVENTORY_CATEGORIES } from '../constants';
import { quoteStore, SavedQuote } from '../services';

interface QuickQuoteCalculatorProps {
  onRequestFullQuote: () => void;
}

interface CustomItem {
  id: string;
  label: string;
  volume: number;
  quantity: number;
}

const QuickQuoteCalculator: React.FC<QuickQuoteCalculatorProps> = ({ onRequestFullQuote }) => {
  const [calculationMode, setCalculationMode] = useState<'size' | 'inventory'>('size');
  const [propertySize, setPropertySize] = useState(CALCULATOR_OPTIONS.propertySizes[1].id);
  const routeOptions = useMemo(() => ([
    ...CALCULATOR_OPTIONS.ukRegions.map(r => ({ id: `uk-${r.id}`, label: r.label, offset: r.offset })),
    ...CALCULATOR_OPTIONS.spainRegions.map(r => ({ id: `es-${r.id}`, label: r.label, offset: r.offset })),
  ]), []);

  const [originRegion, setOriginRegion] = useState(routeOptions[0].id);
  const [destinationRegion, setDestinationRegion] = useState(routeOptions[CALCULATOR_OPTIONS.ukRegions.length].id);
  const [moveType, setMoveType] = useState<'dedicated' | 'shared'>('dedicated');
  const [moveDate, setMoveDate] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(INVENTORY_CATEGORIES[0].id);
  
  // Save Quote State
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [generatedRef, setGeneratedRef] = useState('');
  
  // Custom item input state
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomVolume, setNewCustomVolume] = useState<number | ''>('');

  // Calculate minimum move date (14 days from today for international customs)
  const minMoveDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }, []);

  const totalVolume = useMemo(() => {
    if (calculationMode === 'size') {
      const size = CALCULATOR_OPTIONS.propertySizes.find(s => s.id === propertySize);
      return size?.estVolume || 0;
    } else {
      let volume = 0;
      INVENTORY_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (inventory[item.id]) {
            volume += inventory[item.id] * item.volume;
          }
        });
      });
      customItems.forEach(item => {
        volume += item.quantity * item.volume;
      });
      return parseFloat(volume.toFixed(2));
    }
  }, [calculationMode, propertySize, inventory, customItems]);

  const totalEstimate = useMemo(() => {
    const origin = routeOptions.find(r => r.id === originRegion);
    const destination = routeOptions.find(r => r.id === destinationRegion);

    if (!origin || !destination) return 0;

    let base = totalVolume * CALCULATOR_OPTIONS.pricePerM3;
    if (base < 500) base = 500;
    if (moveType === 'shared') base = base * 0.75;

    base += origin.offset;
    base += destination.offset;

    if (extras.includes('packing')) base += totalVolume * 50;
    if (extras.includes('storage')) base += 180;
    if (extras.includes('insurance')) base += 120;

    return Math.round(base);
  }, [totalVolume, originRegion, destinationRegion, moveType, extras, routeOptions]);


  const isSharedLoadAllowed = calculationMode !== 'size' || propertySize !== '4bed';

  useEffect(() => {
    if (!isSharedLoadAllowed && moveType === 'shared') {
      setMoveType('dedicated');
    }
  }, [isSharedLoadAllowed, moveType]);

  const toggleExtra = (id: string) => {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !customerName.trim()) return;
    setSaveError('');

    // Generate unique reference to avoid accidental cross-account collisions
    const existingQuotes = await quoteStore.getAll();
    const existingRefs = new Set(existingQuotes.map(q => q.ref));
    let ref = '';
    do {
      ref = `ESP-${Math.floor(10000 + Math.random() * 90000)}`;
    } while (existingRefs.has(ref));
    setGeneratedRef(ref);

    // Build Customs Manifest only if Detailed Inventory was used
    const initialCustomsList: any[] = [];
    if (calculationMode === 'inventory') {
      INVENTORY_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (inventory[item.id] > 0) {
            initialCustomsList.push({
              id: `init-${item.id}`,
              description: `${inventory[item.id]} x ${item.label}`,
              value: '', // Client must refine values later
              boxNumber: ''
            });
          }
        });
      });

      customItems.forEach(item => {
        initialCustomsList.push({
          id: item.id,
          description: `${item.quantity} x ${item.label}`,
          value: '',
          boxNumber: ''
        });
      });
    }

    // Persist for system (via localStorage mock)
    const quoteData: SavedQuote = {
      ref,
      email,
      customerName: customerName.trim(),
      volume: totalVolume,
      price: totalEstimate,
      date: moveDate,
      status: 'Quote Saved',
      origin: routeOptions.find(r => r.id === originRegion)?.label,
      destination: routeOptions.find(r => r.id === destinationRegion)?.label,
      moveType: moveType,
      extras: extras.map(exId => CALCULATOR_OPTIONS.services.find(s => s.id === exId)?.label || exId),
      propertySize: calculationMode === 'size' ? CALCULATOR_OPTIONS.propertySizes.find(s => s.id === propertySize)?.label : 'Custom Inventory',
      customsList: initialCustomsList,
      inventorySelections: calculationMode === 'inventory' ? inventory : {},
      inventoryCustomItems: calculationMode === 'inventory' ? customItems : [],
      timestamp: Date.now()
    };
    
    try {
      await quoteStore.create(quoteData);
      setSaveSuccess(true);
      setIsSaving(false);
    } catch (err) {
      setSaveError('Unable to save estimate right now. Please try again.');
    }
  };

  const updateInventory = (id: string, delta: number) => {
    setInventory(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const updateCustomItemQuantity = (id: string, delta: number) => {
    setCustomItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const addCustomItem = () => {
    if (!newCustomLabel || newCustomVolume === '' || newCustomVolume <= 0) return;
    const newItem: CustomItem = {
      id: `custom-${Date.now()}`,
      label: newCustomLabel,
      volume: Number(newCustomVolume),
      quantity: 1
    };
    setCustomItems(prev => [...prev, newItem]);
    setNewCustomLabel('');
    setNewCustomVolume('');
  };

  const clearInventory = () => {
    setInventory({});
    setCustomItems([]);
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Calculator size={16} />
                <span>Smart Volume Estimator</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Quote Cost Calculator</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Estimate your move based on property size or a detailed itemized inventory. Our system calculates volume precisely for Spanish transit in cubic meters.
              </p>
            </div>

            <div className="flex p-1 bg-slate-800 rounded-2xl w-fit">
              <button 
                onClick={() => setCalculationMode('size')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${calculationMode === 'size' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Property Size
              </button>
              <button 
                onClick={() => setCalculationMode('inventory')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${calculationMode === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Detailed Inventory
              </button>
            </div>

            <div className="space-y-8">
              {calculationMode === 'size' ? (
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Home Size</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CALCULATOR_OPTIONS.propertySizes.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setPropertySize(size.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${propertySize === size.id ? 'bg-blue-500/10 border-blue-500 text-white' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Home size={20} className={propertySize === size.id ? 'text-blue-400' : 'text-slate-500'} />
                          <span className="font-bold">{size.label}</span>
                        </div>
                        <span className="text-xs font-mono opacity-60">~{size.estVolume} m³</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Add Items</label>
                    <button onClick={clearInventory} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center space-x-1">
                      <Trash2 size={12} />
                      <span>Clear All</span>
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {INVENTORY_CATEGORIES.map(category => (
                      <div key={category.id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800">
                        <button 
                          onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors"
                        >
                          <span className="font-bold">{category.label}</span>
                          {activeCategory === category.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {activeCategory === category.id && (
                          <div className="p-4 pt-0 space-y-4">
                            {category.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{item.label}</span>
                                  <span className="text-[10px] text-slate-500 uppercase">{item.volume} m³</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button onClick={() => updateInventory(item.id, -1)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-6 text-center font-bold text-blue-400">{inventory[item.id] || 0}</span>
                                  <button onClick={() => updateInventory(item.id, 1)} className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-500/30">
                        <button onClick={() => setActiveCategory(activeCategory === 'custom' ? null : 'custom')} className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors">
                          <span className="font-bold flex items-center space-x-2">
                             <PlusCircle size={18} className="text-blue-400" />
                             <span>Custom & Unique Items</span>
                          </span>
                          {activeCategory === 'custom' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {activeCategory === 'custom' && (
                          <div className="p-4 pt-0 space-y-4">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <input type="text" placeholder="Item name..." value={newCustomLabel} onChange={(e) => setNewCustomLabel(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                              <div className="flex space-x-2">
                                <input type="number" placeholder="Vol (m³)" value={newCustomVolume} onChange={(e) => setNewCustomVolume(e.target.value === '' ? '' : Number(e.target.value))} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full" />
                                <button onClick={addCustomItem} className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-white font-bold text-xs transition-colors">ADD</button>
                              </div>
                            </div>
                            {customItems.length > 0 && (
                              <div className="space-y-3 pt-2 border-t border-slate-700/50">
                                {customItems.map(item => (
                                  <div key={item.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-blue-500/10">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{item.label}</span>
                                      <span className="text-[10px] text-slate-500 uppercase">{item.volume} m³ each</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <button onClick={() => updateCustomItemQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"><Minus size={14} /></button>
                                      <span className="w-6 text-center font-bold text-blue-400">{item.quantity}</span>
                                      <button onClick={() => updateCustomItemQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors"><Plus size={14} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setMoveType('dedicated')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center space-y-2 ${moveType === 'dedicated' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'}`}>
                  <Truck className={moveType === 'dedicated' ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="font-bold block">Dedicated Load</span>
                  <span className="text-xs text-slate-500">Fastest Direct Route</span>
                </button>
                <button onClick={() => isSharedLoadAllowed && setMoveType('shared')} disabled={!isSharedLoadAllowed} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center space-y-2 ${!isSharedLoadAllowed ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-800/30' : moveType === 'shared' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'}`}>
                  <Package className={moveType === 'shared' ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="font-bold block">Shared Load</span>
                  <span className="text-xs text-slate-500">{isSharedLoadAllowed ? 'Weekly Groupage' : 'Not available for 4+ bed dedicated moves'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Origin</label>
                  <select value={originRegion} onChange={(e) => setOriginRegion(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                    {routeOptions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Destination</label>
                  <select value={destinationRegion} onChange={(e) => setDestinationRegion(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                    {routeOptions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Desired Move Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                      type="date"
                      min={minMoveDate}
                      value={moveDate}
                      onChange={(e) => setMoveDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white [color-scheme:dark] transition-all"
                    />
                  </div>
                  <div className="flex items-start space-x-2 mt-2">
                    <AlertTriangle size={12} className="text-amber-500 mt-1 shrink-0" />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
                      A minimum 14-day notice period is required to secure vehicle space and complete export customs processing for Spain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 text-slate-900 shadow-2xl relative border border-slate-100">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2">
                <ShieldCheck size={18} />
                <span>Customs Included</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Total Volume</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-slate-900">{totalVolume.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                    <span className="text-slate-400 font-bold">m³</span>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Estimated Cost</p>
                  <div className="flex items-baseline md:justify-end space-x-2">
                    <span className="text-5xl md:text-6xl font-black text-blue-600 tracking-tighter">£{totalEstimate.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide">
                    Minimum charge of £500 applies to all international moves.
                  </p>
                </div>
              </div>

              {saveSuccess ? (
                <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-200 animate-fade-in text-center">
                  <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-lg">Quote Saved Successfully, {customerName}!</h4>
                  <p className="text-slate-600 text-sm mt-1">Your reference: <span className="font-mono font-black text-blue-600">{generatedRef}</span></p>
                  <p className="text-xs text-slate-500 mt-2">A copy has been emailed to {email}. You can use this reference in the <span className="font-bold">Your Move</span> portal.</p>
                  <button 
                    onClick={() => setSaveSuccess(false)}
                    className="mt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Save to another email
                  </button>
                </div>
              ) : isSaving ? (
                <form onSubmit={handleSaveQuote} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-scale-up">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <Mail size={18} className="text-blue-600" />
                    <span>Send Quote to Email</span>
                  </h4>
                  <div className="space-y-4">
                    {saveError && <p className="text-xs font-bold text-red-600">{saveError}</p>}
                    <input
                      required
                      type="text"
                      placeholder="Enter your full name..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <input 
                      required
                      type="email" 
                      placeholder="Enter your email address..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        type="submit"
                        className="flex-grow bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
                      >
                        Confirm & Save
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsSaving(false)}
                        className="px-4 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex gap-3 mb-8">
                  <button 
                    onClick={() => setIsSaving(true)}
                    className="flex-grow bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 group"
                  >
                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Save My Quote</span>
                  </button>
                </div>
              )}

              {moveDate && (
                <div className="mb-8 p-4 bg-blue-50 rounded-2xl flex items-center space-x-3 border border-blue-100">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Planned Departure</p>
                    <p className="text-slate-900 font-bold">{new Date(moveDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-10 border-t border-slate-100 pt-8">
                <p className="font-bold text-slate-900 flex items-center space-x-2">
                  <ListChecks size={18} className="text-blue-600" />
                  <span>Optional Protection & Services:</span>
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {CALCULATOR_OPTIONS.services.map(service => (
                    <label key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${extras.includes(service.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                          {extras.includes(service.id) && <Plus size={12} className="text-white" />}
                        </div>
                        <span className="font-medium text-slate-700">{service.label}</span>
                      </div>
                      <input type="checkbox" className="hidden" checked={extras.includes(service.id)} onChange={() => toggleExtra(service.id)} />
                      <span className="text-slate-400 text-sm font-bold group-hover:text-blue-600">
                        {service.id === 'packing' ? `+£${Math.round(totalVolume * 50)}` : `+£${service.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={onRequestFullQuote}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-3"
              >
                <span>Submit Estimate</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
      `}</style>
    </section>
  );
};

export default QuickQuoteCalculator;
