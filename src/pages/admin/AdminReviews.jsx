import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getAdminReviews, deleteReview } from '../../api/admin.api';
import StarRating from '../../components/common/StarRating';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({ queryKey: ['adminReviews'], queryFn: () => getAdminReviews().then(r => r.data) });
  const handleDelete = async (id) => { await deleteReview(id); qc.invalidateQueries({ queryKey: ['adminReviews'] }); toast.success('Deleted'); };

  return (<div className="px-4 py-4"><h1 className="text-xl font-bold mb-4">{t('nav.reviews')}</h1>
    <div className="space-y-3">{reviews.map(r=>(
      <div key={r._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
        <div className="flex justify-between"><div><p className="text-sm font-medium">{r.vendor_id?.stall_name?.en}</p>
          <StarRating rating={r.vendor_ratings?.overall||0} size={14}/></div>
          <button onClick={()=>handleDelete(r._id)} className="p-1.5 text-error"><Trash2 size={16}/></button></div>
        {r.vendor_comment&&<p className="text-sm mt-2">{r.vendor_comment}</p>}
      </div>))}</div></div>);
};
export default AdminReviews;
