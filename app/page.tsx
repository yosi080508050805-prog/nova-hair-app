"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [editingId, setEditingId] = useState<number | null>(null);

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

  useEffect(() => {
    const loadEditCase = async () => {
      if (!editId) return;

      const { data } = await supabase
        .from("cases")
        .select("*")
        .eq("id", editId)
        .single();

      if (!data) return;

      setEditingId(data.id);
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
    };

    loadEditCase();
  }, [editId]);

  const saveCase = async () => {
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
      alert("保存失敗");
      return;
    }

    alert("保存完了");
    window.location.href = "/cases";
  };

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>nova</h1>
      <p>MEN'S STRAIGHT PERM</p>

      <div style={{ marginBottom: 20 }}>
        <Link href="/cases">症例一覧</Link>
      </div>

      <input
        placeholder="お客様名"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        placeholder="施術部位"
        value={serviceArea}
        onChange={(e) => setServiceArea(e.target.value)}
      />

      <input
        placeholder="根元"
        value={root}
        onChange={(e) => setRoot(e.target.value)}
      />

      <input
        placeholder="毛先"
        value={tip}
        onChange={(e) => setTip(e.target.value)}
      />

      <textarea
        placeholder="中間処理"
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
      />

      <textarea
        placeholder="注意"
        value={warning}
        onChange={(e) => setWarning(e.target.value)}
      />

      <textarea
        placeholder="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      <button onClick={saveCase}>
        {editingId ? "更新する" : "症例保存"}
      </button>
    </main>
  );
}
