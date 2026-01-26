// src/components/DashboardCard.jsx
import React from "react";

const ICON_BG = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  purple:
    "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  green: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
};

const DashboardCard = ({ title, items, progress, icon, accent = "blue" }) => {
  return (
    <div
      className="
        rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        p-6
        flex flex-col justify-between
        shadow-sm hover:shadow-md
        transition-shadow
        min-h-[260px]
      "
    >
      {/* ===== Header ===== */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          {icon && (
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${ICON_BG[accent]}
              `}
            >
              {icon}
            </div>
          )}

          <h4 className="font-semibold text-gray-900 dark:text-slate-100">
            {title}
          </h4>
        </div>

        {/* ===== Content ===== */}
        <div className="space-y-4">
          {items.map(({ label, value, isBadge }) => (
            <div key={label}>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {label}
              </p>

              {isBadge ? (
                <span
                  className="
                    inline-flex items-center
                    px-3 py-1 mt-1
                    rounded-full text-sm font-medium
                    bg-green-100 text-green-700
                    dark:bg-green-500/20 dark:text-green-400
                  "
                >
                  {value}
                </span>
              ) : (
                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Progress ===== */}
      {progress !== undefined && (
        <div className="pt-6">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Usage</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
