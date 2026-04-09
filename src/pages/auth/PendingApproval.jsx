import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center bg-white rounded-card border border-surface-border shadow-card p-8">
        <Clock size={56} className="text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('common.pending_approval')}</h2>
        <p className="text-text-secondary text-sm mb-6">{t('common.pending_msg')}</p>
        {user && (
          <div className="text-left bg-surface-bg rounded-btn p-4 mb-6 text-sm space-y-1">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
          </div>
        )}
        <button onClick={() => { logout(); navigate('/'); }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-btn text-text-primary hover:bg-gray-200 transition-colors">
          <LogOut size={18} /> {t('nav.logout')}
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
