"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SendEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export function SendEmailModal({ open, onClose }: SendEmailModalProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleClose() {
    onClose();
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSend() {
    if (!email) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-[#C3F001]/40 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3.5 top-3 text-zinc-500 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="font-michroma text-lg font-bold text-white">
          Send Beta Welcome Email
        </h2>
        <p className="mt-1.5 font-sf-pro text-[13px] leading-relaxed text-zinc-500">
          Enter the recipient&apos;s email to send them the ComicSmith beta
          welcome email.
        </p>

        <label
          htmlFor="recipient-name"
          className="mb-1.5 mt-4 block text-xs font-sf-pro font-semibold text-zinc-300"
        >
          Name (optional)
        </label>
        <input
          id="recipient-name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={status === "sending"}
          className="w-full rounded-lg border font-sf-pro border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#C3F001] disabled:opacity-60"
        />

        <label
          htmlFor="recipient-email"
          className="mb-1.5 mt-3.5 block text-xs font-sf-pro font-semibold text-zinc-300"
        >
          Email address
        </label>
        <input
          id="recipient-email"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          className="w-full rounded-lg border font-sf-pro border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#C3F001] disabled:opacity-60"
        />

        {status === "error" && (
          <p className="mt-3 text-[13px] text-red-400 font-sf-pro">
            {errorMsg}
          </p>
        )}
        {status === "success" && (
          <p className="mt-3 text-[13px] text-green-400 font-sf-pro">
            Email sent to {email}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2.5">
          <button
            onClick={handleClose}
            className="rounded-lg bg-zinc-800 px-4 py-2.5 text-[13px] font-michroma font-semibold text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!email || status === "sending"}
            className="rounded-lg bg-[#C3F001] px-4 py-2.5 text-[13px] font-michroma font-bold text-[#171717] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
