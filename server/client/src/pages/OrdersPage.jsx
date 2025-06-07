import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/orders");
        setOrders(data);
      } catch (err) {
        setError("Не вдалося завантажити замовлення");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити це замовлення?")) return;

    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Не вдалося оновити статус");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 bg-gray-50 min-h-screen max-w-screen-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">📦 Активні замовлення</h2>

      {loading ? (
        <p>Завантаження…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">Немає активних замовлень.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Загальна інформація</th>
                <th className="text-left px-4 py-2 border">Покупець</th>
                <th className="text-left px-4 py-2 border">Товари</th>
                <th className="text-left px-4 py-2 border">Сума</th>
                <th className="text-left px-4 py-2 border">Оплачено?</th>
                <th className="text-left px-4 py-2 border">Статус</th>
                <th className="text-center px-2 py-2 border w-12">🗑</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border whitespace-pre-line text-gray-800">
                    <div><strong>Місто:</strong> {order.city || "—"}</div>
                    <div><strong>Оплата:</strong> {order.paymentMethod === "cash" ? "Готівка" : "Онлайн"}</div>
                    <div><strong>Відділення:</strong> {order.novaPoshtaOffice?.split(":")[0] || "—"}</div>
                    <div className="text-gray-600">{order.novaPoshtaOffice}</div>
                  </td>
                  <td className="px-4 py-2 border">{order.customerName}</td>
                  <td className="px-4 py-2 border">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.title} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border">{order.totalPrice} грн</td>
                  <td>{order.paid ? "Так" : "Ні"}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Очікує">Очікує</option>
                        <option value="Активно">Активне</option>
                        <option value="Виконано">Виконано</option>
                      </select>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          order.status === "Очікує"
                            ? "bg-red-500"
                            : order.status === "Активно"
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        }`}
                      />
                    </div>
                  </td>

                  <td className="px-2 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Видалити"
                    >
                      🗑
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
