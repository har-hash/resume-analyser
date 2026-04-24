"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_URL = "http://localhost:8000";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (selectedFile: File) => {
    const validExts = [".pdf", ".docx"];
    const ext = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf("."));
    if (validExts.includes(ext)) {
      setFile(selectedFile);
      setError(null);
      setResultId(null);
    } else {
      setError("Please upload a PDF or DOCX file.");
    }
  };

  const removeFile = () => {
    setFile(null);
    setResultId(null);
    setError(null);
    setProgress(0);
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      setProgress(30);

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setProgress(100);
      setResultId(data.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed. Is the backend running?";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Analyze New Resume</h1>
        <p className="text-neutral-500 mt-1">Upload your resume in PDF or DOCX format to get a real ATS score and AI feedback.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl shadow-blue-900/5 dark:shadow-none border border-neutral-100 dark:border-neutral-800"
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white mb-2">Drag & Drop your resume</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Or click to browse from your computer (PDF or DOCX, Max 5MB)</p>
                <span className="inline-block bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  Select File
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div key="file-selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              {/* File Info */}
              <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold dark:text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                    <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!uploading && !resultId && (
                  <button onClick={removeFile} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Job Description Input */}
              {!resultId && !uploading && (
                <div className="w-full mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Job Description <span className="text-neutral-400">(optional — for targeted matching)</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get a targeted match score and missing keywords..."
                    className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-800 dark:text-neutral-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-400"
                  />
                </div>
              )}

              {/* Progress Bar */}
              {uploading && (
                <div className="w-full mb-6">
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 text-center">Analyzing your resume... {progress}%</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Analysis Failed</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Result State */}
              {resultId ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white mb-2">Analysis Complete!</h3>
                  <p className="text-neutral-500 mb-6">Your resume has been analyzed with real data.</p>
                  <div className="flex gap-4 justify-center">
                    <Link href={`/dashboard/results/${resultId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                      View Results
                    </Link>
                    <button onClick={removeFile} className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                      Upload Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={uploadAndAnalyze}
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...
                    </>
                  ) : (
                    "Start Analysis"
                  )}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
