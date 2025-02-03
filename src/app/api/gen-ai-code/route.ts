import { NextResponse } from "next/server";
import { GenAiCode } from "../../../../configs/AiModel";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 сек

  try {
    const result = await GenAiCode.sendMessage(prompt, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const resp = result.response.text();
    try {
      return NextResponse.json(JSON.parse(resp));
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON response" });
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
