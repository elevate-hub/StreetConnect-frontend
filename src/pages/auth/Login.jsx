import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../api/auth.api';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser(form);
      await login(res.data.token, res.data.user);
      toast.success('Login successful!');
      const redirects = { customer: '/customer', vendor: '/vendor/dashboard', delivery: '/delivery', admin: '/admin' };
      navigate(redirects[res.data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UtensilsCrossed size={40} className="text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-card border border-surface-border shadow-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.password')}</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-btn font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {t('auth.login')}
          </button>
          <p className="text-center text-sm text-text-secondary">
            {t('auth.no_account')} <Link to="/register" className="text-primary hover:underline">{t('auth.register')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
