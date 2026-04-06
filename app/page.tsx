"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type SavedCase = {
  id: number;
  customerName: string;
  title: string;
  date: string;
  serviceArea: string;
  root: string;
  tip: string;
  treatment: string;
  warning: string;
  memo: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
};

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [beforePhotoUrl, setBeforePhotoUrl] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState("");

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (error) {
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
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb"
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "12px"
  };

  const smallLabelStyle = {
    fontSize: "14px",
    marginBottom: "4px"
  };

  const photoPreviewStyle = {
    width: "100%",
    marginTop: "10px",
    borderRadius: "12px"
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: 700 }}>
        nova
      </h1>

      <p style={{ color: "#6b7280" }}>
        MEN'S STRAIGHT PERM
      </p>

      <p
        style={{
          fontSize: "20px",
          fontWeight: 700,
          marginTop: "8px"
        }}
      >
        薬剤選定アプリ
      </p>

      {/* ナビボタン */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "12px",
          marginBottom: "20px"
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
            fontWeight: 600
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
            fontWeight: 600
          }}
        >
          顧客履歴
        </Link>
      </div>

      <hr
        style={{
          marginBottom: "20px",
          border: "none",
          borderTop: "1px solid #e5e7eb"
        }}
      />

      {/* 顧客情報 */}
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          お客様情報
        </h2>

        <div>
          <p style={smallLabelStyle}>
            お客様名
          </p>

          <input
            type="text"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            placeholder="例: 山田太郎"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              fontSize: "16px"
            }}
          />
        </div>
      </section>

      {/* 写真 */}
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          写真
        </h2>

        <div style={{ marginBottom: "18px" }}>
          <p style={smallLabelStyle}>
            施術前写真
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePhotoChange(e, "before")
            }
          />

          {beforePhotoUrl && (
            <img
              src={beforePhotoUrl}
              style={photoPreviewStyle}
            />
          )}
        </div>

        <div>
          <p style={smallLabelStyle}>
            仕上がり写真
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePhotoChange(e, "after")
            }
          />

          {afterPhotoUrl && (
            <img
              src={afterPhotoUrl}
              style={photoPreviewStyle}
            />
          )}
        </div>
      </section>

      <button
        style={{
          width: "100%",
          padding: "16px",
          background: "#111827",
          color: "white",
          borderRadius: "12px",
          fontWeight: 600,
          border: "none",
          marginBottom: "10px"
        }}
      >
        薬剤選定する
      </button>

      <button
        style={{
          width: "100%",
          padding: "16px",
          background: "#22c55e",
          color: "white",
          borderRadius: "12px",
          fontWeight: 600,
          border: "none"
        }}
      >
        症例を保存する
      </button>
    </main>
  );
}