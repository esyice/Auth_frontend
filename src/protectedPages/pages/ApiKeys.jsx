import { useState } from "react";
import { FiKey, FiCopy, FiRefreshCcw, FiTrash2, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const ApiKeys = () => {
  const [keys] = useState(); // remove later
  const [open, setOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expiryType, setExpiryType] = useState("1m"); // default 1 month
  const [customDate, setCustomDate] = useState("");

  const { createApiKeys, refreshDashboard, tokenInfo, revokeAllKeys } =
    useAuth();

  const handleGenerate = async () => {
    if (!keyName.trim()) return;

    const payload = {
      name: keyName,
      expiryType, // "1d" | "1m" | "3m" | "6m" | "1y" | "none" | "custom"
      expiresAt: expiryType === "custom" ? customDate : null,
    };

    try {
      setSubmitting(true);
      await createApiKeys(payload);
      await refreshDashboard();
      setOpen(false);
      setKeyName("");
      setExpiryType("1m");
      setCustomDate("");
    } catch (err) {
      console.error("Create key failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlerevokeAllKeys = async () => {
    console.log("btm clicked");

    try {
      await revokeAllKeys();
      console.log("key revocked successfully");

      await refreshDashboard();
    } catch (err) {
      console.error("Revoke all keys failed", err);
    }
  };

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
        <PrimaryButton
          icon={<FiPlus />}
          label="Generate New Key"
          onClick={() => setOpen(true)}
        />
        <DangerButton
          icon={<FiTrash2 />}
          label="Revoke All Keys"
          onClick={handlerevokeAllKeys}
        />
      </div>

      {/* ===== Keys List ===== */}
      <div className="space-y-4">
        {tokenInfo &&
          tokenInfo.map((item) => <KeyCard key={item.id} item={item} />)}
      </div>

      {/* ===== Generate Key Modal ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* ===== Modal ===== */}
          <div className="relative w-full max-w-sm bg-[#020617] border border-slate-800 rounded-xl p-6 mx-4">
            <h4 className="text-lg font-semibold text-white mb-2">
              Generate API Key
            </h4>

            <p className="text-sm text-slate-400 mb-4">
              Give your API key a descriptive name and expiry.
            </p>

            {/* ===== Key Name ===== */}
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. Production Key"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm mb-4"
            />

            {/* ===== Expiry Options ===== */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Expiry</p>

              <select
                value={expiryType}
                onChange={(e) => setExpiryType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm"
              >
                <option value="1d">1 Day</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
                <option value="none">No Expiry</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            {/* ===== Custom Date Picker ===== */}
            {expiryType === "custom" && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">
                  Select expiry date
                </p>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800
          rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            )}

            {/* ===== Actions ===== */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg
        bg-slate-800 hover:bg-slate-700
        text-slate-300 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                disabled={submitting}
                className="flex-1 px-4 py-2 rounded-lg
        bg-blue-600 hover:bg-blue-700
        text-white text-sm
        disabled:opacity-50"
              >
                {submitting ? "Generating..." : "Generate Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;

/* ================== Key Card ================== */

const KeyCard = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-[#020617] border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="space-y-4">
        {/* Key Name */}
        <div>
          <p className="text-xs text-slate-400">API Key Name</p>
          <p className="text-sm font-medium text-white">{item.name}</p>
        </div>

        {/* Key */}
        <div>
          <p className="text-xs text-slate-400 mb-1">Key</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <code
              className="flex-1 bg-slate-900 border border-slate-800
              rounded px-3 py-2 text-slate-200 font-mono text-sm break-all"
            >
              {item.key}
            </code>

            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                flex items-center justify-center gap-2
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

        {/* Expires At + Actions */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          {/* Row / Column container */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: Label + Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-xs text-slate-400">Expires At</p>
              <p className="text-sm font-medium text-white">
                {item.expiresAt ?? "No Expiry"}
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <SecondaryButton icon={<FiRefreshCcw />} label="Regenerate" />
              <DangerOutlineButton icon={<FiTrash2 />} label="Revoke" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================== Buttons ================== */

const PrimaryButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2
      px-4 py-2 rounded-lg
      bg-blue-600 hover:bg-blue-700
      text-white text-sm font-medium
      w-full sm:w-auto"
  >
    {icon}
    {label}
  </button>
);

const SecondaryButton = ({ icon, label }) => (
  <button
    className="flex items-center justify-center gap-2
    px-4 py-2 rounded-lg
    bg-slate-800 hover:bg-slate-700
    text-slate-200 text-sm font-medium
    w-full sm:w-auto"
  >
    {icon}
    {label}
  </button>
);

const DangerButton = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-2
    px-4 py-2 rounded-lg
    bg-red-600 hover:bg-red-700
    text-white text-sm font-medium
    w-full sm:w-auto"
  >
    {icon}
    {label}
  </button>
);

const DangerOutlineButton = ({ icon, label }) => (
  <button
    className="flex items-center justify-center gap-2
    px-4 py-2 rounded-lg
    border border-red-500/30
    text-red-400 hover:bg-red-500/10
    text-sm font-medium
    w-full sm:w-auto"
  >
    {icon}
    {label}
  </button>
);
