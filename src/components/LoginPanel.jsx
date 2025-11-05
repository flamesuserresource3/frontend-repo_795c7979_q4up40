import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const LoginPanel = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username.trim(), password);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur rounded-xl border p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Masuk</h2>
        <p className="text-sm text-gray-500">Gunakan akun yang telah ditentukan</p>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
            <User size={16} className="text-gray-400" />
            <input
              className="w-full outline-none text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              className="w-full outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Masuk
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-500">
        Contoh akun: Dana/Dana (Superadmin), Abi/Abi (User), Aba/Aba (Pengawas), Abu/Abu (Security)
      </div>
    </div>
  );
};

export default LoginPanel;
