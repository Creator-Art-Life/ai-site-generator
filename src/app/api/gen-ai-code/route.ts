import { NextResponse } from "next/server";
import { GenAiCode } from "../../../../configs/AiModel";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = result.response.text();
    return NextResponse.json(JSON.parse(resp));
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
