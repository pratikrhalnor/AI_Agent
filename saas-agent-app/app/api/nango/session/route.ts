import { NextResponse } from "next/server";
import { Nango } from "@nangohq/node";
import { NANGO_CONFIG } from "@/config/nango";

const nango = new Nango({
  host: NANGO_CONFIG.hostedURL,
  secretKey: NANGO_CONFIG.secretKey,
});

export async function POST() {
  try {
    const { data } = await nango.createConnectSession({
      tags: {
        end_user_id: `user_${Date.now()}`,
      },
      allowed_integrations: ["google-mail","github",],

    });

    return NextResponse.json({
      success: true,
      token: data.token,
      connect_link: data.connect_link,
      expires_at: data.expires_at,
    });
  } catch (error) {
    console.error("Nango session error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}