import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import axios from "axios";
import { FaUserCircle, FaShoppingCart, FaCogs } from "react-icons/fa";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("Мій магазин");
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const PRODUCTS_PER_PAGE = 8;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  useEffect(() => {
    axiosInstance.get("/products").then((res) => setProducts(res.data));
    axiosInstance.get("/store-name").then((res) => {
      if (res.data.name) setStoreName(res.data.name);
    });

    const token = localStorage.getItem("customerToken");
    if (token) {
      axiosInstance
        .get("/customerAuth/customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCustomer(res.data.customer);
          return axiosInstance.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((res) => setCart(res.data.cart))
        .catch(() => {
          setCustomer(null);
          setCart([]);
          localStorage.removeItem("customerToken");
        });
    }
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("customerToken");
    if (!token) return navigate("/customerAuth");

    try {
      await axiosInstance.post(
        "/cart/add",
        { productId: product._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axiosInstance.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Помилка додавання до кошика", err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const timer = setTimeout(() => setShowDescription(true), 1000);
      return () => {
        clearTimeout(timer);
        setShowDescription(false);
      };
    } else {
      setShowDescription(false);
    }
  }, [hoveredIndex]);

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 md:px-10 lg:px-16 relative"
      style={{ background: "linear-gradient(135deg, #e5e5e5 0%, #bdbdbd 100%)" }}

    >
      {customer && (
        <div className="absolute top-4 left-4 flex flex-col items-center gap-2 text-white">
        <FaUserCircle
          size={40}
          className="cursor-pointer text-green-400 hover:text-green-500 drop-shadow-md transition-transform duration-300 transform hover:scale-110"
          onClick={() => navigate("/profile")}
        />
          <button
            onClick={() => {
              localStorage.removeItem("customerToken");
              setCustomer(null);
              setCart([]);
            }}
            className="text-sm underline hover:text-gray-200"
          >
            Вийти
          </button>
        </div>
      )}

      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 text-white text-sm">
        {customer ? (
          <>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded shadow hover:bg-gray-100"
            >
              <FaShoppingCart />
              <span>Кошик ({totalItems})</span>
            </button>
            {customer?.isAdmin && (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-900"
              >
                <FaCogs />
                <span>Адмін-панель</span>
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => navigate("/customerAuth")}
            className="underline hover:text-gray-200"
          >
            Вхід / Реєстрація
          </button>
        )}
      </div>

      <header className="text-center mb-10" style={{ paddingTop: "70px" }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
          {storeName}
        </h1>
      </header>

      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product, index) => (
            <div
              key={product._id}
              className="relative bg-white p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              tabIndex={0}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              {product.imageUrl && (
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.title}
                  className="h-40 object-contain mx-auto mb-3 rounded"
                  loading="lazy"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.title}
              </h3>

              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="mt-1">
                  <span className="line-through text-gray-500">{product.originalPrice} грн</span>
                  <br />
                  <span className="text-red-600 font-bold">{product.price} грн</span>
                </div>
              ) : (
                <p className="mt-1 text-gray-700 font-semibold">{product.price} грн</p>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                ➕ До кошика
              </button>

              <div
                className={`absolute inset-0 bg-white bg-opacity-95 p-4 rounded-lg flex flex-col justify-center text-center transition-opacity duration-500 ease-in-out
                ${hoveredIndex === index && showDescription ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{ zIndex: 10 }}
              >
                <p className="text-gray-800 whitespace-pre-wrap break-words">
                  {product.description || "Опис відсутній"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-600"
                } hover:bg-blue-700 hover:text-white transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        <footer className="mt-16 text-center text-white">
        <div className="flex justify-center gap-6 text-sm">
          <button onClick={() => navigate("/info/about")} className="underline hover:text-gray-200">
            Про нас
          </button>
          <button onClick={() => navigate("/info/privacy")} className="underline hover:text-gray-200">
            Політика конфіденційності
          </button>
          <button onClick={() => navigate("/info/contacts")} className="underline hover:text-gray-200">
            Контакти
          </button>
        </div>
      </footer>
      </main>
    </div>
  );
}
