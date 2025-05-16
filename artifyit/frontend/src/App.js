import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Customer/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; // Your custom PrivateRoute component
import Signup from "./components/Signup";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDash from "./components/Admin/AdminSidebar";
import User from "./components/Admin/User";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminLayout from "./components/Admin/AdminLayout";
import Products from './components/Admin/ProductC';
import Reports from './components/Admin/Reports';
import DashboardC from "./components/Admin/DashboardC";
import CustomizationTemplates from "./components/Admin/CustomizationTemplates";
import DesignPage from './components/Customer/DesignPage';
import Orders from "./components/Admin/Orders";
import Logout from "./components/Logout";
// import Customizer from "./CustomT/src/pages/Customizer"
// import Home from "./CustomT/src/pages/Home"

const App = () => {
  const CustomT = () => {
    return <>
      <Home />
      <Customizer />
    </>
  }
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    console.log("Form toggled. isSignUp:", !isSignUp);
  };

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <div className={`main-container ${isSignUp ? 'animated_signup' : 'animated_signin'}`} id="main">
                <div className="circle1_child3" />
                {isSignUp ? <Signup toggleForm={toggleForm} /> : <Login toggleForm={toggleForm} />}
              </div>
            }
          />
          <Route path="/user" element={<User />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
                {/* <CustomT /> */}
              </PrivateRoute>
            }
          />
          <Route path="/design" element={<DesignPage />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
          <Route
            path="/admindashboard"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminSidebar />} />
            <Route path="dashboard" element={<DashboardC />} />
            <Route path="users" element={<User />} />
            <Route path="products" element={<Products />} />
            <Route path="reports" element={<Reports />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
