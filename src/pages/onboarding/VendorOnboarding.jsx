import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { completeOnboarding } from '../../api/vendor.api';
import { addMenuItem } from '../../api/menu.api';
import TranslateButton from '../../components/common/TranslateButton';
import { Loader2, Check, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const cuisines = ['South Indian','North Indian','Snacks','Beverages','Sweets','Chinese','Mixed'];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const VendorOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    stall_name: { en: '', kn: '', hi: '' }, description: { en: '', kn: '', hi: '' },
    cuisine_type: '', address: '', opening_time: '06:00', closing_time: '22:00',
    days_open: [], image_url: ''
  });
  const [menuItems, setMenuItems] = useState([{ name: { en: '', kn: '', hi: '' }, category: '', price: '', is_available: true }]);

  const u = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const uml = (field, lang, val) => setForm(p => ({ ...p, [field]: { ...p[field], [lang]: val } }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await completeOnboarding(form);
      for (const item of menuItems) {
        if (item.name.en && item.price) await addMenuItem({ ...item, price: Number(item.price) });
      }
      toast.success(t('onboarding.submitted'));
      setStep(6);
    } catch { toast.error(t('common.error')); } finally { setLoading(false); }
  };

  const toggleDay = (d) => u('days_open', form.days_open.includes(d) ? form.days_open.filter(x=>x!==d) : [...form.days_open, d]);

  if (step === 6) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center"><Check size={56} className="text-success mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('onboarding.submitted')}</h2>
        <p className="text-text-secondary text-sm mb-6">{t('onboarding.review_msg')}</p>
        <button onClick={() => navigate('/pending')} className="bg-primary text-white px-6 py-3 rounded-btn">OK</button>
      </div></div>);

  return (
    <div className="min-h-screen bg-surface-bg px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">{[1,2,3,4,5].map(s=>(
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s<=step?'bg-primary':'bg-gray-200'}`}/>))}</div>
        <button onClick={()=>navigate('/vendor/dashboard')} className="text-xs text-text-secondary">Skip</button>
      </div>

      {step===1&&(<div className="space-y-4">
        <h2 className="text-xl font-bold">{t('onboarding.step1_title')}</h2>
        <div><label className="text-sm font-medium">{t('onboarding.stall_name')}</label>
          <div className="flex gap-2 items-center"><input value={form.stall_name.en} onChange={e=>uml('stall_name','en',e.target.value)} className="flex-1 px-3 py-3 border border-surface-border rounded-btn text-sm"/>
          <TranslateButton text={form.stall_name.en} onTranslated={d=>u('stall_name',d)}/></div>
          {(form.stall_name.kn||form.stall_name.hi)&&<div className="mt-1 p-2 bg-gray-50 rounded text-xs space-y-1">
            {form.stall_name.kn&&<p>ಕನ್ನಡ: {form.stall_name.kn}</p>}{form.stall_name.hi&&<p>हिंदी: {form.stall_name.hi}</p>}</div>}</div>
        <div><label className="text-sm font-medium">{t('onboarding.description')}</label>
          <div className="flex gap-2 items-start"><textarea value={form.description.en} onChange={e=>uml('description','en',e.target.value)} rows={3} className="flex-1 px-3 py-3 border border-surface-border rounded-btn text-sm"/>
          <TranslateButton text={form.description.en} onTranslated={d=>u('description',d)}/></div></div>
        <div><label className="text-sm font-medium">{t('onboarding.cuisine_type')}</label>
          <select value={form.cuisine_type} onChange={e=>u('cuisine_type',e.target.value)} className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm">
            <option value="">Select</option>{cuisines.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      </div>)}

      {step===2&&(<div className="space-y-4">
        <h2 className="text-xl font-bold">{t('onboarding.step2_title')}</h2>
        <div><label className="text-sm font-medium">{t('onboarding.address')}</label>
          <textarea value={form.address} onChange={e=>u('address',e.target.value)} rows={2} className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">{t('onboarding.opening_time')}</label><input type="time" value={form.opening_time} onChange={e=>u('opening_time',e.target.value)} className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm"/></div>
          <div><label className="text-sm font-medium">{t('onboarding.closing_time')}</label><input type="time" value={form.closing_time} onChange={e=>u('closing_time',e.target.value)} className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm"/></div></div>
        <div><label className="text-sm font-medium mb-2 block">{t('onboarding.days_open')}</label>
          <div className="flex flex-wrap gap-2">{days.map(d=>(<button key={d} type="button" onClick={()=>toggleDay(d)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.days_open.includes(d)?'bg-primary text-white':'bg-white border border-surface-border text-text-secondary'}`}>{d}</button>))}</div></div>
      </div>)}

      {step===3&&(<div className="space-y-4">
        <h2 className="text-xl font-bold">{t('onboarding.step3_title')}</h2>
        <div className="border-2 border-dashed border-surface-border rounded-card p-8 text-center">
          <Camera size={40} className="text-gray-300 mx-auto mb-3"/>
          <input value={form.image_url} onChange={e=>u('image_url',e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 border border-surface-border rounded-btn text-sm"/>
        </div>
        <button onClick={()=>setStep(4)} className="text-sm text-text-secondary">{t('onboarding.skip')}</button>
      </div>)}

      {step===4&&(<div className="space-y-4">
        <h2 className="text-xl font-bold">{t('onboarding.step4_title')}</h2>
        {menuItems.map((item,i)=>(<div key={i} className="bg-white rounded-card border border-surface-border p-4 space-y-3">
          <div className="flex gap-2 items-center"><input value={item.name.en} onChange={e=>{const n=[...menuItems];n[i].name.en=e.target.value;setMenuItems(n)}} placeholder={t('onboarding.item_name')} className="flex-1 px-3 py-2 border border-surface-border rounded-btn text-sm"/>
          <TranslateButton text={item.name.en} onTranslated={d=>{const n=[...menuItems];n[i].name=d;setMenuItems(n)}}/></div>
          <div className="grid grid-cols-2 gap-3">
            <input value={item.category} onChange={e=>{const n=[...menuItems];n[i].category=e.target.value;setMenuItems(n)}} placeholder={t('onboarding.category')} className="px-3 py-2 border border-surface-border rounded-btn text-sm"/>
            <input type="number" value={item.price} onChange={e=>{const n=[...menuItems];n[i].price=e.target.value;setMenuItems(n)}} placeholder={t('onboarding.price')} className="px-3 py-2 border border-surface-border rounded-btn text-sm"/>
          </div></div>))}
        <button type="button" onClick={()=>setMenuItems([...menuItems,{name:{en:'',kn:'',hi:''},category:'',price:'',is_available:true}])} className="text-primary text-sm font-medium">{t('onboarding.add_another')}</button>
      </div>)}

      {step===5&&(<div className="space-y-4">
        <h2 className="text-xl font-bold">{t('onboarding.step5_title')}</h2>
        <div className="bg-white rounded-card border border-surface-border p-4 space-y-2 text-sm">
          <p><strong>Stall:</strong> {form.stall_name.en}</p>
          <p><strong>Cuisine:</strong> {form.cuisine_type}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <p><strong>Hours:</strong> {form.opening_time} - {form.closing_time}</p>
          <p><strong>Days:</strong> {form.days_open.join(', ')}</p>
          <p><strong>Menu items:</strong> {menuItems.filter(m=>m.name.en).length}</p>
        </div></div>)}

      <div className="flex gap-3 mt-6">
        {step>1&&<button onClick={()=>setStep(step-1)} className="flex-1 py-3 border border-surface-border rounded-btn">{t('onboarding.back')}</button>}
        {step<5?<button onClick={()=>setStep(step+1)} className="flex-1 py-3 bg-primary text-white rounded-btn font-medium">{t('onboarding.next')}</button>
        :step===5&&<button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-primary text-white rounded-btn font-medium flex items-center justify-center gap-2">
          {loading&&<Loader2 size={18} className="animate-spin"/>}{t('onboarding.submit_approval')}</button>}
      </div>
    </div>);
};
export default VendorOnboarding;
