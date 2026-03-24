
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DEMO_MODE, STORAGE_KEYS } from '../config';
import { quoteStore, SavedQuote, CustomsItem, Message } from '../services';
import { 
  Lock, ShieldCheck, ChevronRight, Users, TrendingUp, 
  Package, Calendar, CheckCircle, Clock, Trash2, 
  Search, Filter, Download, LayoutDashboard, Database, AlertCircle, RefreshCw, Eye, X, MapPin, Info, Truck, Archive, ClipboardList, Plus, Save, UserCircle, MessageSquare, Send
} from 'lucide-react';

// Fix: Declaring AdminPortal as a functional component with explicit React.FC type.
const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'database'>('dashboard');
  const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
  
  // Detail Modal States
  const [modalTab, setModalTab] = useState<'customs' | 'chat'>('customs');
  const [editingCustoms, setEditingCustoms] = useState<CustomsItem[]>([]);
  const [newCustomsItem, setNewCustomsItem] = useState({ description: '', value: '', boxNumber: '' });
  
  // Chat States
  const [adminMessages, setAdminMessages] = useState<Message[]>([]);
  const [adminNewMessage, setAdminNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadQuotes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedQuote) {
      setEditingCustoms(selectedQuote.customsList || []);
      setAdminMessages(selectedQuote.messages || []);
      if (modalTab === 'chat') {
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [selectedQuote, modalTab]);

  // Sync messages from other tabs (e.g., if client sends a message)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.quotes && selectedQuote) {
        const allQuotes: SavedQuote[] = JSON.parse(e.newValue || '[]');
        const updated = allQuotes.find(q => q.ref === selectedQuote.ref);
        if (updated && JSON.stringify(updated.messages) !== JSON.stringify(adminMessages)) {
          setAdminMessages(updated.messages || []);
          setQuotes(allQuotes.slice().reverse());
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedQuote, adminMessages]);

  const loadQuotes = async () => {
    const saved = await quoteStore.getAll();
    setQuotes(saved.slice().reverse());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (DEMO_MODE && password === 'admin123') {
        setIsAuthenticated(true);
      } else {
        alert(DEMO_MODE ? 'Invalid admin password' : 'Demo admin bypass is disabled. Connect secure backend auth.');
      }
      setLoading(false);
    }, 800);
  };

  const updateQuoteInStorage = (updatedQuote: SavedQuote) => {
    quoteStore.upsert(updatedQuote);
    loadQuotes();
  };

  const updateQuoteStatus = (ref: string, newStatus: string) => {
    const quote = quotes.find(q => q.ref === ref);
    if (!quote) return;
    const updated = { ...quote, status: newStatus };
    updateQuoteInStorage(updated);
    if (selectedQuote?.ref === ref) {
      setSelectedQuote(updated);
    }
  };

  const saveCustomsChanges = () => {
    if (!selectedQuote) return;
    const updated = { ...selectedQuote, customsList: editingCustoms };
    updateQuoteInStorage(updated);
    setSelectedQuote(updated);
    alert('Customs manifest updated successfully.');
  };

  const sendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote || !adminNewMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: adminNewMessage,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...adminMessages, newMessage];
    setAdminMessages(updatedMessages);
    
    const updatedQuote = { ...selectedQuote, messages: updatedMessages };
    updateQuoteInStorage(updatedQuote);
    setSelectedQuote(updatedQuote);
    setAdminNewMessage('');
    setTimeout(scrollToBottom, 100);
  };

  const addCustomsItem = () => {
    if (!newCustomsItem.description) return;
    const item: CustomsItem = {
      id: Date.now().toString(),
      ...newCustomsItem
    };
    setEditingCustoms([...editingCustoms, item]);
    setNewCustomsItem({ description: '', value: '', boxNumber: '' });
  };

  const removeCustomsItem = (id: string) => {
    setEditingCustoms(editingCustoms.filter(i => i.id !== id));
  };

  const deleteQuote = (ref: string) => {
    if (confirm('Are you sure you want to delete this quote record?')) {
      const newQuotes = quotes.filter((q: SavedQuote) => q.ref !== ref);
      quoteStore.replaceAll(newQuotes);
      setQuotes(newQuotes.slice().reverse());
      if (selectedQuote?.ref === ref) setSelectedQuote(null);
    }
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => 
      q.ref.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  const stats = useMemo(() => {
    return {
      totalQuotes: quotes.length,
      totalVolume: Math.round(quotes.reduce((acc, curr) => acc + curr.volume, 0)),
      totalPotentialRevenue: Math.round(quotes.reduce((acc, curr) => acc + curr.price, 0)),
      acceptedMoves: quotes.filter(q => q.status === 'Quote Accepted').length
    };
  }, [quotes]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img src="/removals-to-spain-2.png" alt="Logo" className="h-10 w-auto mx-auto object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Admin Portal</h2>
            <p className="text-slate-500 mt-2 text-sm">Staff portal for Briton's Removals</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Administrator Password</label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2">
              {loading ? <RefreshCw className="animate-spin" /> : <span>Access Admin Console</span>}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">Authorized Access Only</p>
          <p className="text-center text-[10px] text-amber-500 mt-2 font-bold uppercase tracking-widest">{DEMO_MODE ? 'Demo mode enabled' : 'Demo mode disabled'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <ShieldCheck size={28} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">Admin Console</h2>
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>System Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={loadQuotes} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors" title="Refresh Data">
                <RefreshCw size={20} />
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="px-6 py-3 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-24">
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
               <div><p className="text-xs font-bold text-slate-400 uppercase">Potential Revenue</p><p className="text-2xl font-black text-slate-900">£{stats.totalPotentialRevenue.toLocaleString()}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-4">
               <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Package size={24} /></div>
               <div><p className="text-xs font-bold text-slate-400 uppercase">Total Volume (m³)</p><p className="text-2xl font-black text-slate-900">{stats.totalVolume.toLocaleString()}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><CheckCircle size={24} /></div>
               <div><p className="text-xs font-bold text-slate-400 uppercase">Accepted Moves</p><p className="text-2xl font-black text-slate-900">{stats.acceptedMoves}</p></div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-4">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Users size={24} /></div>
               <div><p className="text-xs font-bold text-slate-400 uppercase">Total Saved Quotes</p><p className="text-2xl font-black text-slate-900">{stats.totalQuotes}</p></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 h-fit space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20} /><span>Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('quotes')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === 'quotes' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Calendar size={20} /><span>Manage Quotes</span>{stats.totalQuotes > 0 && <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full">{stats.totalQuotes}</span>}
            </button>
            <button onClick={() => setActiveTab('database')} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === 'database' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Database size={20} /><span>System Backup</span>
            </button>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[600px]">
            {activeTab === 'quotes' && (
              <div className="animate-fade-in p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                   <h3 className="text-2xl font-black text-slate-900">Saved System Quotes</h3>
                   <div className="flex items-center space-x-2 w-full md:w-auto">
                      <div className="relative flex-grow md:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <input type="text" placeholder="Search Ref or Email..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                      <button className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"><Filter size={18} /></button>
                      <button className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"><Download size={18} /></button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="px-6 py-4">Quote Ref</th><th className="px-6 py-4">Client Details</th><th className="px-6 py-4">Route / Volume</th><th className="px-6 py-4">Value</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredQuotes.length === 0 ? (
                        <tr><td colSpan={6} className="py-20 text-center"><div className="flex flex-col items-center justify-center opacity-30"><Database size={48} className="mb-4" /><p className="font-bold">No system quotes found</p></div></td></tr>
                      ) : (
                        filteredQuotes.map(quote => (
                          <tr key={quote.ref} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5"><span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">{quote.ref}</span></td>
                            <td className="px-6 py-5"><p className="text-sm font-bold text-slate-900">{quote.email}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{quote.date || 'No date set'}</p></td>
                            <td className="px-6 py-5"><p className="text-xs font-medium text-slate-600">{quote.origin} → {quote.destination}</p><p className="text-[10px] text-slate-400 font-bold">{quote.volume} m³</p></td>
                            <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">£{quote.price.toLocaleString()}</span></td>
                            <td className="px-6 py-5"><span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${quote.status === 'Quote Accepted' ? 'bg-green-100 text-green-700' : quote.status === 'Quote Saved' ? 'bg-blue-100 text-blue-700' : quote.status === 'Archived' ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-700'}`}>{quote.status}</span></td>
                            <td className="px-6 py-5 text-right">
                               <div className="flex items-center justify-end space-x-1.5">
                                  <button onClick={() => updateQuoteStatus(quote.ref, 'Quote Accepted')} className={`p-2 transition-all rounded-lg border ${quote.status === 'Quote Accepted' ? 'bg-green-500 text-white border-green-500' : 'bg-slate-50 text-slate-400 hover:text-green-600 hover:border-green-200 border-slate-200'}`} title="Accept Quote"><CheckCircle size={16} /></button>
                                  <button onClick={() => updateQuoteStatus(quote.ref, 'Archived')} className={`p-2 transition-all rounded-lg border ${quote.status === 'Archived' ? 'bg-slate-500 text-white border-slate-500' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:border-slate-300 border-slate-200'}`} title="Archive Quote"><Archive size={16} /></button>
                                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                  <button onClick={() => setSelectedQuote(quote)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg border border-slate-200" title="View Details"><Eye size={16} /></button>
                                  <button onClick={() => deleteQuote(quote.ref)} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-lg border border-slate-200" title="Delete Record"><Trash2 size={16} /></button>
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'dashboard' && (
              <div className="p-8 animate-fade-in space-y-8">
                 <div className="flex justify-between items-center"><h3 className="text-2xl font-black text-slate-900">Operations Summary</h3><p className="text-xs text-slate-400 font-bold uppercase">Real-time Metrics</p></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                       <h4 className="font-black text-slate-900 mb-4 flex items-center space-x-2"><CheckCircle size={18} className="text-green-600" /><span>Conversion Rate</span></h4>
                       <div className="flex items-baseline space-x-2 mb-6"><span className="text-4xl font-black text-slate-900">{stats.totalQuotes > 0 ? Math.round((stats.acceptedMoves / stats.totalQuotes) * 100) : 0}%</span><span className="text-slate-400 font-bold">of quotes saved</span></div>
                       <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${stats.totalQuotes > 0 ? (stats.acceptedMoves / stats.totalQuotes) * 100 : 0}%` }} /></div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                       <h4 className="font-black text-slate-900 mb-4 flex items-center space-x-2"><Clock size={18} className="text-amber-600" /><span>Upcoming Departures</span></h4>
                       <div className="space-y-4">
                          {quotes.filter(q => q.status === 'Quote Accepted').slice(0, 3).map(q => (
                            <div key={q.ref} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                               <div><p className="text-xs font-black text-slate-900">{q.destination}</p><p className="text-[10px] text-slate-400 font-bold">{q.date}</p></div>
                               <span className="font-mono text-[10px] font-black text-blue-600">{q.ref}</span>
                            </div>
                          ))}
                          {quotes.filter(q => q.status === 'Quote Accepted').length === 0 && <p className="text-xs text-slate-400 italic">No accepted moves pending departure.</p>}
                       </div>
                    </div>
                 </div>
                 <div className="p-8 bg-blue-900 text-white rounded-[2rem] relative overflow-hidden shadow-2xl">
                    <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                    <div className="relative z-10"><h4 className="text-xl font-bold mb-2">Market Insight: UK to Spain</h4><p className="text-blue-200 text-sm leading-relaxed max-w-xl">Current trends show a 15% increase in removals to the Costa Blanca region this quarter. Logistics optimization suggests consolidating part-loads for Murcia on Friday runs.</p></div>
                 </div>
              </div>
            )}
            {activeTab === 'database' && (
              <div className="p-8 animate-fade-in flex flex-col items-center justify-center text-center py-20">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"><Database size={40} className="text-slate-400" /></div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">System Database Management</h3>
                 <p className="text-slate-500 max-w-md mb-8">Export all system quotes to a CSV or JSON file for secondary backup or external auditing.</p>
                 <div className="flex gap-4">
                    <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center space-x-2"><Download size={18} /><span>Export Full CSV</span></button>
                    <button onClick={() => { if(confirm('WIPE ALL QUOTES?')) { quoteStore.replaceAll([]); setQuotes([]); } }} className="px-8 py-3 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center space-x-2"><AlertCircle size={18} /><span>Wipe All Records</span></button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedQuote(null)} />
           <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200 h-[90vh] flex flex-col">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center shrink-0">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black">Ref</div>
                    <div>
                       <h3 className="text-2xl font-black">{selectedQuote.ref}</h3>
                       <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Full Administrative Breakdown</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedQuote(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              <div className="flex-grow overflow-hidden flex bg-slate-50">
                 {/* Sidebar - Quote Overview */}
                 <div className="w-80 border-r border-slate-200 p-6 space-y-6 overflow-y-auto bg-white">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <UserCircle size={14} className="text-blue-600" />
                          <span>Client Profile</span>
                       </h4>
                       <div className="space-y-3">
                          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="text-sm font-black text-slate-900 truncate">{selectedQuote.email}</p></div>
                          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Target Date</p><p className="text-sm font-black text-slate-900">{selectedQuote.date || 'TBC'}</p></div>
                          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Volume</p><p className="text-sm font-black text-slate-900">{selectedQuote.volume} m³</p></div>
                          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                             <select value={selectedQuote.status} onChange={(e) => updateQuoteStatus(selectedQuote.ref, e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none">
                                <option value="Quote Saved">Quote Saved</option><option value="Quote Accepted">Quote Accepted</option><option value="Survey Booked">Survey Booked</option><option value="Loading Confirmed">Loading Confirmed</option><option value="Archived">Archived</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
                       <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Financials</h4>
                       <div className="flex items-baseline justify-between">
                          <span className="text-xs text-blue-200 font-bold uppercase">Estimated</span>
                          <span className="text-3xl font-black">£{selectedQuote.price.toLocaleString()}</span>
                       </div>
                       <div className="pt-4 border-t border-blue-800 space-y-2">
                          {selectedQuote.extras?.map((ex, i) => (
                             <div key={i} className="flex items-center space-x-2 text-[10px] font-bold text-blue-200">
                                <CheckCircle size={12} className="text-green-400" /><span>{ex}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Main Content Area */}
                 <div className="flex-grow flex flex-col overflow-hidden">
                    {/* Inner Navigation */}
                    <div className="flex border-b border-slate-200 bg-white shrink-0">
                       <button onClick={() => setModalTab('customs')} className={`px-8 py-4 font-bold text-sm transition-all relative ${modalTab === 'customs' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                          <div className="flex items-center gap-2"><ClipboardList size={18}/><span>Customs Manifest</span></div>
                          {modalTab === 'customs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                       </button>
                       <button onClick={() => setModalTab('chat')} className={`px-8 py-4 font-bold text-sm transition-all relative ${modalTab === 'chat' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                          <div className="flex items-center gap-2"><MessageSquare size={18}/><span>Client Communication</span></div>
                          {modalTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                       </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-grow overflow-y-auto p-8 relative">
                       {modalTab === 'customs' && (
                          <div className="space-y-6 animate-fade-in">
                             <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                   <Archive size={16} className="text-blue-600" />
                                   <span>T1/T2 Shipping Declaration</span>
                                </h4>
                                <button onClick={saveCustomsChanges} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                                   <Save size={14} /><span>Save All Changes</span>
                                </button>
                             </div>

                             <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-2 text-[10px] font-black text-slate-400 uppercase px-3">
                                   <div className="col-span-6">Description</div><div className="col-span-3">Value</div><div className="col-span-2">Box</div><div className="col-span-1"></div>
                                </div>
                                
                                <div className="space-y-2">
                                   {editingCustoms.map((item) => (
                                      <div key={item.id} className="grid grid-cols-12 gap-2 bg-white p-2 rounded-xl items-center border border-slate-200 hover:border-blue-300 transition-all shadow-sm">
                                         <div className="col-span-6"><input type="text" value={item.description} onChange={(e) => setEditingCustoms(editingCustoms.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} className="w-full bg-transparent border-none text-xs font-bold text-slate-800 focus:ring-0" /></div>
                                         <div className="col-span-3"><input type="text" value={item.value} onChange={(e) => setEditingCustoms(editingCustoms.map(i => i.id === item.id ? { ...i, value: e.target.value } : i))} className="w-full bg-transparent border-none text-xs font-medium text-slate-600 focus:ring-0" /></div>
                                         <div className="col-span-2"><input type="text" value={item.boxNumber} onChange={(e) => setEditingCustoms(editingCustoms.map(i => i.id === item.id ? { ...i, boxNumber: e.target.value } : i))} className="w-full bg-transparent border-none text-xs font-mono text-slate-400 focus:ring-0" /></div>
                                         <div className="col-span-1 flex justify-end"><button onClick={() => removeCustomsItem(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button></div>
                                      </div>
                                   ))}

                                   <div className="grid grid-cols-12 gap-2 bg-blue-50/30 p-2 rounded-xl items-center border border-dashed border-blue-200">
                                      <div className="col-span-6"><input type="text" placeholder="Add additional line..." value={newCustomsItem.description} onChange={(e) => setNewCustomsItem({...newCustomsItem, description: e.target.value})} className="w-full bg-transparent border-none text-xs font-bold text-slate-800 placeholder:text-blue-300 focus:ring-0" /></div>
                                      <div className="col-span-3"><input type="text" placeholder="Value" value={newCustomsItem.value} onChange={(e) => setNewCustomsItem({...newCustomsItem, value: e.target.value})} className="w-full bg-transparent border-none text-xs text-slate-600 placeholder:text-blue-300 focus:ring-0" /></div>
                                      <div className="col-span-2"><input type="text" placeholder="Box" value={newCustomsItem.boxNumber} onChange={(e) => setNewCustomsItem({...newCustomsItem, boxNumber: e.target.value})} className="w-full bg-transparent border-none text-xs font-mono text-slate-400 placeholder:text-blue-300 focus:ring-0" /></div>
                                      <div className="col-span-1 flex justify-end"><button onClick={addCustomsItem} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus size={14} /></button></div>
                                   </div>
                                </div>
                                {editingCustoms.length === 0 && <p className="text-center py-20 text-xs text-slate-400 font-bold uppercase italic tracking-widest">No items listed in manifest</p>}
                             </div>
                          </div>
                       )}

                       {modalTab === 'chat' && (
                          <div className="flex flex-col h-full animate-fade-in bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                                <h4 className="font-black text-slate-900 flex items-center gap-2"><UserCircle size={18} className="text-blue-600"/><span>Chat with {selectedQuote.email}</span></h4>
                                <span className="text-[10px] font-black text-green-600 uppercase bg-green-100 px-2 py-1 rounded-full">Secure Session</span>
                             </div>
                             
                             <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {adminMessages.length === 0 && (
                                   <div className="flex flex-col items-center justify-center h-full opacity-40">
                                      <MessageSquare size={48} className="mb-4" />
                                      <p className="font-bold">No messages yet.</p>
                                      <p className="text-xs">Send a greeting to start the conversation.</p>
                                   </div>
                                )}
                                {adminMessages.map(msg => (
                                   <div key={msg.id} className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'agent' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                         {msg.text}
                                      </div>
                                      <span className="text-[9px] text-slate-400 mt-1 font-bold">{msg.timestamp} • {msg.sender === 'agent' ? 'You' : 'Client'}</span>
                                   </div>
                                ))}
                                <div ref={messagesEndRef} />
                             </div>

                             <form onSubmit={sendAdminMessage} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
                                <input 
                                   type="text" 
                                   placeholder="Type a message to the client..." 
                                   className="flex-grow bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={adminNewMessage}
                                   onChange={(e) => setAdminNewMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center">
                                   <Send size={20} />
                                </button>
                             </form>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
              
              <div className="p-8 bg-white border-t border-slate-100 flex gap-4 shrink-0 justify-between items-center">
                 <div className="flex gap-4">
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
                       <Download size={18} /><span>Download PDF Dossier</span>
                    </button>
                 </div>
                 <button onClick={() => setSelectedQuote(null)} className="px-10 py-4 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all">Close Admin View</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPortal;
