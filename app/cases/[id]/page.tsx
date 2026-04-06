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

  const [data, setData] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setData(data);
      }

      setLoading(false);
    };

    if (id) {
      load();
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
    maxWidth: "760px",
    margin: "0 auto",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>読み込み中...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>データがありません</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
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
            marginBottom: "20px",
          }}
        >
          症例詳細
        </h1>

        <section style={cardStyle}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            {data.customer_name || "名前なし"}
          </h2>

          <p>日付: {data.created_at?.slice(0, 19).replace("T", " ")}</p>
          <p>施術部位: {data.service_area}</p>
          <p>根元: {data.root_result}</p>
          <p>毛先: {data.tip_result}</p>
          <p>中間処理: {data.treatment_result}</p>
          <p>注意: {data.warning}</p>
          <p>メモ: {data.memo}</p>
        </section>

        <section style={cardStyle}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            写真
          </h2>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {data.before_photo_url && (
              <div>
                <p>施術前</p>
                <img
                  src={data.before_photo_url}
                  style={{
                    width: "200px",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

            {data.tip_photo_url && (
              <div>
                <p>毛先</p>
                <img
                  src={data.tip_photo_url}
                  style={{
                    width: "200px",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

            {data.after_photo_url && (
              <div>
                <p>仕上がり</p>
                <img
                  src={data.after_photo_url}
                  style={{
                    width: "200px",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}
          </div>
        </section>

        <Link
          href={`/cases/${data.id}/edit`}
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            textAlign: "center",
            background: "#2563eb",
            color: "white",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          編集する
        </Link>
      </div>
    </main>
  );
}
