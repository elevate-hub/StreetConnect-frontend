import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOrderDetail, submitReview } from '../../api/customer.api';
import OrderStatusStepper from '../../components/common/OrderStatusStepper';
import ReviewModal from '../../components/common/ReviewModal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['orderDetail', id],
    queryFn: () => getOrderDetail(id).then(r => r.data)
  });

  const handleSubmitReview = async (reviewData) => {
    try {
      await submitReview(id, reviewData);
      qc.invalidateQueries({ queryKey: ['orderDetail', id] });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  if (isLoading) return <div className="p-4"><LoadingSkeleton count={6} /></div>;
  if (!order) return null;

  return (
    <div className="px-4 py-4 pb-20 md:pb-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Order Details</h1>

      <div className="bg-white rounded-card border border-surface-border shadow-card p-4 mb-4">
        <h2 className="font-medium mb-3">Status</h2>
        <OrderStatusStepper currentStatus={order.status} />
      </div>

      <div className="bg-white rounded-card border border-surface-border shadow-card p-4 mb-4">
        <h2 className="font-medium mb-2">Items</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-surface-border mt-2 pt-2 flex justify-between font-semibold">
          <span>{t('customer.total')}</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div className="bg-white rounded-card border border-surface-border shadow-card p-4 mb-4 text-sm space-y-1">
        <p><span className="font-medium">Delivery:</span> {order.delivery_address}</p>
        {order.rejection_reason && <p className="text-error"><span className="font-medium">Reason:</span> {order.rejection_reason}</p>}
      </div>

      {order.status === 'delivered' && !order.reviewed && (
        <button
          onClick={() => setShowReviewModal(true)}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {t('customer.leave_review')}
        </button>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={id}
        vendorId={order?.vendor_id}
        deliveryPartnerId={order?.delivery_partner_id}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default OrderDetail;
