"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("worldcoin", { redirect: false });
      if (result?.error) {
        console.error("Sign-in failed:", result.error);
        // Proceed to avatars page even if sign-in fails
        router.push("/avatars");
      } else if (result?.ok) {
        router.push("/avatars");
      }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      // Proceed to avatars page if there's an unexpected error
      router.push("/avatars");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-pink-100 p-6 max-w-sm mx-auto h-[100vh] font-poppins">
      <div className="flex flex-col items-center">
      <div className="bg-[#FF66C4] border-[2px] border-white w-full rounded-2xl relative overflow-hidden">
  <div className="absolute inset-0 z-0 top-7">
    <Image
      src="/hero_balls.png"
      alt="balls"
      layout="fill"
      objectFit="cover"
    />
  </div>
  <div className="relative z-10">
    <Image
      src="/animeLogin.png"
      alt="Anime character"
      width={1000}
      height={1000}
      className="object-cover"
    />
  </div>
</div>
        <h2 className="text-[#252037] text-[2.125rem] text-center font-semibold mt-[2rem]">
          Own your 
        </h2>
        <h2 className="text-[#252037] text-[2.125rem] text-center font-semibold mb-2">
          virtual identity 
        </h2>
        <p className="text-[#252037] text-center mb-[2.5rem] text-opacity-80">
          Validate your personhood and unlock new opportunities
        </p>
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`bg-[#FF66C4] text-white font-semibold py-[1.2rem] px-[3.8rem] rounded-xl ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-400"
          }`}
        >
          {isLoading ? "Processing..." : "Sign in with Worldcoin ID"}
        </button>
      </div>
    </div>
  );
}
