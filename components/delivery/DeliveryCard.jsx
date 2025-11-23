"use client";

import DeliveryStatusBadge from './DeliveryStatusBadge';

export default function DeliveryCard({ delivery, onViewDetail }) {
  const getTypeConfig = (type) => {
    const configs = {
      JADWAL: {
        label: 'Jadwal Pengiriman',
        icon: 'schedule',
        gradient: 'from-blue-500 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        borderColor: 'border-blue-200'
      },
      MULTI_DROP: {
        label: 'Multi Drop',
        icon: 'place',
        gradient: 'from-green-500 to-green-600',
        bgGradient: 'from-green-50 to-green-100',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        badgeBg: 'bg-green-50',
        badgeText: 'text-green-700',
        borderColor: 'border-green-200'
      },
      PAKET_BESAR: {
        label: 'Paket Besar',
        icon: 'inventory_2',
        gradient: 'from-orange-500 to-orange-600',
        bgGradient: 'from-orange-50 to-orange-100',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        badgeBg: 'bg-orange-50',
        badgeText: 'text-orange-700',
        borderColor: 'border-orange-200'
      },
      KIRIM_SEKARANG: {
        label: 'Kirim Sekarang',
        icon: 'electric_bolt',
        gradient: 'from-red-500 to-red-600',
        bgGradient: 'from-red-50 to-red-100',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        badgeBg: 'bg-red-50',
        badgeText: 'text-red-700',
        borderColor: 'border-red-200'
      },
      TITIP_BELI: {
        label: 'Titip Beli',
        icon: 'shopping_bag',
        gradient: 'from-purple-500 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        borderColor: 'border-purple-200'
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
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      {/* Header dengan Gradient */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} px-5 py-4 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${typeConfig.iconBg} p-2 rounded-lg`}>
              <span className={`material-symbols-outlined text-xl ${typeConfig.iconColor}`}>
                {typeConfig.icon}
              </span>
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{typeConfig.label}</span>
              <span className="text-xs text-white/90 font-mono">{delivery.resiCode || `#${delivery.id}`}</span>
            </div>
          </div>
          <div className="text-white/80">
            <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Status dan Tanggal */}
        <div className="flex justify-between items-center">
          <DeliveryStatusBadge status={delivery.status} />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>{formatDate(delivery.createdAt)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100"></div>

        {/* Locations dengan Design yang Lebih Baik */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-sm">location_on</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-1">Alamat Penjemputan</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                {delivery.pickupLocation}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-sm">flag</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-1">Alamat Tujuan</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                {delivery.dropoffLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Special Info dengan Design yang Lebih Menarik */}
        {delivery.type === 'MULTI_DROP' && delivery.totalDropPoints && (
          <div className={`flex items-center gap-3 ${typeConfig.badgeBg} px-4 py-3 rounded-lg border ${typeConfig.borderColor}`}>
            <div className={`${typeConfig.iconBg} p-2 rounded-lg`}>
              <span className={`material-symbols-outlined ${typeConfig.iconColor} text-lg`}>place</span>
            </div>
            <div>
              <p className={`text-xs ${typeConfig.badgeText} font-medium`}>Multi Drop</p>
              <p className={`${typeConfig.badgeText} font-bold text-sm`}>{delivery.totalDropPoints} Titik Tujuan</p>
            </div>
          </div>
        )}

        {delivery.type === 'PAKET_BESAR' && delivery.packageDetails && (
          <div className={`flex items-center gap-3 ${typeConfig.badgeBg} px-4 py-3 rounded-lg border ${typeConfig.borderColor}`}>
            <div className={`${typeConfig.iconBg} p-2 rounded-lg`}>
              <span className={`material-symbols-outlined ${typeConfig.iconColor} text-lg`}>inventory_2</span>
            </div>
            <div className="flex-1">
              <p className={`text-xs ${typeConfig.badgeText} font-medium`}>Detail Paket</p>
              <p className={`${typeConfig.badgeText} font-bold text-sm`}>
                {delivery.packageDetails.weight} kg • {delivery.packageDetails.length}×{delivery.packageDetails.width}×{delivery.packageDetails.height} cm
              </p>
            </div>
          </div>
        )}

        {delivery.type === 'JADWAL' && delivery.scheduledDate && (
          <div className={`flex items-center gap-3 ${typeConfig.badgeBg} px-4 py-3 rounded-lg border ${typeConfig.borderColor}`}>
            <div className={`${typeConfig.iconBg} p-2 rounded-lg`}>
              <span className={`material-symbols-outlined ${typeConfig.iconColor} text-lg`}>event</span>
            </div>
            <div className="flex-1">
              <p className={`text-xs ${typeConfig.badgeText} font-medium`}>Jadwal Pengiriman</p>
              <p className={`${typeConfig.badgeText} font-bold text-sm`}>
                {new Date(delivery.scheduledDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })} • {delivery.scheduleTimeSlot}
              </p>
            </div>
          </div>
        )}

        {/* Price dan Button dengan Design yang Lebih Menarik */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Total Biaya</p>
              <p className="text-2xl font-bold text-[#E00000]">
                Rp {Math.round(delivery.price).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onViewDetail(delivery)}
            className="w-full group/btn bg-gradient-to-r from-[#E00000] to-red-600 text-white rounded-lg py-3 px-4 font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
              visibility
            </span>
            <span>Lihat Detail</span>
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

