import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode.sendMessage(prompt);
    const resp = await result.response.text(); // Дождаться строки ответа
    return NextResponse.json(JSON.parse(resp)); // Парсим JSON-ответ
  } catch (error: any) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json(
      { error: error.message || "Произошла ошибка" },
      { status: 500 }
    );
  }
}
