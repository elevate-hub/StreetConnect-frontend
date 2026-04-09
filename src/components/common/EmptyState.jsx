import { useTranslation } from 'react-i18next';

const EmptyState = ({ icon: Icon, message, actionLabel, onAction }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && <Icon size={48} className="text-gray-300 mb-4" />}
      <p className="text-text-secondary text-center mb-4">{message || t('common.no_data')}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="bg-primary text-white px-6 py-3 rounded-btn font-medium hover:bg-primary-hover transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
