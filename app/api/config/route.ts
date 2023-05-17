import { NextResponse } from "next/server";

import { getServerSideConfig } from "../../config/server";

const serverConfig = getServerSideConfig();

// Danger! Don not write any secret value here!
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
  hideUserApiKey: serverConfig.hideUserApiKey,
  enableGPT4: serverConfig.enableGPT4,
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
}

async function captureAndRethrow(e: any) {
  if (!e.stack?.includes("\n")) {
    Error.captureStackTrace(e);
  }
  throw e;
}

async function handle() {
  try {
    return NextResponse.json(DANGER_CONFIG);
  } catch (err) {
    captureAndRethrow(err);
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
