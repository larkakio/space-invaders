import { farcasterConfig } from "@/farcaster.config";
import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    accountAssociation: farcasterConfig.accountAssociation,
    miniapp: {
      ...farcasterConfig.miniapp,
      version: "1",
    },
  };
  return NextResponse.json(config);
}
