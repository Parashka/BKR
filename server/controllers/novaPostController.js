const axios = require("axios");

// Отримання списку міст (getSettlements)
const getCities = async (req, res) => {
  const { name } = req.query;

  try {
    const response = await axios.post("https://api.novaposhta.ua/v2.0/json/", {
      apiKey: process.env.NOVAPOSHTA_API_KEY,
      modelName: "AddressGeneral",
      calledMethod: "searchSettlements",
      methodProperties: {
        CityName: name,
        Limit: 10,
        Page: 1,
      },
    });

    const addresses = response.data?.data?.[0]?.Addresses || [];

    const result = addresses.map((city) => ({
      label: city.MainDescription,
      value: city.Ref, // <-- це SettlementRef (вірний Ref)
    }));

    res.json(result);
  } catch (err) {
    console.error("Помилка пошуку міст Нової Пошти:", err.message);
    res.status(500).json({ message: "Не вдалося знайти міста" });
  }
};

// Отримання відділень по SettlementRef
const getWarehouses = async (req, res) => {
  const { cityRef } = req.query;

  try {
    const response = await axios.post("https://api.novaposhta.ua/v2.0/json/", {
      apiKey: process.env.NOVAPOSHTA_API_KEY,
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        SettlementRef: cityRef, // <--- ключовий момент
        Page: "1",
        Limit: "50",
        Language: "UA",
      },
    });

    const warehouses = response.data.data.map((wh) => ({
      label: wh.Description,
      value: wh.Ref,
    }));

    res.json(warehouses);
  } catch (err) {
    console.error("Помилка отримання відділень:", err.message);
    res.status(500).json({ message: "Не вдалося знайти відділення" });
  }
};

module.exports = {
  getCities,
  getWarehouses,
};
