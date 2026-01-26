import { useState } from "react";
import { FiKey, FiCopy, FiRefreshCcw, FiTrash2, FiPlus } from "react-icons/fi";

/* ===== DEFAULT DATA (remove later in one go) ===== */
const DEFAULT_KEYS = [
  {
    id: 1,
    name: "Primary Key",
    key: "sk_live_9f8sdf7sdf87sdf",
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    name: "Staging Key",
    key: "sk_test_2ksdf98sdf8sd",
    createdAt: "2025-01-20",
  },
];

const ApiKeys = () => {
  const [keys] = useState(DEFAULT_KEYS);

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">API Keys & Tokens</h3>
        <p className="text-sm text-slate-400">
          Manage your API keys and authentication tokens.
        </p>
      </div>

      {/* ===== Actions ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <PrimaryButton icon={<FiPlus />} label="Generate New Key" />
        <DangerButton icon={<FiTrash2 />} label="Revoke All Keys" />
      </div>

      {/* ===== Keys List ===== */}
      <div className="space-y-4">
        {keys.map((item) => (
          <KeyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ApiKeys;

/* ================== Components ================== */

const KeyCard = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-[#020617] border border-slate-800 rounded-xl p-4 sm:p-5">
      {/* Mobile-first stack */}
      <div className="space-y-4">
        {/* Key Info */}
        <div>
          <p className="text-xs text-slate-400">API Key Name</p>
          <p className="text-sm font-medium text-white">{item.name}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Key</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <code className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-sm break-all">
              {item.key}
            </code>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2
                ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              <FiCopy />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800">
          <SecondaryButton icon={<FiRefreshCcw />} label="Regenerate" />
          <DangerOutlineButton icon={<FiTrash2 />} label="Revoke" />
        </div>
      </div>
    </div>
  );
};

/* ================== Buttons ================== */

const PrimaryButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium w-full sm:w-auto">
    {icon}
    {label}
  </button>
);

const SecondaryButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium w-full sm:w-auto">
    {icon}
    {label}
  </button>
);

const DangerButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium w-full sm:w-auto">
    {icon}
    {label}
  </button>
);

const DangerOutlineButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium w-full sm:w-auto">
    {icon}
    {label}
  </button>
);
