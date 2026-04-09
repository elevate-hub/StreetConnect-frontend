import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVendorEarnings } from '../../api/vendor.api';
import { IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const VendorEarnings = () => {
  const { t } = useTranslation();
  const { data } = useQuery({ queryKey: ['vendorEarnings'], queryFn: () => getVendorEarnings().then(r => r.data) });
  return (<div className="px-4 py-4 pb-20 md:pb-8"><h1 className="text-xl font-bold mb-4">{t('nav.earnings')}</h1>
    <div className="grid grid-cols-2 gap-3">{[
      { label: t('vendor.todays_earnings'), val: formatCurrency(data?.today||0) },
      { label: 'Total', val: formatCurrency(data?.total||0) },
      { label: t('vendor.todays_orders'), val: data?.today_count||0 },
      { label: 'Total Orders', val: data?.total_count||0 }
    ].map((m,i)=>(<div key={i} className="bg-white rounded-card border border-surface-border shadow-card p-4">
      <IndianRupee size={20} className="text-text-secondary"/><p className="text-2xl font-bold mt-2">{m.val}</p><p className="text-xs text-text-secondary">{m.label}</p></div>))}</div></div>);
};
export default VendorEarnings;
