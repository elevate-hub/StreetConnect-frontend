import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVendorOrders, updateOrderStatus } from '../../api/vendor.api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const filters = ['all','pending','accepted','preparing','ready','delivered','rejected'];

const VendorOrders = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['vendorOrders', filter], queryFn: () => getVendorOrders(filter === 'all' ? undefined : filter).then(r => r.data) });

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    qc.invalidateQueries({ queryKey: ['vendorOrders'] });
    toast.success('Status updated');
  };

  const handleReject = async () => {
    await updateOrderStatus(rejectId, { status: 'rejected', rejection_reason: reason });
    qc.invalidateQueries({ queryKey: ['vendorOrders'] });
    setRejectId(null); setReason('');
    toast.success('Order rejected');
  };

  return (
    <div className="px-4 py-4 pb-20 md:pb-8">
      <h1 className="text-xl font-bold mb-4">{t('nav.orders')}</h1>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">{filters.map(f=>(
        <button key={f} onClick={()=>setFilter(f)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-surface-border text-text-secondary'}`}>{f}</button>))}</div>
      {isLoading ? <LoadingSkeleton/> : orders.length===0 ? <EmptyState icon={ShoppingBag} message={t('empty.orders')}/> :
        <div className="space-y-3">{orders.map(o=>(
          <div key={o._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
            <div className="flex justify-between items-start mb-2">
              <div><p className="text-xs text-text-secondary">{timeAgo(o.created_at)}</p>
                <p className="text-sm mt-1">{o.items.map(i=>`${i.name} x${i.quantity}`).join(', ')}</p></div>
              <StatusBadge status={o.status}/></div>
            <p className="text-primary font-semibold text-sm">{formatCurrency(o.total_amount)}</p>
            <p className="text-xs text-text-secondary mt-1">{o.delivery_address}</p>
            <div className="flex gap-2 mt-3">
              {o.status==='pending'&&<><button onClick={()=>handleStatus(o._id,'accepted')} className="px-4 py-2 bg-success text-white rounded-btn text-xs font-medium">{t('order.accept')}</button>
                <button onClick={()=>setRejectId(o._id)} className="px-4 py-2 bg-error text-white rounded-btn text-xs font-medium">{t('order.reject')}</button></>}
              {o.status==='accepted'&&<button onClick={()=>handleStatus(o._id,'preparing')} className="px-4 py-2 bg-primary text-white rounded-btn text-xs font-medium">{t('order.mark_preparing')}</button>}
              {o.status==='preparing'&&<button onClick={()=>handleStatus(o._id,'ready')} className="px-4 py-2 bg-primary text-white rounded-btn text-xs font-medium">{t('order.mark_ready')}</button>}
            </div></div>))}</div>}
      {rejectId&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-card p-6 max-w-sm w-full space-y-3">
          <h3 className="font-bold">{t('order.reject')}</h3>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder={t('admin.rejection_reason')} rows={3} className="w-full px-3 py-2 border border-surface-border rounded-btn text-sm"/>
          <div className="flex gap-3"><button onClick={()=>setRejectId(null)} className="flex-1 py-2 border rounded-btn text-sm">{t('common.cancel')}</button>
            <button onClick={handleReject} className="flex-1 py-2 bg-error text-white rounded-btn text-sm">{t('order.reject')}</button></div></div></div>}
    </div>);
};
export default VendorOrders;
