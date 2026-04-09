import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDeliveryOrders } from '../../api/delivery.api';
import EmptyState from '../../components/common/EmptyState';
import { MessageSquare } from 'lucide-react';

const DeliveryReviews = () => {
  const { t } = useTranslation();
  return (<div className="px-4 py-4 pb-20 md:pb-8"><h1 className="text-xl font-bold mb-4">{t('nav.reviews')}</h1>
    <EmptyState icon={MessageSquare} message={t('empty.reviews')} /></div>);
};
export default DeliveryReviews;
