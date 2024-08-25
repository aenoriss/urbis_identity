import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  return (
    <main>
      <div className="p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-bold">Hello, Tailwind CSS!</h1>
        <SignIn />
      </div>
    </main>
  );
}
