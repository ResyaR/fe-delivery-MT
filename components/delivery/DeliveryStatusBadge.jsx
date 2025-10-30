"use client";

export default function DeliveryStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: 'Menunggu',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: 'schedule'
    },
    accepted: {
      label: 'Diterima',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: 'check_circle'
    },
    picked_up: {
      label: 'Diambil',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: 'local_shipping'
    },
    in_transit: {
      label: 'Dalam Perjalanan',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: 'two_wheeler'
    },
    delivered: {
      label: 'Selesai',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: 'task_alt'
    },
    cancelled: {
      label: 'Dibatalkan',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: 'cancel'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span className="material-symbols-outlined text-sm">{config.icon}</span>
      {config.label}
    </span>
  );
}

