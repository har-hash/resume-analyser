"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, BarChart2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-950 flex flex-col pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex-grow flex flex-col items-center justify-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 flex items-center shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
          AI-Powered Resume Analysis
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Land your dream job with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
             Smart ATS Optimization
          </span>
        </motion.h1>

        <motion.p 
          className="mt-4 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload your resume, analyze it against Applicant Tracking Systems, and get actionable AI feedback to improve your match score instantly.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/dashboard" className="px-8 py-4 text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
            <UploadCloud className="w-5 h-5" /> Get Started Free
          </Link>
          <Link href="#features" className="px-8 py-4 text-lg font-medium rounded-xl text-blue-600 bg-white border border-blue-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-700 shadow-sm transition-all hover:scale-105 active:scale-95">
            View Features
          </Link>
        </motion.div>
      </div>

      <motion.div 
        id="features"
        className="mt-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-white dark:bg-neutral-800/60 p-8 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-neutral-100 dark:border-neutral-800">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Smart Parsing</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Upload PDF or DOCX and instantly extract your structure, skills, and experience with high precision.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800/60 p-8 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-neutral-100 dark:border-neutral-800">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">ATS Scoring</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Get a clear percentage score showing how well your resume matches real-world Applicant Tracking Systems.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800/60 p-8 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-neutral-100 dark:border-neutral-800">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">AI Rewriting</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Receive precise, tailored suggestions for missing keywords, action verbs, and impact phrasing.</p>
        </div>
      </motion.div>
    </main>
  );
}
