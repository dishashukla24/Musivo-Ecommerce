export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      const backendRes = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    } catch (error) {
      console.error("Signup API Error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  