import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { updateCustomerProfile } from '../../api/customer.api';
import { User, LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerProfile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateCustomerProfile(form);
      toast.success(t('common.success'));
      setEditing(false);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 pb-20 md:pb-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">{t('nav.profile')}</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <h2 className="font-semibold text-lg">{user?.name}</h2>
        <p className="text-sm text-text-secondary">{user?.email}</p>
      </div>

      <div className="bg-white rounded-card border border-surface-border shadow-card p-4 mb-4">
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">{t('auth.name')}</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-surface-border rounded-btn text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('auth.phone')}</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-surface-border rounded-btn text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-2 border border-surface-border rounded-btn text-sm">{t('common.cancel')}</button>
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-2 bg-primary text-white rounded-btn text-sm flex items-center justify-center gap-1">
                {loading && <Loader2 size={14} className="animate-spin" />}{t('common.save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">{t('auth.name')}:</span> {user?.name}</p>
            <p><span className="font-medium">{t('auth.email')}:</span> {user?.email}</p>
            <p><span className="font-medium">{t('auth.phone')}:</span> {user?.phone}</p>
            <button onClick={() => setEditing(true)} className="text-primary text-sm hover:underline mt-2">{t('common.edit')}</button>
          </div>
        )}
      </div>

      <button onClick={() => { logout(); navigate('/'); }}
        className="w-full flex items-center justify-center gap-2 py-3 border border-surface-border rounded-btn text-text-primary hover:bg-gray-50 transition-colors">
        <LogOut size={18} /> {t('nav.logout')}
      </button>
    </div>
  );
};

export default CustomerProfile;
