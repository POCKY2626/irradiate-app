"use client";

import { useState, useEffect } from 'react';

// 認証チェックを行うためのコンポーネント
const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 環境変数からパスワードを取得（デモ用にtrueに設定）
    setIsAuthenticated(true);
  }, []);

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

  return <>{children}</>;
};

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
  { key: 'mvi' as const, name: 'MVI', fullName: '多角的視点知性', icon: '🧠', description: '多角的な視点から本質を捉え、発展を促す力' },
  { key: 'csi' as const, name: 'CSI', fullName: 'コンセプト統合度', icon: '🧬', description: '理念から具体策までが一貫し、統合されているか' },
  { key: 'res' as const, name: 'RES', fullName: '訴求力・共鳴力', icon: '🌟', description: '言葉やアウトプットが、他者や市場と響き合う力' },
  { key: 'arc' as const, name: 'ARC', fullName: '論理構成度', icon: '❄️', description: '表現の明快さ、論理の一貫性、構造の完成度' }
];

// メインコンテンツコンポーネント
function MainContent() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const MAX_CHARS = 7000;

  // デモ用の分析結果を生成
  const generateDemoResult = (): AnalysisResult => {
    return {
      overallScore: 82,
      axes: { mvi: 85, csi: 78, res: 86, arc: 79 },
      axesComments: {
        mvi: {
          evaluationComment: "多角的な視点から問題を捉え、構造的な分析が見られます。特に本質的な要因の特定において優れた洞察を示しています。",
          improvementComment: "より多様なステークホルダーの視点を取り入れることで、さらに深い分析が可能になるでしょう。"
        },
        csi: {
          evaluationComment: "理念と具体的な施策の間に一貫性があり、コンセプトが明確に表現されています。",
          improvementComment: "抽象的な概念をより具体的な行動指針に落とし込む部分で、さらなる詳細化が効果的です。"
        },
        res: {
          evaluationComment: "感情に訴える表現力があり、読み手の共感を呼ぶ文章構成になっています。",
          improvementComment: "より多様な読み手層を意識した表現のバリエーションを増やすことで、訴求力が向上します。"
        },
        arc: {
          evaluationComment: "論理的な構成がしっかりしており、主張の流れが自然で理解しやすくなっています。",
          improvementComment: "結論に至る過程で、より明確な根拠の提示があると説得力が増します。"
        }
      },
      councilComments: [
        { name: "オリジン君", comment: "この分析の根底にある問題意識は非常に本質的だね。表面的な解決策ではなく、根本的な原因に目を向けている点が素晴らしい。ただ、さらに深層の構造まで掘り下げることで、より革新的なアプローチが見えてくるかもしれない。" },
        { name: "インサイト君", comment: "直感的に「これだ！」と感じる部分がある。特に問題設定の仕方に独特の視点が光っている。この直感をもっと信じて、従来の枠組みにとらわれない発想を展開してみてほしい。" },
        { name: "ストラテジスト君", comment: "論理的な構成は良好だが、戦略的な優先順位付けがもう少し明確になると良い。どの施策を最初に実行すべきか、リソースの配分はどうするかといった実行計画の精度を上げることが重要だ。" },
        { name: "リスクチェッカー君", comment: "提案内容は魅力的だが、潜在的なリスクへの言及が不足している。実行時に直面する可能性のある障害や失敗のシナリオも考慮に入れて、より堅実な計画にすることをおすすめする。" }
      ],
      concludingInsight: {
        insightName: "統合的思考の芽生え",
        keywords: "多角的分析, 本質追求, 実践的洞察",
        comment: "あなたの思考は複数の視点を統合し、本質的な問題に向き合う力を持っています。理論と実践のバランスが取れており、現実的でありながら革新的なアプローチを示しています。この統合的な思考力をさらに発展させることで、より大きなインパクトを生み出すことができるでしょう。",
        question: "この洞察を実際の行動にどう移していきますか？"
      },
      homeSenninComment: "ほほう、なかなか良い気づきじゃのう。\n\n君の思考には光るものがある。特に、物事を多角的に捉えようとする姿勢は立派じゃ。ただし、完璧を求めすぎて行動が遅れることのないよう注意が必要じゃな。\n\n真の智慧は、不完全でも実践の中で磨かれるものじゃ。今のこの洞察を大切にして、一歩ずつ前に進んでいくのじゃぞ。"
    };
  };

  const handleAnalysis = async () => {
    if (!inputText.trim()) {
      setError('テキストを入力してください。');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      // デモ用の遅延処理
      await new Promise(resolve => setTimeout(resolve, 3000));
      const demoResult = generateDemoResult();
      setResult(demoResult);
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
          <div className="inline-block animate-pulse">
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
            {/* 四軸評価セクション */}
            <section className="mb-20 lg:mb-32">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16 text-white">
                コアなる四軸評価
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {axesData.map((axis, index) => (
                  <div
                    key={axis.key}
                    className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 lg:p-8 rounded-2xl text-center hover:border-teal-400/50 hover:bg-gray-700/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-5xl lg:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {axis.icon}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {axis.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 font-medium">
                      {axis.fullName}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {axis.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 11人格セクション */}
            <section className="mb-20 lg:mb-32">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16 text-white">
                あなたの内に眠る、11の人格
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                {councilMembers.map((member, index) => (
                  <div
                    key={member.name}
                    className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 lg:p-6 rounded-2xl text-center hover:bg-gray-700/50 hover:border-teal-400/50 transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-3xl lg:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {member.icon}
                    </div>
                    <h3 className="text-sm lg:text-base font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-teal-300 font-medium leading-tight">
                      {member.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 分析フォーム */}
            <main className="max-w-4xl mx-auto">
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
                      className="w-full h-80 lg:h-96 p-6 bg-gray-900/80 rounded-2xl border border-gray-600 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 outline-none transition-all duration-300 text-white placeholder-gray-400 resize-none text-base leading-relaxed"
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
                        <span className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          <span>分析中...</span>
                        </span>
                      ) : (
                        '分析を開始する'
                      )}
                    </button>
                  </div>

                  {isLoading && (
                    <div className="text-center">
                      <p className="text-gray-400 text-lg">
                        11人格があなたの思考を分析中です...
                      </p>
                      <div className="flex justify-center items-center space-x-2 mt-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 200}ms` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </>
        ) : (
          /* 結果表示セクション */
          <section className="max-w-6xl mx-auto">
            <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 lg:p-10 shadow-2xl">
              {/* ヘッダー */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-teal-300">
                  分析結果
                </h2>
                <button
                  onClick={() => {
                    setInputText("");
                    setResult(null);
                    setError("");
                  }}
                  className="px-6 py-3 bg-slate-600 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  新しい分析を始める
                </button>
              </div>

              {/* 総合スコア */}
              <div className="text-center mb-12 p-8 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-2xl border border-yellow-500/30">
                <div className="text-6xl lg:text-7xl font-extrabold text-yellow-400 mb-2">
                  {result.overallScore}
                  <span className="text-3xl lg:text-4xl text-gray-300">/100</span>
                </div>
                <p className="text-xl lg:text-2xl text-yellow-200 font-semibold">
                  総合スコア
                </p>
                <p className="text-lg text-gray-300 mt-2">
                  {result.overallScore >= 90
                    ? "🌟 圧巻の完成度！"
                    : result.overallScore >= 80
                    ? "✨ すばらしい完成度です！"
                    : result.overallScore >= 70
                    ? "👍 良い仕上がりです"
                    : "🔍 まだ伸びしろがあります"}
                </p>
              </div>

              {/* 四軸詳細 */}
              <div className="mb-12">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                  四大評価軸の詳細
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {axesData.map(axis => {
                    const score = result?.axes?.[axis.key];
                    const comments = result?.axesComments?.[axis.key];
                    return (
                      <div
                        key={axis.key}
                        className="bg-gray-700/30 border border-gray-600/50 rounded-2xl p-6 hover:border-teal-400/50 transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{axis.icon}</span>
                            <div>
                              <h4 className="text-lg font-bold text-white">
                                {axis.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {axis.fullName}
                              </p>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-teal-300">
                            {score}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-100 leading-relaxed">
                              {comments?.evaluationComment || "（評価コメントなし）"}
                            </p>
                          </div>
                          <div className="border-t border-gray-600 pt-4">
                            <p className="text-sm font-semibold text-yellow-300 mb-2">
                              🌱 改善ヒント
                            </p>
                            <p className="text-yellow-200 text-sm leading-relaxed">
                              {comments?.improvementComment || "（改善ヒントなし）"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 人格コメント */}
              <div className="mb-12">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                  11人の人格からのコメント
                </h3>
                <div className="space-y-4">
                  {result?.councilComments?.map((member, index) => {
                    const memberInfo = councilMembers.find(m => m.name === member.name);
                    return (
                      <div
                        key={index}
                        className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-6 hover:border-teal-400/30 transition-colors duration-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl flex-shrink-0">
                            {memberInfo?.icon || "🗣"}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                              <h4 className="text-lg font-bold text-teal-300">
                                {member.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {memberInfo?.title}
                              </p>
                            </div>
                            <p className="text-gray-100 leading-relaxed whitespace-pre-line">
                              {member.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 総合インサイト */}
              <div className="mb-12 p-8 bg-gradient-to-br from-teal-900/50 via-blue-900/50 to-purple-900/50 border-2 border-teal-400/50 rounded-3xl shadow-2xl">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-center text-teal-300 mb-6">
                  🔮 総合インサイト
                </h3>
                <div className="text-center mb-6">
                  <h4 className="text-xl lg:text-2xl font-bold text-white mb-4">
                    「{result?.concludingInsight?.insightName}」
                  </h4>
                  <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-line">
                    {result?.concludingInsight?.comment}
                  </p>
                </div>
                <div className="border-t border-teal-400/30 pt-6 text-center">
                  <p className="text-yellow-300 font-semibold">
                    🧭 次の問い：{result?.concludingInsight?.question}
                  </p>
                </div>
              </div>

              {/* ホメ仙人のことば */}
              <div className="mb-12 p-8 bg-gradient-to-r from-amber-900/60 via-yellow-900/60 to-orange-900/60 border-2 border-yellow-400/50 rounded-3xl shadow-2xl">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-center text-yellow-300 mb-6">
                  🧙‍♂️ ホメ仙人のことば
                </h3>
                <div className="text-center">
                  <p className="text-white text-lg leading-relaxed whitespace-pre-line font-medium">
                    {result?.homeSenninComment}
                  </p>
                </div>
              </div>

              {/* 評価基準 */}
              <details className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                <summary className="cursor-pointer p-6 text-xl font-bold text-teal-300 hover:text-teal-200 hover:bg-gray-700/30 transition-colors duration-300">
                  🧾 評価基準を見る
                </summary>
                <div className="px-6 pb-6 space-y-6 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      四大評価軸の基準
                    </h4>
                    <div className="space-y-2 text-sm leading-relaxed">
                      <p><strong className="text-teal-300">MVI：</strong> 多角的で奥行きある視点を持ち、構造的に掘り下げられているか</p>
                      <p><strong className="text-teal-300">CSI：</strong> 抽象から具体までが一貫し、独自のコンセプトが流れているか</p>
                      <p><strong className="text-teal-300">RES：</strong> 言語表現が感情や直感を刺激し、人や場と共鳴できるか</p>
                      <p><strong className="text-teal-300">ARC：</strong> 説明が整理され、論理が自然に流れているか</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                      11人格のコメント方針
                    </h4>
                    <p className="text-sm leading-relaxed">
                      各人格は独自の視点からコメントします。たとえば「ストラテジスト君」は論理性、「サポーター君」は思いやり、「クエスチョナー君」は常識への挑戦といった観点で洞察を述べます。
                    </p>
                  </div>
                </div>
              </details>
            </div>
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

// エクスポート
export default function Page() {
  return (
    <AuthChecker>
      <MainContent />
    </AuthChecker>
  );
}