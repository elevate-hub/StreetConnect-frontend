import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { markAsRead, markAllRead } from '../../api/notification.api';
import { timeAgo } from '../../utils/formatDate';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

const NotificationBell = () => {
  const { data: notifications = [] } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useTranslation();
  const qc = useQueryClient();

  const unread = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    qc.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleClick = async (n) => {
    if (!n.is_read) {
      await markAsRead(n._id);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-gray-50 rounded-btn transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-white text-[10px] flex items-center justify-center rounded-full">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-surface-border rounded-card shadow-card z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b border-surface-border">
            <span className="font-medium text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-text-secondary text-center">{t('empty.notifications')}</p>
          ) : (
            notifications.slice(0, 10).map(n => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`block w-full text-left p-3 border-b border-surface-border hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-orange-50' : ''}`}
              >
                <p className="text-sm text-text-primary">{n.message}</p>
                <p className="text-xs text-text-secondary mt-1">{timeAgo(n.created_at)}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
