import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UtensilsCrossed, ShoppingBag, Store, Truck } from 'lucide-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const Landing = () => {
  const { t } = useTranslation();

  const roles = [
    { icon: ShoppingBag, role: 'customer', title: t('roles.customer'), desc: t('roles.customer_desc'), to: '/register?role=customer' },
    { icon: Store, role: 'vendor', title: t('roles.vendor'), desc: t('roles.vendor_desc'), to: '/register?role=vendor' },
    { icon: Truck, role: 'delivery', title: t('roles.delivery'), desc: t('roles.delivery_desc'), to: '/register?role=delivery' }
  ];

  return (
    <div className="min-h-screen bg-surface-bg">
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-surface-border">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={24} className="text-primary" />
          <span className="font-bold text-lg">{t('app_name')}</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-hover">{t('auth.login')}</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <UtensilsCrossed size={56} className="text-primary mx-auto mb-4" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t('app_name')}</h1>
        <p className="text-lg text-text-secondary mb-2">{t('tagline')}</p>
        <p className="text-sm text-text-secondary mb-12">{t('subtext')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {roles.map(r => (
            <div key={r.role} className="bg-white rounded-card border border-surface-border shadow-card p-6">
              <r.icon size={40} className="text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{r.desc}</p>
              <Link to={r.to} className="inline-block bg-primary text-white px-6 py-3 rounded-btn font-medium hover:bg-primary-hover transition-colors w-full">
                {t('auth.register')}
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-text-secondary border-t border-surface-border">
        StreetConnect © 2024
      </footer>
    </div>
  );
};

export default Landing;
