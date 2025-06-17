"use client";

import { useState, useEffect } from 'react';

// .env.localからパスワードを読み込む
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

// --- 認証チェックを行うためのコンポーネント ---
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // パスワードが設定されていなければ、何もせずコンテンツを表示（開発環境用）
    if (!CORRECT_PASSWORD) {
        console.warn("WARN: パスワードが設定されていません。認証をスキップします。");
        setIsAuthenticated(true);
        return;
    }

    try {
      const storedPassword = localStorage.getItem('password');
      if (storedPassword === CORRECT_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        window.location.href = '/login';
      }
    } catch (e) {
      console.error('LocalStorage is not available.');
      window.location.href = '/login';
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// --- ここから下は、あなたの既存のメインページのコンポーネントです ---
// (内容は変更ありませんので、簡略化して記載します。あなたのファイルではこの部分を既存のコードのままにしてください)

type CouncilComment = { name: string; comment: string; };
type AxisComment = { evaluationComment: string; improvementComment: string; };
type ConcludingInsight = { insightName: string; keywords: string; comment: string; question: string; };
type AnalysisResult = {
  overallScore: number;
  axes: { mvi: number; csi: number; res: number; arc: number; };
  axesComments: { mvi: AxisComment; csi: AxisComment; res: AxisComment; arc: AxisComment; };
  councilComments: CouncilComment[];
  concludingInsight: ConcludingInsight;
  homeSenninComment?: string;
};

const councilMembers = [
    { icon: "👑", name: "オリジン君", title: "本質の探求者" },
    { icon: "💡", name: "インサイト君", title: "直感の先駆者" },
    { icon: "⚪️", name: "ストラテジスト君", title: "論理の設計者" },
    { icon: "💎", name: "サポーター君", title: "チームの支援者" },
    { icon: "⚫️", name: "リスクチェッカー君", title: "厳格な監査役" },
    { icon: "🟢", name: "バランサー君", title: "最適化の調停者" },
    { icon: "🟠", name: "パフォーマー君", title: "情熱の伝道師" },
    { icon: "🟡", name: "アナリスト君", title: "データの分析官" },
    { icon: "🌙", name: "インタープリター君", title: "意図の翻訳家" },
    { icon: "🪨", name: "リアリスト君", title: "現実の実行官" },
    { icon: "🌀", name: "クエスチョナー君", title: "常識への挑戦者" }
];

const axesData = [
    { key: 'mvi' as const, name: 'MVI (多角的視点知性)', icon: '🧠', description: '多角的な視点から本質を捉え、発展を促す力' },
    { key: 'csi' as const, name: 'CSI (コンセプト統合度)', icon: '🧬', description: '理念から具体策までが一貫し、統合されているか' },
    { key: 'res' as const, name: 'RES (訴求力・共鳴力)', icon: '🌟', description: '言葉やアウトプットが、他者や市場と響き合う力' },
    { key: 'arc' as const, name: 'ARC (論理構成度)', icon: '❄️', description: '表現の明快さ、論理的一貫性、構造の完成度' }
];

function MainContent() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalysis = async () => {
    // ... handleAnalysis の中身は変更なし ...
     if (!inputText.trim()) {
      setError('テキストを入力してください。');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '不明なエラーが発生しました。');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'サーバーエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {/* ... あなたのメインページのJSXコードは、この中にすべて入ります ... */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-50"></div>
      <div className="relative container mx-auto px-4 py-12 z-10">
        <header className="w-full text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider">イラディエイト評価システム™</h1>
          <p className="text-teal-300 text-xl mt-4 tracking-widest">あなたの内部を可視化する</p>
        </header>

        <main className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center bg-gray-800/30 backdrop-blur-md border border-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl animate-fade-in-slow">
            {/* ... main の中身は変更なし ... */}
        </main>
        
        {result && (
            <section className="mt-12 w-full max-w-4xl mx-auto bg-gray-800/30 border border-gray-700 p-6 rounded-xl text-white animate-fade-in-slow">
              {/* ... result表示部分のJSXは変更なし ... */}
            </section>
        )}

        <footer className="w-full pt-10 mt-16 text-center text-gray-500 border-t border-gray-800">
          <p>&copy; 2025 イラディエイト評価システム™</p>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthChecker>
      <MainContent />
    </AuthChecker>
  );
}
