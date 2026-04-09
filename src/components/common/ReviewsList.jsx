import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Trophy, Clock, TrendingUp } from 'lucide-react';
import StarRating from './StarRating';

const ReviewsList = ({ reviews = [], averageRating = 0, totalReviews = 0, type = 'vendor' }) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('newest');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'highest_rated':
        return (b.vendor_rating || b.delivery_rating) - (a.vendor_rating || a.delivery_rating);
      default:
        return 0;
    }
  });

  const getReviewText = (review) => {
    return type === 'vendor' ? review.vendor_review : review.delivery_review;
  };

  const getRating = (review) => {
    return type === 'vendor' ? review.vendor_rating : review.delivery_rating;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} readonly size={16} />
              <div className="text-sm text-gray-600 mt-1">
                {totalReviews} {t('customer.reviews_count')}
              </div>
            </div>
            {averageRating >= 4.5 && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                <Trophy size={16} />
                {t('review.top_rated')}
              </div>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('newest')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'newest'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={14} />
            {t('review.newest')}
          </button>
          <button
            onClick={() => setSortBy('highest_rated')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'highest_rated'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp size={14} />
            {t('review.highest_rated')}
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('review.no_reviews')}
            </h3>
            <p className="text-gray-600">
              {t('empty.reviews')}
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.user_name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>
                <StarRating rating={getRating(review)} readonly size={16} />
              </div>

              {getReviewText(review) && (
                <p className="text-gray-700 leading-relaxed">
                  {getReviewText(review)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;