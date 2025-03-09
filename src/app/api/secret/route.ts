import fs from "fs/promises";
import path from "path";

const jsonFilePath = path.join(process.cwd(), "data", "secrets.json");

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

  console.log("cwd", jsonFilePath);

  try {
    const data = await fs.readFile(jsonFilePath, "utf8");
    const secrets = JSON.parse(data);
    const secretIndex = secrets.findIndex(
      (secret: { name: string }) =>
        secret.name.toLowerCase().indexOf(name.toLowerCase()) >= 0
    );

    if (secretIndex === -1) {
      return new Response(JSON.stringify({ message: "Secret not found" }), {
        status: 404,
      });
    }

    const secret = secrets[secretIndex];
    secrets.splice(secretIndex, 1);

    await fs.writeFile(jsonFilePath, JSON.stringify(secrets, null, 2));

    return new Response(
      JSON.stringify({
        message: "Secret deleted successfully",
        secret: secret,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error handling file:", err);
    return new Response(JSON.stringify({ message: "Error handling file" }), {
      status: 500,
    });
  }
};
