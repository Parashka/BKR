import { useEffect, useState } from "react";
import axios from "axios";

export default function GiftCardSend() {
  const [giftCards, setGiftCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const [sendToAll, setSendToAll] = useState(false);
  const [sendToAbandoned, setSendToAbandoned] = useState(false);
  const [sendToSelected, setSendToSelected] = useState(false);

  const [tab, setTab] = useState("send"); // "send" | "delete"
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:5000/gift-cards").then((res) => {
      setGiftCards(res.data);
    });

    axios.get("http://localhost:5000/customers").then((res) => {
      setCustomers(res.data);
    });
  }, []);

  const handleToggleCustomer = (customer) => {
    setSelectedCustomers((prev) =>
      prev.some((c) => c._id === customer._id)
        ? prev.filter((c) => c._id !== customer._id)
        : [...prev, customer]
    );
  };

  const handleSend = async () => {
    if (!selectedCardId) return alert("Оберіть подарункову картку");

    try {
      const res = await axios.post("http://localhost:5000/gift-cards/send", {
        giftCardId: selectedCardId,
        sendToAll,
        sendToAbandoned,
        customerIds: sendToSelected ? selectedCustomers.map((c) => c._id) : [],
      });

      alert(res.data.message || "Надіслано!");
    } catch (err) {
      console.error(err);
      alert("Помилка при надсиланні");
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю картку?")) return;

    try {
      await axios.delete(`http://localhost:5000/gift-cards/${id}`);
      setGiftCards((prev) => prev.filter((card) => card._id !== id));
    } catch (err) {
      alert("Помилка при видаленні картки");
    }
  };

  const cardsPerPage = 5;
  const paginatedCards = giftCards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎁 Подарункові картки</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "send" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("send")}
        >
          Відправити
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "delete" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("delete")}
        >
          Видалити
        </button>
      </div>

      {/* Tab: Send */}
      {tab === "send" && (
        <>
          {/* Вибір картки */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Оберіть подарункову картку:</label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Не обрано --</option>
              {giftCards.map((card) => (
                <option key={card._id} value={card._id}>
                  {card.title} – {card.amount || card.discountPercent + "%"}
                </option>
              ))}
            </select>
          </div>

          {/* Чекбокси */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendToAll}
                onChange={() => {
                  setSendToAll(!sendToAll);
                  setSendToSelected(false);
                  setSendToAbandoned(false);
                }}
              />
              Надіслати всім покупцям
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendToAbandoned}
                onChange={() => {
                  setSendToAbandoned(!sendToAbandoned);
                  setSendToAll(false);
                  setSendToSelected(false);
                }}
              />
              Надіслати покупцям з покинутими кошиками
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendToSelected}
                onChange={() => {
                  setSendToSelected(!sendToSelected);
                  setSendToAll(false);
                  setSendToAbandoned(false);
                }}
              />
              Надіслати обраним покупцям
            </label>
          </div>

          {/* Вибір користувачів */}
          {sendToSelected && (
            <div className="mb-6 border rounded p-4 max-h-64 overflow-y-auto">
              <h2 className="font-semibold mb-2">Оберіть покупців:</h2>
              {customers.map((customer) => (
                <label key={customer._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.some((c) => c._id === customer._id)}
                    onChange={() => handleToggleCustomer(customer)}
                  />
                  {customer.name} ({customer.email})
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            📤 Надіслати
          </button>
        </>
      )}

      {/* Tab: Delete */}
      {tab === "delete" && (
        <>
          <table className="w-full border mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Назва</th>
                <th className="text-left p-2">Код</th>
                <th className="text-left p-2">Тип</th>
                <th className="text-left p-2">Дія</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCards.map((card) => (
                <tr key={card._id} className="border-b">
                  <td className="p-2">{card.title}</td>
                  <td className="p-2">{card.code}</td>
                  <td className="p-2">{card.type}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteCard(card._id)}
                      className="text-red-600 hover:underline"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {giftCards.length > currentPage * cardsPerPage && (
            <div className="text-right">
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Наступна сторінка
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
