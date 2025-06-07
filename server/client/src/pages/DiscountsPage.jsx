import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/discounts");
        setDiscounts(data);
      } catch (err) {
        setError("Не вдалося завантажити знижки");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Ви дійсно хочете видалити знижку?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/discounts/${id}`);
      setDiscounts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Помилка при видаленні знижки");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 bg-gray-50 min-h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">💸 Знижки</h2>
        <button
          onClick={() => navigate("/discounts/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
        >
          ➕ Створити знижку
        </button>
      </div>

      {loading ? (
        <p>Завантаження…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : discounts.length === 0 ? (
        <p className="text-gray-600">Знижок ще немає.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Назва товару</th>
                <th className="text-left px-4 py-2 border">Відсоток</th>
                <th className="text-left px-4 py-2 border">Дії</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{d.productId?.title || "—"}</td>
                  <td className="px-4 py-2 border">{d.percentage}%</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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
