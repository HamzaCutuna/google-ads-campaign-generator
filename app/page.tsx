import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { StickyHeader } from "@/components/sticky-header";

export default function Home() {
  return (
    <main>
      <StickyHeader />
      {/* Navigation */}
      <nav style={{ padding: "1.5rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)"
            }}>
              AdsKit.io
            </div>
            <Link
              href="/generate"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9375rem",
                fontWeight: 500
              }}
            >
              Generate Kit →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Left Aligned */}
      <section className="section-spacing">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "4rem",
            alignItems: "center"
          }}
          className="hero-grid">
            {/* Left: Content */}
            <div>
              <h1 style={{ marginBottom: "1.5rem" }}>
                Free Google Ads Campaign Starter Kit
              </h1>
              <p style={{
                fontSize: "1.25rem",
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                lineHeight: 1.6
              }}>
                Instantly generate a structured Google Ads Search campaign for your website. Import-ready files, buyer-intent keywords, and conversion tracking setup included.
              </p>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <CheckoutButton />
                <Link href="#whats-inside" className="btn btn-secondary">
                  See What's Inside
                </Link>
              </div>

              <div className="credibility-strip">
                <div className="credibility-item">100% Free</div>
                <div className="credibility-item">Import-ready CSV</div>
                <div className="credibility-item">AI-powered</div>
              </div>
            </div>

            {/* Right: Visual Mockup */}
            <div className="mockup-container">
              {/* Google Ads Editor Frame */}
              <div style={{
                background: "#1a1f2e",
                padding: "0.5rem 1rem",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "1rem",
                marginTop: "-1.5rem",
                marginLeft: "-1.5rem",
                marginRight: "-1.5rem"
              }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }}></div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></div>
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Google Ads Editor - Import Preview
                  </span>
                </div>
              </div>

              <div className="mockup-file">
                <div className="mockup-filename" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  marginBottom: "0.75rem"
                }}>
                  <span>📄 campaign.csv</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>CSV</span>
                </div>
                <div className="mockup-content">
                  Campaign, Ad Group, Keyword, Match Type<br/>
                  Search - Your Store, Leather Bags, buy leather bags, PHRASE<br/>
                  Search - Your Store, Leather Bags, shop leather bags online, EXACT
                </div>
              </div>
              <div className="mockup-file">
                <div className="mockup-filename" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>🚫 negatives.txt</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--success)" }}>Wasted Spend Protection</span>
                </div>
                <div className="mockup-content">
                  free, cheap, DIY, tutorial, job, wholesale
                </div>
              </div>
              <div className="mockup-file">
                <div className="mockup-filename" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>✍️ ads.txt</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>RSA Ready</span>
                </div>
                <div className="mockup-content">
                  Buy Leather Bags Online | Premium Handmade Leather Bags<br/>
                  Shop premium handmade leather bags. Fast shipping.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Strip */}
      <section style={{
        background: "rgba(37, 99, 235, 0.05)",
        borderTop: "1px solid rgba(37, 99, 235, 0.15)",
        borderBottom: "1px solid rgba(37, 99, 235, 0.15)",
        padding: "2rem 0"
      }}>
        <div className="container">
          <p style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto",
            lineHeight: 1.7,
            fontStyle: "italic"
          }}>
            Built by a performance marketer who has audited hundreds of failed Google Ads campaigns.
            This kit exists because most small businesses lose their first $500 on bad campaign structure.
          </p>
        </div>
      </section>

      {/* Problem Section - Asymmetric Layout */}
      <section className="section-spacing" style={{ background: "#111827" }}>
        <div className="container">
          <h2 style={{ marginBottom: "1.5rem", maxWidth: "700px" }}>
            Most Online Businesses Waste Their First $500 on Ads.
          </h2>

          <p style={{
            fontSize: "1.125rem",
            color: "var(--text-muted)",
            marginBottom: "3rem",
            maxWidth: "650px",
            lineHeight: 1.7
          }}>
            Not because they don't try. Because they launch without structure.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "3rem",
            alignItems: "start"
          }}>
            <div>
              <ul className="problem-list">
                <li>Keywords that sound right but convert wrong</li>
                <li>No negative keyword shield from day one</li>
                <li>Campaign structure built for traffic, not sales</li>
                <li>No conversion tracking blueprint</li>
                <li>Generic ad copy that blends in</li>
              </ul>
            </div>

            <div style={{
              padding: "2rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              borderRadius: "6px",
              boxShadow: "0 0 30px rgba(37, 99, 235, 0.08)"
            }}>
              <p style={{
                fontSize: "1.125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "1rem"
              }}>
                AdsKit generates a structured campaign foundation for free.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                Built by a performance marketer to help small businesses avoid common costly mistakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Improved Hierarchy */}
      <section className="section-spacing" id="whats-inside">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem", maxWidth: "750px", margin: "0 auto 4rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>
              Everything You Need to Launch - Done for You
            </h2>
            <p style={{ fontSize: "1.125rem", color: "var(--text-muted)" }}>
              No guesswork. No wasted spend. Just results.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card" style={{
              borderColor: "rgba(37, 99, 235, 0.2)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.1)"
            }}>
              <h3>Campaign Structure</h3>
              <p>Built for conversion intent, not traffic vanity.</p>
            </div>

            <div className="feature-card">
              <h3>Buyer-Intent Keywords</h3>
              <p>High purchase intent only. No informational waste.</p>
            </div>

            <div className="feature-card">
              <h3>Negative Keyword Shield</h3>
              <p>Prevent wasted spend from day one.</p>
            </div>

            <div className="feature-card" style={{
              borderColor: "rgba(16, 185, 129, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.08)"
            }}>
              <h3>RSA Copy</h3>
              <p>Policy-safe, conversion-driven ad copy.</p>
            </div>

            <div className="feature-card">
              <h3>Tracking Blueprint</h3>
              <p>Know what actually converts.</p>
            </div>

            <div className="feature-card">
              <h3>Landing Checklist</h3>
              <p>Fix conversion killers before launch.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works - Streamlined */}
      <section className="section-spacing" style={{ background: "#111827" }}>
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              How It Works
            </h2>
            <p style={{
              textAlign: "center",
              fontSize: "1.0625rem",
              color: "var(--text-muted)",
              marginBottom: "3.5rem"
            }}>
              Three simple steps to your launch-ready campaign.
            </p>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Enter Website URL</h3>
                <p>Provide your website and business description.</p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <h3>AI Generation</h3>
                <p>We analyze your business and generate your campaign.</p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Download & Import</h3>
                <p>Import into Google Ads Editor and launch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Use Cases - Scenario-Based */}
      <section className="section-spacing">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Built for 3 Core Use Cases
          </h2>
          <p style={{
            textAlign: "center",
            fontSize: "1.0625rem",
            color: "var(--text-muted)",
            marginBottom: "4rem",
            maxWidth: "650px",
            margin: "0 auto 4rem"
          }}>
            Each campaign is tailored to your business model - not generic templates.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {/* eCommerce */}
            <div style={{
              padding: "2.5rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
            }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>eCommerce</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                Product sales → ROAS focus
              </p>

              <p style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--accent-primary)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                What we generate:
              </p>

              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 1.8
              }}>
                <li>→ Category-based ad groups</li>
                <li>→ Purchase-intent keyword clusters</li>
                <li>→ ROAS-focused campaign structure</li>
              </ul>

              <div style={{
                background: "#000",
                padding: "1rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                color: "#00FF88",
                fontFamily: "monospace",
                lineHeight: 1.6
              }}>
                buy leather wallets<br/>
                premium leather bags online<br/>
                handmade belts for sale
              </div>
            </div>

            {/* Lead Generation */}
            <div style={{
              padding: "2.5rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
            }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>Lead Generation</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                Qualified leads → Cost per lead
              </p>

              <p style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--accent-primary)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                What we generate:
              </p>

              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 1.8
              }}>
                <li>→ Service-based campaign clusters</li>
                <li>→ High-intent local keywords</li>
                <li>→ Conversion-focused ad copy</li>
              </ul>

              <div style={{
                background: "#000",
                padding: "1rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                color: "#00FF88",
                fontFamily: "monospace",
                lineHeight: 1.6
              }}>
                hire marketing consultant<br/>
                schedule business audit<br/>
                get free consultation
              </div>
            </div>

            {/* SaaS */}
            <div style={{
              padding: "2.5rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
            }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>SaaS</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                Trial signups → Activation rate
              </p>

              <p style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--accent-primary)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                What we generate:
              </p>

              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 1.8
              }}>
                <li>→ Competitor-based campaigns</li>
                <li>→ Feature-based keyword sets</li>
                <li>→ Free-trial driven copy</li>
              </ul>

              <div style={{
                background: "#000",
                padding: "1rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                color: "#00FF88",
                fontFamily: "monospace",
                lineHeight: 1.6
              }}>
                project management software<br/>
                free trial CRM tool<br/>
                team collaboration platform
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* What You Actually Get - Enhanced Hierarchy */}
      <section className="section-spacing" style={{ background: "#111827" }}>
        <div className="container">
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>
              What You Actually Get
            </h2>
            <p style={{
              fontSize: "1.0625rem",
              color: "var(--text-muted)",
              maxWidth: "650px"
            }}>
              Import-ready files. Not theory. Not templates. Real campaign structure.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "2rem"
          }}
          className="output-grid">
            {/* Left Column */}
            <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
              <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                {/* Header Bar */}
                <div style={{
                  background: "#1a1f2e",
                  padding: "0.75rem 1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h3 style={{
                    fontSize: "1rem",
                    margin: 0,
                    color: "var(--accent-primary)"
                  }}>
                    campaign.csv
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Import Ready
                  </span>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div className="code-preview" style={{ marginBottom: "0.5rem" }}>
                    Campaign, Ad Group, Keyword, Match Type<br/>
                    Search - Your Store, Leather Bags, buy leather bags, PHRASE<br/>
                    Search - Your Store, Leather Bags, shop leather bags online, EXACT
                  </div>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    ⎯ 3 of 50 rows shown
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{
                  background: "#1a1f2e",
                  padding: "0.75rem 1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h3 style={{
                    fontSize: "1rem",
                    margin: 0,
                    color: "var(--accent-primary)"
                  }}>
                    negatives.txt
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>
                    Wasted Spend Protection
                  </span>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div className="code-preview">
                    free<br/>
                    cheap<br/>
                    DIY<br/>
                    tutorial<br/>
                    how to make<br/>
                    job<br/>
                    wholesale
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
              <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{
                  background: "#1a1f2e",
                  padding: "0.75rem 1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h3 style={{
                    fontSize: "1rem",
                    margin: 0,
                    color: "var(--accent-primary)"
                  }}>
                    ads.txt - RSA Copy
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Policy Safe
                  </span>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Headlines (15):</strong><br/>
                    <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                      Buy Leather Bags Online <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(23/30)</span><br/>
                      Premium Handmade Leather Bags <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(30/30)</span><br/>
                      Shop Leather Bags | Free Shipping <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(30/30)</span>
                    </div>
                    <strong style={{ color: "var(--text-primary)" }}>Descriptions (4):</strong><br/>
                    <div style={{ marginTop: "0.5rem" }}>
                      Shop our collection of premium leather bags. Fast shipping, easy returns. <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>(78/90)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{
                  fontSize: "1.125rem",
                  marginBottom: "1rem",
                  color: "var(--accent-primary)"
                }}>
                  tracking.md + landing-checklist.md
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                  Step-by-step tracking setup guide and CRO checklist to maximize conversions before launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Statement */}
      <section style={{
        padding: "5rem 0",
        background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)"
      }}>
        <div className="container">
          <div style={{
            maxWidth: "750px",
            margin: "0 auto",
            textAlign: "center"
          }}>
            <h2 style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
              fontWeight: 700
            }}>
              A structured campaign foundation, completely free.
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginBottom: "2rem"
            }}>
              Every keyword, every ad, every negative - built to protect your spend and maximize conversions.
            </p>
            <CheckoutButton />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Final CTA - Narrow Centered Authority Block */}
      <section className="section-spacing">
        <div className="container">
          <div style={{
            textAlign: "center",
            maxWidth: "650px",
            margin: "0 auto",
            padding: "3rem 2rem",
            background: "rgba(37, 99, 235, 0.03)",
            border: "1px solid rgba(37, 99, 235, 0.15)",
            borderRadius: "8px"
          }}>
            <h2 style={{ marginBottom: "1rem" }}>
              Ready to Launch Smarter Ads?
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              lineHeight: 1.7
            }}>
              Generate your free campaign kit and start with a solid foundation.
            </p>
            <CheckoutButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "2rem 0",
        borderTop: "1px solid var(--border-subtle)",
        background: "#111827"
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
              © 2026 AdsKit.io - Free experimental tool built for learning and testing purposes
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
