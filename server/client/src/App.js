import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import AddProductPage from "./pages/AddProductPage";
import AllProductsPage from "./pages/AllProductsPage";
import EditProductPage from "./pages/EditProductPage";
import InventoryPage from './pages/InventoryPage';
import CustomersPage from "./pages/CustomersPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import DiscountsPage from "./pages/DiscountsPage";
import CreateDiscountPage from "./pages/CreateDiscountPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderDraftPage from "./pages/CreateOrderDraftPage";
import AbandonedOrdersPage from "./pages/AbandonedOrdersPage";
import GiftCardCreatePage from "./pages/GiftCardCreatePage";
import StorePage from "./pages/shop/StorePage";
import CustomerAuthPage from "./pages/shop/CustomerAuthPage";
import CartPage from "./pages/shop/CartPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import CheckoutSuccessPage from "./pages/shop/CheckoutSuccess";
import GiftCardSend from "./pages/GiftCardSend";
import UserProfilePage from "./pages/shop/UserProfilePage";
import AboutPage from "./pages/info/AboutPage";
import ContactPage from "./pages/info/ContactPage";
import PrivacyPolicyPage from "./pages/info/PrivacyPolicyPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/products/inventory" element={<InventoryPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/add" element={<AddCustomerPage />} />
          <Route path="/discounts" element={<DiscountsPage />} />
          <Route path="/discounts/create" element={<CreateDiscountPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/drafts" element={<CreateOrderDraftPage />} />
          <Route path="/orders/abandoned" element={<AbandonedOrdersPage />} />
          <Route path="/products/gift-cards" element={<GiftCardCreatePage />} />
          <Route path="/gift-cards/send" element={<GiftCardSend />} />
        </Route>
        <Route path="/" element={<StorePage />} />
        <Route path="/customerAuth" element={<CustomerAuthPage />} />
        <Route path = "/cart" element={<CartPage />} />
        <Route path="/checkout" element = {<CheckoutPage/>} />
        <Route path ="/checkout/success" element = {<CheckoutSuccessPage/>} />
        <Route path="/profile" element = {<UserProfilePage/>}/>
        <Route path="/info/about" element = {<AboutPage />} />
        <Route path="/info/privacy" element = {<PrivacyPolicyPage/>}/>
        <Route path="/info/contacts" element = {<ContactPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;