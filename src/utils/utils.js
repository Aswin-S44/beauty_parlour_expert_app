import { format, formatDistanceToNow, isValid } from 'date-fns';

export function formatFirestoreTimestamp(timestamp) {
  if (!timestamp?.seconds) return '';

  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);

  return `Added ${formatDistanceToNow(date, { addSuffix: true })}`;
}

export const formatDateTime = dateTime => {
  return formatDistanceToNow(dateTime, { addSuffix: true });
};

export const timeAgo = date => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

export const formatTimestamp = timestamp => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
  );
  return format(date, 'dd MMM yyyy');
};

export const convertFIrstCharToUpper = s => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatDate = dateString => {
  const date = new Date(dateString);
  if (!isValid(date)) {
    return '-';
  }

  return format(date, 'dd MMMM yyyy');
};

export const formatTimeAgo = createdAt => {
  const date = createdAt?._seconds
    ? new Date(createdAt._seconds * 1000)
    : new Date(createdAt);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `Added ${diffSec} seconds ago`;
  if (diffMin < 60) return `Added ${diffMin} minutes ago`;
  if (diffHr < 24) return `Added ${diffHr} hours ago`;
  if (diffDay < 7) return `Added ${diffDay} days ago`;
  return `Added on ${date.toLocaleDateString()}`;
};

export const formattedTimeAgo = dateString => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) {
      return `Added ${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

export const formatServiceName = str => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
