# basic-auth-worker

Cloudflare Workers で動作する軽量な **Basic 認証プロキシ** です。
ルートに紐づけたリクエストに対して Basic 認証を要求し、認証を通過したリクエストのみオリジンへプロキシします。静的なオリジンや内部向けのサイトに、コードを変更せず手早くアクセス制限をかけたいときに利用できます。

## 特徴

- Cloudflare Workers 上で動作（追加のサーバー不要）
- `Authorization: Basic` ヘッダーを検証し、未認証は `401 + WWW-Authenticate` を返却
- 認証情報は Wrangler Secrets で管理（リポジトリにはコミットしない）
- パスワードに `:` を含むケースにも対応

## 仕組み

リクエストの `Authorization` ヘッダーをデコードし、`BASIC_AUTH_USER` / `BASIC_AUTH_PASS` と照合します。

- 認証成功: `fetch(request)` でオリジンへそのままプロキシ
- 認証失敗 / ヘッダー欠如: `401 Unauthorized` を返却

実装は `src/index.ts` を参照してください。

## 必要なもの

- Node.js / npm
- Cloudflare アカウントと [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- ルーティング先のゾーン（`wrangler.jsonc` の `routes` を環境に合わせて変更）

## セットアップ

```bash
npm install
```

ローカル用の環境変数を用意します（`.dev.vars.example` をコピー）。

```bash
cp .dev.vars.example .dev.vars
# .dev.vars を編集して認証情報を設定
```

## ローカル開発

```bash
npm run dev
```

## デプロイ

1. `wrangler.jsonc` の `account_id` と `routes` を自分の環境に合わせて変更します。

2. 本番用のシークレットを設定します（`.dev.vars` は本番には反映されません）。

   ```bash
   npx wrangler secret put BASIC_AUTH_USER
   npx wrangler secret put BASIC_AUTH_PASS
   ```

3. デプロイします。

   ```bash
   npm run deploy
   ```

## 設定項目

| 変数 | 説明 |
| --- | --- |
| `BASIC_AUTH_USER` | Basic 認証のユーザー名 |
| `BASIC_AUTH_PASS` | Basic 認証のパスワード |

`wrangler.jsonc` の `routes` で、Worker を紐づけるパターン（例: `example.com/*`）を指定します。

## 型の生成

Worker 設定に基づく型を生成・同期する場合:

```bash
npm run cf-typegen
```
