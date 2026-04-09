import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminDelivery, approveDelivery, rejectDelivery } from '../../api/admin.api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminDelivery = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');
  const { data: partners = [], isLoading } = useQuery({ queryKey: ['adminDelivery', filter], queryFn: () => getAdminDelivery(filter || undefined).then(r => r.data) });
  const handle = async (fn, id) => { await fn(id); qc.invalidateQueries({ queryKey: ['adminDelivery'] }); toast.success('Updated'); };

  return (<div className="px-4 py-4">
    <h1 className="text-xl font-bold mb-4">{t('admin.delivery_partners')}</h1>
    <div className="flex gap-2 mb-4">{['','pending','approved','rejected'].map(f=>(
      <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-surface-border'}`}>{f||'All'}</button>))}</div>
    {isLoading?<LoadingSkeleton/>:<div className="space-y-3">{partners.map(p=>(
      <div key={p._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
        <div className="flex justify-between items-center mb-2">
          <div><p className="font-medium">{p.user_id?.name}</p><p className="text-xs text-text-secondary">{p.user_id?.phone}</p></div>
          <StatusBadge status={p.approval_status}/></div>
        <div className="flex gap-2">
          {p.approval_status==='pending'&&<><button onClick={()=>handle(approveDelivery,p._id)} className="px-3 py-1.5 bg-success text-white rounded-btn text-xs">{t('admin.approve')}</button>
            <button onClick={()=>handle(rejectDelivery,p._id)} className="px-3 py-1.5 bg-error text-white rounded-btn text-xs">{t('admin.reject')}</button></>}
        </div></div>))}</div>}
  </div>);
};
export default AdminDelivery;
