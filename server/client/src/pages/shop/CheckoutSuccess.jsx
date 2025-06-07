import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("customerToken");

  useEffect(() => {
    const createOrderFromStorage = async () => {
      const stored = localStorage.getItem("pendingOrder");
      if (!stored) return;

      try {
        const orderData = JSON.parse(stored);

        await axios.post("http://localhost:5000/orders", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.post("http://localhost:5000/cart/clear", null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("pendingOrder");
      } catch (err) {
        console.error("❌ Помилка створення замовлення після оплати:", err);
        alert("Замовлення не було збережене. Зверніться до підтримки.");
      }
    };

    createOrderFromStorage();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-green-300 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-5xl font-extrabold text-green-700 mb-8 select-none">
          ✅ Оплата успішна!
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Дякуємо за ваше замовлення. Ваш платіж було успішно оброблено.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75"
        >
          Повернутись до магазину
        </button>
      </div>
    </div>
  );
}
