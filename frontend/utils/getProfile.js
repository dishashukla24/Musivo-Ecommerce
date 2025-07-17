// utils/getProfile.js
export const getProfile = async () => {
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'GET',
      credentials: 'include', // important for cookies
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('Profile fetch failed:', err);
    return null;
  }
};
