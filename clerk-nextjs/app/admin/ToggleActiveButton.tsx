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
          className={`text-xs font-medium ${loading ? "text-gray-300 dark:text-gray-600" : "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"}`}
        >
          {loading ? "..." : "Activate"}
        </button>
        <button
          onClick={handleReject}
          disabled={loading || deleting}
          className={`text-xs font-medium ${deleting ? "text-gray-300 dark:text-gray-600" : "text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"}`}
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
      className={`text-xs font-medium ${loading ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
    >
      {loading ? "..." : (isActive ? "Deactivate" : "Activate")}
    </button>
  );
}
