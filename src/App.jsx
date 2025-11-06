import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import LoginPanel from './components/LoginPanel';
import PermitForm from './components/PermitForm';
import ManagementBoard from './components/ManagementBoard';

const initialUsers = [
  { username: 'Dana', password: 'Dana', role: 'Superadmin', section: 'ERS' },
  { username: 'Abi', password: 'Abi', role: 'User', section: 'Plant' },
  { username: 'Aba', password: 'Aba', role: 'Pengawas', section: 'Plant' },
  { username: 'Abu', password: 'Abu', role: 'Security', section: 'ERS' },
];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginHistory, setLoginHistory] = useState([]);
  const [permits, setPermits] = useState([]);

  const onLogin = (username, password) => {
    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!found) {
      setLoginError('Akun tidak ditemukan atau password salah');
      return;
    }
    setCurrentUser(found);
    setLoginError('');
    setLoginHistory((h) => [...h, { username: found.username, role: found.role, timestamp: Date.now() }]);
  };

  const onLogout = () => {
    setCurrentUser(null);
  };

  const createPermit = (data) => {
    const id = crypto.randomUUID();
    const code = `PERM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const record = {
      id,
      code,
      createdBy: currentUser.username,
      section: data.section,
      items: data.items,
      purpose: data.purpose,
      destination: data.destination,
      period: data.period,
      driverName: data.driverName,
      vehicleNumber: data.vehicleNumber,
      carrierName: data.carrierName,
      status: 'pending',
      history: [{ action: 'created', by: currentUser.username, at: Date.now() }],
    };
    setPermits((prev) => [record, ...prev]);
  };

  const approvePermit = (permit, note) => {
    setPermits((prev) => prev.map((p) => p.id === permit.id ? {
      ...p,
      status: 'approved',
      supervisorNote: note || '',
      approvedBy: currentUser.username,
      approvedAt: Date.now(),
      history: [...p.history, { action: 'approved', note, by: currentUser.username, at: Date.now() }],
    } : p));
  };

  const rejectPermit = (permit, note) => {
    setPermits((prev) => prev.map((p) => p.id === permit.id ? {
      ...p,
      status: 'rejected',
      supervisorNote: note || '',
      approvedBy: currentUser.username,
      approvedAt: Date.now(),
      history: [...p.history, { action: 'rejected', note, by: currentUser.username, at: Date.now() }],
    } : p));
  };

  const releasePermit = (permit, location, note) => {
    setPermits((prev) => prev.map((p) => p.id === permit.id ? {
      ...p,
      status: 'released',
      releasedBy: currentUser.username,
      releasedAt: Date.now(),
      releaseLocation: location,
      securityNote: note || '',
      history: [...p.history, { action: 'released', note, location, by: currentUser.username, at: Date.now() }],
    } : p));
  };

  const holdPermit = (permit, location, note) => {
    setPermits((prev) => prev.map((p) => p.id === permit.id ? {
      ...p,
      status: 'issue',
      releasedBy: currentUser.username,
      releasedAt: Date.now(),
      releaseLocation: location,
      securityNote: note || '',
      history: [...p.history, { action: 'issue', note, location, by: currentUser.username, at: Date.now() }],
    } : p));
  };

  const addUser = (u) => {
    if (users.some((x) => x.username.toLowerCase() === u.username.toLowerCase())) return;
    setUsers((prev) => [...prev, u]);
  };
  const removeUser = (username) => {
    setUsers((prev) => prev.filter((u) => u.username !== username));
    if (currentUser?.username === username) setCurrentUser(null);
  };

  const layout = useMemo(() => {
    if (!currentUser) return 'login';
    return 'app';
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header user={currentUser} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {layout === 'login' && (
          <div className="pt-10">
            <LoginPanel onLogin={onLogin} error={loginError} />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur rounded-xl border p-5">
                <h3 className="font-semibold mb-2">Alur Sistem</h3>
                <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                  <li>User membuat pengajuan izin dengan detail barang.</li>
                  <li>Pengawas menyetujui/menolak pengajuan di bagian yang sama.</li>
                  <li>Setelah disetujui, User mencetak lembar izin berisi kode verifikasi.</li>
                  <li>Security memindai/mengetik kode dan menandai barang sebagai released atau tidak sesuai.</li>
                </ol>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl border p-5">
                <h3 className="font-semibold mb-2">Peran Pengguna</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Superadmin: kelola akun, pantau riwayat login.</li>
                  <li>User: ajukan izin, lihat status, cetak, pantau hasil verifikasi.</li>
                  <li>Pengawas: setujui/tolak pengajuan satu section.</li>
                  <li>Security: verifikasi kode dan tentukan released/tidak sesuai.</li>
                </ul>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl border p-5">
                <h3 className="font-semibold mb-2">Catatan</h3>
                <p className="text-sm text-gray-600">Ini adalah antarmuka siap sambung API. Semua aksi masih lokal untuk demo UI dan akan dihubungkan ke backend FastAPI serta database sesuai kebutuhan alur produksi.</p>
              </div>
            </div>
          </div>
        )}

        {layout === 'app' && (
          <div className="space-y-6">
            {(currentUser.role === 'User' || currentUser.role === 'Superadmin') && (
              <PermitForm onSubmit={createPermit} section={currentUser.section} />
            )}

            <ManagementBoard
              user={currentUser}
              users={users}
              permits={permits}
              onApprove={approvePermit}
              onReject={rejectPermit}
              onPrint={() => {}}
              onRelease={releasePermit}
              onHold={holdPermit}
              loginHistory={loginHistory}
              onAddUser={addUser}
              onRemoveUser={removeUser}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
