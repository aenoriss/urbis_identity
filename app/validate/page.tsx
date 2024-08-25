"use client";

import Image from "next/image"
import { useRouter } from "next/navigation";


export default function AvatarsPage() {
    const router = useRouter();

    const handleSelect = () => {
        // Redirect the user to the desired page
        router.push("/profile"); // Replace "/next-page" with your desired route
      };

    return(
        <div className="bg-pink-100 px-4 min-h-screen mx-auto flex flex-col justify-center">
            <Image
            src="/sad_anime.png"
            alt="Anime character"
            width={500}
            height={500}
            objectFit="contain"
            className="pt-[3rem]"
            />

            <h3 className="font-semibold text-[1.6rem] text-[#252037] text-center my-6">Oh no... your token <br/> has expired</h3>

            <p className="text-[#252037] text-center mb-[2.5rem] text-opacity-80">
            Don’t worry you can recover it by <br/> validating your personhood via Orb+</p>
            <button onClick={handleSelect} className="bg-[#FF66C4] text-white font-semibold py-[1.2rem] px-[3.8rem] rounded-xl mx-auto">Recover token with Orb+</button>
        </div>
    )
}