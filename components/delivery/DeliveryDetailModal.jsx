"use client";

import { useState, useEffect } from 'react';
import DeliveryStatusBadge from './DeliveryStatusBadge';
import DeliveryAPI from '@/lib/deliveryApi';

export default function DeliveryDetailModal({ delivery, onClose }) {
  const [dropLocations, setDropLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (delivery && delivery.type === 'MULTI_DROP') {
      loadDropLocations();
    }
  }, [delivery]);

  const loadDropLocations = async () => {
    try {
      setLoadingLocations(true);
      const locations = await DeliveryAPI.getDropLocations(delivery.id);
      setDropLocations(locations.data || []);
    } catch (error) {
      console.error('Error loading drop locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  if (!delivery) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      JADWAL: 'Jadwal Pengiriman',
      MULTI_DROP: 'Multi Drop',
      PAKET_BESAR: 'Paket Besar',
      KIRIM_SEKARANG: 'Kirim Sekarang',
      TITIP_BELI: 'Titip Beli'
    };
    return labels[type] || type;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detail Pengiriman</h2>
            <p className="text-sm text-gray-500 font-mono">
              {delivery.resiCode ? `Kode Resi: ${delivery.resiCode}` : `Order #${delivery.id}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold">
              {getTypeLabel(delivery.type)}
            </span>
            <DeliveryStatusBadge status={delivery.status} />
          </div>

          {/* Date Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-gray-600">schedule</span>
              <span className="text-gray-600">Dibuat pada:</span>
              <span className="font-semibold text-gray-900">{formatDateTime(delivery.createdAt)}</span>
            </div>
            {delivery.scheduledDate && (
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-blue-600">event</span>
                <span className="text-gray-600">Dijadwalkan:</span>
                <span className="font-semibold text-blue-600">
                  {new Date(delivery.scheduledDate).toLocaleDateString('id-ID')} • {delivery.scheduleTimeSlot}
                </span>
              </div>
            )}
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Lokasi</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="material-symbols-outlined text-red-500 flex-shrink-0">location_on</span>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Pickup</p>
                  <p className="font-medium text-gray-900">{delivery.pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="material-symbols-outlined text-green-600 flex-shrink-0">flag</span>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tujuan</p>
                  <p className="font-medium text-gray-900">{delivery.dropoffLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Drop Locations */}
          {delivery.type === 'MULTI_DROP' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined">place</span>
                Daftar Titik Tujuan ({dropLocations.length})
              </h3>
              {loadingLocations ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E00000] mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {dropLocations.map((loc, index) => (
                    <div key={loc.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {loc.sequence}
                        </span>
                        <span className="font-semibold text-gray-900">{loc.locationName || `Tujuan ${loc.sequence}`}</span>
                        {loc.isCompleted && (
                          <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 ml-8">{loc.address}</p>
                      {loc.recipientName && (
                        <p className="text-xs text-gray-600 ml-8 mt-1">
                          <span className="material-symbols-outlined text-xs">person</span> {loc.recipientName}
                          {loc.recipientPhone && ` • ${loc.recipientPhone}`}
                        </p>
                      )}
                      {loc.notes && (
                        <p className="text-xs text-gray-600 ml-8 mt-1 italic">📝 {loc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paket Besar Details */}
          {delivery.type === 'PAKET_BESAR' && delivery.packageDetails && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined">inventory_2</span>
                Detail Paket
              </h3>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Berat Aktual</p>
                    <p className="font-semibold">{delivery.packageDetails.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Berat Volume</p>
                    <p className="font-semibold">{delivery.packageDetails.volumeWeight?.toFixed(2)} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dimensi (P×L×T)</p>
                    <p className="font-semibold">
                      {delivery.packageDetails.length}×{delivery.packageDetails.width}×{delivery.packageDetails.height} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Kategori</p>
                    <p className="font-semibold">{delivery.packageDetails.category || 'Lainnya'}</p>
                  </div>
                </div>
                {(delivery.packageDetails.isFragile || delivery.packageDetails.requiresHelper) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-300">
                    {delivery.packageDetails.isFragile && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                        🔴 Barang Fragile
                      </span>
                    )}
                    {delivery.packageDetails.requiresHelper && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        👷 Perlu Helper
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Barang Info (for Jadwal/Kirim Sekarang) */}
          {delivery.barang && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Detail Barang</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                <p className="text-sm"><span className="text-gray-600">Nama:</span> <span className="font-medium">{delivery.barang.itemName}</span></p>
                {delivery.barang.scale && (
                  <p className="text-sm"><span className="text-gray-600">Berat:</span> <span className="font-medium">{delivery.barang.scale} kg</span></p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {delivery.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Catatan</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">{delivery.notes}</p>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Biaya</span>
              <span className="text-2xl font-bold text-[#E00000]">
                Rp {Math.round(delivery.price).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex gap-3">
            {delivery.status === 'in_transit' && (
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">location_on</span>
                Lacak Pengiriman
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

