import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const steps = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered'];

const OrderStatusStepper = ({ currentStatus }) => {
  const { t } = useTranslation();
  const currentIdx = steps.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-card">
        <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
          <span className="text-white text-sm font-bold">✕</span>
        </div>
        <span className="text-error font-medium">{t('order.rejected')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted ? 'bg-success text-white' :
                isCurrent ? 'bg-primary text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? <Check size={16} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-8 ${isCompleted ? 'bg-success' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pt-1">
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-text-secondary'
              }`}>
                {t(`order.${step}`)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
