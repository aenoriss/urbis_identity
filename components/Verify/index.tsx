'use client'

import { useState, useEffect } from 'react';
import { MiniKit, VerifyCommandInput, VerificationLevel, ResponseEvent, ISuccessResult, MiniAppVerifyActionPayload, verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";

export default function WorldcoinVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.log("MiniKit is not installed");
      return;
    }

    const handleVerification = async (response: MiniAppVerifyActionPayload) => {
      if (response.status === "error") {
        console.log("Error payload", response);
        setVerificationStatus('error');
        setVerificationMessage("Verification error occurred");
        return;
      }

      try {
        const result = await verifyProof(
          response as ISuccessResult,
          "your-action-id", // Replace with your actual action ID
          "0x12312" // Optional signal
        );

        if (result.success) {
          setVerificationStatus('success');
          setVerificationMessage(result.message);
        } else {
          setVerificationStatus('error');
          setVerificationMessage(result.message);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus('error');
        setVerificationMessage("An unexpected error occurred");
      }
    };

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, handleVerification);

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  const startVerification = () => {
    const verifyPayload: VerifyCommandInput = {
      action: "your-action-id", // Replace with your actual action ID
      signal: "0x12312", // Optional additional data
      verification_level: VerificationLevel.Orb,
    };

    MiniKit.commands.verify(verifyPayload);
    setVerificationStatus('pending');
    setVerificationMessage("Verification in progress...");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Worldcoin Verification</h1>
      <button
        onClick={startVerification}
        disabled={verificationStatus === 'pending'}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {verificationStatus === 'pending' ? 'Verifying...' : 'Start Verification'}
      </button>
      {verificationMessage && (
        <p className={`mt-4 ${verificationStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {verificationMessage}
        </p>
      )}
    </div>
  );
}