import { cookies } from 'next/headers';
import { parseGoogleFlow, type GoogleFlow } from '../lib/google-flow';

const FLOW_COOKIE_NAME = 'festividade_google_flow';
const FLOW_COOKIE_PATH = '/admin/login/google';
const FLOW_MAX_AGE_IN_SECONDS = 10 * 60;

function flowCookieOptions(maxAge: number): {
  httpOnly: true;
  sameSite: 'lax';
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: FLOW_COOKIE_PATH,
    maxAge,
  };
}

export async function storeGoogleFlow(flow: GoogleFlow): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    FLOW_COOKIE_NAME,
    JSON.stringify(flow),
    flowCookieOptions(FLOW_MAX_AGE_IN_SECONDS),
  );
}

export async function takeGoogleFlow(): Promise<GoogleFlow | null> {
  const cookieStore = await cookies();
  const flow = parseGoogleFlow(cookieStore.get(FLOW_COOKIE_NAME)?.value);
  cookieStore.set(FLOW_COOKIE_NAME, '', flowCookieOptions(0));
  return flow;
}
