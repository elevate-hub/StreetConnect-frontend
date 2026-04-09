import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVendorDetail, getCustomerOrders, submitReview } from '../../api/customer.api';
import { getVendorReviewsPublic } from '../../api/review.api';
import { useCart } from '../../hooks/useCart';
import ReviewModal from '../../components/common/ReviewModal';
import { Star, MapPin, Clock, Plus, ShoppingBag, Store, MessageSquare } from 'lucide-react';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ReviewsList from '../../components/common/ReviewsList';
import toast from 'react-hot-toast';

const VendorDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem, cartCount, cartTotal, isDifferentVendor, forceAddItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const lang = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['vendorDetail', id],
    queryFn: () => getVendorDetail(id).then(r => r.data)
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['vendorReviews', id],
    queryFn: () => getVendorReviewsPublic(id).then(r => r.data),
    enabled: Boolean(id)
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => getCustomerOrders().then(r => r.data),
    enabled: Boolean(id)
  });

  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const pendingReviewOrder = orders.find(
    (order) => order.vendor_id?._id?.toString() === id && order.status === 'delivered' && !order.reviewed
  );

  const handleAdd = (item) => {
    const vendor = { id: data.vendor._id, name: data.vendor.stall_name?.en };
    if (isDifferentVendor(data.vendor._id)) {
      setPendingItem({ item: { menuItemId: item._id, name: item.name?.en, price: item.price }, vendor });
      setShowModal(true);
    } else {
      addItem({ menuItemId: item._id, name: item.name?.[lang] || item.name?.en, price: item.price }, vendor);
      toast.success(t('customer.add_to_cart'));
    }
  };

  const handleForceAdd = () => {
    if (pendingItem) {
      forceAddItem(pendingItem.item, pendingItem.vendor);
      toast.success(t('customer.add_to_cart'));
    }
    setShowModal(false);
  };

  if (isLoading) return <div className="p-4"><LoadingSkeleton count={6} /></div>;
  if (!data) return null;

  const { vendor, menu } = data;
  const categories = [...new Set(menu.map(m => m.category).filter(Boolean))];

  return (
    <div className="pb-24 md:pb-8">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {vendor.image_url ? <img src={vendor.image_url} alt="" className="w-full h-full object-cover" /> : <Store size={60} className="text-gray-300" />}
      </div>

      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-card border border-surface-border shadow-card p-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">{vendor.stall_name?.[lang] || vendor.stall_name?.en}</h1>
              <span className="text-xs bg-orange-50 text-primary px-2 py-0.5 rounded-full">{vendor.cuisine_type}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${vendor.is_open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {vendor.is_open ? t('customer.open') : t('customer.closed')}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" />{vendor.average_rating}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{vendor.address}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
            <Clock size={12} /> {vendor.opening_time} - {vendor.closing_time}
          </div>
          <p className="text-sm text-text-secondary mt-2">{vendor.description?.[lang] || vendor.description?.en}</p>
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <h2 className="font-semibold text-lg mb-3">{cat}</h2>
            <div className="space-y-3">
              {menu.filter(m => m.category === cat).map(item => (
                <div key={item._id} className={`bg-white rounded-card border border-surface-border shadow-card p-4 flex items-center justify-between ${!item.is_available ? 'opacity-50' : ''}`}>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name?.[lang] || item.name?.en}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">{item.description?.[lang] || item.description?.en}</p>
                    <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                  </div>
                  {item.is_available && vendor.is_open && (
                    <button onClick={() => handleAdd(item)}
                      className="w-10 h-10 bg-primary text-white rounded-btn flex items-center justify-center hover:bg-primary-hover transition-colors ml-3">
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">{t('reviews')}</h2>
        </div>
        <ReviewsList
          reviews={reviews}
          averageRating={vendor.average_rating || 0}
          totalReviews={vendor.total_reviews || 0}
          type="vendor"
        />
        {reviewsLoading && <div className="text-sm text-gray-500 mt-2">Loading reviews…</div>}

        {pendingReviewOrder && (
          <button
            onClick={() => {
              setReviewOrderId(pendingReviewOrder._id);
              setShowReviewModal(true);
            }}
            className="mt-4 w-full bg-primary text-white py-3 rounded-btn font-medium hover:bg-primary-hover transition-colors"
          >
            {t('customer.leave_review')}
          </button>
        )}
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={reviewOrderId}
        vendorId={id}
        deliveryPartnerId={pendingReviewOrder?.delivery_partner_id?._id}
        onSubmit={async (reviewData) => {
          await submitReview(reviewOrderId, reviewData);
          setShowReviewModal(false);
        }}
      />

      {cartCount > 0 && (
        <div className="fixed bottom-16 md:bottom-4 left-4 right-4 max-w-lg mx-auto">
          <button onClick={() => navigate('/customer/cart')}
            className="w-full bg-primary text-white py-4 rounded-card font-medium flex items-center justify-between px-6 shadow-lg hover:bg-primary-hover transition-colors">
            <span className="flex items-center gap-2"><ShoppingBag size={20} />{cartCount} items</span>
            <span>₹{cartTotal} → {t('customer.view_cart')}</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-card p-6 max-w-sm w-full">
            <p className="text-sm mb-4">{t('customer.different_vendor')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-surface-border rounded-btn text-sm">{t('customer.keep_cart')}</button>
              <button onClick={handleForceAdd} className="flex-1 py-2 bg-primary text-white rounded-btn text-sm">{t('customer.clear_add')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
