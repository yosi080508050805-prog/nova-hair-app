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

type CustomerGroup = {
  name: string;
  count: number;
  latestDate: string;
  cases: CaseItem[];
};

export default function CustomersPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerGroup | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("顧客履歴読み込み失敗", error);
        setLoading(false);
        return;
      }

      setCases((data as CaseItem[]) ?? []);
      setLoading(false);
    };

    loadCases();
  }, []);

  const groupedCustomers = useMemo(() => {
    const map = new Map<string, CaseItem[]>();

    for (const item of cases) {
      const name = (item.customer_name || "名前未登録").trim();
      if (!map.has(name)) {
        map.set(name, []);
      }
      map.get(name)!.push(item);
    }

    const grouped: CustomerGroup[] = Array.from(map.entries()).map(
      ([name, customerCases]) => ({
        name,
        count: customerCases.length,
        latestDate: customerCases[0]?.created_at || "",
        cases: customerCases,
      })
    );

    const keyword = search.trim().toLowerCase();
    const filtered = keyword
      ? grouped.filter((item) => item.name.toLowerCase().includes(keyword))
      : grouped;

    return filtered.sort((a, b) => {
      return (
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
      );
    });
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
    maxWidth: "900px",
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

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    boxSizing: "border-box" as const,
    backgroundColor: "#fff",
  };

  const photoStyle = {
    width: "100%",
    maxWidth: "180px",
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
            顧客履歴
          </h1>

          <p style={{ color: "#6b7280" }}>
            お客様ごとに過去の症例履歴をまとめて見れます
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
            style={inputStyle}
          />
        </section>

        {loading && (
          <section style={cardStyle}>
            <p>読み込み中...</p>
          </section>
        )}

        {!loading && groupedCustomers.length === 0 && (
          <section style={cardStyle}>
            <p>該当する顧客がいません</p>
          </section>
        )}

        {!loading &&
          groupedCustomers.map((customer) => (
            <section
              key={customer.name}
              style={{
                ...cardStyle,
                cursor: "pointer",
              }}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    {customer.name}
                  </h2>
                  <p style={{ color: "#6b7280", marginBottom: "6px" }}>
                    症例数: {customer.count}件
                  </p>
                  <p style={{ color: "#6b7280" }}>
                    最新:
                    {customer.latestDate
                      ? ` ${new Date(customer.latestDate).toLocaleString()}`
                      : " -"}
                  </p>
                </div>

                {customer.cases[0]?.after_photo_url && (
                  <img
                    src={customer.cases[0].after_photo_url}
                    alt="最新仕上がり"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "12px",
                      objectFit: "cover",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                )}
              </div>
            </section>
          ))}

        {selectedCustomer && (
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
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    marginBottom: "4px",
                  }}
                >
                  {selectedCustomer.name} さんの履歴
                </h2>
                <p style={{ color: "#6b7280" }}>
                  全 {selectedCustomer.count} 件
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
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

            <div style={{ display: "grid", gap: "14px" }}>
              {selectedCustomer.cases.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  <p style={{ color: "#6b7280", marginBottom: "8px" }}>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    施術部位: {item.service_area || "-"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    根元: {item.root_result || "-"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    毛先: {item.tip_result || "-"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    中間処理: {item.treatment_result || "-"}
                  </p>

                  {item.warning && (
                    <p
                      style={{
                        marginBottom: "4px",
                        color: "#dc2626",
                        fontWeight: 700,
                      }}
                    >
                      ⚠ {item.warning}
                    </p>
                  )}

                  <p style={{ color: "#6b7280", marginBottom: "12px" }}>
                    メモ: {item.memo || "-"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {item.before_photo_url && (
                      <div>
                        <p style={{ marginBottom: "6px", fontWeight: 700 }}>
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
                        <p style={{ marginBottom: "6px", fontWeight: 700 }}>
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
                        <p style={{ marginBottom: "6px", fontWeight: 700 }}>
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
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}