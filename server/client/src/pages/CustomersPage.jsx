import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/customers");
      setCustomers(data);
    } catch (err) {
      setError("Не вдалося завантажити покупців");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цього покупця?")) return;

    try {
      await axios.delete(`http://localhost:5000/customers/${customerId}`);
      fetchCustomers();
    } catch (err) {
      alert("Не вдалося видалити покупця");
    }
  };

  const handleRoleChange = async (customerId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/customers/${customerId}/role`, {
        isAdmin: newRole === "Адміністратор",
      });
      fetchCustomers();
    } catch (err) {
      alert("Не вдалося оновити роль");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 bg-gray-50 min-h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">👥 Покупці</h2>
        <button
          onClick={() => navigate("/customers/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm sm:text-base"
        >
          ➕ Додати покупця
        </button>
      </div>

      {loading ? (
        <p>Завантаження…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600">Покупців ще немає.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Ім'я</th>
                <th className="text-left px-4 py-2 border">Email</th>
                <th className="text-left px-4 py-2 border">Телефон</th>
                <th className="text-left px-4 py-2 border">Роль</th>
                <th className="text-right px-4 py-2 border">Дії</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.email}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border">
                    <select
                      value={cust.isAdmin ? "Адміністратор" : "Покупець"}
                      onChange={(e) => handleRoleChange(cust._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Покупець">Покупець</option>
                      <option value="Адміністратор">Адміністратор</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border text-right">
                    <button
                      onClick={() => handleDelete(cust._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      🗑 Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
