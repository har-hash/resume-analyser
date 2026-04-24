"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

const API_URL = "http://localhost:8000";

interface AnalysisSummary {
  id: string;
  filename: string;
  ats_score: number;
  word_count: number;
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/analyses`)
      .then((res) => res.json())
      .then((data) => setAnalyses(data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.ats_score, 0) / analyses.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-blue-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-blue-600 dark:text-blue-400";
    if (score >= 30) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-neutral-500 mt-2">Overview of your resume analyses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-neutral-500 font-medium text-sm">Resumes Analyzed</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400"><FileText className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold dark:text-white">{loading ? "—" : analyses.length}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-neutral-500 font-medium text-sm">Avg. ATS Score</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold dark:text-white">{loading ? "—" : analyses.length > 0 ? `${avgScore}%` : "N/A"}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-neutral-500 font-medium text-sm">Quick Action</h3>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <Link href="/dashboard/upload" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold text-sm hover:underline">
            Upload & Analyze a Resume →
          </Link>
        </motion.div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold dark:text-white">Analysis History</h2>
          <Link href="/dashboard/upload" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Analysis
          </Link>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-neutral-500">Loading...</div>
          ) : analyses.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold dark:text-white mb-2">No resumes analyzed yet</h3>
              <p className="text-neutral-500 mb-6">Upload your first resume to get started.</p>
              <Link href="/dashboard/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Upload Resume
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Resume Name</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Words</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">ATS Score</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                        a.filename.endsWith('.pdf')
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {a.filename.endsWith('.pdf') ? 'PDF' : 'DOC'}
                      </div>
                      <span className="font-medium dark:text-neutral-200 truncate max-w-[200px]">{a.filename}</span>
                    </td>
                    <td className="p-4 text-sm text-neutral-500">{a.word_count}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div className={`${getScoreColor(a.ats_score)} h-2 rounded-full`} style={{ width: `${a.ats_score}%` }}></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreTextColor(a.ats_score)}`}>{a.ats_score}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Link href={`/dashboard/results/${a.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium hover:underline">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
