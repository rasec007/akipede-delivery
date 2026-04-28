import React from "react";
import { Navbar } from "@/client/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main className="pt-24 pb-12 px-8 bg-gradient-to-br from-primary via-[#111827] to-[#0F172A] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
