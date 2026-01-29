import { useEffect, useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import { FiUser, FiShield, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Overview = () => {
  const { loading, user, meta } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">No dashboard data</div>;
  // console.log("dashboard data  form overvire", user);

  // Fallback to default data if API call fails
  const DEFAULT_DASHBOARD = {
    usage: {
      today: 124,
      limit: 1000,
    },
  };

  // Safely extract data with fallbacks

  const safeData = {
    usage: DEFAULT_DASHBOARD.usage,
  };

  const { usage } = safeData;

  const cards = [
    {
      title: "User Info",
      icon: <FiUser size={20} />,
      accent: "blue",
      items: [
        { label: "Name", value: user.name },
        { label: "Email", value: user.email },
        { label: "User ID", value: user.id },
        { label: "Account Status", value: user.status, isBadge: true },
      ],
    },
    {
      title: "Token Status",
      icon: <FiShield size={20} />,
      accent: "purple",
      items: [
        { label: "Active Token", value: meta.totalTokens > 0 ? "Yes" : "No" },
        { label: "Number of Active Token", value: meta.totalTokens },
        {
          label: "Last Token Issued",
          value: meta?.lastIssuedToken?.issuedAt ?? "N/A",
        },
      ],
    },
    {
      title: "Usage Snapshot",
      icon: <FiBarChart2 size={20} />,
      accent: "amber",
      items: [
        { label: "Requests Today", value: `${usage.today} / ${usage.limit}` },
        { label: "Rate Limit", value: `${usage.limit} requests/day` },
      ],
      progress: Math.round((usage.today / usage.limit) * 100),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="p-6 max-w-7xl mx-auto bg-transparent">
          <h3 className="text-lg font-semibold mb-1 text-slate-100">
            Welcome back, {user.name}
          </h3>

          <p className="text-slate-400 mb-6">
            Monitor your authentication API usage and manage your keys.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {cards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
