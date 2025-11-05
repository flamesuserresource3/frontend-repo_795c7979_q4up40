import React, { useMemo, useState } from 'react';
import { BadgeCheck, CheckCircle2, FileText, Printer, ScanLine, Search, XCircle } from 'lucide-react';

const StatusPill = ({ status }) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    released: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  const text = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    released: 'Released',
  }[status];
  return <span className={`text-xs px-2 py-1 rounded-full border ${map[status]}`}>{text}</span>;
};

const PermitCard = ({ permit, onPrint, onApprove, onReject }) => {
  return (
    <div className="border rounded-lg p-4 bg-white/70 backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">Kode</div>
          <div className="font-mono text-sm">{permit.code}</div>
        </div>
        <StatusPill status={permit.status} />
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-gray-500">Pemohon</div>
          <div className="font-medium">{permit.createdBy} • {permit.section}</div>
        </div>
        <div>
          <div className="text-gray-500">Keperluan & Tujuan</div>
          <div className="font-medium">{permit.purpose} → {permit.destination}</div>
        </div>
        <div>
          <div className="text-gray-500">Periode</div>
          <div className="font-medium">{new Date(permit.period.start).toLocaleString()} — {new Date(permit.period.end).toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-gray-500 text-sm mb-1">Barang</div>
        <ul className="list-disc pl-5 text-sm">
          {permit.items.map((it, idx) => (
            <li key={idx}>{it.name} × {it.qty} {it.notes ? <span className="text-gray-500">({it.notes})</span> : null}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {onPrint && (
          <button onClick={() => onPrint(permit)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"><Printer size={16}/> Cetak</button>
        )}
        {onApprove && permit.status === 'pending' && (
          <button onClick={() => onApprove(permit)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border text-emerald-700 hover:bg-emerald-50"><CheckCircle2 size={16}/> Setujui</button>
        )}
        {onReject && permit.status === 'pending' && (
          <button onClick={() => onReject(permit)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border text-rose-700 hover:bg-rose-50"><XCircle size={16}/> Tolak</button>
        )}
      </div>
    </div>
  );
};

const PrintSheet = ({ permit, onClose }) => {
  const qrPayload = permit.code;
  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl border shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2"><FileText/> Lembar Izin</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Tutup</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Kode Verifikasi</div>
            <div className="font-mono text-lg">{qrPayload}</div>
            <div className="mt-3 p-4 border rounded-lg">
              <div className="text-center text-xs text-gray-500 mb-2">QR Simulasi</div>
              <div className="font-mono text-center select-all">{qrPayload}</div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <div><span className="text-gray-500">Pemohon:</span> <span className="font-medium">{permit.createdBy} • {permit.section}</span></div>
            <div><span className="text-gray-500">Keperluan:</span> <span className="font-medium">{permit.purpose}</span></div>
            <div><span className="text-gray-500">Tujuan:</span> <span className="font-medium">{permit.destination}</span></div>
            <div><span className="text-gray-500">Periode:</span> <span className="font-medium">{new Date(permit.period.start).toLocaleString()} — {new Date(permit.period.end).toLocaleString()}</span></div>
            <div>
              <div className="text-gray-500">Barang:</div>
              <ul className="list-disc pl-5">
                {permit.items.map((it, i) => (
                  <li key={i}>{it.name} × {it.qty} {it.notes ? <span className="text-gray-500">({it.notes})</span> : null}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">Status: <StatusPill status={permit.status} /></div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"><Printer size={16}/> Cetak</button>
        </div>
      </div>
    </div>
  );
};

const ManagementBoard = ({
  user,
  users,
  permits,
  onApprove,
  onReject,
  onPrint,
  onRelease,
  loginHistory,
  onAddUser,
  onRemoveUser,
}) => {
  const [note, setNote] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [location, setLocation] = useState('Gate A');
  const [printPreview, setPrintPreview] = useState(null);

  const myPermits = useMemo(() => permits.filter(p => p.createdBy === user.username), [permits, user.username]);
  const pendingInSection = useMemo(() => permits.filter(p => p.section === user.section && p.status === 'pending'), [permits, user.section]);
  const codeLookup = useMemo(() => Object.fromEntries(permits.map(p => [p.code, p])), [permits]);
  const [foundPermit, setFoundPermit] = useState(null);

  const handleApprove = (p) => onApprove(p, note);
  const handleReject = (p) => onReject(p, note);

  const handleScan = () => {
    const p = codeLookup[scanCode.trim()];
    setFoundPermit(p || null);
  };

  return (
    <div className="space-y-6">
      {user.role === 'Superadmin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><BadgeCheck className="text-indigo-600"/> Manajemen Akun</h3>
              <span className="text-xs text-gray-500">{users.length} akun</span>
            </div>
            <UserManager users={users} onAddUser={onAddUser} onRemoveUser={onRemoveUser} />
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Riwayat Login</h3>
            <div className="overflow-auto max-h-80">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Pengguna</th>
                    <th className="py-2">Peran</th>
                    <th className="py-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.slice().reverse().map((h, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{h.username}</td>
                      <td className="py-2">{h.role}</td>
                      <td className="py-2">{new Date(h.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {user.role === 'User' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Pengajuan Saya</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myPermits.map((p) => (
              <PermitCard key={p.id} permit={p} onPrint={(per) => setPrintPreview(per)} />
            ))}
            {myPermits.length === 0 && (
              <div className="text-sm text-gray-500">Belum ada pengajuan.</div>
            )}
          </div>
        </div>
      )}

      {user.role === 'Pengawas' && (
        <div className="space-y-3">
          <h3 className="font-semibold">Persetujuan Menunggu • Section {user.section}</h3>
          <div className="flex items-center gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan persetujuan/penolakan" className="border rounded-md px-3 py-2 text-sm w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingInSection.map((p) => (
              <PermitCard key={p.id} permit={p} onApprove={handleApprove} onReject={handleReject} />
            ))}
            {pendingInSection.length === 0 && (
              <div className="text-sm text-gray-500">Tidak ada pengajuan menunggu.</div>
            )}
          </div>
        </div>
      )}

      {user.role === 'Security' && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><ScanLine/> Verifikasi Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Tempel/Scan Kode</label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
                <Search size={16} className="text-gray-400"/>
                <input value={scanCode} onChange={(e) => setScanCode(e.target.value)} className="w-full outline-none text-sm" placeholder="Contoh: PERM-..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                <option>Gate A</option>
                <option>Gate B</option>
                <option>Warehouse</option>
              </select>
              <button onClick={handleScan} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">Cari</button>
            </div>
          </div>

          {foundPermit && (
            <div className="border rounded-lg p-4 bg-white/70 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Kode</div>
                  <div className="font-mono text-sm">{foundPermit.code}</div>
                </div>
                <StatusPill status={foundPermit.status} />
              </div>
              <div className="mt-2 text-sm">
                <div><span className="text-gray-500">Pemohon:</span> <span className="font-medium">{foundPermit.createdBy} • {foundPermit.section}</span></div>
                <div><span className="text-gray-500">Periode:</span> <span className="font-medium">{new Date(foundPermit.period.start).toLocaleString()} — {new Date(foundPermit.period.end).toLocaleString()}</span></div>
                <div className="mt-2">
                  <div className="text-gray-500">Barang:</div>
                  <ul className="list-disc pl-5">
                    {foundPermit.items.map((it, i) => (
                      <li key={i}>{it.name} × {it.qty} {it.notes ? <span className="text-gray-500">({it.notes})</span> : null}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input className="border rounded-md px-3 py-2 text-sm md:col-span-2" placeholder="Catatan barang tidak sesuai (opsional)" value={note} onChange={(e) => setNote(e.target.value)} />
                <button onClick={() => onRelease(foundPermit, location, note)} className="px-3 py-2 rounded-md border text-sm text-indigo-700 hover:bg-indigo-50">Tandai Released</button>
              </div>
            </div>
          )}
        </div>
      )}

      {printPreview && (
        <PrintSheet permit={printPreview} onClose={() => setPrintPreview(null)} />
      )}
    </div>
  );
};

const UserManager = ({ users, onAddUser, onRemoveUser }) => {
  const [form, setForm] = useState({ username: '', password: '', role: 'User', section: 'Plant' });
  const add = () => {
    if (!form.username || !form.password) return;
    onAddUser(form);
    setForm({ username: '', password: '', role: 'User', section: 'Plant' });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="border rounded-md px-3 py-2 text-sm" placeholder="Username" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded-md px-3 py-2 text-sm" placeholder="Password" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
          <option>Superadmin</option>
          <option>User</option>
          <option>Pengawas</option>
          <option>Security</option>
        </select>
        <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
          <option>ERS</option>
          <option>Plant</option>
          <option>Warehouse</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button onClick={add} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">Tambah Akun</button>
      </div>
      <div className="overflow-auto max-h-80">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Username</th>
              <th className="py-2">Peran</th>
              <th className="py-2">Section</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{u.username}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2">{u.section}</td>
                <td className="py-2 text-right">
                  <button onClick={() => onRemoveUser(u.username)} className="text-rose-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagementBoard;
