import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const VendorSettings = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  return (<div className="px-4 py-4 pb-20 md:pb-8"><h1 className="text-xl font-bold mb-4">{t('nav.settings')}</h1>
    <div className="bg-white rounded-card border border-surface-border shadow-card p-4 text-sm space-y-2">
      <p><strong>{t('auth.name')}:</strong> {user?.name}</p><p><strong>{t('auth.email')}:</strong> {user?.email}</p>
    </div><button onClick={logout} className="mt-4 w-full py-3 border border-surface-border rounded-btn text-text-primary">{t('nav.logout')}</button></div>);
};
export default VendorSettings;
