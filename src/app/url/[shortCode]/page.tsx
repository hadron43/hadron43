import { redirect } from "next/navigation";
import { Metadata } from "next";

// This function would typically fetch the URL from your database
async function getTargetUrl(shortCode: string): Promise<string | null> {
  try {
    // Replace this with your actual API call or database query
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/url?slug=${encodeURIComponent(shortCode)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    return data?.originalUrl || null;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { shortCode: string };
}): Promise<Metadata> {
  const { shortCode } = await params;
  const targetUrl = await getTargetUrl(shortCode);

  return {
    title: targetUrl ? "Redirecting..." : "URL Not Found",
    description: targetUrl
      ? `Redirecting to ${targetUrl}`
      : "The requested short URL was not found",
  };
}

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = await params;
  const targetUrl = await getTargetUrl(shortCode);

  if (targetUrl) {
    redirect(targetUrl);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-background p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-red-500">URL Not Found</h1>
        <p className="mb-6">
          The shortened URL{" "}
          <code className="bg-gray-700 px-2 py-1 rounded">{shortCode}</code>{" "}
          does not exist or has expired.
        </p>
        <a
          href="/url"
          className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create a new shortened URL
        </a>
      </div>
    </div>
  );
}
