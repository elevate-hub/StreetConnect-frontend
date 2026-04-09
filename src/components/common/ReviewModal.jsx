import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, orderId, vendorId, deliveryPartnerId, onSubmit }) => {
  const { t } = useTranslation();
  const [vendorRating, setVendorRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [vendorReview, setVendorReview] = useState('');
  const [deliveryReview, setDeliveryReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (vendorRating === 0 || (deliveryPartnerId && deliveryRating === 0)) {
      toast.error('Please rate both vendor and delivery partner');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        vendor_ratings: {
          overall: vendorRating,
        },
        vendor_comment: vendorReview.trim(),
        ...(deliveryPartnerId ? {
          delivery_ratings: {
            overall: deliveryRating,
          },
          delivery_comment: deliveryReview.trim(),
        } : {})
      };

      await onSubmit(reviewData);
      setSubmitted(true);
      toast.success(t('review.submit_success'));

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('review.submit_success')}
          </h3>
          <p className="text-gray-600">
            Thank you for your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('review.review_order')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Vendor Review Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t('review.rate_vendor')}
            </h3>
            <div className="flex items-center gap-4">
              <StarRating
                rating={vendorRating}
                onRatingChange={setVendorRating}
                interactive={true}
                size={28}
              />
              {vendorRating > 0 && (
                <span className="text-sm text-gray-600">
                  {vendorRating} {t('review.stars')}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('review.write_feedback')}
              </label>
              <textarea
                value={vendorReview}
                onChange={(e) => setVendorReview(e.target.value)}
                placeholder={t('review.vendor_feedback_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {vendorReview.length}/500
              </div>
            </div>
          </div>

          {deliveryPartnerId && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('review.rate_delivery')}
              </h3>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={deliveryRating}
                  onRatingChange={setDeliveryRating}
                  interactive={true}
                  size={28}
                />
                {deliveryRating > 0 && (
                  <span className="text-sm text-gray-600">
                    {deliveryRating} {t('review.stars')}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('review.write_feedback')}
                </label>
                <textarea
                  value={deliveryReview}
                  onChange={(e) => setDeliveryReview(e.target.value)}
                  placeholder={t('review.delivery_feedback_placeholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {deliveryReview.length}/500
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-4 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || vendorRating === 0 || (deliveryPartnerId && deliveryRating === 0)}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? t('common.loading') : t('review.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;