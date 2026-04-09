import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const DeliveryProfile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (<div className="px-4 py-4 pb-20 md:pb-8"><h1 className="text-xl font-bold mb-4">{t('nav.profile')}</h1>
    <div className="flex flex-col items-center mb-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3"><span className="text-2xl font-bold text-primary">{user?.name?.[0]}</span></div>
      <h2 className="font-semibold">{user?.name}</h2><p className="text-sm text-text-secondary">{user?.email}</p></div>
    <button onClick={()=>{logout();navigate('/');}} className="w-full flex items-center justify-center gap-2 py-3 border border-surface-border rounded-btn"><LogOut size={18}/>{t('nav.logout')}</button></div>);
};
export default DeliveryProfile;
