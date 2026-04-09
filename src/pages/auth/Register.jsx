import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { registerUser } from '../../api/auth.api';
import { UtensilsCrossed, ShoppingBag, Store, Truck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const roles = [
  { value: 'customer', icon: ShoppingBag },
  { value: 'vendor', icon: Store },
  { value: 'delivery', icon: Truck }
];

const Register = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: searchParams.get('role') || 'customer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.phone) e.phone = 'Phone is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await registerUser(data);
      await login(res.data.token, res.data.user);
      toast.success('Registration successful!');
      const redirects = { customer: '/customer', vendor: '/vendor/onboarding', delivery: '/pending', admin: '/admin' };
      navigate(redirects[res.data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const u = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <UtensilsCrossed size={40} className="text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-card border border-surface-border shadow-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.select_role')}</label>
            <div className="flex gap-2">
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-btn border transition-colors ${
                    form.role === r.value ? 'border-primary bg-orange-50 text-primary' : 'border-surface-border text-text-secondary hover:bg-gray-50'
                  }`}>
                  <r.icon size={20} />
                  <span className="text-xs font-medium">{t(`roles.${r.value}`)}</span>
                </button>
              ))}
            </div>
          </div>
          {[
            { field: 'name', type: 'text', label: t('auth.name') },
            { field: 'phone', type: 'tel', label: t('auth.phone') },
            { field: 'email', type: 'email', label: t('auth.email') },
            { field: 'password', type: 'password', label: t('auth.password') },
            { field: 'confirmPassword', type: 'password', label: t('auth.confirm_password') }
          ].map(f => (
            <div key={f.field}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input type={f.type} value={form[f.field]} onChange={u(f.field)}
                className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              {errors[f.field] && <p className="text-error text-xs mt-1">{errors[f.field]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-btn font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {t('auth.register')}
          </button>
          <p className="text-center text-sm text-text-secondary">
            {t('auth.have_account')} <Link to="/login" className="text-primary hover:underline">{t('auth.login')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
