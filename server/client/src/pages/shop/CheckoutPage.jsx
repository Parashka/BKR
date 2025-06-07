import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../lib/axios";
import Select from "react-select";

export default function CheckoutPage() {
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [city, setCity] = useState("Київ");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const token = localStorage.getItem("customerToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/customerAuth/customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCustomer(res.data.customer))
        .catch(() => alert("Помилка отримання даних користувача"));
    }
  }, [token]);

  useEffect(() => {
    if (city.trim()) {
      axiosInstance
        .get("/novaposhta/cities", { params: { name: city } })
        .then((res) => {
          const options = res.data.map((c) => ({ label: c.label, value: c.value }));
          setCityOptions(options);
        })
        .catch(() => setCityOptions([]));
    }
  }, [city]);

  useEffect(() => {
    if (selectedCity?.value) {
      axiosInstance
        .get("/novaposhta/warehouses", {
          params: { cityRef: selectedCity.value },
        })
        .then((res) => {
          const options = res.data.map((w) => ({ value: w.value, label: w.label }));
          setWarehouses(options);
        })
        .catch(() => alert("Не вдалося завантажити відділення"));
    }
  }, [selectedCity]);

  const handleSubmitOrder = async () => {
    if (!selectedWarehouse || !selectedCity) {
      alert("Оберіть місто та відділення Нової Пошти");
      return;
    }

    try {
      const { data: cartRes } = await axiosInstance.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = cartRes.cart.map((item) => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

      if (paymentMethod === "online") {
        setIsProcessingPayment(true);

        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            items,
            totalPrice,
            paymentMethod: "online",
            deliveryMethod: "Нова пошта",
            novaPoshtaOffice: selectedWarehouse.label,
            city: selectedCity.label,
            isPaid: true,
          })
        );

        const { data: paymentData } = await axiosInstance.post(
          "/liqpay/create-payment",
          {
            amount: totalPrice,
            orderInfo: `Замовлення від ${customer.name}`,
            currency: "UAH",
            returnUrl: "http://localhost:3000/checkout/success",
            failUrl: "http://localhost:3000/checkout/fail",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        return (window.location.href = paymentData.paymentUrl);
      }

      await axiosInstance.post(
        "/orders",
        {
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          items,
          totalPrice,
          paymentMethod,
          deliveryMethod: "Нова пошта",
          novaPoshtaOffice: selectedWarehouse.label,
          city: selectedCity.label,
          isPaid: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axiosInstance.post("/cart/clear", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Замовлення успішно створено!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Не вдалося створити замовлення");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-8 mb-16">
      <h1 className="text-3xl font-semibold mb-6 text-center">Підтвердження замовлення</h1>

      {customer ? (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">ПІБ:</label>
            <input
              type="text"
              value={customer.name}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Телефон:</label>
            <input
              type="text"
              value={customer.phone || ""}
              disabled
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Спосіб оплати:</label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span>Оплата онлайн</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <span>Оплата при отриманні</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Місто:</label>
            <Select
              options={cityOptions}
              value={selectedCity}
              onInputChange={(inputValue) => setCity(inputValue)}
              onChange={(option) => {
                setSelectedCity(option);
                setCity(option.label);
              }}
              placeholder="Введіть назву міста"
              isSearchable
              className="text-gray-700"
              classNamePrefix="select"
              noOptionsMessage={() => "Місто не знайдено"}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Відділення Нової Пошти:</label>
            <Select
              options={warehouses}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Оберіть відділення"
              isSearchable
              className="text-gray-700"
              classNamePrefix="select"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isProcessingPayment}
            className={`w-full mt-6 py-3 rounded-md font-semibold text-white ${
              isProcessingPayment ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } transition`}
          >
            {isProcessingPayment ? "Перенаправлення на оплату..." : "✅ Підтвердити замовлення"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600">Завантаження даних…</p>
      )}
    </div>
  );
}
