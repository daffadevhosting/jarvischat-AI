import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import SharedChat from "./pages/SharedChat"
import Donasi from "./pages/Donasi";
import Success from "./pages/Success";
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/donate" element={<Donasi />} />
        <Route path="/success" element={<Success />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/share/:shareId" element={<SharedChat />} />
        <Route element={<PrivateRoute />}>
        <Route path="/j-c/:chatroomId" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
