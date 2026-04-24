"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Loader2, Info, Zap, FileText } from "lucide-react";
import Link from "next/link";

const API_URL = "http://localhost:8000";

interface AnalysisData {
  id: string;
  filename: string;
  word_count: number;
  contact_info: Record<string, string>;
  skills_found: Record<string, string[]>;
  skills_flat: string[];
  sections_detected: Record<string, boolean>;
  action_verbs: {
    strong_verbs: string[];
    weak_phrases: string[];
  };
  metrics: {
    has_metrics: boolean;
    percentages: string[];
    dollar_amounts: string[];
    multipliers: string[];
    count: number;
  };
  formatting_issues: string[];
  job_match: {
    matched: string[];
    missing: string[];
    match_percentage: number;
  };
  ats_score: {
    total: number;
    breakdown: Record<string, { score: number; max: number; label: string }>;
  };
  suggestions: Array<{
    type: string;
    severity: string;
    title: string;
    detail: string;
  }>;
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (circumference * score) / 100;
  const color = score >= 75 ? "text-green-500" : score >= 50 ? "text-blue-500" : score >= 30 ? "text-orange-500" : "text-red-500";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Good" : score >= 30 ? "Fair" : "Needs Work";

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-100 dark:text-neutral-800" />
        <motion.circle
          cx="50" cy="50" r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-black dark:text-white">{score}<span className="text-2xl text-neutral-400">%</span></span>
        <span className={`text-sm font-medium mt-1 ${color}`}>{label}</span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[severity] || colors.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const analysisId = params.id as string;
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analysis/${analysisId}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Not found" }));
          throw new Error(err.detail || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-orange-500 mb-4" />
        <h2 className="text-xl font-bold dark:text-white mb-2">Analysis Not Found</h2>
        <p className="text-neutral-500 mb-6">{error || "This analysis may have expired."}</p>
        <Link href="/dashboard/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Upload New Resume
        </Link>
      </div>
    );
  }

  const { ats_score, skills_found, skills_flat, action_verbs, metrics, formatting_issues, job_match, suggestions, sections_detected, contact_info, word_count, filename } = data;

  return (
    <div className="max-w-5xl mx-auto mt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <FileText className="w-4 h-4" />
          <span className="font-medium dark:text-neutral-300">{filename}</span>
          <span>•</span>
          <span>{word_count} words</span>
        </div>
      </div>

      {/* Top Row: Score + Key Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ATS Score */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-lg font-bold text-neutral-500 mb-6">Overall ATS Score</h2>
          <ScoreRing score={ats_score.total} />

          {/* Score Breakdown */}
          <div className="mt-8 w-full space-y-3">
            {Object.entries(ats_score.breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-500">{val.label}</span>
                  <span className="font-semibold dark:text-neutral-300">{val.score}/{val.max}</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(val.score / val.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-2/3 space-y-6"
        >
          {/* Skills Found */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <CheckCircle className="w-5 h-5 text-green-500" /> Skills Detected ({skills_flat.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills_flat.length > 0 ? skills_flat.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg text-sm font-medium capitalize">
                  {s}
                </span>
              )) : (
                <p className="text-sm text-neutral-500">No technical skills were detected. Make sure to list your skills explicitly.</p>
              )}
            </div>
            {Object.keys(skills_found).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-500">
                {Object.entries(skills_found).map(([cat, items]) => (
                  <span key={cat} className="capitalize">{cat.replace("_", " ")}: {(items as string[]).length}</span>
                ))}
              </div>
            )}
          </div>

          {/* Job Match (if provided) */}
          {job_match.match_percentage > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                <Zap className="w-5 h-5 text-yellow-500" /> Job Description Match: {job_match.match_percentage}%
              </h3>
              {job_match.missing.length > 0 && (
                <>
                  <p className="text-sm text-neutral-500 mb-3">Missing keywords from the job description:</p>
                  <div className="flex flex-wrap gap-2">
                    {job_match.missing.map((kw) => (
                      <span key={kw} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 rounded-lg text-sm font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {job_match.matched.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-neutral-500 mb-2">Matched keywords:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job_match.matched.map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Verbs & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                {metrics.has_metrics ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm dark:text-white mb-1">Impact Metrics</h4>
                  <p className="text-xs text-neutral-500">
                    {metrics.has_metrics
                      ? `Found ${metrics.count} quantifiable metric(s) — percentages, dollar amounts, etc.`
                      : "No quantifiable metrics found. Add numbers like '35% improvement' or '$2M revenue'."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                {action_verbs.weak_phrases.length === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm dark:text-white mb-1">Action Verbs</h4>
                  <p className="text-xs text-neutral-500">
                    {action_verbs.strong_verbs.length > 0
                      ? `${action_verbs.strong_verbs.length} strong verb(s): ${action_verbs.strong_verbs.slice(0, 5).join(", ")}`
                      : "No strong action verbs found."}
                    {action_verbs.weak_phrases.length > 0 && (
                      <span className="block mt-1 text-red-500">Weak: {action_verbs.weak_phrases.join(", ")}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Detected */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800">
            <h4 className="font-bold text-sm dark:text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> Resume Sections
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(sections_detected).map(([section, found]) => (
                <span
                  key={section}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    found
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700 line-through"
                  }`}
                >
                  {found ? "✓" : "✗"} {section}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800"
        >
          <h3 className="text-xl font-bold mb-6 dark:text-white">💡 Improvement Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <SeverityBadge severity={s.severity} />
                  <h4 className="font-semibold text-sm dark:text-white">{s.title}</h4>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-[52px]">{s.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Formatting Issues */}
      {formatting_issues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-800"
        >
          <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" /> Formatting Feedback
          </h3>
          <ul className="space-y-3">
            {formatting_issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                {issue}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Contact Info */}
      {Object.keys(contact_info).length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
          <h4 className="font-bold text-sm dark:text-white mb-3">Extracted Contact Info</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(contact_info).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-neutral-400 capitalize">{key}:</span>
                <span className="dark:text-neutral-200 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
