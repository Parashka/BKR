import { FaUsers, FaFlag, FaSmile } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-8 text-center">
          🛍 Про компанію “ShopManager”
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-10 text-center">
          ShopManager — це сучасна платформа для онлайн-продажів, розроблена для малого та середнього бізнесу.
          Ми допомагаємо підприємцям зручно керувати товарами, замовленнями та клієнтами в одному місці.
        </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-10">
        <div className="p-4">
          <FaFlag className="mx-auto text-blue-600 text-3xl mb-2" />
          <h3 className="font-semibold text-lg">Старт у 2025</h3>
          <p className="text-sm text-gray-600">м. Миколаїв, Україна</p>
        </div>
        <div className="p-4">
          <FaUsers className="mx-auto text-blue-600 text-3xl mb-2" />
          <h3 className="font-semibold text-lg">3 засновники</h3>
          <p className="text-sm text-gray-600">Техно-ентузіасти</p>
        </div>
      </div>


        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">👨‍💻 Наша команда</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <img
              src="/avatars/kostya.png"
              alt="Костянтин Сергієв"
              className="w-24 h-24 rounded-full shadow-md"
            />
            <h4 className="font-semibold text-lg">Костянтин Сергієв</h4>
            <p className="text-sm text-gray-600">Frontend Developer</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <img
              src="/avatars/denis.png"
              alt="Денис Свистун"
              className="w-24 h-24 rounded-full shadow-md"
            />
            <h4 className="font-semibold text-lg">Денис Свистун</h4>
            <p className="text-sm text-gray-600">UI/UX Designer</p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <img
              src="/avatars/kolya.png"
              alt="Микола Рудь"
              className="w-24 h-24 rounded-full shadow-md"
            />
            <h4 className="font-semibold text-lg">Микола Рудь</h4>
            <p className="text-sm text-gray-600">Backend Developer</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Дякуємо, що обираєте <strong>ShopManager</strong> — ми працюємо, щоб ваш бізнес ріс!
        </p>
      </div>
    </div>
  );
}
