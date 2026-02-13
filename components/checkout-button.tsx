"use client";

import Link from "next/link";

export function CheckoutButton() {
  return (
    <Link href="/generate" className="btn btn-primary btn-large">
      Generate Free Campaign Kit
    </Link>
  );
}
