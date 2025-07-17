export const logout = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
