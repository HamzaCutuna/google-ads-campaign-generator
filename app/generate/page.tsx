import Link from "next/link";
import { GenerateForm } from "@/components/generate-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Free Campaign Kit",
  description: "Enter your website URL and business description to generate a complete Google Ads Search campaign with buyer-intent keywords, RSA ad copy, and negative keyword lists. Free, no signup required.",
  openGraph: {
    title: "Generate Free Campaign Kit | AdsKit.io",
    description: "Enter your website URL and business description to generate a complete Google Ads Search campaign instantly. Free AI-powered tool.",
  },
};

export default function GeneratePage() {
  return (
    <main>
      {/* Navigation */}
      <nav style={{ padding: "1.5rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/" style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)"
            }}>
              AdsKit.io
            </Link>
            <Link
              href="/"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9375rem",
                fontWeight: 500
              }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ marginBottom: "1rem" }}>
              Generate Your Free Campaign Kit
            </h1>
            <p style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "3rem",
              lineHeight: 1.6
            }}>
              Enter your website details. We'll analyze your business and generate a complete, import-ready Google Ads campaign.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <GenerateForm />

            {/* Help Box */}
            <div style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(37, 99, 235, 0.08)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              borderRadius: "8px"
            }}>
              <h3 style={{
                fontSize: "1rem",
                marginBottom: "0.75rem",
                color: "var(--text-primary)",
                fontWeight: 600
              }}>
                💡 Pro Tip
              </h3>
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "var(--text-secondary)"
              }}>
                Be specific in your business description. Mention your offerings, target market, and unique selling points. This helps us create more targeted keywords and ad copy.
              </p>
            </div>

            {/* What Happens Next */}
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{
                fontSize: "1.25rem",
                marginBottom: "1.5rem",
                textAlign: "center"
              }}>
                What Happens Next
              </h3>

              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3 style={{ fontSize: "1.125rem" }}>AI Generation</h3>
                  <p style={{ fontSize: "0.9375rem" }}>
                    We analyze your website and create optimized campaigns
                  </p>
                </div>

                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3 style={{ fontSize: "1.125rem" }}>ZIP Package</h3>
                  <p style={{ fontSize: "0.9375rem" }}>
                    All files packaged into a single downloadable ZIP
                  </p>
                </div>

                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3 style={{ fontSize: "1.125rem" }}>Import & Launch</h3>
                  <p style={{ fontSize: "0.9375rem" }}>
                    Open Google Ads Editor and import your campaign
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <p style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                lineHeight: 1.7
              }}>
                This is a free utility tool. Always review outputs before launching campaigns. We recommend testing with a small budget first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "2rem 0",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-secondary)"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              © 2026 AdsKit.io - Free experimental tool
            </p>
            <div style={{ display: "flex", gap: "2rem", fontSize: "0.875rem" }}>
              <a href="#" style={{ color: "var(--text-muted)" }}>Privacy</a>
              <a href="#" style={{ color: "var(--text-muted)" }}>Terms</a>
              <a href="#" style={{ color: "var(--text-muted)" }}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
