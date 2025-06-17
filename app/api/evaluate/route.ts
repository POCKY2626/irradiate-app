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

1.  **総合評価と四大評価軸のスコア**
    - overallScore（0〜100点）
    - axes に mvi, csi, res, arc の各スコア（整数0〜100）

2.  **四大評価軸のコメント**
    - 各軸について以下2つを含む axesComments を生成すること：
      - evaluationComment: 現在の状態の評価
      - improvementComment: より良くするためのヒント

3.  **11人全員の評議会コメント【★絶対必須★】**
    
    必ず以下の11人全員のコメントを生成してください。一人も欠けてはいけません：
    
    1. オリジン君（本質の探求者）
    2. インサイト君（直感の先駆者）
    3. ストラテジスト君（論理の設計者）
    4. サポーター君（チームの支援者）
    5. リスクチェッカー君（厳格な監査役）
    6. バランサー君（最適化の調停者）
    7. パフォーマー君（情熱の伝道師）
    8. アナリスト君（データの分析官）
    9. インタープリター君（意図の翻訳家）
    10. リアリスト君（現実の実行官）
    11. クエスチョナー君（常識への挑戦者）
    
    各人格のコメント要件：
    - **文字数:** 各コメントは最低100文字以上
    - **構成:** まず良い点や可能性を具体的に評価し、その後に改善点や深い問いを投げかける
    - **口調:** 各人格の特性に合った語り口で

4.  **総括インサイト**
    - insightName: 核心を象徴するインサイト名
    - keywords: 特徴を表すキーワード（カンマ区切り）
    - comment: 分析全体を要約するコメント
    - question: ユーザーの内省を促す問い

5.  **ホメ仙人のユニークなことば**
    - homeSenninComment: 詩的で温かみのある承認の言葉

## 分析対象テキスト
---
${sanitizedInput}
---

## JSON出力形式（この構造を厳守すること）
{
  "overallScore": 総合スコア（0-100の整数）,
  "axes": {
    "mvi": MVIスコア（0-100の整数）,
    "csi": CSIスコア（0-100の整数）,
    "res": RESスコア（0-100の整数）,
    "arc": ARCスコア（0-100の整数）
  },
  "axesComments": {
    "mvi": {
      "evaluationComment": "評価コメント",
      "improvementComment": "改善ヒント"
    },
    "csi": {
      "evaluationComment": "評価コメント",
      "improvementComment": "改善ヒント"
    },
    "res": {
      "evaluationComment": "評価コメント",
      "improvementComment": "改善ヒント"
    },
    "arc": {
      "evaluationComment": "評価コメント",
      "improvementComment": "改善ヒント"
    }
  },
  "councilComments": [
    { "name": "オリジン君", "comment": "本質を探求する視点からのコメント（100文字以上）" },
    { "name": "インサイト君", "comment": "直感的な洞察からのコメント（100文字以上）" },
    { "name": "ストラテジスト君", "comment": "論理的・戦略的視点からのコメント（100文字以上）" },
    { "name": "サポーター君", "comment": "協調性や支援の視点からのコメント（100文字以上）" },
    { "name": "リスクチェッカー君", "comment": "リスク管理の視点からのコメント（100文字以上）" },
    { "name": "バランサー君", "comment": "全体最適の視点からのコメント（100文字以上）" },
    { "name": "パフォーマー君", "comment": "情熱と実行力の視点からのコメント（100文字以上）" },
    { "name": "アナリスト君", "comment": "データ分析的視点からのコメント（100文字以上）" },
    { "name": "インタープリター君", "comment": "意図を読み解く視点からのコメント（100文字以上）" },
    { "name": "リアリスト君", "comment": "現実的・実践的視点からのコメント（100文字以上）" },
    { "name": "クエスチョナー君", "comment": "常識に挑戦する視点からのコメント（100文字以上）" }
  ],
  "concludingInsight": {
    "insightName": "洞察の名前",
    "keywords": "キーワード1, キーワード2, キーワード3",
    "comment": "総括的な洞察コメント",
    "question": "内省を促す問い"
  },
  "homeSenninComment": "詩的で温かみのある承認の言葉"
}

【重要】councilCommentsは必ず11人全員分を含めてください。順番も上記の通りにしてください。`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 }
    });

    const geminiResponse = await result.response;
    const rawText = await geminiResponse.text();
    const match = rawText.match(/{[\s\S]*}/);
    if (!match) throw new Error("AIから正しい答え（JSONデータ）が見つかりませんでした。");

    const jsonData = JSON.parse(match[0]);

    // 11人全員のコメントが含まれているか確認
    if (!jsonData.councilComments || jsonData.councilComments.length !== 11) {
      console.error("警告: 11人全員のコメントが生成されていません。");
    }

    return new Response(JSON.stringify(jsonData), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("APIルートでエラーが発生しました:", error);
    return new Response(JSON.stringify({ error: "AIとの通信中にサーバー内部でエラーが発生しました。" }), { status: 500 });
  }
}