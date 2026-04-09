import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminStats } from '../../api/admin.api';
import { Store, Clock, ShoppingBag, IndianRupee, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { data } = useQuery({ queryKey: ['adminStats'], queryFn: () => getAdminStats().then(r => r.data) });
  const metrics = [
    { icon: Store, label: t('admin.total_vendors'), val: data?.total_vendors||0 },
    { icon: Clock, label: t('admin.pending_approvals'), val: data?.pending_approvals||0, hl: (data?.pending_approvals||0)>0 },
    { icon: ShoppingBag, label: t('admin.today_orders'), val: data?.today_orders||0 },
    { icon: IndianRupee, label: t('admin.total_revenue'), val: formatCurrency(data?.total_revenue||0) },
    { icon: Truck, label: t('admin.active_dp'), val: data?.active_delivery_partners||0 }
  ];
  return (<div className="px-4 py-4"><h1 className="text-xl font-bold mb-4">{t('vendor.overview')}</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{metrics.map((m,i)=>(<div key={i} className={`bg-white rounded-card border shadow-card p-4 ${m.hl?'border-primary':'border-surface-border'}`}>
      <m.icon size={20} className={m.hl?'text-primary':'text-text-secondary'}/><p className="text-2xl font-bold mt-2">{m.val}</p><p className="text-xs text-text-secondary">{m.label}</p></div>))}</div></div>);
};
export default AdminDashboard;
