import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { payload, action, signal } = req.body;
  const app_id = process.env.WLD_APP_ID as `app_${string}`;

  if (!app_id) {
    return res.status(500).json({ message: "WLD_APP_ID is not set" });
  }

  try {
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse;

    if (verifyRes.success) {
      return res.status(200).json({ success: true, message: "Verification successful" });
    } else {
      return res.status(400).json({ success: false, message: "Verification failed" });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
}