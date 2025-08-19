import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function SubmitAPI(
  req: VercelRequest,
  res: VercelResponse
) {
  const formId = process.env.FORMSPREE_FORMID;
  if (!formId)
    return res.status(500).json({ message: "Missing FORMSPREE_FORMID" });
  const url = `https://formspree.io/f/${formId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      res.status(200).json({ message: "Form submitted successfully" });
    } else {
      res.status(response.status).json({
        message: "Failed to submit the form. Please try again later",
      });
    }
  } catch (error) {
    console.error("Error submitting form", error);
  }

  return res.statusMessage;
}
