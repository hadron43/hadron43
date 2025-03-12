import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in environment variables"
  );
}

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
const dbName = "hadron43";

export const POST = async (req: Request) => {
  const { name, luckyNumber } = await req.json();

  if (!name || !luckyNumber) {
    return new Response(
      JSON.stringify({ message: "name and luckyNumber are required" }),
      {
        status: 400,
      }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("secrets");

    const secret = await collection.findOne({
      name: new RegExp(name, "i"),
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    });

    if (!secret) {
      return new Response(JSON.stringify({ message: "Secret not found" }), {
        status: 404,
      });
    }

    if (secret.viewOnce) {
      await collection.updateOne(
        { _id: secret._id },
        { $set: { deleted: true } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Secret retrieved successfully",
        secret: secret,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error handling MongoDB:", err);
    return new Response(JSON.stringify({ message: "Error handling MongoDB" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
};
