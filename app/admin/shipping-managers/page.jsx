"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShippingManagerAPI, { ShippingManager, CreateShippingManagerDto } from '@/lib/shippingManagerApi';

export default function ShippingManagersPage() {
  const router = useRouter();
  const [managers, setManagers] = useState<ShippingManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateShippingManagerDto>({
    name: '',
    email: '',
    phone: '',
    zone: 1,
  });
  const [regeneratingToken, setRegeneratingToken] = useState<number | null>(null);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ShippingManagerAPI.getAll();
      setManagers(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data shipping manager');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'zone' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      if (editingId) {
        await ShippingManagerAPI.update(editingId, formData);
      } else {
        await ShippingManagerAPI.create(formData);
      }
      await loadManagers();
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', zone: 1 });
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan shipping manager');
    }
  };

  const handleEdit = (manager: ShippingManager) => {
    setFormData({
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      zone: manager.zone,
    });
    setEditingId(manager.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus shipping manager ini?')) {
      return;
    }
    try {
      setError('');
      await ShippingManagerAPI.delete(id);
      await loadManagers();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus shipping manager');
    }
  };

  const handleRegenerateToken = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin regenerate token? Token lama tidak akan bisa digunakan lagi.')) {
      return;
    }
    try {
      setRegeneratingToken(id);
      setError('');
      await ShippingManagerAPI.regenerateToken(id);
      await loadManagers();
      alert('Token berhasil di-regenerate!');
    } catch (err: any) {
      setError(err.message || 'Gagal regenerate token');
    } finally {
      setRegeneratingToken(null);
    }
  };

  const handleToggleActive = async (manager: ShippingManager) => {
    try {
      setError('');
      await ShippingManagerAPI.update(manager.id, { isActive: !manager.isActive });
      await loadManagers();
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate status');
    }
  };

  const groupedByZone = managers.reduce((acc, manager) => {
    if (!acc[manager.zone]) {
      acc[manager.zone] = [];
    }
    acc[manager.zone].push(manager);
    return acc;
  }, {} as Record<number, ShippingManager[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Managers</h1>
            <p className="text-gray-600 mt-1">Kelola shipping manager berdasarkan zona</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              setFormData({ name: '', email: '', phone: '', zone: 1 });
            }}
            className="bg-[#E00000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Tambah Shipping Manager
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Shipping Manager' : 'Tambah Shipping Manager Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zona (1-5) *
                  </label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  >
                    <option value={1}>Zona 1</option>
                    <option value={2}>Zona 2</option>
                    <option value={3}>Zona 3</option>
                    <option value={4}>Zona 4</option>
                    <option value={5}>Zona 5</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E00000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ name: '', email: '', phone: '', zone: 1 });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000] mx-auto"></div>
            <p className="text-gray-600 mt-4">Memuat data...</p>
          </div>
        ) : managers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-2">local_shipping</span>
            <p className="text-gray-600">Belum ada shipping manager</p>
          </div>
        ) : (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((zone) => {
              const zoneManagers = groupedByZone[zone] || [];
              if (zoneManagers.length === 0) return null;

              return (
                <div key={zone} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E00000]">location_on</span>
                    Zona {zone}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zoneManagers.map((manager) => (
                      <div
                        key={manager.id}
                        className={`p-4 rounded-lg border-2 ${
                          manager.isActive
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{manager.name}</h3>
                            <p className="text-sm text-gray-600">{manager.email}</p>
                            <p className="text-sm text-gray-600">{manager.phone}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              manager.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {manager.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>

                        <div className="mb-3">
                          <label className="text-xs text-gray-500">Token Login:</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded truncate">
                              {manager.token.substring(0, 20)}...
                            </code>
                            <button
                              onClick={() => handleRegenerateToken(manager.id)}
                              disabled={regeneratingToken === manager.id}
                              className="text-xs text-[#E00000] hover:underline disabled:opacity-50"
                              title="Regenerate Token"
                            >
                              {regeneratingToken === manager.id ? '...' : '🔄'}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleActive(manager)}
                            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded ${
                              manager.isActive
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-green-200 text-green-700 hover:bg-green-300'
                            }`}
                          >
                            {manager.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            onClick={() => handleEdit(manager)}
                            className="px-3 py-1.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(manager.id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

