import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  title: "Admin Dashboard – Desire Job Hub",
  description: "Admin dashboard for managing Desire Job Hub applications and jobs",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
