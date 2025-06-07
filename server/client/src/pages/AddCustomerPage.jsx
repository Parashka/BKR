import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCustomerPage() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${form.lastName} ${form.firstName} ${form.middleName}`.trim();

    if (!form.lastName || !form.firstName || !form.phone) {
      return setError("Прізвище, ім’я та телефон обов’язкові");
    }

    try {
      await axios.post("http://localhost:5000/customers", {
        name: fullName,
        email: form.email,
        phone: form.phone,
      });
      navigate("/customers");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Помилка при додаванні покупця");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">➕ Додати покупця</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="lastName"
            placeholder="Прізвище"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="Ім’я"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="По батькові"
            value={form.middleName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Номер телефону"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            💾 Зберегти
          </button>
        </form>
      </div>
    </div>
  );
}
