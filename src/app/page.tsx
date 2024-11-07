"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt");  // Verifica si entra en la función

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/login`, { // Asegúrate de apuntar al backend correcto.
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    

    const data = await response.json();

    if (response.ok) {
      console.log(data);  // Verifica la respuesta del backend
      localStorage.setItem("token", data.Token);
      router.push("/users");
      // Redirigir al usuario a otra página, si es necesario
    } else {
      setError("Email o contraseña incorrecta");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Contenedor del logo, fuera del rectángulo */}
      <div className="flex justify-center mb-4 absolute top-10">
        <img src="logo.png" alt="Logo" className="h-20 w-auto" />
      </div>
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Inicie sesión
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-200"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
