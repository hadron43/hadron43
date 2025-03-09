"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import ScrollableLetter from "@/components/ScrollableLetter";

export interface Secret {
  name: string;
  number: number;
  letter: string[];
}

export default function Secrets() {
  const [name, setName] = useState("");
  const [luckyNumber, setLuckyNumber] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [secret, setSecret] = useState<Secret | null>(null);

  const playConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    playConfetti();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, luckyNumber }),
    });

    if (response.ok) {
      // Handle success
      console.log("Form submitted successfully");
      setNotification("Your secret has been revealed!");
      const _secret = (await response.json()).secret;
      setTimeout(() => {
        setSecret(_secret);
      }, 2000);
    } else {
      // Handle error
      const errorData = await response.json();
      setNotification(`${errorData.message}`);
    }

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (secret !== null) {
    return <ScrollableLetter sentences={secret.letter} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-background">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 opacity-80 bg-red-700 hover:opacity-100 text-white px-4 py-2 rounded-md shadow-md flex items-center space-x-2">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}
      <h1 className="text-3xl font-bold">
        <a
          onClick={playConfetti}
          className="hover:bg-gray-900 rounded-lg cursor-pointer px-2 py-1"
        >
          Congratulations
        </a>
        🥳🎉
      </h1>
      <h2 className="text-2xl mt-5">You found this. Wohoooo!</h2>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="luckyNumber"
            className="block text-sm font-medium text-gray-300"
          >
            Lucky Number
          </label>
          <input
            type="number"
            id="luckyNumber"
            name="luckyNumber"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={luckyNumber}
            onChange={(e) => setLuckyNumber(e.target.value)}
            required
          />
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="flex mx-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Find my Secret!
          </button>
        </div>
      </form>
    </div>
  );
}
