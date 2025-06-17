"use client";

import { useState } from 'react';

// .env.localからパスワードを読み込む（ブラウザ用）
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!CORRECT_PASSWORD) {
      setError('アプリケーションのパスワードが設定されていません。');
      return;
    }

    if (password === CORRECT_PASSWORD) {
      try {
        // ✅ middleware用のCookieを保存
        document.cookie = `password-protected=${password}; path=/;`;

        // ✅ AuthCheckerなどクライアント側用にlocalStorageにも保存
        localStorage.setItem('password', password);

        // ✅ メインページにリダイレクト
        window.location.href = '/';
      } catch (e) {
        setError('ブラウザのストレージが利用できません。');
      }
    } else {
      setError('パスワードが正しくありません。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">認証</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-teal-300 mb-2">パスワードを入力</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900/70 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 outline-none transition duration-300 text-white"
              required
            />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 px-8 py-3 bg-teal-500 text-white rounded-full text-lg font-bold hover:bg-teal-400 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            認証する
          </button>
        </form>
      </div>
    </div>
  );
}
