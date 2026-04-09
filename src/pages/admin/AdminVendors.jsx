import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminVendors, approveVendor, rejectVendor, deactivateVendor } from '../../api/admin.api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminVendors = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');
  const { data: vendors = [], isLoading } = useQuery({ queryKey: ['adminVendors', filter], queryFn: () => getAdminVendors(filter || undefined).then(r => r.data) });

  const handle = async (fn, id, ...args) => { await fn(id, ...args); qc.invalidateQueries({ queryKey: ['adminVendors'] }); toast.success('Updated'); };

  return (<div className="px-4 py-4">
    <h1 className="text-xl font-bold mb-4">{t('admin.vendors')}</h1>
    <div className="flex gap-2 mb-4">{['','pending','approved','rejected'].map(f=>(
      <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-surface-border text-text-secondary'}`}>{f||'All'}</button>))}</div>
    {isLoading?<LoadingSkeleton/>:<div className="space-y-3">{vendors.map(v=>(
      <div key={v._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
        <div className="flex justify-between items-start mb-2">
          <div><p className="font-medium">{v.stall_name?.en||'No name'}</p><p className="text-xs text-text-secondary">{v.cuisine_type} — {v.address}</p>
            <p className="text-xs text-text-secondary">{v.user_id?.name} • {v.user_id?.phone}</p></div>
          <StatusBadge status={v.approval_status}/></div>
        <div className="flex gap-2 mt-2">
          {v.approval_status==='pending'&&<><button onClick={()=>handle(approveVendor,v._id)} className="px-3 py-1.5 bg-success text-white rounded-btn text-xs">{t('admin.approve')}</button>
            <button onClick={()=>{const r=prompt(t('admin.rejection_reason'));if(r)handle(rejectVendor,v._id,r)}} className="px-3 py-1.5 bg-error text-white rounded-btn text-xs">{t('admin.reject')}</button></>}
          {v.approval_status==='approved'&&<button onClick={()=>handle(deactivateVendor,v._id)} className="px-3 py-1.5 bg-gray-200 rounded-btn text-xs">{t('admin.deactivate')}</button>}
        </div></div>))}</div>}
  </div>);
};
export default AdminVendors;
