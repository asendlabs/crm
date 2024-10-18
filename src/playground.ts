import { googleOAuthClient } from "@/lib/lucia";
import { generateCodeVerifier, generateState } from "arctic";

async function main() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const authUrl = await googleOAuthClient.createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
    },
  );
  console.log(authUrl.toString());
}

main();
