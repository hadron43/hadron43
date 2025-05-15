"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface ShortenedUrl {
  shortCode: string;
  targetUrl: string;
  createdAt: string;
}

export default function UrlShortener() {
  const [targetUrl, setTargetUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<ShortenedUrl | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(`${window.location.origin}/url/`);
  }, []);

  const playConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedUrl(null);

    if (!targetUrl.trim()) {
      setNotification("Please enter a valid URL");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: targetUrl, customSlug: shortCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedUrl(data);
        setNotification("URL shortened successfully!");
        playConfetti();
        // Not clearing the form anymore
      } else {
        const errorData = await response.json();
        setNotification(errorData.message || "Failed to create shortened URL");
      }
    } catch {
      setNotification("An error occurred. Please try again.");
    }

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const clearForm = () => {
    setTargetUrl("");
    setShortCode("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setNotification("Copied to clipboard!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-background p-4">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 opacity-80 bg-blue-700 hover:opacity-100 text-white px-4 py-2 rounded-md shadow-md flex items-center space-x-2 z-50">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-200 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
      <p className="text-gray-300 mb-8">
        Create shortened URLs for easy sharing
      </p>

      <div className="w-full max-w-md space-y-6">
        <form
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              htmlFor="targetUrl"
              className="block text-sm font-medium text-gray-300 text-left mb-1"
            >
              Target URL
            </label>
            <input
              type="url"
              id="targetUrl"
              name="targetUrl"
              placeholder="https://example.com/very-long-url"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="shortCode"
              className="block text-sm font-medium text-gray-300 text-left mb-1"
            >
              Custom Short Code (optional)
            </label>
            <div className="flex items-center">
              <span className="bg-gray-600 px-3 py-2 rounded-l-md border border-gray-600">
                {baseUrl}
              </span>
              <input
                type="text"
                id="shortCode"
                name="shortCode"
                placeholder="custom-code"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-left">
              Leave empty to generate a random code
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Shorten URL
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Form
            </button>
          </div>
        </form>

        {createdUrl && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Your Shortened URL</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 text-left mb-1">
                Shortened URL
              </label>
              <div className="bg-gray-700 p-3 rounded-md mb-2">
                <div className="flex items-center justify-between break-all">
                  <span>
                    {baseUrl}
                    {createdUrl.shortCode}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(`${baseUrl}${createdUrl.shortCode}`)
                    }
                    className="ml-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded-md text-sm flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-300 text-left mb-1">
                  Target URL
                </label>
                <div className="bg-gray-700 p-3 rounded-md mb-2">
                  <div className="flex items-center justify-between break-all">
                    {createdUrl.targetUrl}
                    <button
                      onClick={() => copyToClipboard(`${createdUrl.targetUrl}`)}
                      className="ml-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded-md text-sm flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Created: {new Date(createdUrl.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
