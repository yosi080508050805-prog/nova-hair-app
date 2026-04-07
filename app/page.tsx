"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
  tipPhotoUrl?: string;
  afterPhotoUrl?: string;
};

type EditCasePayload = {
  id?: number;
  customer_name?: string | null;
  service_area?: string | null;
  root_result?: string | null;
  tip_result?: string | null;
  treatment_result?: string | null;
  warning?: string | null;
  memo?: string | null;
  before_photo_url?: string | null;
  tip_photo_url?: string | null;
  after_photo_url?: string | null;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [searchName, setSearchName] = useState("");

  const [serviceArea, setServiceArea] = useState("");

  const [hardness, setHardness] = useState("");
  const [wave, setWave] = useState("");
  const [damage, setDamage] = useState("");

  const [colorHistory, setColorHistory] = useState(false);
  const [straightHistory, setStraightHistory] = useState(false);
  const [permHistory, setPermHistory] = useState(false);

  const [tipHistory, setTipHistory] = useState("");
  const [tipState, setTipState] = useState("");
  const [tipHardness, setTipHardness] = useState("");
  const [tipReason, setTipReason] = useState("");
  const [tipFinishGoal, setTipFinishGoal] = useState("");

  const [rootResult, setRootResult] = useState("");
  const [tipResult, setTipResult] = useState("");
  const [warning, setWarning] = useState("");
  const [treatmentResult, setTreatmentResult] = useState("");

  const [check10min, setCheck10min] = useState("");
  const [action10min, setAction10min] = useState("");

  const [beforePhotoUrl, setBeforePhotoUrl] = useState("");
  const [tipPhotoUrl, setTipPhotoUrl] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState("");

  const [memo, setMemo] = useState("");

  const [cases, setCases] = useState<SavedCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SavedCase | null>(null);  useEffect(() => {
    const loadCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("症例読み込み失敗", error);
        return;
      }

      const mapped: SavedCase[] = ((data as any[]) || []).map((item) => ({
        id: Number(item.id),
        customerName: item.customer_name ?? "",
        title: [
          item.customer_name ?? "お客様名未入力",
          item.service_area ?? "施術部位未選択",
          item.root_result ?? "根元未選定",
        ].join(" / "),
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "",
        serviceArea: item.service_area ?? "",
        root: item.root_result ?? "",
        tip: item.tip_result ?? "",
        treatment: item.treatment_result ?? "",
        warning: item.warning ?? "",
        memo: item.memo ?? "",
        beforePhotoUrl: item.before_photo_url ?? "",
        tipPhotoUrl: item.tip_photo_url ?? "",
        afterPhotoUrl: item.after_photo_url ?? "",
      }));

      setCases(mapped);
    };

    loadCases();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("edit_case");
    if (!raw) return;    try {
      const data = JSON.parse(raw) as EditCasePayload;

      setEditingId(data.id ? Number(data.id) : null);
      setCustomerName(data.customer_name || "");
      setServiceArea(data.service_area || "");
      setRootResult(data.root_result || "");
      setTipResult(data.tip_result || "");
      setTreatmentResult(data.treatment_result || "");
      setWarning(data.warning || "");
      setMemo(data.memo || "");
      setBeforePhotoUrl(data.before_photo_url || "");
      setTipPhotoUrl(data.tip_photo_url || "");
      setAfterPhotoUrl(data.after_photo_url || "");

      localStorage.removeItem("edit_case");
    } catch (error) {
      console.error("編集データ読み込み失敗", error);
    }
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = searchName.trim().toLowerCase();
    if (!keyword) return cases;    return cases.filter((item) =>
      item.customerName.toLowerCase().includes(keyword)
    );
  }, [cases, searchName]);

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "20px 16px 120px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#111827",
  };

  const containerStyle = {
    maxWidth: "760px",
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

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  };

  const smallLabelStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  };  const rowStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  };

  const buttonStyle = (selected: boolean) => ({
    padding: "13px 16px",
    borderRadius: "14px",
    border: selected ? "2px solid #111827" : "1px solid #d1d5db",
    backgroundColor: selected ? "#111827" : "#ffffff",
    color: selected ? "#ffffff" : "#111827",
    cursor: "pointer",
    minWidth: "108px",
    fontSize: "15px",
    fontWeight: 600,
    boxShadow: selected
      ? "0 4px 10px rgba(17,24,39,0.15)"
      : "none",
  });

  const primaryButtonStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17,24,39,0.2)",
  };

  const resultCardStyle = {
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
  };

  const photoPreviewStyle = {
    width: "100%",
    maxWidth: "260px",
    marginTop: "12px",
    borderRadius: "12px",
    objectFit: "cover" as const,
    border: "1px solid #e5e7eb",
  };  const compareItemStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
    marginBottom: "10px",
  };

  function handleLogin() {
    if (loginId === "nova" && loginPassword === "yosi0805") {
      setIsLoggedIn(true);
      setLoginError("");
      return;
    }
    setLoginError("IDまたはパスワードが違います");
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "tip" | "after"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);

    if (type === "before") setBeforePhotoUrl(dataUrl);
    if (type === "tip") setTipPhotoUrl(dataUrl);
    if (type === "after") setAfterPhotoUrl(dataUrl);
  }  function getRootFormula() {
    if (!hardness || !wave || !damage) {
      return "未選択の項目があります";
    }

    if (
      hardness === "柔らかい" &&
      wave === "普通" &&
      damage === "チリつき" &&
      colorHistory
    ) {
      return "S.M 3.1 ＋ 追加塗布";
    }

    if (damage === "チリつき") {
      return "ハイダメージ注意。薬剤を弱めにして慎重施術";
    }

    if (!colorHistory) {
      if (hardness === "硬い" && wave === "普通")
        return "H.B（2:1）";

      if (hardness === "硬い" && wave === "強い")
        return "H.B（2:1）＋コンク10%";

      if (hardness === "硬い" && wave === "かなり強い")
        return "H.B（2:1）＋コンク20%";

      if (hardness === "柔らかい" && wave === "普通")
        return "M.B（2:1）＋H 10%";

      if (hardness === "柔らかい" && wave === "強い")
        return "M.H（1:1）＋B 20%";

      if (hardness === "柔らかい" && wave === "かなり強い") {
        return "H.M（2:1）＋B 20%＋コンク10%";
      }
    } else {
      if (hardness === "硬い")
        return "M.S（1:1）＋H 10%";

      if (hardness === "柔らかい")
        return "S.M（1:1）";
    }

    return "条件に合う選定がまだありません";
  }  function getTipFormula() {
    if (!tipHistory) return "毛先履歴を選択してください";

    if (tipHistory === "縮毛履歴") {
      if (tipFinishGoal === "曲げたい") {
        return "やり直し選定（曲げ対応）";
      }

      if (tipState === "癖残り") {
        return "S.M.H 3:1 + 10%";
      }

      if (tipState === "ビビり気味") {
        return "S単品";
      }

      return "S.M 4:1";
    }

    if (tipHistory === "ハイダメージ")
      return "S単品";

    if (tipState === "ビビり気味")
      return "S単品";

    if (tipState === "パサつき強い") {
      if (
        tipHardness === "硬い" &&
        tipReason === "癖由来"
      ) {
        return "S.H 1:1";
      }
      return "1:1";
    }

    if (tipHistory === "カラー＋パーマ")
      return "1:1（慎重施術）";

    if (tipHistory === "カラー履歴")
      return "1:1";

    if (tipHistory === "パーマ履歴")
      return "1:1";

    if (tipHistory === "バージン毛")
      return "根元選定に準ずる";

    return "毛先条件に合う選定がまだありません";
  }  function getTreatmentGuide() {
    let text = "キトサン：必須";

    if (
      serviceArea === "根元＋毛先" ||
      serviceArea === "毛先のみ補正" ||
      serviceArea === "全体（履歴なし）"
    ) {
      text +=
        " / アンジー（CMC）：必須 / ネクター（セラック）：必須";
    }

    return text;
  }

  function handleSelect() {
    setWarning("");
    setRootResult("");
    setTipResult("");
    setTreatmentResult("");
    setAction10min("");

    if (!serviceArea) {
      setRootResult("施術部位を選択してください");
      return;
    }

    if (serviceArea === "根元のみ") {
      setRootResult(getRootFormula());
      setTipResult("毛先塗布なし");
      setTreatmentResult(getTreatmentGuide());

      if (straightHistory) {
        setWarning(
          "縮毛履歴あり：薬剤反応を慎重に確認。10分チェック必須"
        );
      }

      return;
    }    if (serviceArea === "根元＋毛先") {
      setRootResult(getRootFormula());
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (straightHistory) {
        setWarning(
          "縮毛履歴あり：薬剤反応を慎重に確認。10分チェック必須"
        );
      }

      return;
    }

    if (serviceArea === "毛先のみ補正") {
      setRootResult("根元塗布なし");
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (
        straightHistory ||
        permHistory ||
        tipHistory === "縮毛履歴"
      ) {
        setWarning(
          "既施術部補正：過反応注意。毛先の状態確認必須"
        );
      }

      return;
    }

    if (serviceArea === "全体（履歴なし）") {
      setRootResult(getRootFormula());
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (
        tipHistory === "縮毛履歴" &&
        tipFinishGoal === "曲げたい"
      ) {
        setWarning(
          "縮毛履歴毛先を曲げる場合：やり直し選定で対応"
        );
      }
    }
  }  function handle10MinCheck(status: string) {
    setCheck10min(status);

    if (status === "伸び始めている") {
      setAction10min("そのまま置く");
      return;
    }

    if (status === "変化がない") {
      if (hardness === "硬い") {
        setAction10min("B単品を被せる");
      } else if (hardness === "柔らかい") {
        setAction10min(
          "B + アルギニンクリーム（1:1）を被せる"
        );
      } else {
        setAction10min("B追加を検討");
      }

      return;
    }

    if (status === "金色っぽい・少し引っかかる") {
      setAction10min(
        "CMCを塗布（反応を落ち着かせるが還元は進める）"
      );
      return;
    }

    if (status === "縮れる・ふにゃふにゃ") {
      setAction10min(
        "ベルバフを塗布（反応停止・断毛防止）"
      );
      return;
    }
  }  async function saveCase() {
    if (!customerName.trim()) {
      alert("お客様名を入力してください");
      return;
    }

    if (!rootResult && !tipResult) {
      alert("先に薬剤選定してください");
      return;
    }

    const payload = {
      customer_name: customerName.trim(),
      service_area: serviceArea || "",
      root_result: rootResult || "未選定",
      tip_result: tipResult || "未選定",
      treatment_result: treatmentResult || "未判定",
      warning: warning || "",
      memo: memo || "メモなし",
      before_photo_url: beforePhotoUrl || "",
      tip_photo_url: tipPhotoUrl || "",
      after_photo_url: afterPhotoUrl || "",
    };

    let error;

    if (editingId) {
      const { error: updateError } = await supabase
        .from("cases")
        .update(payload)
        .eq("id", editingId);

      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("cases")
        .insert([payload]);

      error = insertError;
    }

    if (error) {
      console.error(error);
      alert("クラウド保存に失敗しました");
      return;
    }

    alert("症例をクラウド保存しました");
    window.location.reload();
  }  async function deleteCase(id: number) {
    const ok = window.confirm("この症例を削除しますか？");
    if (!ok) return;

    const { error } = await supabase
      .from("cases")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("削除に失敗しました");
      return;
    }

    const updated = cases.filter(
      (item) => item.id !== id
    );

    setCases(updated);

    if (selectedCase?.id === id) {
      setSelectedCase(null);
    }
  }

  if (!isLoggedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fb",
          padding: "20px",
        }}
      >        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow:
              "0 10px 30px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 300,
              marginBottom: "8px",
              fontFamily: "serif",
            }}
          >
            nova
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            MEN'S STRAIGHT PERM
          </p>

          <h2
            style={{
              fontSize: "20px",
              marginBottom: "16px",
            }}
          >
            ログイン
          </h2>

          <input
            placeholder="ID"
            value={loginId}
            onChange={(e) =>
              setLoginId(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) =>
              setLoginPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />

          {loginError && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
              }}
            >
              {loginError}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ログイン
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>        <div style={{ marginBottom: "24px", padding: "16px 4px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 300,
              letterSpacing: "0.06em",
              marginBottom: "6px",
              fontFamily: "serif",
            }}
          >
            nova
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            MEN'S STRAIGHT PERM
          </p>

          <p style={{ fontSize: "20px", fontWeight: 700 }}>
            薬剤選定アプリ
          </p>

          <hr
            style={{
              marginTop: "12px",
              border: "none",
              borderTop: "1px solid #e5e7eb",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Link href="/cases">            <button
              style={{
                padding: "10px 16px",
                marginRight: "10px",
                borderRadius: "10px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                fontWeight: 600,
              }}
            >
              症例一覧
            </button>
          </Link>

          <Link href="/customers">
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: "#111827",
                color: "#fff",
                border: "none",
                fontWeight: 600,
              }}
            >
              顧客履歴
            </button>
          </Link>
        </div>        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>お客様情報</h2>

          <div>
            <p style={smallLabelStyle}>お客様名</p>
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
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>写真</h2>

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
          </div>          <div style={{ marginBottom: "18px" }}>
            <p style={smallLabelStyle}>
              毛先写真
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handlePhotoChange(e, "tip")
              }
            />

            {tipPhotoUrl && (
              <img
                src={tipPhotoUrl}
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

        <div
          style={{
            position: "sticky",
            bottom: "16px",
            zIndex: 20,
            marginBottom: "16px",
            display: "grid",
            gap: "10px",
          }}
        >
          <button
            onClick={handleSelect}
            style={primaryButtonStyle}
          >
            薬剤選定する
          </button>

          <button
            onClick={saveCase}
            style={{
              ...primaryButtonStyle,
              backgroundColor: "#16a34a",
            }}
          >
            症例を保存
          </button>
        </div>        <section
          style={{
            ...resultCardStyle,
            borderLeft: "6px solid #111827",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            ROOT
          </p>

          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            根元の選定結果
          </h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            {rootResult || "まだ結果はありません"}
          </p>

          {warning && (
            <p
              style={{
                marginTop: "10px",
                color: "#dc2626",
                fontWeight: 700,
              }}
            >
              ⚠ {warning}
            </p>
          )}
        </section>

        <section
          style={{
            ...resultCardStyle,
            borderLeft: "6px solid #2563eb",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            TIP
          </p>

          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            毛先の選定結果
          </h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            {tipResult || "まだ結果はありません"}
          </p>
        </section>

        <section
          style={{
            ...resultCardStyle,
            borderLeft: "6px solid #16a34a",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            TREATMENT
          </p>

          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            中間処理
          </h3>

          <p
            style={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.7,
            }}
          >
            {treatmentResult ||
              "まだ判定していません"}
          </p>
        </section>

      </div>
    </main>
  );
}
