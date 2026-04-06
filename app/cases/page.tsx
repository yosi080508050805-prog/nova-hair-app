const saveCase = async () => {
  try {
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
      console.error(error);
      alert("クラウド保存に失敗しました");
      return;
    }

    alert("症例をクラウド保存しました");

  } catch (e) {
    console.error(e);
    alert("クラウド保存に失敗しました");
  }
};