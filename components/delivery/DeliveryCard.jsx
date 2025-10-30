"use client";

import DeliveryStatusBadge from './DeliveryStatusBadge';

export default function DeliveryCard({ delivery, onViewDetail }) {
  const getTypeConfig = (type) => {
    const configs = {
      JADWAL: {
        label: 'Jadwal Pengiriman',
        icon: 'schedule',
        borderColor: 'border-l-blue-500',
        bgColor: 'bg-blue-50'
      },
      MULTI_DROP: {
        label: 'Multi Drop',
        icon: 'place',
        borderColor: 'border-l-green-500',
        bgColor: 'bg-green-50'
      },
      PAKET_BESAR: {
        label: 'Paket Besar',
        icon: 'inventory_2',
        borderColor: 'border-l-orange-500',
        bgColor: 'bg-orange-50'
      },
      KIRIM_SEKARANG: {
        label: 'Kirim Sekarang',
        icon: 'electric_bolt',
        borderColor: 'border-l-red-500',
        bgColor: 'bg-red-50'
      },
      TITIP_BELI: {
        label: 'Titip Beli',
        icon: 'shopping_bag',
        borderColor: 'border-l-purple-500',
        bgColor: 'bg-purple-50'
      }
    };
    return configs[type] || configs.KIRIM_SEKARANG;
  };

  const typeConfig = getTypeConfig(delivery.type);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 ${typeConfig.borderColor} overflow-hidden`}>
      {/* Header */}
      <div className={`${typeConfig.bgColor} px-4 py-3 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">{typeConfig.icon}</span>
            <span className="font-semibold text-sm">{typeConfig.label}</span>
          </div>
          <span className="text-xs text-gray-600">#{delivery.id}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Status */}
        <div className="flex justify-between items-start">
          <DeliveryStatusBadge status={delivery.status} />
          <span className="text-xs text-gray-500">{formatDate(delivery.createdAt)}</span>
        </div>

        {/* Locations */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500 text-lg flex-shrink-0">location_on</span>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Dari</p>
              <p className="font-medium text-gray-900 line-clamp-1">{delivery.pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-green-600 text-lg flex-shrink-0">flag</span>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Ke</p>
              <p className="font-medium text-gray-900 line-clamp-1">{delivery.dropoffLocation}</p>
            </div>
          </div>
        </div>

        {/* Special Info */}
        {delivery.type === 'MULTI_DROP' && delivery.totalDropPoints && (
          <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-md">
            <span className="material-symbols-outlined text-green-600">place</span>
            <span className="text-green-800 font-medium">{delivery.totalDropPoints} Titik Tujuan</span>
          </div>
        )}

        {delivery.type === 'PAKET_BESAR' && delivery.packageDetails && (
          <div className="flex items-center gap-2 text-sm bg-orange-50 px-3 py-2 rounded-md">
            <span className="material-symbols-outlined text-orange-600">inventory_2</span>
            <span className="text-orange-800 font-medium">
              {delivery.packageDetails.weight} kg • {delivery.packageDetails.length}×{delivery.packageDetails.width}×{delivery.packageDetails.height} cm
            </span>
          </div>
        )}

        {delivery.type === 'JADWAL' && delivery.scheduledDate && (
          <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-md">
            <span className="material-symbols-outlined text-blue-600">event</span>
            <span className="text-blue-800 font-medium">
              {new Date(delivery.scheduledDate).toLocaleDateString('id-ID')} • {delivery.scheduleTimeSlot}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total Biaya</p>
            <p className="text-lg font-bold text-[#E00000]">
              Rp {Math.round(delivery.price).toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={() => onViewDetail(delivery)}
            className="px-4 py-2 bg-[#E00000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

