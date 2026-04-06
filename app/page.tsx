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
  tipPhotoUrl?: string;
  afterPhotoUrl?: string;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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
  const [selectedCase, setSelectedCase] = useState<SavedCase | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("読み込み失敗", error);
        return;
      }

      const mapped: SavedCase[] = (data ?? []).map((item: any) => ({
        id: Number(item.id),
        customerName: item.customer_name ?? "",
        title:
          item.customer_name && item.service_area
            ? `${item.customer_name} / ${item.service_area}`
            : item.customer_name ?? "症例",
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

  const filteredCases = useMemo(() => {
    const keyword = searchName.trim().toLowerCase();
    if (!keyword) return cases;

    return cases.filter((item) =>
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
  };

  const rowStyle = {
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
    boxShadow: selected ? "0 4px 10px rgba(17,24,39,0.15)" : "none",
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
  };

  const compareItemStyle = {
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
  }

  function getRootFormula() {
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
      if (hardness === "硬い" && wave === "普通") return "H.B（2:1）";
      if (hardness === "硬い" && wave === "強い") return "H.B（2:1）＋コンク10%";
      if (hardness === "硬い" && wave === "かなり強い")
        return "H.B（2:1）＋コンク20%";
      if (hardness === "柔らかい" && wave === "普通") return "M.B（2:1）＋H 10%";
      if (hardness === "柔らかい" && wave === "強い") return "M.H（1:1）＋B 20%";
      if (hardness === "柔らかい" && wave === "かなり強い") {
        return "H.M（2:1）＋B 20%＋コンク10%";
      }
    } else {
      if (hardness === "硬い") return "M.S（1:1）＋H 10%";
      if (hardness === "柔らかい") return "S.M（1:1）";
    }

    return "条件に合う選定がまだありません";
  }

  function getTipFormula() {
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

    if (tipHistory === "ハイダメージ") return "S単品";
    if (tipState === "ビビり気味") return "S単品";

    if (tipState === "パサつき強い") {
      if (tipHardness === "硬い" && tipReason === "癖由来") {
        return "S.H 1:1";
      }
      return "1:1";
    }

    if (tipHistory === "カラー＋パーマ") return "1:1（慎重施術）";
    if (tipHistory === "カラー履歴") return "1:1";
    if (tipHistory === "パーマ履歴") return "1:1";
    if (tipHistory === "バージン毛") return "根元選定に準ずる";

    return "毛先条件に合う選定がまだありません";
  }

  function getTreatmentGuide() {
    let text = "キトサン：必須";

    if (
      serviceArea === "根元＋毛先" ||
      serviceArea === "毛先のみ補正" ||
      serviceArea === "全体（履歴なし）"
    ) {
      text += " / アンジー（CMC）：必須 / ネクター（セラック）：必須";
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
        setWarning("縮毛履歴あり：薬剤反応を慎重に確認。10分チェック必須");
      }
      return;
    }

    if (serviceArea === "根元＋毛先") {
      setRootResult(getRootFormula());
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (straightHistory) {
        setWarning("縮毛履歴あり：薬剤反応を慎重に確認。10分チェック必須");
      }
      return;
    }

    if (serviceArea === "毛先のみ補正") {
      setRootResult("根元塗布なし");
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (straightHistory || permHistory || tipHistory === "縮毛履歴") {
        setWarning("既施術部補正：過反応注意。毛先の状態確認必須");
      }
      return;
    }

    if (serviceArea === "全体（履歴なし）") {
      setRootResult(getRootFormula());
      setTipResult(getTipFormula());
      setTreatmentResult(getTreatmentGuide());

      if (tipHistory === "縮毛履歴" && tipFinishGoal === "曲げたい") {
        setWarning("縮毛履歴毛先を曲げる場合：やり直し選定で対応");
      }
    }
  }

  function handle10MinCheck(status: string) {
    setCheck10min(status);

    if (status === "伸び始めている") {
      setAction10min("そのまま置く");
      return;
    }

    if (status === "変化がない") {
      if (hardness === "硬い") {
        setAction10min("B単品を被せる");
      } else if (hardness === "柔らかい") {
        setAction10min("B + アルギニンクリーム（1:1）を被せる");
      } else {
        setAction10min("B追加を検討");
      }
      return;
    }

    if (status === "金色っぽい・少し引っかかる") {
      setAction10min("CMCを塗布（反応を落ち着かせるが還元は進める）");
      return;
    }

    if (status === "縮れる・ふにゃふにゃ") {
      setAction10min("ベルバフを塗布（反応停止・断毛防止）");
      return;
    }
  }

  async function saveCase() {
    if (!customerName.trim()) {
      alert("お客様名を入力してください");
      return;
    }

    if (!rootResult && !tipResult) {
      alert("先に薬剤選定してください");
      return;
    }

    const titleParts = [
      customerName || "お客様名未入力",
      serviceArea || "施術部位未選択",
      hardness || "硬さ未選択",
      wave || "うねり未選択",
    ];

    const insertData = {
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
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cases")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      alert("クラウド保存に失敗しました");
      console.error(error);
      return;
    }

    const newCase: SavedCase = {
      id: Number(data.id),
      customerName: data.customer_name ?? "",
      title: titleParts.join(" / "),
      date: data.created_at
        ? new Date(data.created_at).toLocaleDateString()
        : new Date().toLocaleDateString(),
      serviceArea: data.service_area ?? "",
      root: data.root_result ?? "",
      tip: data.tip_result ?? "",
      treatment: data.treatment_result ?? "",
      warning: data.warning ?? "",
      memo: data.memo ?? "",
      beforePhotoUrl: data.before_photo_url ?? "",
      tipPhotoUrl: data.tip_photo_url ?? "",
      afterPhotoUrl: data.after_photo_url ?? "",
    };

    setCases((prev) => [newCase, ...prev]);
    setSelectedCase(newCase);
    alert("症例をクラウド保存しました");
  }

  async function deleteCase(id: number) {
    const ok = window.confirm("この症例を削除しますか？");
    if (!ok) return;

    const { error } = await supabase.from("cases").delete().eq("id", id);

    if (error) {
      alert("削除に失敗しました");
      console.error(error);
      return;
    }

    const updated = cases.filter((item) => item.id !== id);
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 300,
              letterSpacing: "0.06em",
              marginBottom: "8px",
              fontFamily: "serif",
            }}
          >
            nova
          </h1>

          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            MEN&apos;S STRAIGHT PERM
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
            ログイン
          </h2>

          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "14px", marginBottom: "6px" }}>ID</p>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
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

          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", marginBottom: "6px" }}>パスワード</p>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
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

          {loginError && (
            <p style={{ color: "#dc2626", marginBottom: "12px", fontWeight: 700 }}>
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
              backgroundColor: "#111827",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
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
      <div style={containerStyle}>
        <div style={{ marginBottom: "24px", padding: "16px 4px" }}>
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
            MEN&apos;S STRAIGHT PERM
          </p>

          <p style={{ fontSize: "20px", fontWeight: 700 }}>薬剤選定アプリ</p>
<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "12px",
    marginBottom: "20px",
    flexWrap: "wrap"
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
              marginTop: "12px",
              border: "none",
              borderTop: "1px solid #e5e7eb",
            }}
          />
        </div>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>お客様情報</h2>

          <div>
            <p style={smallLabelStyle}>お客様名</p>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
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
            <p style={smallLabelStyle}>施術前写真</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, "before")}
            />
            {beforePhotoUrl && (
              <img
                src={beforePhotoUrl}
                alt="施術前写真"
                style={photoPreviewStyle}
              />
            )}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <p style={smallLabelStyle}>毛先写真</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, "tip")}
            />
            {tipPhotoUrl && (
              <img src={tipPhotoUrl} alt="毛先写真" style={photoPreviewStyle} />
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
                alt="仕上がり写真"
                style={photoPreviewStyle}
              />
            )}
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>施術部位</h2>
          <div style={rowStyle}>
            <button
              style={buttonStyle(serviceArea === "根元のみ")}
              onClick={() => setServiceArea("根元のみ")}
            >
              根元のみ
            </button>
            <button
              style={buttonStyle(serviceArea === "根元＋毛先")}
              onClick={() => setServiceArea("根元＋毛先")}
            >
              根元＋毛先
            </button>
            <button
              style={buttonStyle(serviceArea === "毛先のみ補正")}
              onClick={() => setServiceArea("毛先のみ補正")}
            >
              毛先のみ補正
            </button>
            <button
              style={buttonStyle(serviceArea === "全体（履歴なし）")}
              onClick={() => setServiceArea("全体（履歴なし）")}
            >
              全体（履歴なし）
            </button>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>根元の入力</h2>

          <div style={{ marginBottom: "18px" }}>
            <p style={smallLabelStyle}>髪の硬さ</p>
            <div style={rowStyle}>
              <button
                style={buttonStyle(hardness === "硬い")}
                onClick={() => setHardness("硬い")}
              >
                硬い
              </button>
              <button
                style={buttonStyle(hardness === "柔らかい")}
                onClick={() => setHardness("柔らかい")}
              >
                柔らかい
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <p style={smallLabelStyle}>うねり強さ</p>
            <div style={rowStyle}>
              <button
                style={buttonStyle(wave === "普通")}
                onClick={() => setWave("普通")}
              >
                普通
              </button>
              <button
                style={buttonStyle(wave === "強い")}
                onClick={() => setWave("強い")}
              >
                強い
              </button>
              <button
                style={buttonStyle(wave === "かなり強い")}
                onClick={() => setWave("かなり強い")}
              >
                かなり強い
              </button>
            </div>
          </div>

          <div>
            <p style={smallLabelStyle}>状態</p>
            <div style={rowStyle}>
              <button
                style={buttonStyle(damage === "普通")}
                onClick={() => setDamage("普通")}
              >
                普通
              </button>
              <button
                style={buttonStyle(damage === "パサパサ")}
                onClick={() => setDamage("パサパサ")}
              >
                パサパサ
              </button>
              <button
                style={buttonStyle(damage === "チリつき")}
                onClick={() => setDamage("チリつき")}
              >
                チリつき
              </button>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>履歴</h2>

          <div style={rowStyle}>
            <button
              style={buttonStyle(colorHistory)}
              onClick={() => setColorHistory(!colorHistory)}
            >
              カラーあり
            </button>
            <button
              style={buttonStyle(straightHistory)}
              onClick={() => setStraightHistory(!straightHistory)}
            >
              縮毛履歴あり
            </button>
            <button
              style={buttonStyle(permHistory)}
              onClick={() => setPermHistory(!permHistory)}
            >
              パーマ履歴あり
            </button>
          </div>
        </section>

        {(serviceArea === "根元＋毛先" ||
          serviceArea === "毛先のみ補正" ||
          serviceArea === "全体（履歴なし）") && (
          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>毛先の入力</h2>

            <div style={{ marginBottom: "18px" }}>
              <p style={smallLabelStyle}>毛先履歴</p>
              <div style={rowStyle}>
                <button
                  style={buttonStyle(tipHistory === "バージン毛")}
                  onClick={() => setTipHistory("バージン毛")}
                >
                  バージン毛
                </button>
                <button
                  style={buttonStyle(tipHistory === "カラー履歴")}
                  onClick={() => setTipHistory("カラー履歴")}
                >
                  カラー履歴
                </button>
                <button
                  style={buttonStyle(tipHistory === "パーマ履歴")}
                  onClick={() => setTipHistory("パーマ履歴")}
                >
                  パーマ履歴
                </button>
                <button
                  style={buttonStyle(tipHistory === "縮毛履歴")}
                  onClick={() => setTipHistory("縮毛履歴")}
                >
                  縮毛履歴
                </button>
                <button
                  style={buttonStyle(tipHistory === "カラー＋パーマ")}
                  onClick={() => setTipHistory("カラー＋パーマ")}
                >
                  カラー＋パーマ
                </button>
                <button
                  style={buttonStyle(tipHistory === "ハイダメージ")}
                  onClick={() => setTipHistory("ハイダメージ")}
                >
                  ハイダメージ
                </button>
              </div>
            </div>

            {tipHistory === "縮毛履歴" && (
              <div style={{ marginBottom: "18px" }}>
                <p style={smallLabelStyle}>仕上がり希望</p>
                <div style={rowStyle}>
                  <button
                    style={buttonStyle(tipFinishGoal === "曲げたい")}
                    onClick={() => setTipFinishGoal("曲げたい")}
                  >
                    曲げたい
                  </button>
                  <button
                    style={buttonStyle(tipFinishGoal === "伸ばすだけ")}
                    onClick={() => setTipFinishGoal("伸ばすだけ")}
                  >
                    伸ばすだけ
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginBottom: "18px" }}>
              <p style={smallLabelStyle}>毛先状態</p>
              <div style={rowStyle}>
                <button
                  style={buttonStyle(tipState === "普通")}
                  onClick={() => setTipState("普通")}
                >
                  普通
                </button>
                <button
                  style={buttonStyle(tipState === "癖残り")}
                  onClick={() => setTipState("癖残り")}
                >
                  癖残り
                </button>
                <button
                  style={buttonStyle(tipState === "ビビり気味")}
                  onClick={() => setTipState("ビビり気味")}
                >
                  ビビり気味
                </button>
                <button
                  style={buttonStyle(tipState === "パサつき強い")}
                  onClick={() => setTipState("パサつき強い")}
                >
                  パサつき強い
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <p style={smallLabelStyle}>毛先の硬さ</p>
              <div style={rowStyle}>
                <button
                  style={buttonStyle(tipHardness === "硬い")}
                  onClick={() => setTipHardness("硬い")}
                >
                  硬い
                </button>
                <button
                  style={buttonStyle(tipHardness === "柔らかい")}
                  onClick={() => setTipHardness("柔らかい")}
                >
                  柔らかい
                </button>
              </div>
            </div>

            <div>
              <p style={smallLabelStyle}>パサつきの理由</p>
              <div style={rowStyle}>
                <button
                  style={buttonStyle(tipReason === "ダメージ由来")}
                  onClick={() => setTipReason("ダメージ由来")}
                >
                  ダメージ由来
                </button>
                <button
                  style={buttonStyle(tipReason === "癖由来")}
                  onClick={() => setTipReason("癖由来")}
                >
                  癖由来
                </button>
              </div>
            </div>
          </section>
        )}

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>メモ</h2>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="施術メモ、注意点、次回への引き継ぎなど"
            style={{
              width: "100%",
              minHeight: "100px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              padding: "12px",
              fontSize: "14px",
              resize: "vertical" as const,
              boxSizing: "border-box",
            }}
          />
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
          <button onClick={handleSelect} style={primaryButtonStyle}>
            薬剤選定する
          </button>

          <button
            onClick={saveCase}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(22,163,74,0.2)",
            }}
          >
            症例を保存する
          </button>
        </div>

        <section
          style={{
            ...resultCardStyle,
            borderLeft: "6px solid #111827",
          }}
        >
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
            ROOT
          </p>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
            根元の選定結果
          </h3>
          <p style={{ fontSize: "24px", fontWeight: 800 }}>
            {rootResult || "まだ結果はありません"}
          </p>

          {warning && (
            <p
              style={{
                marginTop: "12px",
                color: "#dc2626",
                fontWeight: 700,
                lineHeight: 1.6,
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
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
            TIP
          </p>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
            毛先の選定結果
          </h3>
          <p style={{ fontSize: "22px", fontWeight: 800 }}>
            {tipResult || "まだ毛先の結果はありません"}
          </p>
        </section>

        <section
          style={{
            ...resultCardStyle,
            borderLeft: "6px solid #16a34a",
          }}
        >
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
            TREATMENT
          </p>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
            中間処理
          </h3>
          <p style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.8 }}>
            {treatmentResult || "まだ判定していません"}
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>10分チェック</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "14px" }}>
            塗布10分後の状態を選択
          </p>

          <div style={rowStyle}>
            <button
              style={buttonStyle(check10min === "伸び始めている")}
              onClick={() => handle10MinCheck("伸び始めている")}
            >
              伸び始めている
            </button>

            <button
              style={buttonStyle(check10min === "変化がない")}
              onClick={() => handle10MinCheck("変化がない")}
            >
              変化がない
            </button>

            <button
              style={buttonStyle(check10min === "金色っぽい・少し引っかかる")}
              onClick={() => handle10MinCheck("金色っぽい・少し引っかかる")}
            >
              金色っぽい
            </button>

            <button
              style={buttonStyle(check10min === "縮れる・ふにゃふにゃ")}
              onClick={() => handle10MinCheck("縮れる・ふにゃふにゃ")}
            >
              縮れる
            </button>
          </div>

          <div
            style={{
              marginTop: "18px",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              ACTION
            </p>
            <p style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.7 }}>
              {action10min || "まだ10分チェック結果はありません"}
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>症例検索・比較</h2>

          <div style={{ marginBottom: "14px" }}>
            <p style={smallLabelStyle}>お客様名で検索</p>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="例: 山田"
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

          {filteredCases.length === 0 && (
            <p style={{ color: "#6b7280" }}>該当する症例はありません</p>
          )}

          {filteredCases.map((item) => (
            <div key={item.id} style={compareItemStyle}>
              <div
                onClick={() => setSelectedCase(item)}
                style={{ cursor: "pointer" }}
              >
                <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                  {item.customerName}
                </p>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
                  {item.date}
                </p>
                <p style={{ fontSize: "14px", color: "#374151", marginBottom: "4px" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "14px", color: "#374151" }}>
                  根元: {item.root}
                </p>
              </div>

              <button
                onClick={() => deleteCase(item.id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                削除
              </button>
            </div>
          ))}

          {selectedCase && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "14px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                お客様名: {selectedCase.customerName}
              </p>
              <p style={{ marginBottom: "6px" }}>施術部位: {selectedCase.serviceArea}</p>
              <p style={{ marginBottom: "6px" }}>根元: {selectedCase.root}</p>
              <p style={{ marginBottom: "6px" }}>毛先: {selectedCase.tip}</p>
              <p style={{ marginBottom: "6px" }}>中間処理: {selectedCase.treatment}</p>
              {selectedCase.warning && (
                <p style={{ marginBottom: "6px", color: "#dc2626", fontWeight: 700 }}>
                  ⚠ {selectedCase.warning}
                </p>
              )}
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                メモ: {selectedCase.memo}
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {selectedCase.beforePhotoUrl && (
                  <div>
                    <p style={smallLabelStyle}>施術前</p>
                    <img
                      src={selectedCase.beforePhotoUrl}
                      alt="保存施術前"
                      style={photoPreviewStyle}
                    />
                  </div>
                )}

                {selectedCase.tipPhotoUrl && (
                  <div>
                    <p style={smallLabelStyle}>毛先</p>
                    <img
                      src={selectedCase.tipPhotoUrl}
                      alt="保存毛先"
                      style={photoPreviewStyle}
                    />
                  </div>
                )}

                {selectedCase.afterPhotoUrl && (
                  <div>
                    <p style={smallLabelStyle}>仕上がり</p>
                    <img
                      src={selectedCase.afterPhotoUrl}
                      alt="保存仕上がり"
                      style={photoPreviewStyle}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}