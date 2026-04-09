import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { getVendorProfile, getVendorEarnings, getVendorOrders, toggleVendorOpen } from '../../api/vendor.api';
import { ShoppingBag, IndianRupee, Clock, Star } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ['vendorProfile'], queryFn: () => getVendorProfile().then(r => r.data) });
  const { data: earnings } = useQuery({ queryKey: ['vendorEarnings'], queryFn: () => getVendorEarnings().then(r => r.data) });
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['vendorOrders'], queryFn: () => getVendorOrders().then(r => r.data) });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const pending = orders.filter(o => o.status === 'pending').length;

  const handleToggle = async () => {
    await toggleVendorOpen();
    qc.invalidateQueries({ queryKey: ['vendorProfile'] });
    toast.success('Status updated');
  };

  const metrics = [
    { icon: ShoppingBag, label: t('vendor.todays_orders'), value: earnings?.today_count || 0 },
    { icon: IndianRupee, label: t('vendor.todays_earnings'), value: formatCurrency(earnings?.today || 0) },
    { icon: Clock, label: t('vendor.pending_orders'), value: pending, highlight: pending > 0 },
    { icon: Star, label: t('vendor.avg_rating'), value: profile?.average_rating || 0 }
  ];

  return (
    <div className="px-4 py-4 pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div><p className="text-text-secondary text-sm">{greeting},</p><h1 className="text-xl font-bold">{user?.name}</h1></div>
        <button onClick={handleToggle} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${profile?.is_open ? 'bg-success text-white' : 'bg-gray-200 text-text-secondary'}`}>
          {profile?.is_open ? t('vendor.stall_open') : t('vendor.stall_closed')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className={`bg-white rounded-card border shadow-card p-4 ${m.highlight ? 'border-primary' : 'border-surface-border'}`}>
            <m.icon size={20} className={m.highlight ? 'text-primary' : 'text-text-secondary'} />
            <p className="text-2xl font-bold mt-2">{m.value}</p>
            <p className="text-xs text-text-secondary">{m.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-3">{t('vendor.recent_orders')}</h2>
      {isLoading ? <LoadingSkeleton /> : orders.slice(0, 5).map(o => (
        <div key={o._id} className="bg-white rounded-card border border-surface-border shadow-card p-3 mb-2">
          <div className="flex justify-between items-center">
            <div><p className="text-sm font-medium">{o.items.map(i=>`${i.name} x${i.quantity}`).join(', ')}</p>
              <p className="text-xs text-text-secondary">{timeAgo(o.created_at)}</p></div>
            <div className="text-right"><StatusBadge status={o.status}/><p className="text-sm font-semibold mt-1">{formatCurrency(o.total_amount)}</p></div>
          </div></div>))}
    </div>);
};
export default VendorDashboard;
