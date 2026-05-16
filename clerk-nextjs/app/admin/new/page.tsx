"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_AFRICAN_COUNTRIES } from "@/components/onboarding/StepNationality";

const DEGREE_OPTIONS = ["UNDERGRADUATE", "MASTERS", "PHD"];
const CURRENCY_OPTIONS = ["USD", "GBP", "EUR", "SEK", "CAD", "other"];

export default function NewScholarshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create scholarship");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Add New Scholarship</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TITLE */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Title *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* PROVIDER */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Provider *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            />
          </div>

          {/* SOURCE URL */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Source URL *</label>
            <input
              type="url"
              required
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.sourceUrl}
              onChange={handleSourceUrlChange}
            />
          </div>

          {/* DOMAIN */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Source Domain</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50"
              value={form.sourceDomain}
              readOnly
            />
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Deadline</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Amount</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {/* CURRENCY */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Currency</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
          <textarea
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* ELIGIBILITY RAW */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Raw Eligibility Text (from source)</label>
          <textarea
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
            value={form.eligibilityRaw}
            onChange={(e) => setForm({ ...form, eligibilityRaw: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DEGREES */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Eligible Degrees</label>
            <div className="flex flex-wrap gap-4">
              {DEGREE_OPTIONS.map((deg) => (
                <label key={deg} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#1D9E75]"
                    checked={form.eligibleDegrees.includes(deg)}
                    onChange={() => toggleDegree(deg)}
                  />
                  <span className="text-sm text-gray-700">{deg.charAt(0) + deg.slice(1).toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* FLAGS */}
          <div className="flex gap-8 items-center h-full pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-[#1D9E75]"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
              />
              <span className="text-sm text-gray-700 font-medium">Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-[#1D9E75]"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-sm text-gray-700 font-medium">Active</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FIELDS */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Fields of Study (comma-separated)</label>
            <input
              type="text"
              placeholder="Engineering, Computer Science, Law"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.fields}
              onChange={(e) => setForm({ ...form, fields: e.target.value })}
            />
          </div>

          {/* NATIONALITIES */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nationalities (comma-separated ISO or "ALL")</label>
            <textarea
              rows={2}
              placeholder='NG, GH, KE or "ALL"'
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
              value={form.eligibleNationalities}
              onChange={(e) => setForm({ ...form, eligibleNationalities: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">University-specific</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">University Name</label>
              <input
                type="text"
                placeholder="Uppsala University"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
                value={form.universityName}
                onChange={(e) => setForm({ ...form, universityName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">University Country</label>
              <select
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
                value={form.universityCountry}
                onChange={(e) => setForm({ ...form, universityCountry: e.target.value })}
              >
                <option value="">-- Leave blank for national --</option>
                {ALL_AFRICAN_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Program Name</label>
              <input
                type="text"
                placeholder="MSc Microbiology (Leave blank if open to all programs)"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#1D9E75] outline-none"
                value={form.programName}
                onChange={(e) => setForm({ ...form, programName: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Scholarship Type</label>
              <div className="flex flex-col gap-2">
                {["NATIONAL", "UNIVERSITY", "DEPARTMENT"].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`scholarshipType_new`}
                      className="accent-[#1D9E75]"
                      checked={form.scholarshipType === type}
                      onChange={() => setForm({ ...form, scholarshipType: type })}
                    />
                    <span className="text-sm text-gray-700 capitalize">{type.toLowerCase()} scholarship</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Application Route</label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "DIRECT", label: "Direct application" },
                  { value: "ADMISSION_FIRST", label: "Admission required first" },
                  { value: "AUTOMATIC", label: "Automatic on admission" }
                ].map(route => (
                  <label key={route.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`applicationRoute_new`}
                      className="accent-[#1D9E75]"
                      checked={form.applicationRoute === route.value}
                      onChange={() => setForm({ ...form, applicationRoute: route.value })}
                    />
                    <span className="text-sm text-gray-700">{route.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl text-sm font-medium bg-[#1D9E75] text-white hover:bg-[#0F6E56] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
}
