import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVendorReviews } from '../../api/vendor.api';
import StarRating from '../../components/common/StarRating';
import EmptyState from '../../components/common/EmptyState';
import { MessageSquare } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate';

const VendorReviews = () => {
  const { t } = useTranslation();
  const { data: reviews = [] } = useQuery({ queryKey: ['vendorReviews'], queryFn: () => getVendorReviews().then(r => r.data) });

  return (<div className="px-4 py-4 pb-20 md:pb-8">
    <h1 className="text-xl font-bold mb-4">{t('nav.reviews')}</h1>
    {reviews.length === 0 ? <EmptyState icon={MessageSquare} message={t('empty.reviews')} /> :
      <div className="space-y-3">{reviews.map(r => (
        <div key={r._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
          <StarRating rating={r.vendor_ratings?.overall || 0} size={16} />
          {r.vendor_comment && <p className="text-sm mt-2">{r.vendor_comment}</p>}
          <p className="text-xs text-text-secondary mt-2">{timeAgo(r.created_at)}</p>
        </div>))}</div>}
  </div>);
};
export default VendorReviews;
