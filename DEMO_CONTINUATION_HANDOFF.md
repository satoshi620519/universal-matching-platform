# Demo Continuation Handoff — 2026-09-15

## 今日の作業

今回の作業は、Universal Matching Platform の**購入検討者向けデモ完成**に限定して進めた。

### 現在の公開デモ構成

`apps/web/public/demo.html` → `apps/web/public/demo-v7.html` → hardened `demo-v6.html` / matching walkthrough

v7 は既存の v5/v6 の完成済みマッチングコアを壊さず、購入検討者が機能を確認するためのラッパーとして使用する。

### 今日までに完成している購入者向け操作

- 候補を見る
- 相互MATCHを体験
- メッセージ送信を体験
- MATCH後の通知を確認
- MATCH → メッセージ → 通知の一連操作
- MATCH一覧
- メッセージ
- 地域・言語
- 管理・分析
- Quick Launch
- 通報を体験
- ブロックを体験
- デモをリセット
- **全機能を順番に確認**（今回追加）

### 今回追加した機能

購入検討者向けパネルに「全機能を順番に確認」を追加。

以下8画面を自動で順番に表示する。

1. 候補・検索
2. MATCH一覧
3. メッセージ
4. 通知
5. 安心・安全
6. 地域・言語
7. 管理・分析
8. Quick Launch

各ステップを `1/8` ～ `8/8` で表示し、最後にツアー完了を表示する。

## GitHub記録

- デモ実装コミット: `2e1da56be98c55dcd670967a4cc59470da51a76f`
  - `feat(demo): add guided feature tour for buyer review`
- デモテストコミット: `033b7304f70d9d5ebd9bdeb39b5e50d125cd05e3`
  - `test(demo): cover guided buyer feature tour`
- `apps/web/public/demo-v7.html` 現在のblob SHA: `bdcde346dae0310f61a06749457e668d89b2aa02`
- `apps/web/src/demo-v7-entry.test.ts` 現在のblob SHA: `5373d0303b1d19d71b610e08c50651db545935e2`
- `DEVELOPMENT_STATUS.md` 現在のblob SHA: `e7a41f0b799f29f413357291a9a244389fb27b6e`

## Render記録

サービス: `universal-matching-platform-demo`

- Service ID: `srv-dah0j7lbedkc738j2p4g`
- Workspace ID: `tea-dah0i9m1egvs73c1r0p0`
- 最新確認時、テストコミット `033b7304f70d9d5ebd9bdeb39b5e50d125cd05e3` のデプロイが `live`。
- Auto Deploy は有効。mainへ反映した場合は原則として手動deployを実行しない。

## 重要な既知事項

- 過去に `e88e05c21d1547c26346726f78e08a4fd3ccb158` で demo-v5.html を簡略版へ誤上書きしたが、これは不正な状態として扱い、mainには戻していない。**今後も絶対に再導入しない。**
- v5/v6 の hardened matching core は、明確な不具合が確認されない限り変更しない。
- v7 wrapperへ追加できるものはまずv7で実装し、コアへの不要な変更を避ける。
- status-only のコミットを増やして作業量を水増ししない。
- 既存機能と重複するボタンやテストを追加しない。
- CI/Live E2E/RenderのPASSやLIVEは、実際に確認したものだけを記録する。

## 次回の作業開始地点

次回は、まず現在の `main` とRenderの最新状態を確認してから作業する。今日追加した「全機能を順番に確認」は再実装しない。

### 次に確認する本命の項目

**デモの実際の購入者体験を一周して、まだ操作できない/確認できない機能だけを特定する。**

優先する実操作順:

`トップ → デモ開始 → ユーザー設定 → プロフィール → 条件検索 → 候補詳細 → LIKE → 相互MATCH → MATCH一覧 → メッセージ送信/履歴 → 通知 → 通報/ブロック`

その後、購入者確認用の二次機能:

`地域・言語 → 設定 → 管理・分析 → Quick Launch`

### 作業ルール

- まずGitHubの現在状態を読む。
- 既存実装を確認してから、最初の未達項目だけを直す。
- 見た目だけの追加、不要なボタン追加、重複テストはしない。
- 実際に触れる機能を増やすことを最優先する。
- 修正したらテスト → CI → Live E2E → Renderの順で確認できる範囲を確認する。
- 作業停止時は、**コミットSHA / 変更ファイル / 検証結果 / Render状態 / 次の1作業**をこのファイルまたは開発状況記録に追記する。

## 次回チャットへの最短指示

「`DEMO_CONTINUATION_HANDOFF.md` を読んで、記録済みの作業を重複せず、次の未達デモ機能から続行する。」
