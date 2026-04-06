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

type EditForm = {
  customer_name: string;
  service_area: string;
  root_result: string;
  tip_result: string;
  treatment_result: string;
  warning: string;
  memo: string;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    customer_name: "",
    service_area: "",
    root_result: "",
    tip_result: "",
    treatment_result: "",
    warning: "",
    memo: "",
  });

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

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    boxSizing: "border-box" as const,
    backgroundColor: "#fff",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    backgroundColor: "#fff",
  };

  const photoStyle = {
    width: "100%",
    maxWidth: "220px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    objectFit: "cover" as const,
  };

  function openDetail(item: CaseItem) {
    setSelectedCase(item);
    setIsEditing(false);
  }

  function startEdit() {
    if (!selectedCase) return;

    setEditForm({
      customer_name: selectedCase.customer_name ?? "",
      service_area: selectedCase.service_area ?? "",
      root_result: selectedCase.root_result ?? "",
      tip_result: selectedCase.tip_result ?? "",
      treatment_result: selectedCase.treatment_result ?? "",
      warning: selectedCase.warning ?? "",
      memo: selectedCase.memo ?? "",
    });

    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function handleUpdateCase() {
    if (!selectedCase) return;

    if (!editForm.customer_name.trim()) {
      alert("お客様名を入力してください");
      return;
    }

    setSaving(true);

    const updateData = {
      customer_name: editForm.customer_name.trim(),
      service_area: editForm.service_area,
      root_result: editForm.root_result,
      tip_result: editForm.tip_result,
      treatment_result: editForm.treatment_result,
      warning: editForm.warning,
      memo: editForm.memo,
    };

    const { data, error } = await supabase
      .from("cases")
      .update(updateData)
      .eq("id", selectedCase.id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("更新失敗", error);
      alert("更新に失敗しました");
      return;
    }

    const updatedCase = data as CaseItem;

    setCases((prev) =>
      prev.map((item) => (item.id === updatedCase.id ? updatedCase : item))
    );
    setSelectedCase(updatedCase);
    setIsEditing(false);
    alert("症例を更新しました");
  }

  async function handleDeleteCase(id: number) {
    const ok = window.confirm("この症例を削除しますか？");
    if (!ok) return;

    const { error } = await supabase.from("cases").delete().eq("id", id);

    if (error) {
      console.error("削除失敗", error);
      alert("削除に失敗しました");
      return;
    }

    setCases((prev) => prev.filter((item) => item.id !== id));

    if (selectedCase?.id === id) {
      setSelectedCase(null);
      setIsEditing(false);
    }

    alert("削除しました");
  }

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
            保存済みの症例を検索・確認・編集できます
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
              onClick={() => openDetail(item)}
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

        {selectedCase && !isEditing && (
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
                gap: "10px",
                marginBottom: "12px",
                flexWrap: "wrap",
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

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={startEdit}
                  style={{
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  編集する
                </button>

                <button
                  onClick={() => handleDeleteCase(selectedCase.id)}
                  style={{
                    border: "none",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  削除する
                </button>

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

        {selectedCase && isEditing && (
          <section
            style={{
              ...cardStyle,
              border: "2px solid #2563eb",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                marginBottom: "16px",
              }}
            >
              症例編集
            </h2>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  お客様名
                </p>
                <input
                  type="text"
                  value={editForm.customer_name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      customer_name: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  施術部位
                </p>
                <input
                  type="text"
                  value={editForm.service_area}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      service_area: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  根元
                </p>
                <input
                  type="text"
                  value={editForm.root_result}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      root_result: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  毛先
                </p>
                <input
                  type="text"
                  value={editForm.tip_result}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      tip_result: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  中間処理
                </p>
                <textarea
                  value={editForm.treatment_result}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      treatment_result: e.target.value,
                    }))
                  }
                  style={textareaStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  注意
                </p>
                <textarea
                  value={editForm.warning}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      warning: e.target.value,
                    }))
                  }
                  style={textareaStyle}
                />
              </div>

              <div>
                <p style={{ fontSize: "14px", marginBottom: "6px", color: "#6b7280" }}>
                  メモ
                </p>
                <textarea
                  value={editForm.memo}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      memo: e.target.value,
                    }))
                  }
                  style={textareaStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleUpdateCase}
                disabled={saving}
                style={{
                  border: "none",
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "更新中..." : "更新する"}
              </button>

              <button
                onClick={cancelEdit}
                style={{
                  border: "none",
                  backgroundColor: "#6b7280",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}