import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminOrders } from '../../api/admin.api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';

const AdminOrders = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['adminOrders', status], queryFn: () => getAdminOrders(status || undefined).then(r => r.data) });

  return (<div className="px-4 py-4"><h1 className="text-xl font-bold mb-4">{t('nav.orders')}</h1>
    <select value={status} onChange={e=>setStatus(e.target.value)} className="mb-4 text-sm border border-surface-border rounded-btn px-3 py-2 bg-white">
      <option value="">All</option>{['pending','accepted','preparing','ready','picked_up','delivered','rejected'].map(s=><option key={s} value={s}>{s}</option>)}</select>
    {isLoading?<LoadingSkeleton/>:<div className="space-y-3">{orders.map(o=>(
      <div key={o._id} className="bg-white rounded-card border border-surface-border shadow-card p-3">
        <div className="flex justify-between items-start">
          <div><p className="text-sm font-medium">{o.vendor_id?.stall_name?.en}</p><p className="text-xs text-text-secondary">{timeAgo(o.created_at)}</p></div>
          <StatusBadge status={o.status}/></div>
        <p className="text-sm text-primary font-semibold mt-1">{formatCurrency(o.total_amount)}</p>
      </div>))}</div>}</div>);
};
export default AdminOrders;
