"use client";

import { useState } from 'react';

// .env.localからパスワードを読み込みます
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ボタンがクリックされた時に実行される関数
  const handleLogin = () => {
    // パスワードが設定されていない場合のエラー処理
    if (!CORRECT_PASSWORD) {
      setError('エラー: アプリケーションのパスワードが設定されていません。');
      return;
    }

    // パスワードが正しいかチェック
    if (password === CORRECT_PASSWORD) {
      try {
        // 正しい場合は、ブラウザにパスワードを保存
        localStorage.setItem('password', password);
        // メインページに移動
        window.location.href = '/'; 
      } catch (e) {
        setError('エラー: ブラウザのストレージにアクセスできません。');
      }
    } else {
      // パスワードが間違っている場合
      setError('パスワードが正しくありません。');
    }
  };

  // Enterキーが押された時にログインを実行する関数
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">認証</h1>
        
        {/* 問題を回避するため、formタグを使わないシンプルな構造に変更しました */}
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-teal-300 mb-2">パスワードを入力</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-gray-900/70 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 outline-none transition duration-300 text-white"
              required
            />
          </div>

          <div className="text-right">
            <label className="text-gray-400 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 align-middle"
              />
              パスワードを表示
            </label>
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            // active: スタイルを追加して、クリックした瞬間にボタンが少し縮む視覚効果を追加
            className="w-full mt-4 px-8 py-3 bg-teal-500 text-white rounded-full text-lg font-bold hover:bg-teal-400 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            認証する
          </button>
        </div>
      </div>
    </div>
  );
}

