import React, { useState } from 'react';
import { Plus, Trash2, Calendar, ClipboardCheck, Truck, IdCard, Hash } from 'lucide-react';

const emptyItem = { name: '', qty: 1, notes: '' };

const PermitForm = ({ onSubmit, section }) => {
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [purpose, setPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, key, value) => setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!purpose || !destination || !start || !end || items.some((it) => !it.name || it.qty <= 0)) return;
    if (!driverName || !vehicleNumber || !carrierName) return;
    onSubmit({ items, purpose, destination, period: { start, end }, section, driverName, vehicleNumber, carrierName });
    // reset
    setItems([{ ...emptyItem }]);
    setPurpose('');
    setDestination('');
    setStart('');
    setEnd('');
    setDriverName('');
    setVehicleNumber('');
    setCarrierName('');
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="text-indigo-600" />
        <div>
          <h3 className="font-semibold">Pengajuan Izin Membawa Barang</h3>
          <p className="text-xs text-gray-500">Bagian/Section: {section}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Keperluan</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Contoh: Perbaikan, Pengembalian, dll"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tujuan</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Contoh: Vendor A, Gudang B, dll"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1 flex items-center gap-2"><Calendar size={16}/> Mulai</label>
            <input
              type="datetime-local"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 flex items-center gap-2"><Calendar size={16}/> Selesai</label>
            <input
              type="datetime-local"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 flex items-center gap-2"><Truck size={16}/> Nama Driver</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Nama driver/driver perusahaan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 flex items-center gap-2"><Hash size={16}/> Nomor Sarana</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Plat nomor / ID kendaraan"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 flex items-center gap-2"><IdCard size={16}/> Nama Pembawa Barang</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              placeholder="Nama petugas yang membawa"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm">Data Barang</label>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"><Plus size={14}/> Tambah Barang</button>
          </div>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                <input
                  className="col-span-5 border rounded-md px-3 py-2 text-sm"
                  placeholder="Nama Barang"
                  value={item.name}
                  onChange={(e) => updateItem(idx, 'name', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border rounded-md px-3 py-2 text-sm"
                  placeholder="Qty"
                  value={item.qty}
                  min={1}
                  onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                />
                <input
                  className="col-span-4 border rounded-md px-3 py-2 text-sm"
                  placeholder="Catatan (opsional)"
                  value={item.notes}
                  onChange={(e) => updateItem(idx, 'notes', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="col-span-1 inline-flex items-center justify-center h-10 rounded-md border text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Kirim Pengajuan</button>
        </div>
      </form>
    </div>
  );
};

export default PermitForm;
