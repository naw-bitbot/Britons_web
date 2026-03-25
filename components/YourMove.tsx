
import React, { useState, useEffect, useRef } from 'react';
import { DEMO_MODE, STORAGE_KEYS } from '../config';
import { quoteStore, SavedQuote, CustomsItem, Message } from '../services';
import { 
  Lock, CheckCircle2, Truck, ClipboardList, MessageSquare, 
  Calendar, FileText, Send, Plus, Trash2, AlertCircle, 
  ChevronRight, MapPin, Package, ShieldCheck, UserCircle, History, ExternalLink,
  Upload, FileCheck, File, X, Loader2, Clock, Save
} from 'lucide-react';

interface UserDocument {
  id: string;
  name: string;
  status: 'required' | 'pending' | 'approved' | 'rejected';
  fileName?: string;
  uploadDate?: string;
}

const YourMove: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reference, setReference] = useState(DEMO_MODE ? 'ESP-12345' : '');
  const [customerEmail, setCustomerEmail] = useState(DEMO_MODE ? 'demo@example.com' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeMoveData, setActiveMoveData] = useState<SavedQuote | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'customs' | 'documents' | 'messages'>('overview');
  
  // Synced state for customs list
  const [itinerary, setItinerary] = useState<CustomsItem[]>([]);
  const [newItem, setNewItem] = useState({ description: '', value: '', boxNumber: '' });
  const [inventorySelections, setInventorySelections] = useState<Record<string, number>>({});
  const [inventoryCustomItems, setInventoryCustomItems] = useState<Array<{ id: string; label: string; volume: number; quantity: number }>>([]);
  const [newInventoryLabel, setNewInventoryLabel] = useState('');
  const [newInventoryVolume, setNewInventoryVolume] = useState<number | ''>('');
  const [isSavingCustoms, setIsSavingCustoms] = useState(false);

  // Fix: Added missing 'documents' and 'isUploading' states to resolve reference errors in handleFileUpload and JSX.
  const [documents, setDocuments] = useState<UserDocument[]>([
    { id: 'id-front', name: 'Passport / ID (Front)', status: 'required' },
    { id: 'id-back', name: 'Passport / ID (Back)', status: 'required' },
    { id: 'residency', name: 'Spanish Residency / TIE', status: 'required' },
    { id: 'inventory-sign', name: 'Signed Inventory Declaration', status: 'required' },
  ]);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [syncError, setSyncError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeMoveData) {
      setItinerary(activeMoveData.customsList || []);
      setMessages(activeMoveData.messages || []);
      setInventorySelections(activeMoveData.inventorySelections || {});
      setInventoryCustomItems(activeMoveData.inventoryCustomItems || []);
      if (activeTab === 'messages') {
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [activeMoveData, activeTab]);

  // Real-time message sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.quotes && activeMoveData) {
        const allQuotes: SavedQuote[] = JSON.parse(e.newValue || '[]');
        const updated = allQuotes.find(q => q.ref === activeMoveData.ref);
        if (updated && JSON.stringify(updated.messages) !== JSON.stringify(messages)) {
          setMessages(updated.messages || []);
          setActiveMoveData(updated);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [activeMoveData, messages]);

  const persistQuoteChanges = async (updatedQuote: SavedQuote) => {
    setSyncStatus('saving');
    setSyncError('');
    try {
      await quoteStore.upsert(updatedQuote);
      setActiveMoveData(updatedQuote);
      setSyncStatus('saved');
      setTimeout(() => setSyncStatus('idle'), 1200);
    } catch (err) {
      setSyncStatus('error');
      setSyncError(err instanceof Error ? err.message : 'Unable to save changes');
    }
  };

  const persistCustomsChanges = (updatedList: CustomsItem[]) => {
    if (!activeMoveData) return;
    const updatedQuote = { ...activeMoveData, customsList: updatedList };
    void persistQuoteChanges(updatedQuote);
    
    // Visual feedback for save
    setIsSavingCustoms(true);
    setTimeout(() => setIsSavingCustoms(false), 1000);
  };

  const updateItemInline = (id: string, field: keyof CustomsItem, value: string) => {
    const updated = itinerary.map(item => item.id === id ? { ...item, [field]: value } : item);
    setItinerary(updated);
    void persistCustomsChanges(updated);
  };


  const buildCustomsFromInventory = (
    selections: Record<string, number>,
    custom: Array<{ id: string; label: string; volume: number; quantity: number }>
  ): CustomsItem[] => {
    const existingByDescription = new Map(itinerary.map(i => [i.description, i]));
    const items: CustomsItem[] = [];

    INVENTORY_CATEGORIES.forEach(category => {
      category.items.forEach(item => {
        const qty = selections[item.id] || 0;
        if (qty > 0) {
          const description = `${qty} x ${item.label}`;
          const prev = existingByDescription.get(description);
          items.push({ id: `inv-${item.id}`, description, value: prev?.value || '', boxNumber: prev?.boxNumber || '' });
        }
      });
    });

    custom.forEach(ci => {
      if (ci.quantity > 0) {
        const description = `${ci.quantity} x ${ci.label}`;
        const prev = existingByDescription.get(description);
        items.push({ id: ci.id, description, value: prev?.value || '', boxNumber: prev?.boxNumber || '' });
      }
    });

    return items;
  };

  const persistInventoryAndCustoms = (
    selections: Record<string, number>,
    custom: Array<{ id: string; label: string; volume: number; quantity: number }>
  ) => {
    if (!activeMoveData) return;
    const newCustoms = buildCustomsFromInventory(selections, custom);
    setItinerary(newCustoms);
    const updatedQuote = {
      ...activeMoveData,
      inventorySelections: selections,
      inventoryCustomItems: custom,
      customsList: newCustoms,
    };
    void persistQuoteChanges(updatedQuote);
  };

  const updateInventoryQty = (itemId: string, delta: number) => {
    const current = inventorySelections[itemId] || 0;
    const next = Math.max(0, current + delta);
    const updatedSelections = { ...inventorySelections };
    if (next === 0) delete updatedSelections[itemId];
    else updatedSelections[itemId] = next;
    setInventorySelections(updatedSelections);
    void persistInventoryAndCustoms(updatedSelections, inventoryCustomItems);
  };

  const addCustomInventoryItem = () => {
    if (!newInventoryLabel || newInventoryVolume === '' || Number(newInventoryVolume) <= 0) return;
    const newItem = {
      id: `custom-inv-${Date.now()}`,
      label: newInventoryLabel,
      volume: Number(newInventoryVolume),
      quantity: 1,
    };
    const updated = [...inventoryCustomItems, newItem];
    setInventoryCustomItems(updated);
    void persistInventoryAndCustoms(inventorySelections, updated);
    setNewInventoryLabel('');
    setNewInventoryVolume('');
  };

  const updateCustomInventoryQty = (id: string, delta: number) => {
    const updated = inventoryCustomItems
      .map(ci => (ci.id === id ? { ...ci, quantity: Math.max(0, ci.quantity + delta) } : ci))
      .filter(ci => ci.quantity > 0);
    setInventoryCustomItems(updated);
    void persistInventoryAndCustoms(inventorySelections, updated);
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(async () => {
      const savedQuotes = await quoteStore.getAll();
      const normalizedEmail = customerEmail.trim().toLowerCase();
      const foundQuote = savedQuotes.find(q => q.ref.toUpperCase() === reference.toUpperCase() && q.email.toLowerCase() === normalizedEmail);
      
      const demoAccountMatch = DEMO_MODE && reference.toUpperCase() === 'ESP-12345' && normalizedEmail === 'demo@example.com';
      if (demoAccountMatch || foundQuote) {
        if (foundQuote) {
          setActiveMoveData(foundQuote);
        } else {
          // Mock move if using the demo reference
          const demoQuote: SavedQuote = {
            ref: 'ESP-12345',
            email: 'demo@example.com',
            volume: 15,
            price: 3400,
            date: '2024-05-15',
            status: 'In Preparation',
            origin: 'London, UK',
            destination: 'Madrid, Spain',
            customsList: [
              { id: '1', description: 'Kitchenware (Standard Boxes)', value: '400', boxNumber: '1-4' },
              { id: '2', description: 'Dining Room Table (Wrapped)', value: '800', boxNumber: '7' },
            ],
            messages: [
              { id: '1', sender: 'agent', text: 'Hello! Welcome to your move portal. I am your coordinator, Mark. We have confirmed your loading for the 15th.', timestamp: '10:15 AM' }
            ]
          };
          setActiveMoveData(demoQuote);
        }
        setIsAuthenticated(true);
      } else {
        setError('Reference and email do not match. Please check your quote email.');
      }
      setLoading(false);
    }, 1200);
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.value) {
      const updatedList = [...itinerary, { ...newItem, id: Date.now().toString() }];
      setItinerary(updatedList);
      void persistCustomsChanges(updatedList);
      setNewItem({ description: '', value: '', boxNumber: '' });
    }
  };

  const removeItem = (id: string) => {
    const updatedList = itinerary.filter(i => i.id !== id);
    setItinerary(updatedList);
    persistCustomsChanges(updatedList);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeMoveData) {
      const msg: Message = {
        id: Date.now().toString(),
        sender: 'client',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      
      const updatedQuote = { ...activeMoveData, messages: updatedMessages };
      void persistQuoteChanges(updatedQuote);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(docId);
    setTimeout(async () => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status: 'pending', fileName: file.name, uploadDate: new Date().toLocaleDateString() };
        }
        return doc;
      }));
      setIsUploading(null);
    }, 1500);
  };

  const removeFile = (docId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) return { ...doc, status: 'required', fileName: undefined, uploadDate: undefined };
      return doc;
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img src="/removals-to-spain-2.png" alt="Logo" className="h-12 w-auto mx-auto object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Your Move Portal</h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your quote reference or move ID</p>
            {DEMO_MODE && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-2">Demo credentials preloaded</p>}
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Move Reference</label>
              <input required type="text" placeholder="e.g. ESP-12345" className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? 'border-red-500' : 'border-slate-200'}`} value={reference} onChange={(e) => setReference(e.target.value)} />
              {error && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{error}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Registered Email</label>
              <input required type="email" placeholder="name@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-white">Access Dashboard</span><ChevronRight size={18} className="text-white"/></>}
            </button>
          </form>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p className="text-[10px] text-slate-400 font-bold uppercase text-center mb-2">Helpful Tip</p><p className="text-[10px] text-slate-600 leading-relaxed text-center">Don't have a reference? Use the <span className="text-blue-600 font-bold">Quick Quote Calculator</span> and click 'Save Quote' to generate a reference instantly.</p></div>
        </div>
      </div>
    );
  }

  const normalizedMoveStatus = (activeMoveData?.status || '').toLowerCase();
  const moveProgressCopy = normalizedMoveStatus === 'quote saved' ? 'ready for booking.' : 'currently in progress.';
  const formattedEstimatedTotal = typeof activeMoveData?.price === 'number' ? activeMoveData.price.toLocaleString() : '0';

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-slate-900 text-white pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-3 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2"><Truck size={16} /><span>Reference: {reference || activeMoveData?.ref}</span></div>
              <h2 className="text-4xl font-black">Hello, {customerEmail || 'Valued Customer'}</h2>
              <p className="text-slate-400 mt-2">Your relocation to <span className="text-white font-bold">{activeMoveData?.destination || 'Spain'}</span> is {moveProgressCopy}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Target Date</p><p className="text-xl font-black">{activeMoveData?.date ? new Date(activeMoveData.date).toLocaleDateString() : 'TBC'}</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-2xl border border-blue-500 shadow-xl">
                 <p className="text-xs text-blue-100 font-bold uppercase tracking-widest mb-1">Status</p><p className="text-xl font-black">{activeMoveData?.status || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}><Package size={20} /><span>Overview</span></button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}><ClipboardList size={20} /><span>Inventory</span></button>
            <button onClick={() => setActiveTab('customs')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'customs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}><ClipboardList size={20} /><span>Customs List</span></button>
            <button onClick={() => setActiveTab('documents')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}><FileCheck size={20} /><span>Documents</span></button>
            <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}><MessageSquare size={20} /><span>Messages</span></button>
            <div className="pt-8 mt-8 border-t border-slate-200"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 px-4">Contact Agent</p><div className="px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><UserCircle size={20} /></div><div><p className="text-sm font-bold text-slate-800">Mark Collins</p><p className="text-[10px] text-slate-500">Coordinator</p></div></div></div>
            <button onClick={() => setIsAuthenticated(false)} className="w-full mt-12 text-xs font-bold text-slate-400 hover:text-red-500 text-left px-4">Log Out of Portal</button>
          </div>

          <div className="flex-grow p-6 md:p-10">
            {(syncStatus === 'saving' || syncStatus === 'saved' || syncStatus === 'error') && (
              <div className={`mb-4 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${syncStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : syncStatus === 'saved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {syncStatus === 'saving' ? 'Syncing changes…' : syncStatus === 'saved' ? 'SYNC ACTIVE: Changes saved' : syncError || 'Sync failed'}
              </div>
            )}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">Your Move Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl border border-green-100"><div className="bg-green-500 text-white p-2 rounded-lg"><CheckCircle2 size={20} /></div><div><p className="font-bold text-slate-900">Quote Received</p><p className="text-xs text-slate-500">Completed via Web Calculator</p></div></div>
                      <div className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all ${itinerary.length > 0 ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}><div className={`${itinerary.length > 0 ? 'bg-green-500' : 'bg-blue-600'} text-white p-2 rounded-lg`}><ClipboardList size={20} /></div><div><p className="font-bold text-slate-900">Customs Declaration</p><p className="text-xs text-slate-500">{itinerary.length > 0 ? `${itinerary.length} items declared` : 'Please start your inventory list'}</p></div></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2"><MapPin size={18} className="text-blue-600" /><span>Key Details</span></h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 text-sm">Origin</span><span className="font-bold text-slate-900">{activeMoveData?.origin}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 text-sm">Destination</span><span className="font-bold text-slate-900">{activeMoveData?.destination}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 text-sm">Volume</span><span className="font-bold text-slate-900">{activeMoveData?.volume} m³</span></div>
                      <div className="flex justify-between"><span className="text-slate-500 text-sm">Estimated Total</span><span className="font-bold text-blue-600 text-lg">£{formattedEstimatedTotal}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Online Inventory Builder</h3>
                  <p className="text-sm text-slate-500 mt-1">This mirrors your quote inventory and auto-syncs to your Customs List.</p>
                </div>
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                  {INVENTORY_CATEGORIES.map(category => (
                    <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="font-bold text-slate-900 mb-3">{category.label}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateInventoryQty(item.id, -1)} className="p-1 rounded border border-slate-300"><Trash2 size={12} /></button>
                              <span className="min-w-6 text-center font-bold">{inventorySelections[item.id] || 0}</span>
                              <button onClick={() => updateInventoryQty(item.id, 1)} className="p-1 rounded border border-slate-300"><Plus size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-3">Custom Inventory Items</h4>
                  <div className="flex flex-col md:flex-row gap-2 mb-3">
                    <input value={newInventoryLabel} onChange={(e) => setNewInventoryLabel(e.target.value)} placeholder="Item name" className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    <input value={newInventoryVolume} onChange={(e) => setNewInventoryVolume(e.target.value === '' ? '' : Number(e.target.value))} placeholder="m³" type="number" min="0" step="0.01" className="w-28 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    <button onClick={addCustomInventoryItem} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Add</button>
                  </div>
                  <div className="space-y-2">
                    {inventoryCustomItems.map(ci => (
                      <div key={ci.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                        <span className="text-sm font-medium">{ci.label}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCustomInventoryQty(ci.id, -1)} className="p-1 rounded border border-slate-300"><Trash2 size={12} /></button>
                          <span className="min-w-6 text-center font-bold">{ci.quantity}</span>
                          <button onClick={() => updateCustomInventoryQty(ci.id, 1)} className="p-1 rounded border border-slate-300"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center space-x-3">
                  <CheckCircle2 className="text-green-600" size={18} />
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wide">SYNC ACTIVE: Inventory updates are mirrored to your Customs List and visible to admin.</p>
                </div>
              </div>
            )}

            {activeTab === 'customs' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Customs Itinerary (T1 Document)</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold flex items-center gap-2">
                       {itinerary.length > 0 && itinerary.every(i => i.value !== '') ? (
                          <span className="text-green-600 flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12}/> Manifest Ready for Review</span>
                       ) : itinerary.length === 0 ? (
                          <span className="text-slate-400 flex items-center gap-1 uppercase tracking-widest">Inventory list empty</span>
                       ) : (
                          <span className="text-amber-600 flex items-center gap-1 uppercase tracking-widest"><AlertCircle size={12}/> Please refine values for items</span>
                       )}
                       {isSavingCustoms && <><Loader2 size={12} className="animate-spin text-blue-600"/> <span className="text-blue-600 uppercase tracking-widest ml-1">Changes Saved</span></>}
                    </p>
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg hover:bg-slate-800 transition-colors">
                    <FileText size={16} /><span>Preview T1 Manifest</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                      <tr>
                        <th className="px-6 py-4">Item Description</th>
                        <th className="px-6 py-4">Est. Value (GBP)</th>
                        <th className="px-6 py-4 w-32">Box No.</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itinerary.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                             <div className="flex flex-col items-center justify-center opacity-40">
                                <ClipboardList size={48} className="mb-4" />
                                <p className="font-bold text-lg text-slate-900">No Items Declared</p>
                                <p className="text-xs max-w-xs mx-auto mt-2 leading-relaxed text-slate-500">
                                   International removals require a specific manifest. 
                                   Since your quote was based on property size, please add each item group manually below.
                                </p>
                             </div>
                          </td>
                        </tr>
                      )}
                      {itinerary.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={item.description} 
                              onChange={(e) => updateItemInline(item.id, 'description', e.target.value)}
                              className="w-full bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 p-0"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                               <span className="text-slate-400 font-bold">£</span>
                               <input 
                                  type="text" 
                                  placeholder="0.00" 
                                  value={item.value} 
                                  onChange={(e) => updateItemInline(item.id, 'value', e.target.value)}
                                  className={`w-24 bg-transparent border-b ${item.value === '' ? 'border-amber-200 bg-amber-50/30' : 'border-transparent'} text-sm font-bold text-slate-900 focus:ring-0 p-0.5 focus:border-blue-500 transition-colors`}
                               />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              placeholder="e.g. 1" 
                              value={item.boxNumber} 
                              onChange={(e) => updateItemInline(item.id, 'boxNumber', e.target.value)}
                              className="w-full bg-transparent border-none text-sm font-mono text-slate-600 focus:ring-0 p-0"
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100" title="Remove item">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50/30">
                        <td className="px-6 py-4">
                          <input type="text" placeholder="Add additional item..." className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-blue-300" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                             <span className="text-blue-300 font-bold">£</span>
                             <input type="text" placeholder="Value" className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-blue-300" value={newItem.value} onChange={(e) => setNewItem({...newItem, value: e.target.value})} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input type="text" placeholder="Box #" className="bg-transparent border-none outline-none w-full text-sm font-mono placeholder:text-blue-300" value={newItem.boxNumber} onChange={(e) => setNewItem({...newItem, boxNumber: e.target.value})} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={handleAddItem} className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                             <Plus size={18} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {itinerary.length > 0 ? (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="text-green-600" size={18} />
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Sync Active: Your logistics agent can now review these items in real-time.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3 shadow-sm">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      <strong>Requirement:</strong> To comply with Spanish Customs, every major item or box group must be declared with a GBP value. Use the blue row to build your manifest.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h3 className="text-2xl font-bold text-slate-900">Required Documentation</h3><p className="text-slate-500 text-sm mt-1">Upload files required for customs clearance.</p></div><div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200"><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 text-center">Status</p><div className="flex items-center space-x-2"><span className="text-xs font-bold text-slate-700">{documents.filter(d => d.status === 'pending' || d.status === 'approved').length} / {documents.length} Uploaded</span></div></div></div>
                <div className="grid grid-cols-1 gap-4">
                  {documents.map(doc => (
                    <div key={doc.id} className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${doc.status === 'required' ? 'bg-white border-slate-200' : doc.status === 'pending' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center space-x-4"><div className={`p-3 rounded-2xl ${doc.status === 'required' ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}><File size={24} /></div><div><h4 className="font-bold text-slate-900">{doc.name}</h4>{doc.fileName ? <p className="text-xs text-slate-500 font-medium">Uploaded: {doc.fileName}</p> : <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-1">File Required</p>}</div></div>
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        {doc.status === 'required' ? <label className="flex-grow md:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center justify-center space-x-2 shadow-lg">{isUploading === doc.id ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}<span>{isUploading === doc.id ? 'Uploading...' : 'Upload File'}</span><input type="file" className="hidden" onChange={(e) => handleFileUpload(doc.id, e)} accept=".pdf,.jpg,.jpeg,.png" disabled={isUploading !== null} /></label> : <div className="flex items-center space-x-2"><div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${doc.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{doc.status === 'pending' ? <Clock size={14} /> : <CheckCircle2 size={14} />}<span>{doc.status}</span></div><button onClick={() => removeFile(doc.id)} className="p-2.5 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-xl transition-colors"><Trash2 size={16} /></button></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="flex flex-col h-full max-h-[600px] animate-fade-in bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={20} className="text-blue-600"/><span>Coordinator Chat</span></h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Team is Online</span>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-[300px]">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                       <MessageSquare size={40} className="mb-2" />
                       <p className="font-bold">Start a conversation with our logistics team.</p>
                    </div>
                  )}
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'client' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-bold">{msg.timestamp}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-grow bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                  />
                  <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }`}</style>
    </div>
  );
};

export default YourMove;
