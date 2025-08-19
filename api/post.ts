import { VercelRequest, VercelResponse } from "@vercel/node";
import { Client, ID, Storage } from "appwrite";
import { IncomingForm } from "formidable";
import fs from "fs";

export default async function PostApi(req: VercelRequest, res: VercelResponse) {
  const endPoint = process.env.APPWRITE_ENDPOINT_1;
  const projectId = process.env.APPWRITE_PROJECT_ID_1;
  const bucketId = process.env.APPWRITE_BUCKETID_1;

  if (!endPoint) {
    throw new Error("Appwrite endpoint is not set in env");
  }
  if (!projectId) {
    throw new Error("Appwrite projectId  is not set in env");
  }
  if (!bucketId) {
    throw new Error("Appwrite bucketId is not set in env");
  }

  const client = new Client();
  const storage = new Storage(client);

  client.setEndpoint(endPoint).setProject(projectId);

  const form = new IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing form data" });
    }

    if (!files.file || files.file.length == 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedFile = files.file[0];
    const uploadedFileName = uploadedFile.originalFilename ?? "No file name";


    try {
      const fileBuffer = fs.readFileSync(uploadedFile.filepath);
      const file = new File([fileBuffer], uploadedFileName);

      const result = await storage.createFile(bucketId, ID.unique(), file);

      return res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
      res.status(400).json({ message: "Unable to upload image" });
    }
  });
}
