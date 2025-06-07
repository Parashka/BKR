import { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/products");
        setProducts(data);
      } catch (err) {
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuantityChange = async (id, newQty) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, quantity: newQty } : p))
      );
      await axios.put(`http://localhost:5000/products/${id}`, { quantity: newQty });
    } catch (err) {
      setError("Помилка оновлення");
    }
  };

  if (loading) return <p className="px-4 py-6">Завантаження…</p>;
  if (error) return <p className="px-4 py-6 text-red-500">{error}</p>;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-screen-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">📦 Інвентар</h2>

      <div className="overflow-x-auto bg-white shadow rounded border">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Назва</th>
              <th className="p-3 border w-40">Кількість</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3 border">{p.title}</td>
                <td className="p-3 border">
                  <input
                    type="number"
                    min={0}
                    value={p.quantity ?? 0}
                    onChange={(e) =>
                      handleQuantityChange(p._id, Number(e.target.value))
                    }
                    className="w-24 border rounded px-2 py-1 text-center text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
