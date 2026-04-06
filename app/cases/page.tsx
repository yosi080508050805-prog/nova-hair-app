"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type CaseItem = {
  id: number;
  customer_name: string | null;
  service_area: string | null;
  root_result: string | null;
  tip_result: string | null;
  treatment_result: string | null;
  warning: string | null;
  memo: string | null;
  before_photo_url: string | null;
  tip_photo_url: string | null;
  after_photo_url: string | null;
  created_at: string | null;
};

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("症例詳細読み込み失敗", error);
        setLoading(false);
        return;
      }

      setItem(data as CaseItem);
      setLoading(false);
    };

    if (id) {
      loadCase();
    }
  }, [id]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "20px 16px 80px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#111827",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "900px",
    margin: "0 auto",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
    border: "1px solid #e5e7eb",
    marginBottom: "16px",
  };

  const photoStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "220px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    objectFit: "cover",
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/cases"
            style={{
              display: "inline-block",
              marginBottom: "14px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← 症例一覧へ戻る
          </Link>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            症例詳細
          </h1>
        </div>

        {loading && (
          <section style={cardStyle}>
            <p>読み込み中...</p>
          </section>
        )}

        {!loading && !item && (
          <section style={cardStyle}>
            <p>症例が見つかりません</p>
          </section>
        )}

        {!loading && item && (
          <section style={cardStyle}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              {item.customer_name || "名前未登録"}
            </h2>

            <p style={{ color: "#6b7280", marginBottom: "8px" }}>
              日付:
              {item.created_at
                ? ` ${new Date(item.created_at).toLocaleString()}`
                : " -"}
            </p>

            <p style={{ marginBottom: "6px" }}>
              施術部位: {item.service_area || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              根元: {item.root_result || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              毛先: {item.tip_result || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              中間処理: {item.treatment_result || "-"}
            </p>

            {item.warning && (
              <p
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  color: "#dc2626",
                  fontWeight: 700,
                }}
              >
                ⚠ {item.warning}
              </p>
            )}

            <p style={{ color: "#6b7280", marginBottom: "18px" }}>
              メモ: {item.memo || "-"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {item.before_photo_url && (
                <div>
                  <p
                    style={{
                      marginBottom: "8px",
                      fontWeight: 700,
                    }}
                  >
                    施術前
                  </p>
                  <img
                    src={item.before_photo_url}
                    alt="施術前"
                    style={photoStyle}
                  />
                </div>
              )}

              {item.tip_photo_url && (
                <div>
                  <p
                    style={{
                      marginBottom: "8px",
                      fontWeight: 700,
                    }}
                  >
                    毛先
                  </p>
                  <img
                    src={item.tip_photo_url}
                    alt="毛先"
                    style={photoStyle}
                  />
                </div>
              )}

              {item.after_photo_url && (
                <div>
                  <p
                    style={{
                      marginBottom: "8px",
                      fontWeight: 700,
                    }}
                  >
                    仕上がり
                  </p>
                  <img
                    src={item.after_photo_url}
                    alt="仕上がり"
                    style={photoStyle}
                  />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
