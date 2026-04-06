"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [root, setRoot] = useState("");
  const [tip, setTip] = useState("");
  const [treatment, setTreatment] = useState("");
  const [warning, setWarning] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "20px 16px 60px",
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "8px",
          color: "#111827",
        }}
      >
        nova
      </h1>

      <p
        style={{
          color: "#6b7280",
          letterSpacing: "0.08em",
          marginBottom: "8px",
        }}
      >
        MEN&apos;S STRAIGHT PERM
      </p>

      <p
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "8px",
        }}
      >
        薬剤選定アプリ
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/cases"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          症例一覧
        </Link>

        <Link
          href="/customers"
          style={{
            background: "#111827",
            color: "white",
            padding: "10px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          顧客履歴
        </Link>
      </div>

      <hr
        style={{
          marginBottom: "20px",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <section
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          お客様情報
        </h2>

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          お客様名
        </p>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="例: 山田太郎"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          施術部位
        </p>
        <input
          type="text"
          value={serviceArea}
          onChange={(e) => setServiceArea(e.target.value)}
          placeholder="例: 全体"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          根元
        </p>
        <input
          type="text"
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          placeholder="例: M.H（1:1）"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          毛先
        </p>
        <input
          type="text"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="例: 根元選定に準ずる"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          中間処理
        </p>
        <textarea
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          placeholder="例: キトサン / CMC / ネクター"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            minHeight: "90px",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          注意
        </p>
        <textarea
          value={warning}
          onChange={(e) => setWarning(e.target.value)}
          placeholder="例: 縮毛履歴あり"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            minHeight: "90px",
            marginBottom: "12px",
          }}
        />

        <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
          メモ
        </p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例: 次回は弱めスタート"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "white",
            minHeight: "90px",
          }}
        />
      </section>

      <button
        type="button"
        style={{
          width: "100%",
          padding: "16px",
          background: "#4caf50",
          color: "white",
          borderRadius: "12px",
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
        }}
      >
        症例を保存する
      </button>
    </main>
  );
}
