"use client";

import Link from "next/link";

export default function CasesPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>症例一覧</h1>

      <Link href="/">← トップへ戻る</Link>

      <div style={{ marginTop: "20px" }}>
        症例ページ準備中
      </div>
    </main>
  );
}
