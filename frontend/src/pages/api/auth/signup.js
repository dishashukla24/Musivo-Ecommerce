export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(req.body),
      });
  
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    } catch (error) {
      console.error("Signup API Error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  
