import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function CrowdAPI(
  req: VercelRequest,
  res: VercelResponse
) {
  const formId = process.env.FORMCARRY_FORMID;
  if (!formId)
    return res.status(500).json({ message: "Missing Form Carry ID" });
  
	const url = `https://formcarry.com/s/${formId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    return res.status(200).json({ message: "Form sucessfully uploaded" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error forwarding form data to Form Carry" });
  }
}
