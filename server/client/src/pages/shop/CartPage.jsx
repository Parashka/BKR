import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("customerToken");

  useEffect(() => {
    if (!token) return navigate("/auth");

    axiosInstance
      .get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCartItems(res.data.cart))
      .catch(() => alert("Не вдалося завантажити кошик"));
  }, [token, navigate]);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    axiosInstance
      .post(
        "/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product && item.product._id === productId
              ? { ...item, quantity }
              : item
          )
        );
      });
  };

  const removeFromCart = (productId) => {
    axiosInstance
      .delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setCartItems((prev) =>
          prev.filter((item) => item.product && item.product._id !== productId)
        );
      });
  };

  const total = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-3">
          <FaShoppingCart className="text-blue-600" /> Ваш кошик
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Кошик порожній. Додайте товари 🛒
          </p>
        ) : (
          <div className="space-y-5">
           {cartItems.map(({ product, quantity }) =>
  product ? (
    <div
      key={product._id}
      className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg shadow-sm p-4 transition hover:shadow-md"
    >
      <div className="flex items-center gap-4 w-full sm:w-1/2 mb-3 sm:mb-0">
        {product.imageUrl && (
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.title}
            className="w-16 h-16 object-contain rounded-md border"
          />
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h2>
          <p className="text-gray-500">{product.price} грн / шт</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => updateQuantity(product._id, Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="font-semibold text-gray-700">
          {product.price * quantity} грн
        </span>
        <button
          onClick={() => removeFromCart(product._id)}
          className="text-red-600 hover:text-red-800 transition text-lg"
          title="Видалити"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  ) : null
)}

            <div className="flex justify-between items-center border-t pt-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800">Сума:</h3>
              <span className="text-xl font-bold text-blue-600">{total} грн</span>
            </div>

            <div className="text-right">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
              >
                🛍️ Оформити замовлення
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
