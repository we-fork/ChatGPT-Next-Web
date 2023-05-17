import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestOpenai } from "../../common";

async function captureAndRethrow(e: any) {
  if (!e.stack?.includes("\n")) {
    Error.captureStackTrace(e);
  }
  throw e;
}

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    console.log("[OpenAI Route] params ", params);

    const authResult = auth(req);
    if (authResult.error) {
      return NextResponse.json(authResult, {
        status: 401,
      });
    }

    try {
      return await requestOpenai(req);
    } catch (e) {
      console.error("[OpenAI] ", e);
      return NextResponse.json(prettyObject(e));
    }
  } catch (err) {
    captureAndRethrow(err);
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
