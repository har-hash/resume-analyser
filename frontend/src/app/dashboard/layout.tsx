import { FileText, Settings, UploadCloud, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">ResumeAI</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
            <LayoutDashboard className="w-5 h-5" /> Overview
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors">
            <UploadCloud className="w-5 h-5" /> Analyze Resume
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors">
            <FileText className="w-5 h-5" /> History
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium dark:text-white">John Doe</div>
              <div className="text-neutral-500 dark:text-neutral-400 text-xs">user@example.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-8 justify-between md:justify-end">
          <div className="md:hidden text-lg font-bold text-blue-600 dark:text-blue-400">ResumeAI</div>
          {/* placeholder for mobile menu or top actions */}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
