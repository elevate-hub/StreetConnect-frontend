import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getVendors } from '../../api/customer.api';
import { Search, Star, MapPin, Store } from 'lucide-react';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

const cuisines = ['All', 'South Indian', 'North Indian', 'Snacks', 'Beverages', 'Sweets', 'Chinese', 'Mixed'];

const CustomerHome = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [sort, setSort] = useState('');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors', search, cuisine, sort],
    queryFn: () => getVendors({ search, cuisine, sort }).then(r => r.data)
  });

  const lang = i18n.language;

  return (
    <div className="pb-20 md:pb-8">
      <div className="sticky top-14 bg-surface-bg z-30 px-4 pt-4 pb-2 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('customer.search')}
            className="w-full pl-10 pr-4 py-3 bg-white border border-surface-border rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {cuisines.map(c => (
            <button key={c} onClick={() => setCuisine(c)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cuisine === c ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-surface-border'
              }`}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="text-sm border border-surface-border rounded-btn px-3 py-2 bg-white">
          <option value="">{t('customer.sort_relevance')}</option>
          <option value="rating">{t('customer.sort_rating')}</option>
          <option value="newest">{t('customer.sort_newest')}</option>
        </select>
      </div>

      <div className="px-4 mt-4">
        {isLoading ? <LoadingSkeleton count={4} /> : vendors.length === 0 ? (
          <EmptyState icon={Store} message={t('empty.vendors')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendors.map(v => (
              <Link key={v._id} to={`/customer/vendor/${v._id}`}
                className="bg-white rounded-card border border-surface-border shadow-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {v.image_url ? <img src={v.image_url} alt="" className="w-full h-full object-cover" /> : <Store size={40} className="text-gray-300" />}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-text-primary">{v.stall_name?.[lang] || v.stall_name?.en}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.is_open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {v.is_open ? t('customer.open') : t('customer.closed')}
                    </span>
                  </div>
                  <span className="text-xs bg-orange-50 text-primary px-2 py-0.5 rounded-full">{v.cuisine_type}</span>
                  <div className="flex items-center gap-1 mt-2 text-sm text-text-secondary">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>{v.average_rating || 0}</span>
                    <span>({v.total_reviews} {t('customer.reviews_count')})</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                    <MapPin size={12} /> <span className="truncate">{v.address}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;
