import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { promt } = await req.json();

  try {
    const result = await chatSession.sendMessage(promt);
    const AIResp = result.response.text();

    return NextResponse.json({ result: AIResp });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
