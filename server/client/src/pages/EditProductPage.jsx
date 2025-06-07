import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setQuantity(res.data.quantity);
      })
      .catch(() => alert("Помилка при завантаженні товару"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        title,
        description,
        price,
        quantity,
      });
      navigate("/products");
    } catch (error) {
      alert("Помилка при оновленні товару");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 min-h-screen bg-gray-50">
      <div className="bg-white shadow rounded-lg p-6 sm:p-8 max-w-screen-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">✏️ Редагувати товар</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-sm sm:text-base">Назва товару</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm sm:text-base">Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm sm:text-base">Ціна</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block font-medium mb-1 text-sm sm:text-base">Кількість</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 text-sm sm:text-base"
          >
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
}
