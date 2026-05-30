"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleActiveButton({ id, isActive, isPendingReview }: { id: string, isActive: boolean, isPendingReview?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    if (loading || deleting) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${id}/toggle`, {
        method: "POST"
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to toggle status");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (loading || deleting) return;
    if (!confirm("Are you sure you want to reject and delete this scholarship?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to reject");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setDeleting(false);
    }
  }

  if (isPendingReview) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          disabled={loading || deleting}
          className={`text-xs font-medium ${loading ? "text-gray-300" : "text-green-600 hover:text-green-800"}`}
        >
          {loading ? "..." : "Activate"}
        </button>
        <button
          onClick={handleReject}
          disabled={loading || deleting}
          className={`text-xs font-medium ${deleting ? "text-gray-300" : "text-red-500 hover:text-red-700"}`}
        >
          {deleting ? "..." : "Reject"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-medium ${loading ? "text-gray-300" : "text-gray-500 hover:text-gray-800"}`}
    >
      {loading ? "..." : (isActive ? "Deactivate" : "Activate")}
    </button>
  );
}
