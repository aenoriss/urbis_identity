// File: app/avatars/page.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function AvatarsPage() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");
  const router = useRouter();

  useEffect(() => {
    if (authError === "OAuthCallback") {
      // Handle the error, e.g., show a message to the user
      console.log("Authentication error occurred. Please try again.");
    }
  }, [authError]);

  const handleSelect = () => {
    // Redirect the user to the desired page
    router.push("/validate"); // Replace "/next-page" with your desired route
  };

  return (
    <div className="bg-pink-100 mx-auto min-h-screen overflow-hidden">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full">
          <svg
            width="390"
            height="207"
            viewBox="0 0 390 207"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="193.5" cy="74.5" rx="242.5" ry="132.5" fill="#FF66C4" />
          </svg>
        </div>

        <h2 className="relative z-10 text-[#fff] text-[2.125rem] text-center font-semibold pt-[3rem]">
          Choose
        </h2>
        <h2 className="relative z-10 text-[#fff] text-[2.125rem] text-center font-semibold">
          Your Avatar
        </h2>
      </div>
      {authError === "OAuthCallback" && (
        <p>
          There was an issue with authentication. Please try again or choose a
          different method.
        </p>
      )}
      <h4 className="font-medium text-[#252037] mt-[10rem] text-center text-[1.625rem]">
        Emberlith
      </h4>
      <div className="relative pt-[2rem]">
        <Image
          src="/emberlith-.png"
          alt="Anime character"
          width={500}
          height={500}
          objectFit="contain"
          className="max-w-[16rem] mx-auto block relative z-0"
        />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="flex justify-between w-full px-8 mb-6 z-20">
            <button className="text-gray-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button className="text-gray-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSelect}
            className="bg-[#FF66C4] text-white font-bold py-3 px-12 rounded-xl mx-auto mb-4 border border-white z-20"
          >
            Select
          </button>
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FF66C4] to-transparent z-0"></div>
        </div>
      </div>
    </div>
  );
}
