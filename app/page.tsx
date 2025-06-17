"use client";

import { useState, useEffect } from 'react';

// .env.localからパスワードを読み込みます
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

// --- 認証チェックを行うためのコンポーネントです ---
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vercelにパスワードが設定されていない場合、認証をスキップします
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

  // 認証が確認されるまでは、ローディング画面を表示します
  if (!isAuthenticated) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-400 mx-auto mb-4"></div>
        <p className="text-teal-300 text-lg">認証中...</p>
      </div>
    </div>
    );
  }

  // 認証済みなら、メインコンテンツを表示します
  return <>{children}</>;
};


// --- ここから下が、あなたのメインページコンポーネントです ---

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
    { icon: "⚪", name: "ストラテジスト君", title: "論理の設計者" },
    { icon: "💎", name: "サポーター君", title: "チームの支援者" },
    { icon: "⚫", name: "リスクチェッカー君", title: "厳格な監査役" },
    { icon: "🟢", name: "バランサー君", title: "最適化の調停者" },
    { icon: "🟠", name: "パフォーマー君", title: "情熱の伝道師" },
    { icon: "🟡", name: "アナリスト君", title: "データの分析官" },
    { icon: "🌙", name: "インタープリター君", title: "意図の翻訳家" },
    { icon: "🪨", name: "リアリスト君", title: "現実の実行官" },
    { icon: "🌀", name: "クエスチョナー君", title: "常識への挑戦者" }
];

const axesData = [
    { key: 'mvi' as const, name: 'MVI', fullName: '多角的視点知性', icon: '🧠', description: '多角的な視点から本質を捉え、発展を促す力' },
    { key: 'csi' as const, name: 'CSI', fullName: 'コンセプト統合度', icon: '🧬', description: '理念から具体策までが一貫し、統合されているか' },
    { key: 'res' as const, name: 'RES', fullName: '訴求力・共鳴力', icon: '🌟', description: '言葉やアウトプットが、他者や市場と響き合う力' },
    { key: 'arc' as const, name: 'ARC', fullName: '論理構成度', icon: '❄️', description: '表現の明快さ、論理の一貫性、構造の完成度' }
];

// あなたが作成したメインページのUIコンポーネント
function MainContent() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const MAX_CHARS = 7000;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-100">
      {/* 背景エフェクト */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(168,85,247,0.1),transparent)] pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-16 lg:mb-24">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
              イラディエイト評価システム™
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-teal-300 font-light tracking-wide">
            あなたの内部を可視化する
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-teal-400 to-blue-500 mx-auto rounded-full"></div>
        </header>

        {!result ? (
          <>
            <main id="analysis-form" className="max-w-4xl mx-auto mb-20">
              <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                    さあ、あなたの思考を解き放とう
                  </h2>
                  <p className="text-gray-300 text-lg">
                    文章、企画、アイデア、悩み... 何でも入力してください
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      className="w-full h-80 lg:h-96 p-6 bg-gray-900/80 rounded-2xl border border-gray-600 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 outline-none transition-all duration-300 text-white placeholder-gray-400 resize-y text-base leading-relaxed"
                      placeholder="ここに分析したい内容を入力してください..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                      maxLength={MAX_CHARS}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                      {inputText.length} / {MAX_CHARS}
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4">
                      <p className="text-red-300 text-center">{error}</p>
                    </div>
                  )}
                  <div className="text-center">
                    <button
                      onClick={handleAnalysis}
                      disabled={isLoading || !inputText.trim()}
                      className="px-8 py-4 lg:px-12 lg:py-5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full text-lg lg:text-xl font-bold hover:from-teal-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-teal-500/30 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          <span>分析中...</span>
                        </span>
                      ) : (
                        '分析を開始する'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </main>
            <section className="mb-20 lg:mb-32">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16 text-white">
                コアなる四軸評価
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {axesData.map((axis, index) => (
                  <div key={axis.name} className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 lg:p-8 rounded-2xl text-center hover:border-teal-400/50 hover:bg-gray-700/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="text-5xl lg:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{axis.icon}</div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{axis.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 font-medium">{axis.fullName}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{axis.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="mb-20 lg:mb-32">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16 text-white">
                あなたの内に眠る、11の人格
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                {councilMembers.map((member, index) => (
                  <div key={member.name} className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 lg:p-6 rounded-2xl text-center hover:bg-gray-700/50 hover:border-teal-400/50 transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="text-3xl lg:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{member.icon}</div>
                    <h3 className="text-sm lg:text-base font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-xs text-teal-300 font-medium leading-tight">{member.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section id="result-section" className="mt-12 w-full max-w-5xl mx-auto space-y-12">
            <div className="text-center">
              <button
                onClick={() => {
                  setInputText("");
                  setResult(null);
                  document.querySelector('header')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-slate-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                新しい分析を始める
              </button>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold text-teal-300">総合評価</h3>
              <p className="text-6xl font-bold my-2 text-white">{result.overallScore} <span className="text-3xl text-gray-400">/ 100</span></p>
              <p className="mt-2 text-lg text-yellow-300 italic">
                {result.overallScore >= 90
                  ? "🌟 圧巻の完成度！"
                  : result.overallScore >= 80
                  ? "✨ すばらしい完成度です！"
                  : result.overallScore >= 70
                  ? "👍 良い仕上がりです"
                  : "🔍 まだ伸びしろがあります"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                {axesData.map(axis => (
                  <div key={axis.key}>
                    <p className="text-gray-400">{axis.name} ({axis.fullName})</p>
                    <p className="font-bold text-white text-lg">{result.axes[axis.key]} / 100</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">四大評価軸からの詳細コメント</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {axesData.map(axis => {
                  const comments = result.axesComments[axis.key];
                  return (
                    <div key={axis.key} className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
                      <p className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-2xl mr-2">{axis.icon}</span>
                        {axis.fullName}
                      </p>
                      <div className="space-y-3">
                        <p className="text-gray-200 leading-relaxed"><strong className="text-teal-300">評価:</strong> {comments.evaluationComment}</p>
                        <p className="text-gray-200 leading-relaxed"><strong className="text-yellow-300">改善ヒント:</strong> {comments.improvementComment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">11人格からの詳細コメント</h3>
              <div className="space-y-6">
                {result?.councilComments?.map((member, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-4xl pt-1">{councilMembers.find(m => m.name === member.name)?.icon}</div>
                    <div>
                      <p className="font-bold text-white">{member.name}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{member.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">総括インサイト</h3>
              <div className="text-center">
                <p className="text-sm text-teal-300">【インサイト名】</p>
                <p className="text-xl font-bold text-white mb-4">💎 {result.concludingInsight.insightName}</p>
                <p className="text-sm text-teal-300 mt-6">【特徴キーワード】</p>
                <p className="text-gray-300 mb-4">🪐 {result.concludingInsight.keywords}</p>
                <p className="text-sm text-teal-300 mt-6">【総括コメント】</p>
                <p className="text-gray-300 max-w-3xl mx-auto mb-6">🌌 {result.concludingInsight.comment}</p>
                <p className="text-sm text-teal-300 mt-6">【次への問い】</p>
                <p className="text-lg font-semibold text-white max-w-3xl mx-auto">🌱 {result.concludingInsight.question}</p>
              </div>
            </div>
            {result.homeSenninComment && (
              <div className="bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 p-1 rounded-2xl shadow-lg">
                <div className="bg-gray-800 p-8 rounded-xl h-full flex flex-col justify-center items-center">
                  <h3 className="text-lg font-semibold text-yellow-200 mb-3 text-center">🧙‍♂️ ホメ仙人からの言葉</h3>
                  <p className="text-yellow-100 text-center text-xl leading-relaxed italic">「{result.homeSenninComment}」</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* フッター */}
        <footer className="text-center mt-20 pt-8 border-t border-gray-800">
          <p className="text-gray-500">
            &copy; 2025 イラディエイト評価システム™
          </p>
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
  )