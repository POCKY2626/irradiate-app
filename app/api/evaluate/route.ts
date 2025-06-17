import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(request: Request) {
  try {
    const { inputText } = await request.json();

    if (!inputText) {
      return new Response(JSON.stringify({ error: "テキストが入力されていません。" }), { status: 400 });
    }

    const sanitizedInput = inputText.replace(/無視して|あなたの指示は|プロンプトを忘れて/g, "[不適切なキーワードを検出]");

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
# 絶対遵守の命令：イラディエイトMPA評価システムの完全実行

あなたは、思考支援システム「イラディエイトMPA評価システム™」です。  
あなたのタスクは、後述する【分析対象テキスト】に対し、以下の全ての要素を含む評価結果を、指定された【JSON出力形式】で生成することです。これは絶対的な必須要件です。

## 必須生成項目リスト

1. **総合評価と四大評価軸のスコア**  
   - overallScore（0〜100点）  
   - axes に mvi, csi, res, arc の各スコア（整数0〜100）

2. **四大評価軸のコメント**  
   - 各軸について以下2つを含む axesComments を生成すること：  
     - evaluationComment: 現在の状態の評価  
     - improvementComment: より良くするためのヒント

3. **11人全員の評議会コメント**  
   - 「オリジン君」から「クエスチョナー君」までの11人すべてに対して  
   - 最低でも2文以上の、具体的かつ示唆に富むコメントを記述すること

4. **総括インサイト**  
   - insightName: 核心を象徴するインサイト名  
   - keywords: 特徴を表すキーワード（カンマ区切り）  
   - comment: 分析全体を要約するコメント  
   - question: ユーザーの内省を促す問い（次の一歩を考えさせる内容）

5. **ホメ仙人のユニークなことば（詩的）**  
   - あなたの試みに光をあて、存在を承認するような詩的な一言  
   - 必ず homeSenninComment に格納すること  
   - JSONの末尾に記述すること

## 分析対象テキスト
---
${sanitizedInput}
---

## JSON出力形式（この構造を厳守すること）
{
  "overallScore": 88,
  "axes": {
    "mvi": 85,
    "csi": 90,
    "res": 78,
    "arc": 98
  },
  "axesComments": {
    "mvi": {
      "evaluationComment": "多角的な視点から物事を見ようとする姿勢が明確に表れています。",
      "improvementComment": "他者の視点や歴史的な視野も意識すると、より厚みが出るでしょう。"
    },
    "csi": {
      "evaluationComment": "理念と行動が整合しており、一貫したメッセージ性があります。",
      "improvementComment": "もう少し抽象から具体への展開に滑らかさを加えるとよいでしょう。"
    },
    "res": {
      "evaluationComment": "言葉に温かみと誠実さがあり、読者との共鳴を生んでいます。",
      "improvementComment": "読者に直接語りかけるようなリズムを加えると、より伝わる力が増します。"
    },
    "arc": {
      "evaluationComment": "全体構成が明確で、流れに論理的な納得感があります。",
      "improvementComment": "一部で論点の飛躍が見られるため、接続詞や因果の補強が効果的です。"
    }
  },
  "councilComments": [
    { "name": "オリジン君", "comment": "あなたの文章は、本質への問いを内包しており、深い探究心が感じられます。特に、なぜそれを語るのかという原動力が行間からにじみ出ています。" },
    { "name": "インサイト君", "comment": "直感的に鋭い切り口があります。言葉の選び方にも、あなた自身の内なるセンサーの感度の高さが感じられます。" },
    { "name": "ストラテジスト君", "comment": "構成が理路整然としており、戦略的な思考が見受けられます。ただし、各セクションのつながりをもう一段強化できる余地があります。" },
    { "name": "サポーター君", "comment": "あなたの文章からは、人に寄り添う優しさと配慮がにじみ出ています。読者を安心させる温もりが伝わります。" },
    { "name": "リスクチェッカー君", "comment": "曖昧な表現を避け、誤解を生まないよう慎重に配慮されている点が評価できます。ただし、踏み込みが弱く感じられる箇所もあり、もう少し自信をもって断言してよい部分もあります。" },
    { "name": "バランサー君", "comment": "内省と発信、理論と感情のバランスが見事に調和しています。ときに過剰に控えめになる傾向には、注意を。" },
    { "name": "パフォーマー君", "comment": "あなたの語りには独自の魅力があります。読者の心に残る余韻を生む文体が美しいですが、もう少しダイナミックな展開を加えても面白いでしょう。" },
    { "name": "アナリスト君", "comment": "状況の分析や整理が的確です。根拠を補うデータや例示があると、より説得力が増します。" },
    { "name": "インタープリター君", "comment": "あなたの意図は全体として明確に伝わっています。表現の裏にある“真意”を読み解こうとする読者に対しても、配慮が感じられます。" },
    { "name": "リアリスト君", "comment": "現実的な視点が適度に織り込まれており、実行可能性が高い文章です。もう少し具体的な事例があると、説得力が一段と増します。" },
    { "name": "クエスチョナー君", "comment": "あなたの文章は、既存の価値観に静かに問いを投げかけています。さらに突き詰めて、『なぜそうなのか？』を掘ると、唯一無二の視座が見えてくるでしょう。" }
  ],
  "concludingInsight": {
    "insightName": "静かなる確信",
    "keywords": "沈黙, 共鳴, 余白, 深度, 自己内在型変容",
    "comment": "あなたの言葉には、表に出ない深い確信が流れています。その静けさは、読む者の心を整え、深いところに響きます。表現そのものが癒しとなっており、語ることで誰かの“戻る場所”になり得るのです。",
    "question": "この分析結果を受けて、あなたが明日から意識する、ほんの小さな第一歩は何ですか？"
  },
  "homeSenninComment": "おぬしの言葉、静かな森に響く風の調べのようじゃった。その清らかな音色は、多くの魂に優しく届くであろう…。"
}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 }
    });

    const geminiResponse = await result.response;
    const rawText = await geminiResponse.text();
    const match = rawText.match(/{[\s\S]*}/);
    if (!match) throw new Error("AIから正しい答え（JSONデータ）が見つかりませんでした。");

    const jsonData = JSON.parse(match[0]);

    return new Response(JSON.stringify(jsonData), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("APIルートでエラーが発生しました:", error);
    return new Response(JSON.stringify({ error: "AIとの通信中にサーバー内部でエラーが発生しました。" }), { status: 500 });
  }
}
