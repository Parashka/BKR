import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateDiscountPage() {
  const [form, setForm] = useState({
    percentage: "",
    productId: "",
  });

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Не вдалося завантажити товари"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.percentage || !form.productId) {
      return setError("Заповніть усі поля");
    }

    try {
      await axios.post("http://localhost:5000/discounts", {
        percentage: Number(form.percentage),
        productId: form.productId,
      });

      navigate("/discounts");
    } catch (err) {
      console.error(err);
      setError("Помилка при створенні знижки");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md md:max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">➕ Створити знижку</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="percentage"
          placeholder="Відсоток знижки (%)"
          min="1"
          max="100"
          value={form.percentage}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm sm:text-base"
        />

        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm sm:text-base"
        >
          <option value="">Оберіть товар</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Застосувати знижку
        </button>
      </form>
    </div>
  );
}
