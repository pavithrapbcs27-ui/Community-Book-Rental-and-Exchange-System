import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Components
import StartPage from "./components/StartPage";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import UpdateProfile from "./components/UpdateProfile";

// Admin Components
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

// Books & Transactions
import AddBook from "./components/AddBook";
import Transactions from "./components/Transactions";
import MyRentals from "./components/MyRentals";

import Exchange from "./components/Exchange";

// Rental & Exchange


import MyExchange from "./components/MyExchange";


// Styles
import "./styles/index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<StartPage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />

        {/* User Dashboard & Profile */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/profile/update" element={<UpdateProfile />} />

        {/* Transactions */}
        <Route path="/user/transactions" element={<Transactions />} />

        {/* Admin Dashboard */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Books & AddBook */}
        <Route path="/books/add" element={<AddBook />} />

        {/* Rental & Exchange */}
       
        <Route path="/user/exchange" element={<Exchange />} />

        <Route path="/user/myrentals" element={<MyRentals />} />
        <Route path="/user/myexchange" element={<MyExchange />} />


      </Routes>
    </BrowserRouter>
  );
}
