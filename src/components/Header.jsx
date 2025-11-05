import React from 'react';
import { LogOut, Shield, User as UserIcon, ClipboardList } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Shield className="text-indigo-600" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Izin Membawa Barang</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1"><ClipboardList size={14}/> Workflow Pengajuan • Persetujuan • Verifikasi</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{user.username}</div>
              <div className="text-xs text-gray-500">{user.role} • {user.section}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center">
              <UserIcon size={18} />
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-gray-50"
            >
              <LogOut size={16}/> Keluar
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Silakan masuk</div>
        )}
      </div>
    </header>
  );
};

export default Header;
