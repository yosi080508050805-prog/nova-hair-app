"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditCasePage() {
  const params = useParams();
  const id = params?.id as string;

  const [customerName, setCustomerName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [root, setRoot] = useState("");
  const [tip, setTip] = useState("");
  const [treatment, setTreatment] = useState("");
  const [warning, setWarning] = useState("");
  const [memo, setMemo] = useState("");

  const [beforePhotoUrl, setBeforePhotoUrl] = useState("");
  const [tipPhotoUrl, setTipPhotoUrl] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCase = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("編集データ読み込み失敗", error);
        setLoading(false);
        return;
      }

      setCustomerName(data.customer_name || "");
      setServiceArea(data.service_area || "");
      setRoot(data.root_result || "");
      setTip(data.tip_result || "");
      setTreatment(data.treatment_result || "");
      setWarning(data.warning || "");
      setMemo(data.memo || "");

      setBeforePhotoUrl(data.before_photo_url || "");
      setTipPhotoUrl(data.tip_photo_url || "");
      setAfterPhotoUrl(data.after_photo_url || "");

      setLoading(false);
    };

    if (id) {
      loadCase();
    }
  }, [id]);

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "tip" | "after"
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (error) {
      alert("アップロード失敗");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    if (type === "before") setBeforePhotoUrl(urlData.publicUrl);
    if (type === "tip") setTipPhotoUrl(urlData.publicUrl);
    if (type === "after") setAfterPhotoUrl(urlData.publicUrl);
  };

  const updateCase = async () => {
    setSaving(true);

    const payload = {
      customer_name: customerName,
      service_area: serviceArea,
      root_result: root,
      tip_result: tip,
      treatment_result: treatment,
      warning,
      memo,
      before_photo_url: beforePhotoUrl,
      tip_photo_url: tipPhotoUrl,
      after_photo_url: afterPhotoUrl,
    };

    const { error } = await supabase
      .from("cases")
      .update(payload)
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("更新失敗");
      return;
    }

    localStorage.setItem("edit_case", JSON.stringify(payload));
    alert("更新完了");
    window.location.href = "/";
  };

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

  const labelStyle: React.CSSProperties = {
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
    marginBottom: "12px",
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    boxSizing: "border-box",
    background: "white",
    minHeight: "90px",
    marginBottom: "12px",
  };

  const photoPreviewStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "220px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>読み込み中...</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link
          href={`/cases/${id}`}
          style={{
            display: "inline-block",
            marginBottom: "14px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← 症例詳細へ戻る
        </Link>

        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          症例編集
        </h1>

        <section style={cardStyle}>
          <p style={labelStyle}>お客様名</p>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={inputStyle}
          />

          <p style={labelStyle}>施術部位</p>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            style={inputStyle}
          />

          <p style={labelStyle}>根元</p>
          <input
            type="text"
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            style={inputStyle}
          />

          <p style={labelStyle}>毛先</p>
          <input
            type="text"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            style={inputStyle}
          />

          <p style={labelStyle}>中間処理</p>
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            style={textareaStyle}
          />

          <p style={labelStyle}>注意</p>
          <textarea
            value={warning}
            onChange={(e) => setWarning(e.target.value)}
            style={textareaStyle}
          />

          <p style={labelStyle}>メモ</p>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={textareaStyle}
          />
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

          <div style={{ marginBottom: "18px" }}>
            <p style={labelStyle}>施術前写真</p>
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

          <div style={{ marginBottom: "18px" }}>
            <p style={labelStyle}>毛先写真</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, "tip")}
            />
            {tipPhotoUrl && (
              <img
                src={tipPhotoUrl}
                alt="毛先"
                style={photoPreviewStyle}
              />
            )}
          </div>

          <div>
            <p style={labelStyle}>仕上がり写真</p>
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
          disabled={saving}
          onClick={updateCase}
          style={{
            width: "100%",
            padding: "16px",
            background: "#2563eb",
            color: "white",
            borderRadius: "12px",
            fontWeight: 700,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "更新中..." : "更新する"}
        </button>
      </div>
    </main>
  );
}
