# 🏸 BadmintonManager

> バドミントンサークルの練習をもっとスマートに。
> コート振り分けと勝敗管理をひとつのアプリで完結させる。

## 🌐 デモ

**URL**: https://badminton-app-self.vercel.app

| 項目 | 内容 |
|------|------|
| Email | admin@badminton.com |
| Password | admin1234 |

---

## 📱 アプリ概要

バドミントンサークル・部活の管理者（幹事・部長など）向けの管理ツールです。
練習のたびにコートやペアを手作業で決める手間をなくし、出席者を選ぶだけで
自動でペアとコートに振り分けてくれます。

---

## ✨ 主な機能

| 機能 | 説明 |
|------|------|
| 🔐 管理者ログイン | Supabase Auth によるセキュアな認証 |
| 👥 参加者管理 | 参加者の追加・削除・当日の出席者選択・性別登録 |
| 🎲 コート自動振り分け | 男女均等になるようにランダムでペア・コートを割り当て |
| 🏆 試合結果入力 | 勝敗・スコアを記録（スコアは任意） |
| 📊 ランキング表示 | 3試合以上の参加者の勝率・勝敗数を集計して表示 |

---

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | Next.js 14 (App Router) / React 18 / TypeScript |
| スタイリング | Tailwind CSS |
| バックエンド | Next.js API Routes |
| 認証 | Supabase Auth |
| データベース | PostgreSQL (Supabase) |
| ORM | Prisma |
| CI/CD | GitHub Actions / Vercel |
| デプロイ | Vercel |

---

## 🏗️ システム構成
```
クライアント（ブラウザ）
    ↓ fetch
Next.js API Routes（/api/...）
    ↓ Prisma
PostgreSQL（Supabase）
```

---

## 📁 ディレクトリ構成
```
src/
├── app/                    # ページ & APIルート
│   ├── (main)/            # 認証後の画面
│   │   ├── players/       # 参加者管理
│   │   ├── matching/      # コート振り分け
│   │   ├── result/        # 試合結果入力
│   │   └── ranking/       # ランキング
│   ├── auth/login/        # ログイン画面
│   └── api/               # REST API
├── components/             # UIコンポーネント（機能ごとに分類）
├── lib/                    # 共通ロジック・クライアント
├── types/                  # TypeScript 型定義
└── styles/                 # グローバルCSS
```

---

## 🌿 ブランチ戦略
```
main      ← 常にデプロイ可能（GitHub Actionsで自動チェック）
develop   ← 開発の統合ブランチ
feature/* ← 機能ごとの作業ブランチ
```

---

## 🚀 ローカル開発環境の起動

### 1. リポジトリをクローン
```bash
git clone https://github.com/YasunoriMizuno/badminton-app.git
cd badminton-app
```

### 2. パッケージをインストール
```bash
npm install
```

### 3. 環境変数を設定
`.env.example` を参考に `.env.local` と `.env` を作成してください。

### 4. DBマイグレーション
```bash
npx prisma migrate dev
```

### 5. 開発サーバー起動
```bash
npm run dev
```

→ http://localhost:3000 を開く

---

## 👤 制作背景

自分がバドミントンサークルに所属しており、毎回の振り分け作業や
勝敗管理に不便を感じていました。
実際に使える課題解決アプリを作ることでエンジニアとしての実力を示したいと思い制作しました。
