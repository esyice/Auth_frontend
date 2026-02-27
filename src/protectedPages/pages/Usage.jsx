import { FiBarChart2, FiClock, FiInfo, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/Context.js";

const Usage = () => {
  const { apikeysuseages } = useAuth();

  // Always render UI. Default to safe values.
  const usage = apikeysuseages || {
    today: 0,
    month: 0,
    total: 0,
    dailyLimit: 1000,
    perMinute: 0,
    perHour: 0,
  };

  const today = usage.today ?? 0;
  const dailyLimit = usage.dailyLimit || 1000;
  const month = usage.month ?? 0;
  const total = usage.total ?? 0;
  const perMinute = usage.perMinute ?? 0;
  const perHour = usage.perHour ?? 0;

  const dailyPercent =
    dailyLimit > 0 ? Math.min(100, Math.round((today / dailyLimit) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Usage Analytics</h3>
        <p className="text-sm text-slate-400">
          Monitor your API usage and rate limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Request Counts */}
        <Card
          title="Request Counts"
          icon={<FiBarChart2 />}
          iconBg="bg-blue-500/10 text-blue-400"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400">Requests Today</p>
              <p className="text-3xl font-bold text-white">{today}</p>
              <Progress value={dailyPercent} color="bg-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Metric label="This Month" value={month} />
              <Metric label="Total Requests" value={total} />
            </div>
          </div>
        </Card>

        {/* Rate Limits */}
        <Card
          title="Rate Limits"
          icon={<FiClock />}
          iconBg="bg-purple-500/10 text-purple-400"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400">Requests Per Day</p>
              <p className="text-3xl font-bold text-white">{dailyLimit}</p>
              <Progress value={dailyPercent} color="bg-purple-600" />
              <p className="text-sm text-slate-400 mt-1">
                {today} used today ({dailyPercent}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Metric label="Per Minute" value={perMinute} />
              <Metric label="Per Hour" value={perHour} />
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2 text-amber-400">
              <FiInfo className="mt-0.5 shrink-0" />
              <p className="text-sm">Alerts trigger at 80% of daily limit.</p>
            </div>
          </div>
        </Card>

        {/* Usage Trends */}
        <Card
          title="Usage Trends"
          icon={<FiTrendingUp />}
          iconBg="bg-green-500/10 text-green-400"
          full
        >
          <div className="h-56 sm:h-64 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-center px-4">
            <div className="space-y-2">
              <FiTrendingUp className="text-4xl text-slate-600 mx-auto" />
              <p className="text-slate-400">
                Interactive chart will appear here
              </p>
              <p className="text-xs text-slate-500">
                (Requires chart library + real data)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Usage;

/* ================= Reusable UI ================= */

const Card = ({ title, icon, iconBg, children, full }) => (
  <div
    className={`bg-[#020617] border border-slate-800 rounded-xl p-4 sm:p-6 ${
      full ? "lg:col-span-2" : ""
    }`}
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

const Metric = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Progress = ({ value, color }) => (
  <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
    <div
      className={`${color} h-2 rounded-full transition-all`}
      style={{ width: `${value}%` }}
    />
  </div>
);
