"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function StickyHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "0.75rem 0",
      transition: "all 0.3s ease"
    }}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)"
          }}>
            AdsKit.io
          </div>
          <Link
            href="/generate"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "var(--accent-primary)",
              color: "#ffffff",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.9375rem",
              transition: "all 0.2s ease",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent-primary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Generate Free Kit - No Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
