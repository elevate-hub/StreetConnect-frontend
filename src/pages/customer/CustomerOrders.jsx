import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../api/customer.api';
import { ShoppingBag } from 'lucide-react';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';

const CustomerOrders = () => {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState('active');
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => getCustomerOrders().then(r => r.data)
  });

  const active = orders.filter(o => !['delivered', 'rejected'].includes(o.status));
  const past = orders.filter(o => ['delivered', 'rejected'].includes(o.status));
  const displayed = tab === 'active' ? active : past;

  return (
    <div className="px-4 py-4 pb-20 md:pb-8">
      <h1 className="text-xl font-bold mb-4">{t('nav.orders')}</h1>
      <div className="flex gap-2 mb-4">
        {['active', 'past'].map(v => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === v ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-surface-border'}`}>
            {t(`customer.${v}_orders`)}
          </button>
        ))}
      </div>

      {isLoading ? <LoadingSkeleton count={4} /> : displayed.length === 0 ? (
        <EmptyState icon={ShoppingBag} message={t('empty.orders')} />
      ) : (
        <div className="space-y-3">
          {displayed.map(order => (
            <Link key={order._id} to={`/customer/orders/${order._id}`}
              className="block bg-white rounded-card border border-surface-border shadow-card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{order.vendor_id?.stall_name?.[i18n.language] || order.vendor_id?.stall_name?.en || 'Vendor'}</p>
                  <p className="text-xs text-text-secondary">{timeAgo(order.created_at)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-text-secondary">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
              <p className="text-primary font-semibold text-sm mt-1">{formatCurrency(order.total_amount)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
