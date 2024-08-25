import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const app_id = process.env.APP_ID as `app_${string}`;
    
    if (!app_id) {
      console.error("APP_ID is not set");
      return NextResponse.redirect(new URL('/avatar', req.url));
    }

    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse;
    
    console.log(verifyRes);

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      // You can still return some data along with the redirect
      return NextResponse.json(
        { verifyRes, status: 200, message: "Verification successful" },
        { status: 200, headers: { 'Location': '/avatar' } }
      );
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      return NextResponse.json(
        { verifyRes, status: 400, message: "Verification failed" },
        { status: 400, headers: { 'Location': '/avatar' } }
      );
    }
  } catch (error) {
    console.error("Error during verification:", error);
    // In case of any error, still redirect to /avatar
    return NextResponse.redirect(new URL('/avatar', req.url));
  }
}