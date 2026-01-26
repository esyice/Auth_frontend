import { useEffect, useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import { FiUser, FiShield, FiBarChart2 } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        // 🔥 THIS IS THE FIX
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("auth");
          window.location.href = "/login";
          return null;
        }

        return res.json();
      })
      .then((json) => {
        if (!json) return;
        setData(json);
        console.log(json);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No dashboard data</div>;
  console.log("dashboard data ", data);

  // Fallback to default data if API call fails
  const DEFAULT_DASHBOARD = {
    token: {
      active: false,
      expiry: "2026-01-31 23:59:59",
      lastIssued: "2026-01-01 10:15:22",
    },
    usage: {
      today: 124,
      limit: 1000,
    },
  };

  // Safely extract data with fallbacks

  const { user, token, usage } = data;

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
        { label: "Active Token", value: token.active ? "Yes" : "No" },
        { label: "Token Expiry", value: token.expiry },
        { label: "Last Token Issued", value: token.lastIssued },
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
