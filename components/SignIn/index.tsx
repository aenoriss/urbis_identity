"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
    return (
      <>
        <button onClick={() => signIn()}>Sign In With Worldcoin ID</button>
      </>
    );
};
