"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [beforePhotoUrl, setBeforePhotoUrl] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    setLoading(true);

    const { error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (error) {
      setLoading(false);
      alert("アップロード失敗");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    if (type === "before") {
      setBeforePhotoUrl(urlData.publicUrl);
    } else {
      setAfterPhotoUrl(urlData.publicUrl);
    }

    setLoading(false);
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  };

  const smallLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    marginBottom: "6px",
    color: "#6b7280",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    boxSizing: "border-box",
    background: "white",
  };

  const photoPreviewStyle: React.CSSProperties = {
    width: "100%",
    marginTop: "10px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  };

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

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>お客様情報</h2>

        <div>
          <p style={smallLabelStyle}>お客様名</p>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="例: 山田太郎"
            style={inputStyle}
          />
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>写真</h2>

        <div style={{ marginBottom: "18px" }}>
          <p style={smallLabelStyle}>施術前写真</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, "before")}
          />
          {beforePhotoUrl && (
            <img
              src={beforePhotoUrl}
              alt="施術前"
              style={photoPreviewStyle}
            />
          )}
        </div>

        <div>
          <p style={smallLabelStyle}>仕上がり写真</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, "after")}
          />
          {afterPhotoUrl && (
            <img
              src={afterPhotoUrl}
              alt="仕上がり"
              style={photoPreviewStyle}
            />
          )}
        </div>
      </section>

      <button
        type="button"
        style={{
          width: "100%",
          padding: "16px",
          background: "#0f172a",
          color: "white",
          borderRadius: "12px",
          fontWeight: 700,
          border: "none",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        薬剤選定する
      </button>

      <button
        type="button"
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          background: "#4caf50",
          color: "white",
          borderRadius: "12px",
          fontWeight: 700,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        症例を保存する
      </button>
    </main>
  );
}
