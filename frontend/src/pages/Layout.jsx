import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = ({ onLogout }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar onLogout={onLogout} />
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
  </div>
);

export default Layout;
