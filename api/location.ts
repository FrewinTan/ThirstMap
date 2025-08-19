import { neon } from "@neondatabase/serverless";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function locationAPI(req: VercelRequest, res: VercelResponse) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("Database_Url is not set in env");
    }
    const sql = neon(dbUrl);

    const result = await sql`
      SELECT 
        location.lat,
        location.lng
      FROM
        location`;

    return res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fetch Vending Location Data Error", details: error });
  }
}
