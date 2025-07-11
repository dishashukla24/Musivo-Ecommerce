const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getProfile = async () => {
    const res = await fetch('http://localhost:8080/api/profile', {
      credentials: 'include',
    });
  
    if (!res.ok) throw new Error('Not authenticated');
  
    return await res.json();
  };
  