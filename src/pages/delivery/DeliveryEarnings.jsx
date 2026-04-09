import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDeliveryEarnings } from '../../api/delivery.api';
import { IndianRupee, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const DeliveryEarnings = () => {
  const { t } = useTranslation();
  const { data } = useQuery({ queryKey: ['deliveryEarnings'], queryFn: () => getDeliveryEarnings().then(r => r.data) });
  return (<div className="px-4 py-4 pb-20 md:pb-8"><h1 className="text-xl font-bold mb-4">{t('nav.earnings')}</h1>
    <div className="grid grid-cols-2 gap-3">{[
      { label: 'Today', val: formatCurrency(data?.today||0), icon: IndianRupee },
      { label: 'Total', val: formatCurrency(data?.total||0), icon: IndianRupee },
      { label: t('delivery.deliveries_completed'), val: data?.deliveries_completed||0, icon: Truck },
      { label: 'Today', val: data?.today_count||0, icon: Truck }
    ].map((m,i)=>(<div key={i} className="bg-white rounded-card border border-surface-border shadow-card p-4">
      <m.icon size={20} className="text-text-secondary"/><p className="text-2xl font-bold mt-2">{m.val}</p><p className="text-xs text-text-secondary">{m.label}</p></div>))}</div></div>);
};
export default DeliveryEarnings;
