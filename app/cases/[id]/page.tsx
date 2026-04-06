"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      setItem(data);
    };

    load();
  }, [id]);

  if (!item) return <div>読み込み中...</div>;

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Link href="/cases">←戻る</Link>

      <h1>{item.customer_name}</h1>

      <p>{item.service_area}</p>
      <p>{item.root_result}</p>
      <p>{item.tip_result}</p>

      <Link href={`/?edit=${item.id}`}>
        編集する
      </Link>

      <div>
        {item.before_photo_url && (
          <img src={item.before_photo_url} width="200"/>
        )}

        {item.after_photo_url && (
          <img src={item.after_photo_url} width="200"/>
        )}
      </div>
    </main>
  );
}
