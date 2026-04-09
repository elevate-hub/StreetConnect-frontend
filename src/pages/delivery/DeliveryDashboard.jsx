import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { toggleAvailable, getAvailableJobs, acceptJob } from '../../api/delivery.api';
import { getMe } from '../../api/auth.api';
import { Truck, MapPin, Store } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
  const { t } = useTranslation();
  const { user, profile, setProfile } = useAuth();
  const qc = useQueryClient();

  const { data: jobs = [] } = useQuery({
    queryKey: ['deliveryJobs'],
    queryFn: () => getAvailableJobs().then(r => r.data),
    enabled: profile?.is_available === true
  });

  const getDirectionsUrl = (origin, destination) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

  const handleToggle = async () => {
    const res = await toggleAvailable();
    const me = await getMe();
    setProfile(me.data.profile);
    qc.invalidateQueries({ queryKey: ['deliveryJobs'] });
    toast.success(res.data.is_available ? 'You are now online' : 'You are now offline');
  };

  const handleAccept = async (orderId) => {
    await acceptJob(orderId);
    qc.invalidateQueries({ queryKey: ['deliveryJobs'] });
    toast.success('Job accepted!');
  };

  return (<div className="px-4 py-4 pb-20 md:pb-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold">{user?.name}</h1>
      <button onClick={handleToggle} className={`px-4 py-2 rounded-full text-sm font-medium ${profile?.is_available ? 'bg-success text-white' : 'bg-gray-200 text-text-secondary'}`}>
        {profile?.is_available ? t('delivery.online') : t('delivery.offline')}</button>
    </div>

    {!profile?.is_available ? (
      <EmptyState icon={Truck} message={t('delivery.go_online')} />
    ) : jobs.length === 0 ? (
      <EmptyState icon={Truck} message={t('delivery.no_jobs')} />
    ) : (
      <div className="space-y-3">{jobs.map(j => (
        <div key={j._id} className="bg-white rounded-card border border-surface-border shadow-card p-4">
          <div className="flex items-start gap-2 mb-2"><Store size={16} className="text-primary mt-0.5"/><div>
            <p className="text-sm font-medium">{j.vendor_id?.stall_name?.en}</p><p className="text-xs text-text-secondary">{j.vendor_id?.address}</p></div></div>
          <div className="flex items-start gap-2 mb-3"><MapPin size={16} className="text-text-secondary mt-0.5"/><p className="text-xs text-text-secondary">{j.delivery_address}</p></div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-primary">₹20 earnings</span>
              <button onClick={() => handleAccept(j._id)} className="px-4 py-2 bg-primary text-white rounded-btn text-sm font-medium">{t('delivery.accept')}</button>
            </div>
            <a href={getDirectionsUrl(j.vendor_id?.address || '', j.delivery_address)} target="_blank" rel="noreferrer" className="block text-center px-4 py-2 border border-surface-border rounded-btn text-sm font-medium text-primary hover:bg-surface-bg transition-colors">
              {t('delivery.navigate')}
            </a>
          </div></div>))}</div>)}
  </div>);
};
export default DeliveryDashboard;
