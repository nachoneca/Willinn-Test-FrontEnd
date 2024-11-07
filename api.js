const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener usuarios
export const fetchUsers = async () => {
  const response = await fetch(`${apiUrl}/all`); // Endpoint para obtener usuarios
  const data = await response.json();
  return data;
};

// Función para crear un nuevo usuario
export const createUser = async (userData) => {
  const response = await fetch(`${apiUrl}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};
