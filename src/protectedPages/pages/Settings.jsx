import {
  FiUser,
  FiEdit,
  FiKey,
  FiAlertTriangle,
  FiTrash2,
  FiDownload,
  FiSlash,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, deactivateAccount, logout } = useAuth();

  // Deactivate Account Handler
  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "This will deactivate your account.\n\nYou will be logged out immediately.",
    );

    if (!confirmed) return;

    try {
      await deactivateAccount();
      logout(); // force logout after deactivation
    } catch (err) {
      console.error("Account deactivation failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Account Settings</h3>
        <p className="text-sm text-slate-400">
          Manage your account and security preferences.
        </p>
      </div>

      {/* ===== Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ===== Profile Card ===== */}
        <Card
          title="Profile"
          icon={<FiUser />}
          iconBg="bg-blue-500/10 text-blue-400"
        >
          <div className="space-y-4">
            <Info label="Name" value={user?.name} />
            <Info label="Email" value={user?.email} />
          </div>
        </Card>

        {/* ===== Account Actions ===== */}
        <Card
          title="Account"
          icon={<FiAlertTriangle />}
          iconBg="bg-red-500/10 text-red-400"
        >
          <div className="space-y-6">
            {/* Danger Notice */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <FiAlertTriangle className="text-red-400 mt-1 shrink-0" />
              <div>
                <p className="font-medium text-red-400">Danger Zone</p>
                <p className="text-sm text-red-300 mt-1">
                  These actions are irreversible. Proceed with caution.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <DangerButton
                icon={<FiTrash2 />}
                label="Delete Account"
                onClick={handleDeactivateAccount}
              />

              <SecondaryButton icon={<FiDownload />} label="Export Data" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

/* ================== Reusable UI ================== */

const Card = ({ title, icon, iconBg, children }) => (
  <div
    className={`bg-[#020617] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm `}
  >
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

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-medium text-white mt-1">{value}</p>
  </div>
);

/* ===== Buttons ===== */

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium w-full sm:w-auto">
    {icon}
    {label}
  </button>
);

const SecondaryButton = ({ icon, label }) => (
  <button className="hidden items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium w-full sm:w-auto">
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
