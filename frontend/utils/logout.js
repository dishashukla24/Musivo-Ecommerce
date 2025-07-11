const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const logout = async () => {
  const res = await fetch('http://localhost:8080/api/logout', {
    method: 'POST',
    credentials: 'include',
  });

  return await res.json();
};
