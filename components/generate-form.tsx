"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  storeUrl: string;
  description: string;
  country: string;
};

export function GenerateForm() {
  const [form, setForm] = useState<FormState>({
    storeUrl: "",
    description: "",
    country: "United States",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("adskit.zip");

  const canSubmit = useMemo(() => {
    return Boolean(form.storeUrl.trim() && form.description.trim() && form.country.trim());
  }, [form]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Generation failed.");
      }

      const disposition = response.headers.get("Content-Disposition");
      const nameMatch = disposition?.match(/filename="?([^";]+)"?/i);
      if (nameMatch?.[1]) {
        setFileName(nameMatch[1]);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#111827",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "8px",
      padding: "2.5rem",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
    }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <label>Website URL</label>
          <input
            required
            type="url"
            placeholder="https://your-website.com"
            value={form.storeUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, storeUrl: e.target.value }))}
          />
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <label>Business Description</label>
          <textarea
            required
            rows={6}
            placeholder="We sell handmade leather wallets, belts, and accessories made from premium Italian leather. Our products are perfect for professionals and fashion enthusiasts who value quality craftsmanship."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
            Describe your business offerings, target audience, and unique selling points
          </p>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <label>Target Country</label>
          <select
            required
            value={form.country}
            onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Italy">Italy</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Belgium">Belgium</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Austria">Austria</option>
            <option value="Sweden">Sweden</option>
            <option value="Norway">Norway</option>
            <option value="Denmark">Denmark</option>
            <option value="Finland">Finland</option>
            <option value="Poland">Poland</option>
            <option value="Ireland">Ireland</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Singapore">Singapore</option>
            <option value="Japan">Japan</option>
            <option value="South Korea">South Korea</option>
            <option value="India">India</option>
            <option value="Brazil">Brazil</option>
            <option value="Mexico">Mexico</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="South Africa">South Africa</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !canSubmit}
          style={{
            marginTop: "1rem",
            width: "100%",
            height: "56px",
            fontSize: "1.0625rem",
            fontWeight: 600,
            boxShadow: loading ? "none" : "0 4px 14px rgba(37, 99, 235, 0.3)"
          }}
        >
          {loading ? "Generating Your Campaign..." : "Generate Campaign Kit"}
        </button>
      </form>

      {error ? (
        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#EF4444",
          borderRadius: "6px",
          fontSize: "0.9375rem",
          border: "1px solid rgba(239, 68, 68, 0.3)"
        }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {downloadUrl ? (
        <div style={{
          marginTop: "2rem",
          padding: "2rem",
          background: "rgba(16, 185, 129, 0.1)",
          borderRadius: "6px",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
          <h3 style={{
            fontSize: "1.5rem",
            marginBottom: "0.75rem",
            color: "var(--success)"
          }}>
            Campaign Kit Ready
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Download your ZIP file and import it into Google Ads Editor
          </p>
          <a
            className="btn btn-primary btn-large"
            href={downloadUrl}
            download={fileName}
            style={{ textDecoration: "none" }}
          >
            Download {fileName}
          </a>

          <div style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-subtle)",
            textAlign: "left"
          }}>
            <strong style={{
              display: "block",
              marginBottom: "0.75rem",
              color: "var(--text-primary)",
              fontSize: "0.9375rem"
            }}>
              Next Steps:
            </strong>
            <ol style={{
              margin: 0,
              paddingLeft: "1.5rem",
              lineHeight: 1.8,
              color: "var(--text-muted)",
              fontSize: "0.9375rem"
            }}>
              <li>Extract the ZIP file</li>
              <li>Open Google Ads Editor</li>
              <li>Import the campaign.csv file</li>
              <li>Review ad copy and keywords</li>
              <li>Set your budget and launch</li>
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}
