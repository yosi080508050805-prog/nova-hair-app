"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type CaseItem = {
  id: number;
  customer_name: string;
  service_area: string;
  root_result: string;
  tip_result: string;
  treatment_result: string;
  warning: string;
  memo: string;
  before_photo_url: string;
  tip_photo_url: string;
  after_photo_url: string;
  created_at: string;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("症例読み込み失敗", error);
        setLoading(false);
        return;
      }

      setCases((data as CaseItem[]) ?? []);
      setLoading(false);
    };

    loadCases();
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return cases;

    return cases.filter((item) =>
      (item.customer_name ?? "").toLowerCase().includes(keyword)
    );
  }, [cases, search]);

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "20px 16px 80px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#111827",
  };

  const containerStyle = {
    maxWidth: "860px",
    margin: "0 auto",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
    border: "1px solid #e5e7eb",
    marginBottom: "16px",
  };

  const photoStyle = {
    width: "100%",
    maxWidth: "220px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    objectFit: "cover" as const,
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginBottom: "14px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← トップへ戻る
          </Link>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            症例一覧
          </h1>

          <p style={{ color: "#6b7280" }}>
            保存済みの症例を検索・確認できます
          </p>
        </div>

        <section style={cardStyle}>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "#6b7280",
            }}
          >
            お客様名で検索
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="例: Hirano"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </section>

        {loading && (
          <section style={cardStyle}>
            <p>読み込み中...</p>
          </section>
        )}

        {!loading && filteredCases.length === 0 && (
          <section style={cardStyle}>
            <p>症例がまだありません</p>
          </section>
        )}

        {!loading &&
          filteredCases.map((item) => (
            <section
              key={item.id}
              style={{
                ...cardStyle,
                cursor: "pointer",
              }}
              onClick={() => setSelectedCase(item)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    {item.customer_name || "名前未登録"}
                  </h2>
                  <p style={{ color: "#6b7280", marginBottom: "6px" }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : ""}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    施術部位: {item.service_area || "-"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    根元: {item.root_result || "-"}
                  </p>
                  <p>毛先: {item.tip_result || "-"}</p>
                </div>

                {item.after_photo_url && (
                  <img
                    src={item.after_photo_url}
                    alt="仕上がり"
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "12px",
                      objectFit: "cover",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                )}
              </div>
            </section>
          ))}

        {selectedCase && (
          <section
            style={{
              ...cardStyle,
              border: "2px solid #111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                症例詳細
              </h2>

              <button
                onClick={() => setSelectedCase(null)}
                style={{
                  border: "none",
                  backgroundColor: "#111827",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                閉じる
              </button>
            </div>

            <p style={{ marginBottom: "6px" }}>
              お客様名: {selectedCase.customer_name || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              施術部位: {selectedCase.service_area || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              根元: {selectedCase.root_result || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              毛先: {selectedCase.tip_result || "-"}
            </p>
            <p style={{ marginBottom: "6px" }}>
              中間処理: {selectedCase.treatment_result || "-"}
            </p>

            {selectedCase.warning && (
              <p
                style={{
                  marginBottom: "6px",
                  color: "#dc2626",
                  fontWeight: 700,
                }}
              >
                ⚠ {selectedCase.warning}
              </p>
            )}

            <p
              style={{
                marginBottom: "14px",
                color: "#6b7280",
              }}
            >
              メモ: {selectedCase.memo || "-"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              {selectedCase.before_photo_url && (
                <div>
                  <p style={{ marginBottom: "6px", fontWeight: 700 }}>施術前</p>
                  <img
                    src={selectedCase.before_photo_url}
                    alt="施術前"
                    style={photoStyle}
                  />
                </div>
              )}

              {selectedCase.tip_photo_url && (
                <div>
                  <p style={{ marginBottom: "6px", fontWeight: 700 }}>毛先</p>
                  <img
                    src={selectedCase.tip_photo_url}
                    alt="毛先"
                    style={photoStyle}
                  />
                </div>
              )}

              {selectedCase.after_photo_url && (
                <div>
                  <p style={{ marginBottom: "6px", fontWeight: 700 }}>仕上がり</p>
                  <img
                    src={selectedCase.after_photo_url}
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