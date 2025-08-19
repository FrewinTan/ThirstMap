import { neon } from "@neondatabase/serverless";
import { VercelRequest, VercelResponse } from "@vercel/node";

export async function vendingAPI(req: VercelRequest, res: VercelResponse) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("Database_Url is not set in env");
    }
    const sql = neon(dbUrl);

    const result = await sql`
      SELECT 
        vending.opening_hour,
        vending.payment_type,
        vending.type,
        location.name,
        location.location
      FROM
        vending
      JOIN location on location.id = vending.location_id`;
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Fetch Vending Data Error", details: error });
  }
}

export default vendingAPI;
