"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ALL_AFRICAN_COUNTRIES } from "@/components/onboarding/screens/Screen2Nationality";

const DEGREE_OPTIONS = ["UNDERGRADUATE", "MASTERS", "PHD"];
const CURRENCY_OPTIONS = ["USD", "GBP", "EUR", "SEK", "CAD", "other"];

export default function EditScholarshipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    provider: "",
    sourceUrl: "",
    sourceDomain: "",
    description: "",
    amount: "",
    currency: "USD",
    deadline: "",
    eligibleDegrees: [] as string[],
    fields: "",
    eligibleNationalities: "",
    eligibilityRaw: "",
    verified: false,
    isActive: true,
    universityName: "",
    universityCountry: "",
    programName: "",
    scholarshipType: "NATIONAL",
    applicationRoute: "DIRECT",
  });

  const [lastCrawled, setLastCrawled] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScholarship() {
      try {
        const res = await fetch(`/api/admin/scholarships/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title || "",
            provider: data.provider || "",
            sourceUrl: data.sourceUrl || "",
            sourceDomain: data.sourceDomain || "",
            description: data.description || "",
            amount: data.amount ? data.amount.toString() : "",
            currency: data.currency || "USD",
            deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : "",
            eligibleDegrees: data.eligibleDegrees || [],
            fields: data.fieldsOfStudy ? data.fieldsOfStudy.join(", ") : "",
            eligibleNationalities: data.eligibleNationalities ? data.eligibleNationalities.join(", ") : "",
            eligibilityRaw: data.eligibilityRaw || "",
            verified: !!data.verified,
            isActive: !!data.isActive,
            universityName: data.hostInstitution || "",
            universityCountry: data.hostCountry || "",
            programName: "",
            scholarshipType: "NATIONAL",
            applicationRoute: "DIRECT",
          });
          if (data.lastCrawledAt) {
            const diff = Math.floor((Date.now() - new Date(data.lastCrawledAt).getTime()) / (1000 * 60 * 60 * 24));
            setLastCrawled(diff === 0 ? "Today" : `${diff} days ago`);
          }
        } else {
          setError("Scholarship not found");
        }
      } catch (err) {
        setError("Failed to load scholarship");
      } finally {
        setLoading(false);
      }
    }
    fetchScholarship();
  }, [id]);

  const handleSourceUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let domain = "";
    try {
      domain = new URL(value).hostname.replace("www.", "");
    } catch {}
    setForm((f) => ({ ...f, sourceUrl: value, sourceDomain: domain }));
  };

  const toggleDegree = (deg: string) => {
    setForm((f) => ({
      ...f,
      eligibleDegrees: f.eligibleDegrees.includes(deg)
        ? f.eligibleDegrees.filter((d) => d !== deg)
        : [...f.eligibleDegrees, deg],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update scholarship");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading scholarship...</div>;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-8 lg:p-12 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-ink)] tracking-tight">Edit Scholarship</h2>
          {lastCrawled && (
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-ink-tertiary)] mt-2">Last crawled: {lastCrawled}</p>
          )}
        </div>
        <button
          type="button"
          onClick={async () => {
            const res = await fetch(`/api/admin/scholarships/${id}/toggle`, { method: "POST" });
            if (res.ok) window.location.href = "/admin";
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            form.isActive 
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" 
              : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
          }`}
        >
          {form.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[13px] font-bold mb-8 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Title *</label>
            <input
              type="text"
              required
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Provider *</label>
            <input
              type="text"
              required
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Source URL *</label>
            <input
              type="url"
              required
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.sourceUrl}
              onChange={handleSourceUrlChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Source Domain</label>
            <input
              type="text"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink-tertiary)] opacity-70 cursor-not-allowed"
              value={form.sourceDomain}
              readOnly
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Deadline</label>
            <input
              type="date"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Amount</label>
            <input
              type="number"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Currency</label>
            <div className="relative">
              <select
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all appearance-none"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-ink-tertiary)]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Description</label>
          <textarea
            rows={4}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Raw Eligibility Text</label>
          <textarea
            rows={3}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
            value={form.eligibilityRaw}
            onChange={(e) => setForm({ ...form, eligibilityRaw: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-3 pl-2">Eligible Degrees</label>
            <div className="flex flex-wrap gap-4">
              {DEGREE_OPTIONS.map((deg) => (
                <label key={deg} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-[var(--color-moss)] w-4 h-4 border-[var(--color-border)] rounded transition-all group-hover:scale-110"
                    checked={form.eligibleDegrees.includes(deg)}
                    onChange={() => toggleDegree(deg)}
                  />
                  <span className="text-[13px] font-bold text-[var(--color-ink)] group-hover:text-[var(--color-moss)] transition-colors">{deg.charAt(0) + deg.slice(1).toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-8 items-center h-full pt-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="accent-[var(--color-moss)] w-5 h-5 border-[var(--color-border)] rounded transition-all group-hover:scale-110"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
              />
              <span className="text-[13px] font-black tracking-wide text-[var(--color-ink)] group-hover:text-[var(--color-moss)] transition-colors">Verified</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="accent-[var(--color-moss)] w-5 h-5 border-[var(--color-border)] rounded transition-all group-hover:scale-110"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-[13px] font-black tracking-wide text-[var(--color-ink)] group-hover:text-[var(--color-moss)] transition-colors">Active</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Fields of Study (comma-separated)</label>
            <input
              type="text"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.fields}
              onChange={(e) => setForm({ ...form, fields: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Nationalities (comma-separated ISO or "ALL")</label>
            <textarea
              rows={2}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
              value={form.eligibleNationalities}
              onChange={(e) => setForm({ ...form, eligibleNationalities: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)]">
          <h3 className="text-[11px] font-black text-[var(--color-ink-secondary)] uppercase tracking-[0.2em] mb-6 pl-2">University-specific Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">University Name</label>
              <input
                type="text"
                placeholder="Uppsala University"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
                value={form.universityName}
                onChange={(e) => setForm({ ...form, universityName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">University Country</label>
              <div className="relative">
                <select
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all appearance-none"
                  value={form.universityCountry}
                  onChange={(e) => setForm({ ...form, universityCountry: e.target.value })}
                >
                  <option value="">-- Leave blank for national --</option>
                  {ALL_AFRICAN_COUNTRIES.map((c: { name: string; code: string; flag: string }) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-ink-tertiary)]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-2 pl-2">Program Name</label>
              <input
                type="text"
                placeholder="MSc Microbiology (Leave blank if open to all programs)"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-[13px] font-bold text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:ring-2 focus:ring-[var(--color-moss)]/20 outline-none transition-all"
                value={form.programName}
                onChange={(e) => setForm({ ...form, programName: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-3 pl-2">Scholarship Type</label>
              <div className="flex flex-col gap-3">
                {["NATIONAL", "UNIVERSITY", "DEPARTMENT"].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name={`scholarshipType_edit`}
                      className="accent-[var(--color-moss)] w-4 h-4 border-[var(--color-border)] transition-transform group-hover:scale-110"
                      checked={form.scholarshipType === type}
                      onChange={() => setForm({ ...form, scholarshipType: type })}
                    />
                    <span className="text-[13px] font-bold text-[var(--color-ink)] capitalize group-hover:text-[var(--color-moss)] transition-colors">{type.toLowerCase()} scholarship</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-ink-tertiary)] mb-3 pl-2">Application Route</label>
              <div className="flex flex-col gap-3">
                {[
                  { value: "DIRECT", label: "Direct application" },
                  { value: "ADMISSION_FIRST", label: "Admission required first" },
                  { value: "AUTOMATIC", label: "Automatic on admission" }
                ].map(route => (
                  <label key={route.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name={`applicationRoute_edit`}
                      className="accent-[var(--color-moss)] w-4 h-4 border-[var(--color-border)] transition-transform group-hover:scale-110"
                      checked={form.applicationRoute === route.value}
                      onChange={() => setForm({ ...form, applicationRoute: route.value })}
                    />
                    <span className="text-[13px] font-bold text-[var(--color-ink)] group-hover:text-[var(--color-moss)] transition-colors">{route.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-[var(--color-border)] flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest bg-[var(--color-moss)] text-[var(--color-surface)] shadow-lg shadow-[var(--color-moss)]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? "Saving..." : "Update Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
}
