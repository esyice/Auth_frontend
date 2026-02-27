import { useState } from "react";
import { FiGlobe, FiArrowRight, FiCode, FiCopy, FiCheck } from "react-icons/fi";

const BASE_URL = "https://authapi.anshvarma.in/api/v1";

const Endpoints = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white">External API (v1)</h3>
        <p className="text-sm text-slate-400">
          Use these endpoints with your generated API key.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base URL */}
        <Card
          icon={<FiGlobe />}
          title="Base URL"
          iconBg="bg-blue-500/10 text-blue-400"
        >
          <code className="block font-mono bg-slate-900 px-3 py-2 rounded border border-slate-800 text-slate-200 break-all">
            {BASE_URL}
          </code>
          <CopyButton text={BASE_URL} className="mt-3" full />
        </Card>

        {/* Required Header */}
        <Card
          icon={<FiCode />}
          title="Required Header"
          iconBg="bg-amber-500/10 text-amber-400"
        >
          <p className="text-sm text-slate-400 mb-2">
            Include your API key in every request:
          </p>
          <code className="block bg-slate-900 p-2 rounded border border-slate-800">
            Authorization: Bearer &lt;token&gt;
          </code>
          <CopyButton
            text="Authorization: Bearer <token>: ak_live_xxxxxxxxxxxxx"
            className="mt-3"
            full
          />
        </Card>

        {/* Endpoints */}
        <Card
          icon={<FiArrowRight />}
          title="Available Endpoints"
          iconBg="bg-purple-500/10 text-purple-400"
        >
          <ul className="space-y-2">
            {["POST /register", "POST /login"].map((ep) => (
              <li key={ep} className="flex items-start gap-2">
                <FiArrowRight className="text-green-400 mt-1 shrink-0" />
                <code className="font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-200 text-sm">
                  {ep}
                </code>
              </li>
            ))}
          </ul>
        </Card>

        {/* Example Request */}
        <Card
          icon={<FiCode />}
          title="Example Request"
          iconBg="bg-green-500/10 text-green-400"
        >
          <pre className="bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
            {`fetch('${BASE_URL}/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization: Bearer <token>': 'ak_live_your_key_here'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@yourapp.com',
    password: 'password123'
  })
})`}
          </pre>

          <CopyButton
            full
            className="mt-3"
            text={`fetch('${BASE_URL}/register', { method: 'POST' })`}
          />
        </Card>
      </div>
    </div>
  );
};

export default Endpoints;

/* ===== Reusable Components ===== */

const Card = ({ icon, title, iconBg, children }) => (
  <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition">
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-white">{title}</h4>
    </div>
    {children}
  </div>
);

const CopyButton = ({ text, full = false, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
