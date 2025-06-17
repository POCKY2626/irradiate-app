"use client";

import { useState, useEffect } from 'react';

// ★★★ ここは、login/page.tsx と全く同じパスワードにしてください ★★★
const CORRECT_PASSWORD = "your-secret-password"; 

// --- 認証チェックを行うためのコンポーネント ---
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedPassword = localStorage.getItem('password');
      if (storedPassword === CORRECT_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        // パスワードが違う、または無ければログインページへ
        window.location.href = '/login';
      }
    } catch (e) {
      // localStorageが使えない場合（稀なケース）もログインページへ
      console.error('LocalStorage is not available.');
      window.location.href = '/login';
    }
  }, []);

  // 認証が確認されるまでは、ローディング画面を表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  // 認証済みなら、メインコンテンツを表示
  return <>{children}</>;
};


// --- ここから下は、あなたの既存のメインページのコンポーネントです ---

// 型定義
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

// あなたが作成したメインページのUIコンポーネント
function MainContent() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalysis = async () => {
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
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-50"></div>
      <div className="relative container mx-auto px-4 py-12 z-10">
        <header className="w-full text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider">イラディエイト評価システム™</h1>
          <p className="text-teal-300 text-xl mt-4 tracking-widest">あなたの内部を可視化する</p>
        </header>

        {/* ... (あなたのメインページの残りのJSXコードは、この中にすべて入ります) ... */}
        
        {/* この例では簡略化のために一部のみ記載しますが、あなたのコードではすべてをここに含めてください */}
        <main className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center bg-gray-800/30 backdrop-blur-md border border-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl animate-fade-in-slow">
            <div className="w-full text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">さあ、あなたの思考を解き放とう</h2>
                <textarea
                  className="w-full h-60 p-4 bg-gray-900/70 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 outline-none transition duration-300 text-white placeholder-gray-500"
                  placeholder="ここに分析したい文章、企画、アイデア、あるいは悩みを入力してください..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                {error && <p className="text-red-400 mt-4 animate-fade-in">{error}</p>}
                <button onClick={handleAnalysis} disabled={isLoading} className="mt-8 px-12 py-4 bg-teal-500 text-white rounded-full text-lg font-bold hover:bg-teal-400 transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(45,212,191,0.6)] disabled:opacity-50">
                  {isLoading ? '分析中...' : '分析を開始する'}
                </button>
                {isLoading && (
                  <div className="mt-6 flex justify-center items-center space-x-3 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    <span>11人格があなたの思考を分析中です...</span>
                  </div>
                )}
            </div>
        </main>
        
        {result && (
            <section className="mt-12 w-full max-w-4xl mx-auto bg-gray-800/30 border border-gray-700 p-6 rounded-xl text-white animate-fade-in-slow">
              {/* ... result表示部分のJSX ... */}
              <div className="flex justify-end mb-4">
                  <button
                      onClick={() => {
                          setInputText("");
                          setResult(null);
                      }}
                      className="px-4 py-2 bg-slate-500 hover:bg-teal-600 text-white rounded-md"
                  >
                      リセット
                  </button>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-teal-300">分析結果</h2>
              {/* ... 以下、結果表示の詳しいコードが続きます ... */}
            </section>
        )}

        <footer className="w-full pt-10 mt-16 text-center text-gray-500 border-t border-gray-800">
          <p>&copy; 2025 イラディエイト評価システム™</p>
        </footer>
      </div>
    </div>
  );
}

// 最終的にページとしてエクスポートするコンポーネント
export default function Page() {
  return (
    <AuthChecker>
      <MainContent />
    </AuthChecker>
  );
}