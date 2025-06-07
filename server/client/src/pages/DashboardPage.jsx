import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [storeName, setStoreName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/store-name").then((res) => {
      setStoreName(res.data.name || "");
    });

    axios.get("http://localhost:5000/analytics/registrations").then((res) =>
      setRegistrations(res.data)
    );

    axios.get("http://localhost:5000/analytics/orders").then((res) =>
      setOrders(res.data)
    );
  }, []);

  const handleSave = async () => {
    if (!storeName.trim()) return;
    setSaving(true);
    try {
      const { data } = await axios.put("http://localhost:5000/store-name", {
        name: storeName,
      });
      setMessage(data.message);
    } catch {
      setMessage("Помилка збереження");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Панель адміністрування ShopManager
      </h2>

      <label className="block mb-2 font-semibold text-sm sm:text-base">
        Назва магазину:
      </label>

      <input
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4 text-sm sm:text-base"
        placeholder="Введіть назву магазину"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"
      >
        💾 Зберегти
      </button>

      {message && <p className="mt-2 text-green-600 text-sm">{message}</p>}

      {/* Графіки */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Реєстрації користувачів</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrations}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Замовлення</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orders}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
