import { useEffect, useState } from "react";
import axios from "axios";

export default function AbandonedOrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAbandonedCarts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/customers?withCart=true");
        const filtered = data.filter(customer =>
          customer.cart && customer.cart.some(item => item.productId && item.quantity > 0)
        );
        setCustomers(filtered);
      } catch (err) {
        setError("Не вдалося завантажити покинуті кошики");
      } finally {
        setLoading(false);
      }
    };

    fetchAbandonedCarts();
  }, []);

  const handleSendReminder = async (customerId) => {
    try {
      await axios.post(`http://localhost:5000/customers/${customerId}/send-reminder`);
      alert("Нагадування успішно відправлено");
    } catch (error) {
      alert("Помилка при відправленні нагадування");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 Покинуті кошики</h2>

      {loading ? (
        <p className="text-center">Завантаження…</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600 text-center">Покинутих кошиків немає.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left whitespace-nowrap">ПІБ</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Телефон</th>
                <th className="px-4 py-2 border text-left whitespace-nowrap">Кошик</th>
                <th className="px-2 py-2 border text-center">Нагадати</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border text-gray-700 space-y-1">
                    {cust.cart.map((item) =>
                      item.productId ? (
                        <div key={item.productId._id}>
                          {item.productId.title} &times; {item.quantity}
                        </div>
                      ) : null
                    )}
                  </td>
                  <td className="px-2 py-2 border text-center">
                    <button
                      onClick={() => handleSendReminder(cust._id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Нагадати"
                    >
                      📧
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
