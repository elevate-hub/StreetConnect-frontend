import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/notification.api';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then(r => r.data),
    refetchInterval: 30000
  });
};
