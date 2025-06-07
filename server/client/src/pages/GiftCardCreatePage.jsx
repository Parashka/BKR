import { useState } from "react";
import axios from "axios";

export default function GiftCardCreatePage() {
  const [form, setForm] = useState({
    code: "",
    title: "",
    type: "",
    discountPercent: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: form.code,
        title: form.title,
        type: form.type,
      };

      if (form.type === "product-discount" || form.type === "cart-discount") {
        payload.discountPercent = Number(form.discountPercent);
      }

      await axios.post("http://localhost:5000/gift-cards", payload);
      setMessage("✅ Картку створено успішно!");
      setForm({ code: "", title: "", type: "", discountPercent: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Помилка при створенні картки");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-full sm:max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        🎁 Створити подарункову картку
      </h2>

      {message && <p className="mb-4 text-blue-600 text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="code"
          placeholder="Код картки (наприклад: GIFT100)"
          value={form.code}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm sm:text-base"
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Назва картки"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm sm:text-base"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded text-sm sm:text-base"
          required
        >
          <option value="">Оберіть тип картки</option>
          <option value="product-discount">Знижка на товар</option>
          <option value="free-shipping">Безкоштовна доставка</option>
          <option value="cart-discount">Знижка на кошик</option>
        </select>

        {(form.type === "product-discount" || form.type === "cart-discount") && (
          <input
            type="number"
            name="discountPercent"
            placeholder="Відсоток знижки (%)"
            min="1"
            max="100"
            value={form.discountPercent}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            required
          />
        )}

        <button
          type="submit"
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
        >
          ➕ Створити картку
        </button>
      </form>
    </div>
  );
}
