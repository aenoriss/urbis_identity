import Image from "next/image";
import { useState, useEffect } from "react";
import { MiniKit, ResponseEvent, PayCommandInput, Tokens, tokenToDecimals, MiniAppWalletAuthPayload, MiniAppPaymentPayload } from '@worldcoin/minikit-js';

export default function ProfileMockupPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      setError("MiniKit is not installed");
      return;
    }

    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleWalletAuthResponse);
    MiniKit.subscribe(ResponseEvent.MiniAppPayment, handlePaymentResponse);

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  const handleWalletAuthResponse = async (payload: MiniAppWalletAuthPayload) => {
    if (payload.status === "success") {
      try {
        const response = await fetch("/api/complete-siwe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: payload,
            nonce: await getNonce(),
          }),
        });
        const result = await response.json();
        if (result.isValid) {
          setIsAuthenticated(true);
          setError(null);
        } else {
          setError("Authentication failed: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        setError("Error during authentication: " + error.message);
      }
    } else if (payload.status === "error") {
      setError("Wallet authentication failed: " + payload.error);
    }
  };

  const handlePaymentResponse = async (response: MiniAppPaymentPayload) => {
    if (response.status === "success") {
      try {
        const res = await fetch(`/api/confirm-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: response }),
        });
        const payment = await res.json();
        if (payment.success) {
          console.log("Payment successful!");
          setError(null);
        } else {
          setError("Payment failed or is still processing");
        }
      } catch (error) {
        setError("Error confirming payment: " + error.message);
      }
    } else if (response.status === "error") {
      setError("Payment failed: " + response.error);
    }
  };

  const getNonce = async () => {
    try {
      const res = await fetch(`/api/nonce`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      try {
        const { nonce } = JSON.parse(text);
        return nonce;
      } catch (e) {
        console.error("Server response:", text);
        throw new Error("Invalid JSON in server response");
      }
    } catch (error) {
      console.error("Error fetching nonce:", error);
      setError(`Error fetching nonce: ${error.message}`);
      throw error;
    }
  };

  const signInWithWallet = async () => {
    try {
      setError(null);
      const nonce = await getNonce();
      if (!nonce) {
        throw new Error("Failed to obtain nonce");
      }
      await MiniKit.commands.walletAuth({
        nonce: nonce,
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: "Sign in to contribute",
      });
    } catch (error) {
      console.error("Error during sign in:", error);
      setError(`Error during sign in: ${error.message}`);
    }
  };

  const initiatePayment = async () => {
    try {
      const res = await fetch('/api/initiate-payment', {
        method: 'POST'
      });
      const { id } = await res.json();

      const payload: PayCommandInput = {
        reference: id,
        to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Replace with your actual address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
          },
        ],
        description: "Contribution payment",
      };

      if (MiniKit.isInstalled()) {
        await MiniKit.commands.pay(payload);
      } else {
        setError("MiniKit is not installed");
      }
    } catch (error) {
      setError("Error initiating payment: " + error.message);
    }
  };

  const handleContribute = () => {
    if (!isAuthenticated) {
      signInWithWallet();
    } else {
      initiatePayment();
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Image
        src="/profile_mockup.png"
        alt="Profile Mockup"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute bottom-0 left-0 w-full p-4 z-10 flex flex-col items-center">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <button 
          onClick={handleContribute}
          className="bg-white text-[#FF66C4] font-semibold py-3 px-6 rounded-xl"
        >
          {isAuthenticated ? "Contribute Now!" : "Sign in to Contribute"}
        </button>
      </div>
    </div>
  );
}