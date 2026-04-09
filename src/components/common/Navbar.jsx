import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    const map = { customer: '/customer', vendor: '/vendor/dashboard', delivery: '/delivery', admin: '/admin' };
    return map[user.role] || '/';
  };

  return (
    <nav className="bg-white border-b border-surface-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={getDashboardLink()} className="flex items-center gap-2">
          <UtensilsCrossed size={24} className="text-primary" />
          <span className="font-bold text-lg text-text-primary">{t('app_name')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user && (
            <>
              <NotificationBell />
              <button onClick={handleLogout} className="p-2 hover:bg-gray-50 rounded-btn transition-colors" title={t('nav.logout')}>
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
