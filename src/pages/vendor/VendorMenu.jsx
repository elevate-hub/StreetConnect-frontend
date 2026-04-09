import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVendorProfile } from '../../api/vendor.api';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItem } from '../../api/menu.api';
import TranslateButton from '../../components/common/TranslateButton';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit, Trash2, ChefHat } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const VendorMenu = () => {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: { en: '', kn: '', hi: '' }, description: { en: '', kn: '', hi: '' }, category: '', price: '', image_url: '', is_available: true });

  const { data: profile } = useQuery({ queryKey: ['vendorProfile'], queryFn: () => getVendorProfile().then(r => r.data) });
  const { data: items = [] } = useQuery({
    queryKey: ['menuItems', profile?._id],
    queryFn: () => getMenuItems(profile._id).then(r => r.data),
    enabled: !!profile?._id
  });

  const handleSave = async () => {
    try {
      if (editItem) await updateMenuItem(editItem._id, { ...form, price: Number(form.price) });
      else await addMenuItem({ ...form, price: Number(form.price) });
      qc.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success(t('common.success'));
      setShowModal(false);
      setEditItem(null);
      setForm({ name: { en: '', kn: '', hi: '' }, description: { en: '', kn: '', hi: '' }, category: '', price: '', image_url: '', is_available: true });
    } catch { toast.error(t('common.error')); }
  };

  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description || { en: '', kn: '', hi: '' }, category: item.category, price: item.price, image_url: item.image_url || '', is_available: item.is_available }); setShowModal(true); };

  const handleDelete = async (id) => { await deleteMenuItem(id); qc.invalidateQueries({ queryKey: ['menuItems'] }); toast.success('Deleted'); };
  const handleToggle = async (id) => { await toggleMenuItem(id); qc.invalidateQueries({ queryKey: ['menuItems'] }); };

  return (
    <div className="px-4 py-4 pb-20 md:pb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t('nav.menu')}</h1>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-btn text-sm flex items-center gap-1"><Plus size={16}/>{t('vendor.add_menu_item')}</button>
      </div>

      {items.length === 0 ? <EmptyState icon={ChefHat} message={t('empty.menu')} actionLabel={t('vendor.add_menu_item')} onAction={() => setShowModal(true)} /> :
        <div className="space-y-3">{items.map(item => (
          <div key={item._id} className={`bg-white rounded-card border border-surface-border shadow-card p-4 ${!item.is_available ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
              <div><h3 className="font-medium">{item.name?.[i18n.language] || item.name?.en}</h3>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                <p className="text-primary font-semibold mt-1">{formatCurrency(item.price)}</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(item._id)} className={`w-10 h-6 rounded-full transition-colors ${item.is_available ? 'bg-success' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${item.is_available ? 'translate-x-4' : ''}`}/></button>
                <button onClick={() => openEdit(item)} className="p-1.5 text-text-secondary hover:text-primary"><Edit size={16}/></button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 text-text-secondary hover:text-error"><Trash2 size={16}/></button>
              </div></div></div>))}</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-card p-6 w-full max-w-md space-y-3">
            <h2 className="font-bold text-lg">{editItem ? t('common.edit') : t('vendor.add_menu_item')}</h2>
            <div className="flex gap-2 items-center"><input value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} placeholder={t('onboarding.item_name')} className="flex-1 px-3 py-2 border border-surface-border rounded-btn text-sm"/>
              <TranslateButton text={form.name.en} onTranslated={d => setForm({...form, name: d})}/></div>
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder={t('onboarding.category')} className="w-full px-3 py-2 border border-surface-border rounded-btn text-sm"/>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder={t('onboarding.price')} className="w-full px-3 py-2 border border-surface-border rounded-btn text-sm"/>
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="flex-1 py-2 border border-surface-border rounded-btn text-sm">{t('common.cancel')}</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-primary text-white rounded-btn text-sm font-medium">{t('common.save')}</button>
            </div></div></div>)}
    </div>);
};
export default VendorMenu;
