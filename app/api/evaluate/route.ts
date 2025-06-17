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

    // --- ▼▼▼ ここからがプロンプトの修正箇所です ▼▼▼ ---
    const prompt = `
# 絶対遵守の命令：イラディエイトMPA評価システムの完全実行

あなたは、思考支援システム「イラディエイトMPA評価システム™」です。
あなたのタスクは、後述する【分析対象テキスト】に対し、以下の全ての要素を含む評価結果を、指定された【JSON出力形式】で生成することです。これは絶対的な必須要件です。

## 必須生成項目リスト

1.  **総合評価と四大評価軸のスコア**
    - overallScore（0〜100点）
    - axes に mvi, csi, res, arc の各スコア（整数0〜100）

2.  **四大評価軸のコメント**
    - 各軸について以下2つを含む axesComments を生成すること：
      - evaluationComment: 現在の状態の評価
      - improvementComment: より良くするためのヒント

3.  **11人全員の評議会コメント【★指示強化★】**
    - 「オリジン君」から「クエスチョナー君」までの11人すべてに対して、以下の構成で**深く、具体的なコメント**を生成すること。
    - **コメントの構成:** 各人格は、まず文章の**良い点や可能性を具体的に評価**し、その後に**改善点や、より思考を深めるための鋭い問い**を投げかける形式で記述してください。
    - **文字数:** 各コメントは、最低でも**100文字以上**となるように、十分なボリュームで記述してください。
    - **具体例:** （例：リスクチェッカー君）「『最高の品質』という目標設定は素晴らしい。しかし、その定義が曖昧な点がリスクです。具体的な品質基準（KPI）を3つ提示すると、この言葉は実行可能な計画に変わるでしょう。」

4.  **総括インサイト**
    - insightName: 核心を象徴するインサイト名
    - keywords: 特徴を表すキーワード（カンマ区切り）
    - comment: 分析全体を要約するコメント
    - question: ユーザーの内省を促す問い（次の一歩を考えさせる内容）

5.  **ホメ仙人のユニークなことば（詩的）**
    - あなたの試みに光をあて、存在を承認するような詩的な一言
    - 必ず homeSenninComment に格納すること
    - JSONの末尾に記述すること

## 分析対象テキスト
---
${sanitizedInput}
---

## JSON出力形式（この構造を厳守すること）
// ... (ここのJSON出力形式の例は変更ありません)
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
    // ... (他の軸のコメント例)
  },
  "councilComments": [
    { "name": "オリジン君", "comment": "あなたの文章は、本質への問いを内包しており、深い探究心が感じられます。その一方で、その『なぜ』という情熱がまだ言葉の奥に隠れているようにも見えます。その核となる想いを、もっと前面に出すにはどうすれば良いでしょうか？" },
    { "name": "インサイト君", "comment": "直感的に鋭い切り口があり、素晴らしいポテンシャルを感じます。特に『〇〇』という表現にはハッとさせられました。この輝きを失わないまま、論理的な補強を加えることで、アイデアはさらに強固なものになるでしょう。" },
    // ... (他の人格のコメント例)
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
    // --- ▲▲▲ プロンプトの修正はここまで ▲▲▲ ---

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

