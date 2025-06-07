import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaStore,
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaChartBar,
  FaTags,
  FaCartPlus,
  FaGift,
  FaClipboardList,
  FaShoppingBasket,
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMain, setActiveMain] = useState("");

  const isSubActive = (path) => location.pathname === path;

  useEffect(() => {
    if (location.pathname.startsWith("/orders")) {
      setActiveMain("orders");
    } else if (location.pathname.startsWith("/products") || location.pathname.startsWith("/gift-cards")) {
      setActiveMain("products");
    } else if (location.pathname.startsWith("/customers")) {
      setActiveMain("customers");
    } else if (location.pathname.startsWith("/analytics")) {
      setActiveMain("analytics");
    } else {
      setActiveMain("");
    }
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const buttonClass = (isActive) =>
    `text-left w-full px-4 py-2 rounded transition flex items-center gap-2 ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
    }`;

  const isCurrent = (prefix) => location.pathname.startsWith(prefix);

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 fixed overflow-y-auto">
      <div className="mb-6 text-2xl font-bold flex items-center justify-center">🛒</div>

      <button
        onClick={() => handleNavigate("/dashboard")}
        className={buttonClass(location.pathname === "/dashboard")}
      >
        <FaTachometerAlt />
        Головна
      </button>

      <button
        onClick={() => handleNavigate("/")}
        className={buttonClass(location.pathname === "/store")}
      >
        <FaStore />
        Мій магазин
      </button>

      <button
        onClick={() => {
          setActiveMain((prev) => (prev === "orders" ? "" : "orders"));
          navigate("/orders");
        }}
        className={buttonClass(isCurrent("/orders"))}
      >
        <FaCartPlus />
        Замовлення
      </button>
      {activeMain === "orders" && (
        <div className="ml-6 text-sm flex flex-col gap-1">
          <button
            onClick={() => handleNavigate("/orders/drafts")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/orders/drafts") ? "font-bold text-blue-400" : ""
            }`}
          >
            <FaClipboardList />
            Створити вручну
          </button>
          <button
            onClick={() => handleNavigate("/orders/abandoned")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/orders/abandoned") ? "font-bold text-blue-400" : ""
            }`}
          >
            <FaShoppingBasket />
            Покинуті кошики
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setActiveMain((prev) => (prev === "products" ? "" : "products"));
          handleNavigate("/products");
        }}
        className={buttonClass(isCurrent("/products") || isCurrent("/gift-cards"))}
      >
        <FaBoxOpen />
        Товари
      </button>
      {activeMain === "products" && (
        <div className="ml-6 text-sm flex flex-col gap-1">
          <button
            onClick={() => handleNavigate("/products/inventory")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/products/inventory") ? "font-bold text-blue-400" : ""
            }`}
          >
            <FiPackage />
            Інвентар
          </button>
          <button
            onClick={() => handleNavigate("/gift-cards/send")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/gift-cards/send") ? "font-bold text-blue-400" : ""
            }`}
          >
            <FaGift />
            Подарункові картки
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setActiveMain((prev) => (prev === "customers" ? "" : "customers"));
          handleNavigate("/customers");
        }}
        className={buttonClass(isCurrent("/customers"))}
      >
        <FaUsers />
        Покупці
      </button>

      <button
        onClick={() => handleNavigate("/discounts")}
        className={buttonClass(location.pathname === "/discounts")}
      >
        <FaTags />
        Знижки
      </button>

      <button
        onClick={() => setActiveMain((prev) => (prev === "analytics" ? "" : "analytics"))}
        className={buttonClass(isCurrent("/analytics"))}
      >
        <FaChartBar />
        Аналітика
      </button>
      {activeMain === "analytics" && (
        <div className="ml-6 text-sm flex flex-col gap-1">
          <button
            onClick={() => handleNavigate("/analytics/reports")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/analytics/reports") ? "font-bold text-blue-400" : ""
            }`}
          >
            <span>📄</span>
            Звіти
          </button>
          <button
            onClick={() => handleNavigate("/analytics/realtime")}
            className={`text-left px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-2 ${
              isSubActive("/analytics/realtime") ? "font-bold text-blue-400" : ""
            }`}
          >
            <span>⏱</span>
            Аналіз у реальному часі
          </button>

        </div>
        
      )}
    
    </aside>
  );
}
