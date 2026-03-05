//app\admin\orders\order-status-form.tsx

"use client";

import { useState } from "react";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);

    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setLoading(false);
  }

  return (
    <div className="mt-2 flex gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-2 py-1"
      >
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="border px-3 py-1"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}