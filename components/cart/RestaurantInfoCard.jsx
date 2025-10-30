"use client";

export default function RestaurantInfoCard({ restaurant, subtotal }) {
  const minimumOrder = 25000;
  const isAboveMinimum = subtotal >= minimumOrder;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={restaurant?.image || '/placeholder.jpg'}
          alt={restaurant?.name}
          className="w-16 h-16 rounded-lg object-cover"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{restaurant?.name || 'Restaurant'}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
              {restaurant?.rating || '4.5'}
            </span>
            <span>•</span>
            <span>{restaurant?.category || 'Food'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-gray-500">schedule</span>
          <div>
            <p className="font-semibold text-gray-700">Jam Operasional</p>
            <p className="text-gray-600">
              {restaurant?.openingTime || '10:00'} - {restaurant?.closingTime || '22:00'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-gray-500">restaurant</span>
          <div>
            <p className="font-semibold text-gray-700">Waktu Persiapan</p>
            <p className="text-gray-600">~15-20 menit</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-gray-500">payments</span>
          <div>
            <p className="font-semibold text-gray-700">Minimum Order</p>
            <p className="text-gray-600">Rp {minimumOrder.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {!isAboveMinimum && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-orange-600 text-sm">info</span>
            <p className="text-sm text-orange-800">
              Tambah <strong>Rp {(minimumOrder - subtotal).toLocaleString('id-ID')}</strong> lagi untuk mencapai minimum order
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

