import type { ReactNode } from "react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

interface Props {
  children: ReactNode;
  onNavigate?: (page: string) => void;
  activePage?: string;
}

export default function DashboardLayout({
  children,
  onNavigate,
  activePage,
}: Props) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#07090e] text-slate-100">
      <Sidebar
        onNavigate={onNavigate}
        activePage={activePage}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#07090e] p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}