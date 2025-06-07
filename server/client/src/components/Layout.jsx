import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
