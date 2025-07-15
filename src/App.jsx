import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import MyPage from "./components/account/MyPage";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import EditableProfile from "./components/account/EditableProfile";
import SuperAdminLayout from "./components/admin/SuperAdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Settings from "./components/admin/Setting";
import AdminLogin from "./components/admin/AdminLogin";
import VideoPannel from "./components/video-pannel/VideoPannel";
import EmailVerification from "./components/auth/EmailVerification";
import FilterBar from "./Test/FilterBar";
import MonkeyHome from "./monkeyclone/MonkeyHome";




const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a" element={<MonkeyHome />} />
          <Route path="/email" element={<EmailVerification />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<VideoPannel />} />
            <Route path="/account" element={<EditableProfile />} />
          </Route>

          <Route path="adminlogin" element={<AdminLogin></AdminLogin>}></Route>
          <Route path="/admin" element={<SuperAdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Settings />} />
            <Route path="dashboard" element={<Dashboard />} />

          </Route>

          <Route path="/filter" element={<FilterBar />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
