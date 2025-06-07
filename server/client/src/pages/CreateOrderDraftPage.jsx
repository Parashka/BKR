import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateOrderDraftPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((res) => setProducts(res.data));
    axios.get("http://localhost:5000/customers").then((res) => setCustomers(res.data));
  }, []);

  const handleAddProduct = (id) => {
    const existing = selectedItems.find((item) => item._id === id);
    if (!existing) {
      const product = products.find((p) => p._id === id);
      setSelectedItems([
        ...selectedItems,
        { ...product, quantity: 1, availableQuantity: product.quantity },
      ]);
    }
  };

  const handleQuantityChange = (id, qty) => {
    const product = selectedItems.find((item) => item._id === id);
    const maxQty = product?.availableQuantity || 1;
    const safeQty = Math.min(Number(qty), maxQty);

    setSelectedItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const handleCustomerInput = (e) => {
    setNewCustomerData({ ...newCustomerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      return setError("Виберіть хоча б один товар");
    }

    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      items: selectedItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        _id: item._id,
      })),
      totalPrice,
      status: "Очікує",
      isNewCustomer,
    };

    if (isNewCustomer) {
      const { name, email, phone } = newCustomerData;
      if (!name || !phone) return setError("Заповніть ПІБ і номер телефону");

      if (email) {
        const emailUsed = customers.some((c) => c.email === email);
        if (emailUsed) {
          return setError("Цей email вже зареєстровано іншим покупцем");
        }
      }

      order.customerName = name;
      order.customerEmail = email;
      order.customerPhone = phone;
    } else {
      const customer = customers.find((c) => c._id === selectedCustomerId);
      if (!customer) return setError("Оберіть покупця");

      order.customerName = customer.name;
      order.customerEmail = customer.email;
      order.customerPhone = customer.phone;
    }

    try {
      await axios.post("http://localhost:5000/orders", order);
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Помилка при створенні замовлення");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-full sm:max-w-xl md:max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">📝 Створити замовлення</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Вибір товарів */}
        <div>
          <label className="font-semibold">Товари:</label>
          <select
            onChange={(e) => handleAddProduct(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm sm:text-base"
          >
            <option value="">Оберіть товар…</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} — {p.price} грн
              </option>
            ))}
          </select>

          {selectedItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full mt-3 border text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Назва</th>
                    <th className="p-2 border">Кількість</th>
                    <th className="p-2 border">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr key={item._id}>
                      <td className="p-2 border">{item.title}</td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          min="1"
                          max={item.availableQuantity}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, e.target.value)
                          }
                          className="w-16 text-center border px-1 rounded"
                        />
                      </td>
                      <td className="p-2 border">{item.quantity * item.price} грн</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Тип покупця */}
        <div className="space-y-2">
          <label className="font-semibold">Тип покупця:</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <label>
              <input
                type="radio"
                checked={isNewCustomer}
                onChange={() => setIsNewCustomer(true)}
              />{" "}
              Новий користувач
            </label>
            <label>
              <input
                type="radio"
                checked={!isNewCustomer}
                onChange={() => setIsNewCustomer(false)}
              />{" "}
              Постійний клієнт
            </label>
          </div>
        </div>

        {isNewCustomer ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="ПІБ"
              value={newCustomerData.name}
              onChange={handleCustomerInput}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newCustomerData.email}
              onChange={handleCustomerInput}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            />
            <input
              type="tel"
              name="phone"
              placeholder="+380XXXXXXXXX"
              pattern="\+380\d{9}"
              required
              value={newCustomerData.phone}
              onChange={handleCustomerInput}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            />
          </>
        ) : (
          <select
            className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Оберіть покупця…</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} / {c.email}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          ✅ Створити замовлення
        </button>
      </form>
    </div>
  );
}
