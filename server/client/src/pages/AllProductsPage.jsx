import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(() => alert("Помилка при завантаженні товарів"));
  }, []);

  useEffect(() => {
    const filtered = products.filter(prod =>
      prod.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Ви впевнені, що хочете видалити цей товар?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      const updated = products.filter(p => p._id !== id);
      setProducts(updated);
      setFilteredProducts(updated);
    } catch {
      alert("Помилка при видаленні");
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-center sm:text-left">📦 Усі товари</h2>
        <button
          onClick={() => navigate("/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 w-full sm:w-auto"
        >
          ➕ Додати товар
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Пошук товару за назвою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {currentItems.length === 0 ? (
        <p className="text-gray-600 text-center">Товарів не знайдено.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border">Назва</th>
                <th className="text-left px-4 py-2 border">Ціна</th>
                <th className="text-left px-4 py-2 border">Кількість</th>
                <th className="text-left px-4 py-2 border">Опис</th>
                <th className="text-left px-4 py-2 border">Дії</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(prod => (
                <tr key={prod._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{prod.title}</td>
                  <td className="px-4 py-2 border">{prod.price} грн</td>
                  <td className="px-4 py-2 border">{prod.quantity}</td>
                  <td className="px-4 py-2 border max-w-xs truncate">{prod.description}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => navigate(`/edit-product/${prod._id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                      >
                        ✏️ Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        🗑 Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {currentPage > 1 && (
            <button
              onClick={handlePrevPage}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            >
              ⬅️ Попередня сторінка
            </button>
          )}
          {currentPage < totalPages && (
            <button
              onClick={handleNextPage}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            >
              Наступна сторінка➡️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
