"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MiniKit, ResponseEvent, PayCommandInput, Tokens, tokenToDecimals, MiniAppWalletAuthSuccessPayload, MiniAppPaymentPayload } from '@worldcoin/minikit-js';

export default function ProfileMockupPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleWalletAuthResponse);
    MiniKit.subscribe(ResponseEvent.MiniAppPayment, handlePaymentResponse);

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  const handleWalletAuthResponse = async (payload: MiniAppWalletAuthSuccessPayload) => {
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
        } else {
          console.error("Authentication failed:", result.message);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
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
          // You might want to update the UI or state here to reflect the successful payment
        } else {
          console.log("Payment failed or is still processing");
          // Handle failed or processing payment
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    }
  };

  const getNonce = async () => {
    try {
      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();
      return nonce;
    } catch (error) {
      console.error("Error fetching nonce:", error);
      throw error;
    }
  };

  const signInWithWallet = async () => {
    try {
      const nonce = await getNonce();
      await MiniKit.commands.walletAuth({
        nonce: nonce,
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: "Sign in to contribute",
      });
    } catch (error) {
      console.error("Error during sign in:", error);
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
        console.error("MiniKit is not installed");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
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
      <div className="absolute bottom-[7%] left-0 w-full p-4 z-10 flex justify-center">
        <button 
          onClick={handleContribute}
          className="bg-white text-[#FF66C4] w-[75%] font-semibold py-3 px-6 rounded-xl"
        >
          {isAuthenticated ? "Contribute Now!" : "Sign in to Contribute"}
        </button>
      </div>
    </div>
  );
}