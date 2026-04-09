import { getStatusColor } from '../../utils/getStatusColor';

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}>
    {status?.replace('_', ' ')}
  </span>
);

export default StatusBadge;
