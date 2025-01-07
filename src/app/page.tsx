"use client";

import { FaKey } from "react-icons/fa";
import Link from "next/link";
import "./globals.css";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-background">
      <h1 className="text-4xl font-bold"></h1>

      <TypeAnimation
        sequence={[
          "",
          500,
          "Welcome seeker of mystery and lore...",
          1000,
          "Through digital realms you'll explore...",
          1500,
          "Hidden wonders await your keen eye...",
          1500,
          "In places where cobwebs lie...",
          1500,
          "Fortune favors those who dare to peek...",
          1500,
          "Below the surface, what you seek...",
          2000,
        ]}
        wrapper="span"
        speed={50}
        deletionSpeed={75}
        style={{ fontSize: "2em", display: "inline-block" }}
        repeat={Infinity}
      />
      <footer className="absolute bottom-4 left-4">
        <Link href="/secrets">
          <FaKey
            className="opacity-10 transition-all duration-300 hover:text-yellow-400 hover:scale-125 hover:opacity-100"
            size={12}
          />
        </Link>
      </footer>
    </div>
  );
};

export default Home;
