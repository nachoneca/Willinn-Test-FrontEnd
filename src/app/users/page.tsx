'use client';
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [newUser, setNewUser] = useState({ id: 0, name: "", email: "", password: "", isActive: true}); // Datos para el nuevo usuario

  // Función para obtener la lista de usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/all`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Cargar la lista de usuarios cuando se carga la página
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para crear un nuevo usuario
  const createUser = async (e) => {
    e.preventDefault();
    const userWithStatus = {
      id: 0,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      isActive: newUser.isActive || true
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchUsers(); // Recargar la lista de usuarios
        setNewUser({id: 0, name: "", email: "", password: "", isActive: true,});
      } else {
        const errorData = await response.json();
        console.error("Error creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const deactivateUser = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers(); // Recargar la lista de usuarios
      } else {
        const errorData = await response.json();
        console.error("Error deactivating user:", errorData);
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Menú lateral */}
      <aside className="w-64 bg-white text-gray-200 p-6">
        <div className="mb-8 flex justify-center">
          <img src="logo.png" alt="Logo" className="h-12 w-auto" />
        </div>
        <nav>
          <ul className="space-y-6">
            <li>
              <a href="/home" className="text-pink-600 hover:text-pink-700 flex items-center text-xl">
                {/* Icono de inicio */}
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 12l7-8 7 8H3z"></path>
                  <path d="M5 10v10h4v-6h6v6h4V10L12 3 5 10z"></path>
                </svg>
                Inicio
              </a>
            </li>
            <li>
              <a href="/users" className="text-pink-600 hover:text-pink-700 flex items-center text-xl">
                {/* Icono de usuario */}
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
                Usuarios
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="bg-gray-100 flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Usuarios</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Caja de lista de usuarios (más grande ocupando 2 columnas) */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-150px)]">
            <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
            
            {/* Tabla de usuarios */}
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-4 px-4 border-b border-gray-200 text-left font-medium text-gray-700">Nombre</th>
                    <th className="py-4 px-4 border-b border-gray-200 text-left font-medium text-gray-700">Correo</th>
                    <th className="py-4 px-4 border-b border-gray-200 text-left font-medium text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="bg-blue border-b border-gray-200">
                      <td className="py-6 px-4 text-blue-600">{user.name}</td>
                      <td className="py-6 px-4 text-blue-600">{user.email}</td>
                      <td className="py-6 px-4">
                        {user.isActive ? (
                          <div className="flex items-center">
                            <span className="text-green-600">Activo</span>
                            <button
                              onClick={() => deactivateUser(user.id)}
                              className="ml-4 text-red-600 hover:text-pink-700"
                            >
                              <svg className="w-5 h-5" fill="red" viewBox="0 0 24 24">
                              <path d="M6 2L6 3H18L18 2M10 3V1H14V3M4 6V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V6H4Z" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-red-600">Inactivo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Caja de registro de usuario (ocupando 1 columna) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-5  ">Agregar Usuario</h2>
            <form onSubmit={createUser}>
              <div className="mb-5">
                <label htmlFor="name" className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Introduce tu nombre"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Introduce tu E-mail"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Introduce tu contraseña"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400"
                  required
                />
              </div>
              {/* Switch de activación */}
        <div className="flex items-center mb-10">
          <label htmlFor="isActive" className="mr-4 text-gray-700">Estado</label>
          <button
            type="button"
            onClick={() => setNewUser({ ...newUser, isActive: !newUser.isActive })}className={`w-16 h-8 flex items-center rounded-full p-1 ${newUser.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className={`h-6 w-6 bg-white rounded-full shadow-md transform duration-300 ${newUser.isActive ? 'translate-x-8' : 'translate-x-0'}`}>
            </div>
          </button>
          <span className="ml-2 text-gray-700">
            {newUser.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
              <button type="submit"className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">Guardar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
);
}
