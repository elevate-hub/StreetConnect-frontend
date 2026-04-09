import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDeliveryOrders, updateDeliveryStatus } from '../../api/delivery.api';
import { Truck } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const ActiveDelivery = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({ queryKey: ['deliveryOrders'], queryFn: () => getDeliveryOrders().then(r => r.data) });
  const active = orders.find(o => ['picked_up','accepted','preparing','ready'].includes(o.status));

  const getDirectionsUrl = (origin, destination) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

  const handleStatus = async (status) => {
    await updateDeliveryStatus(active._id, { status });
    qc.invalidateQueries({ queryKey: ['deliveryOrders'] });
    toast.success('Updated!');
  };

  if (!active) return <div className="px-4 py-4"><EmptyState icon={Truck} message={t('delivery.no_active')} /></div>;

  return (<div className="px-4 py-4 pb-20 md:pb-8">
    <h1 className="text-xl font-bold mb-4">{t('delivery.active_delivery')}</h1>
    <div className="bg-white rounded-card border border-surface-border shadow-card p-4 space-y-3">
      <p className="text-sm"><strong>{t('delivery.pickup')}:</strong> {active.vendor_id?.stall_name?.en} — {active.vendor_id?.address}</p>
      <p className="text-sm"><strong>{t('delivery.dropoff')}:</strong> {active.delivery_address}</p>
      <p className="text-sm"><strong>Items:</strong> {active.items.map(i=>`${i.name} x${i.quantity}`).join(', ')}</p>
      <p className="text-primary font-semibold">{formatCurrency(active.total_amount)}</p>
      <div className="flex flex-col gap-3">
        <a href={getDirectionsUrl(active.vendor_id?.address || '', active.delivery_address)} target="_blank" rel="noreferrer" className="py-3 px-4 border border-surface-border rounded-btn text-center text-sm font-medium text-primary hover:bg-surface-bg transition-colors">
          {t('delivery.navigate')}
        </a>
        <div className="flex gap-3">
          {active.status==='picked_up' ? null : <button onClick={()=>handleStatus('picked_up')} className="flex-1 py-3 bg-primary text-white rounded-btn font-medium">{t('delivery.mark_picked')}</button>}
          {active.status==='picked_up'&&<button onClick={()=>handleStatus('delivered')} className="flex-1 py-3 bg-success text-white rounded-btn font-medium">{t('delivery.mark_delivered')}</button>}
        </div>
      </div></div></div>);
};
export default ActiveDelivery;
