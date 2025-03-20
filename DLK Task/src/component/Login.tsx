import { useState } from "react";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Config_Url } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      console.log(email, password);
      const responce = await axios.post(
        `${Config_Url.base_url}/employee/login`,
        {
          email: email,
          password: password,
        }
      );
      localStorage.setItem("user", JSON.stringify(responce.data));
      toast.success("Login Success");
      console.log(responce.data);
      navigate("dashboard");
    } catch (err:any) {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 opacity-70"
      style={{
        backgroundImage:
          "url('https://kenboxtech.com/wp-content/uploads/2023/07/human-resource-bg-left-min.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <img
            src="https://t3.ftcdn.net/jpg/06/96/38/28/360_F_696382809_HlcZ6LTeIqtEBLnjPY45zCOEO2Q37H3a.jpg"
            alt="DLK Logo"
            className="h-20"
          />
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Login
        </h2>
        <div className="relative mb-3">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border px-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 transition duration-300"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
