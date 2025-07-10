import { client } from '../../../lib/client'; // or `import client from ...` if using default

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    console.log("Is client defined?", client !== undefined);
    console.log("Client keys:", Object.keys(client || {}));

    const sanityQuery = `*[_type == "product" && name match "${query}*"]{
      image, name, slug, price 
    }`;

    const products = await client.fetch(sanityQuery);

    res.status(200).json({ products });
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    res.status(500).json({ error: "Sanity fetch failed", detail: err.message });
  }
}
