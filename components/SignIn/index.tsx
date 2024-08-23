import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  const [signInError, setSignInError] = React.useState(null);

  const handleSignIn = async () => {
    const result = await signIn("your-provider", { redirect: false });
    console.log("Sign-in result:", result);
    if (result?.error) {
      setSignInError(result.error);
    }
  };

  if (session) {
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button onClick={handleSignIn}>Sign in</button>
        {signInError && <p>Error: {signInError}</p>}
      </>
    );
  }
};