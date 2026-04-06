"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [root, setRoot] = useState("");
  const [tip, setTip] = useState("");
  const [treatment, setTreatment] = useState("");
  const [warning, setWarning] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const editData = localStorage.getItem("edit_case");

    if (editData) {
      const data = JSON.parse(editData);

      setCustomerName(data.customer_name || "");
      setServiceArea(data.service_area || "");
      setRoot(data.root_result || "");
      setTip(data.tip_result || "");
      setTreatment(data.treatment_result || "");
      setWarning(data.warning || "");
      setMemo(data.memo || "");

      localStorage.removeItem("edit_case");
    }
  }, []);

  const pageStyle: React.CSSProperties = {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "20px 16px 60px",
    minHeight: "100vh",
    background: "#f5f7fb",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
  };

  return (
    <main style={pageStyle}>
      <h1 style={{ fontSize: "28px", fontWeight: 700 }}>nova</h1>

      <p style={{ color: "#6b7280" }}>MEN'S STRAIGHT PERM</p>

      <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
        薬剤選定アプリ
      </h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
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
          }}
        >
          顧客履歴
        </Link>
      </div>

      <section style={cardStyle}>
        <h3>お客様情報</h3>

        <input
          placeholder="お客様名"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="施術部位"
          value={serviceArea}
          onChange={(e) => setServiceArea(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="根元"
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="毛先"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="中間処理"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="注意"
          value={warning}
          onChange={(e) => setWarning(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="メモ"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={inputStyle}
        />
      </section>

      <button
        style={{
          width: "100%",
          padding: "16px",
          background: "#2563eb",
          color: "white",
          borderRadius: "12px",
          border: "none",
        }}
      >
        薬剤選定する
      </button>

      <button
        style={{
          width: "100%",
          padding: "16px",
          background: "#4caf50",
          color: "white",
          borderRadius: "12px",
          border: "none",
          marginTop: "12px",
        }}
      >
        症例を保存する
      </button>
    </main>
  );
}
