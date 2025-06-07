import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-8 text-center">
          📞 Зв’яжіться з нами
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed text-center mb-10">
          Якщо у вас виникли запитання або потрібна допомога — ми завжди на зв’язку!
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 hover:bg-blue-50 p-4 rounded-lg transition duration-300">
            <FaEnvelope className="text-blue-600 text-2xl" />
            <span className="text-gray-800 text-lg">unclekostya7670@outlook.com</span>
          </div>

          <div className="flex items-center space-x-4 hover:bg-blue-50 p-4 rounded-lg transition duration-300">
            <FaPhoneAlt className="text-blue-600 text-xl" />
            <span className="text-gray-800 text-lg">+380 95 155 5269</span>
          </div>

          <div className="flex items-center space-x-4 hover:bg-blue-50 p-4 rounded-lg transition duration-300">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <span className="text-gray-800 text-lg">
              м. Миколаїв, обл. Миколаївська,<br />
              р-н Жовтневий, с. Миролюбове
            </span>
          </div>
        </div>

        <p className="text-sm text-center text-gray-500 mt-10">
          ⏰ Ми відповідаємо щодня з 09:00 до 20:00
        </p>
      </div>
    </div>
  );
}
