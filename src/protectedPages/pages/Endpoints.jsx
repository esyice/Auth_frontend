import { useState } from "react";
import { FiGlobe, FiArrowRight, FiCode, FiCopy, FiCheck } from "react-icons/fi";

const BASE_URL = "https://auth.yourdomain.com";

const Endpoints = () => {
  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">API Endpoints</h3>
        <p className="text-sm text-slate-400">
          Integration details for your authentication API.
        </p>
      </div>

      {/* ===== Cards Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ===== Base URL ===== */}
        <Card
          icon={<FiGlobe />}
          title="Base URL"
          iconBg="bg-blue-500/10 text-blue-400"
        >
          <p className="text-sm text-slate-400 mb-3">
            All API requests should be sent to:
          </p>

          {/* Mobile-first stack */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="w-full font-mono bg-slate-900 px-3 py-2 rounded border border-slate-800 text-slate-200 break-all">
              {BASE_URL}
            </code>

            <CopyButton text={BASE_URL} />
          </div>
        </Card>

        {/* ===== Auth Endpoints ===== */}
        <Card
          icon={<FiArrowRight />}
          title="Auth Endpoints"
          iconBg="bg-purple-500/10 text-purple-400"
        >
          <p className="text-sm text-slate-400 mb-3">
            Available authentication endpoints:
          </p>

          <ul className="space-y-2">
            {["POST /login", "POST /register"].map((ep) => (
              <li key={ep} className="flex items-start gap-2">
                <FiArrowRight className="text-green-400 mt-1 shrink-0" />
                <code className="font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-200 break-all">
                  {ep}
                </code>
              </li>
            ))}
          </ul>
        </Card>

        {/* ===== Required Headers ===== */}
        <Card
          icon={<FiCode />}
          title="Required Headers"
          iconBg="bg-amber-500/10 text-amber-400"
        >
          <p className="text-sm text-slate-400 mb-3">
            Include this header in all authenticated requests:
          </p>

          {/* Mobile stack */}
          <div className="flex flex-col sm:flex-row mb-3">
            <span className="bg-slate-800 px-3 py-2 text-sm font-medium border border-slate-700 rounded-t sm:rounded-l sm:rounded-tr-none">
              Authorization
            </span>
            <code className="bg-slate-900 px-3 py-2 font-mono border border-slate-700 text-slate-200 rounded-b sm:rounded-r sm:rounded-bl-none break-all">
              Bearer &lt;token&gt;
            </code>
          </div>

          <CopyButton text="Bearer <token>" full />
        </Card>

        {/* ===== Example Request ===== */}
        <Card
          icon={<FiCode />}
          title="Example Request"
          iconBg="bg-green-500/10 text-green-400"
        >
          <p className="text-sm text-slate-400 mb-3">JavaScript example:</p>

          <pre className="bg-slate-950 border border-slate-800 text-slate-200 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
            {`fetch('${BASE_URL}/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})`}
          </pre>

          <CopyButton
            full
            className="mt-3"
            text={`fetch('${BASE_URL}/login', { method: 'POST' })`}
          />
        </Card>
      </div>
    </div>
  );
};

export default Endpoints;

/* ================== Reusable Components ================== */

const Card = ({ icon, title, iconBg, children }) => (
  <div className="bg-[#020617] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:border-slate-700 transition">
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-white text-sm sm:text-base">{title}</h4>
    </div>
    {children}
  </div>
);

const CopyButton = ({ text, full = false, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        ${full ? "w-full" : "w-full sm:w-auto"}
        ${className}
        flex items-center justify-center gap-2
        px-4 py-2 rounded-lg text-sm font-medium
        transition
        ${
          copied
            ? "bg-green-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
      `}
    >
      {copied ? <FiCheck /> : <FiCopy />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};
