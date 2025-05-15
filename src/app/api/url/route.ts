import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
dotenv.config();

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in environment variables"
  );
}

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
const dbName = "hadron43";
const collectionName = "url";
const BASE_URL = process.env.BASE_URL || "https://hadron43.in/url";

// Helper function to validate custom slug
const isValidSlug = (slug: string) => /^[a-zA-Z0-9-_]+$/.test(slug);

// Create a shortened URL
export const POST = async (req: Request) => {
  const { originalUrl, customSlug } = await req.json();

  if (!originalUrl) {
    return new Response(
      JSON.stringify({ message: "originalUrl is required" }),
      {
        status: 400,
      }
    );
  }

  if (customSlug && !isValidSlug(customSlug)) {
    return new Response(
      JSON.stringify({
        message:
          "customSlug contains invalid characters. Only alphanumeric characters, hyphens, and underscores are allowed.",
      }),
      {
        status: 400,
      }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Generate a slug or use the custom one
    const slug = customSlug || nanoid(6);

    // Check if custom slug already exists
    if (customSlug) {
      const existingUrl = await collection.findOne({ slug: customSlug });
      if (existingUrl) {
        return new Response(
          JSON.stringify({ message: "Custom slug already in use" }),
          {
            status: 409,
          }
        );
      }
    }

    // Create new URL document
    const urlDoc = {
      originalUrl,
      slug,
      createdAt: new Date(),
      visits: 0,
    };

    await collection.insertOne(urlDoc);

    return new Response(
      JSON.stringify({
        message: "URL shortened successfully",
        shortUrl: `${BASE_URL}/${slug}`,
        shortCode: slug,
        targetUrl: originalUrl,
        createdAt: urlDoc.createdAt,
      }),
      {
        status: 201,
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

// Retrieve original URL from slug
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response(
      JSON.stringify({ message: "slug parameter is required" }),
      {
        status: 400,
      }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const urlDoc = await collection.findOne({ slug });

    if (!urlDoc) {
      return new Response(JSON.stringify({ message: "URL not found" }), {
        status: 404,
      });
    }

    // Increment visit count
    await collection.updateOne({ _id: urlDoc._id }, { $inc: { visits: 1 } });

    return new Response(
      JSON.stringify({
        message: "URL retrieved successfully",
        originalUrl: urlDoc.originalUrl,
        visits: urlDoc.visits + 1,
        createdAt: urlDoc.createdAt,
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
