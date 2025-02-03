import { NextResponse } from "next/server";
import { GenAiCode } from "../../../../configs/AiModel";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = await result.response.text(); // Дождаться ответа
    return NextResponse.json(JSON.parse(resp));
  } catch (error: any) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
