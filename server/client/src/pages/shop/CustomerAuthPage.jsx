import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("justRegistered") === "true") {
      setSuccessMessage("Реєстрація пройшла успішно. Тепер увійдіть.");
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (isRegister && !isCodeSent) {
        await axios.post("http://localhost:5000/customerAuth/customer/initiate-registration", form);
        setTempEmail(form.email);
        setIsCodeSent(true);
      } else if (isRegister && isCodeSent) {
        await axios.post("http://localhost:5000/customerAuth/customer/verify-code", {
          email: tempEmail,
          code: verificationCode,
        });
        navigate("/customerAuth?justRegistered=true");
      } else {
        const res = await axios.post("http://localhost:5000/customerAuth/customer/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("customerToken", res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Помилка");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
        aria-label={isRegister ? "Форма реєстрації" : "Форма входу"}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isRegister ? (isCodeSent ? "Підтвердження Email" : "Реєстрація") : "Вхід"} покупця
        </h2>

        {successMessage && (
          <p className="text-green-600 text-center text-sm font-medium">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-center text-sm font-medium">{error}</p>
        )}

        {!isCodeSent && isRegister && (
          <>
            <input
              type="text"
              name="name"
              placeholder="ПІБ"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </>
        )}

        {isCodeSent && isRegister && (
          <input
            type="text"
            name="verificationCode"
            placeholder="6-значний код"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
          />
        )}

        {!isRegister && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
        >
          {isRegister ? (isCodeSent ? "Підтвердити" : "Зареєструватися") : "Увійти"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Вже маєте акаунт?" : "Немає акаунту?"} {" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccessMessage("");
              setIsCodeSent(false);
            }}
          >
            {isRegister ? "Увійти" : "Зареєструватися"}
          </button>
        </p>
      </form>
    </div>
  );
}
