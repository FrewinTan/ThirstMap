import { VercelRequest, VercelResponse } from "@vercel/node";
import { Client, Query, Storage } from "appwrite";

export async function getFileId(name: string) {
  const endPoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const bucketId = process.env.APPWRITE_BUCKETID;

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

  try {
    const result = await storage.listFiles(bucketId, [
      Query.equal("name", name + ".png"),
    ]);
    const files = result.files;
    if (!files || files.length == 0) {
      throw new Error(`No file found for name ${name}.png`);
    }

    const arr = [];
    for (var i = 0; i < files.length; i++) {
      arr.push(files[i].$id);
    }
    return arr;
  } catch (error) {
    console.error("Unable to fetch image id", error);
  }
}

export default async function ImageApi(
  req: VercelRequest,
  res: VercelResponse
) {
  const endPoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const bucketId = process.env.APPWRITE_BUCKETID;

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

  try {
    const name = req.query.name as string;

    const fileId = await getFileId(name);
    if (!fileId) {
      throw new Error("fileId is undefined");
    }

    const arr: string[] = [];
    for (var i = 0; i < fileId.length; i++) {
      const result = storage.getFileView(bucketId, fileId[i]);
      arr.push(result);
    }

    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ error: "No Image Found", details: error });
  }
}
