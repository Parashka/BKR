import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfilePage() {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [phoneError, setPhoneError] = useState("");

  const token = localStorage.getItem("customerToken");

  useEffect(() => {
    axios
      .get("http://localhost:5000/customers/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomer(res.data.customer);
        setFormData({
          name: res.data.customer.name,
          phone: res.data.customer.phone || "",
        });
      });

    axios
      .get("http://localhost:5000/customers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data));
  }, [token]);

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, ""); // прибрати всі пробіли
    const regex = /^\+380\d{9}$/;
    if (!regex.test(cleaned)) return false;

    const validOperatorCodes = [
      "039", "050", "063", "066", "067", "068", "073",
      "091", "092", "093", "094", "095", "096", "097", "098", "099"
    ];

    const operatorCode = cleaned.slice(3, 6);
    return validOperatorCodes.includes(operatorCode);
  };

  const handleProfileUpdate = async () => {
    if (!formData.name.trim()) {
      return alert("Ім’я не може бути порожнім");
    }

    if (!validatePhone(formData.phone)) {
      setPhoneError("Номер повинен бути у форматі +380XXXXXXXXX та містити коректний код оператора");
      return;
    }

    setPhoneError("");

    try {
      const res = await axios.put(
        "http://localhost:5000/customers/update",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Дані оновлено успішно");
      setCustomer(res.data.customer);
      setEditing(false);
    } catch (err) {
      alert("Помилка при оновленні профілю");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:5000/customers/update-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Пароль змінено");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert("Не вдалося змінити пароль");
    }
  };

  if (!customer) return <div className="p-6 text-center">Завантаження...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Особистий кабінет</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Мій профіль</h2>
        {editing ? (
          <>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-2 border rounded px-3 py-2"
              placeholder="Ім'я"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (!validatePhone(e.target.value)) {
                  setPhoneError("Номер повинен бути у форматі +380XXXXXXXXX та містити коректний код оператора");
                } else {
                  setPhoneError("");
                }
              }}
              className="w-full mb-2 border rounded px-3 py-2"
              placeholder="Телефон"
            />
            {phoneError && (
              <p className="text-red-600 text-sm mb-2">{phoneError}</p>
            )}
            <button
              onClick={handleProfileUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Зберегти
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Скасувати
            </button>
          </>
        ) : (
          <>
            <p><strong>Ім'я:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Телефон:</strong> {customer.phone}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Редагувати
            </button>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Змінити пароль</h2>
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
          className="w-full mb-2 border rounded px-3 py-2"
          placeholder="Поточний пароль"
        />
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          className="w-full mb-2 border rounded px-3 py-2"
          placeholder="Новий пароль"
        />
        <button
          onClick={handlePasswordChange}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Змінити пароль
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Історія замовлень</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">Замовлень ще немає.</p>
        ) : (
          <ul className="divide-y">
            {orders.map((order) => (
              <li key={order._id} className="py-3">
                <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Сума:</strong> {order.totalPrice} грн</p>
                <p><strong>Статус:</strong> {order.status}</p>
                <p><strong>Оплата:</strong> {order.paymentMethod === 'online' ? 'Онлайн' : 'Готівка'}</p>
                <p className="mt-2"><strong>Товари:</strong></p>
                <ul className="list-disc ml-6">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.title} — {item.quantity} шт</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
