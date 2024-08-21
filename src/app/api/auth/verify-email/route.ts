import { svVerifyEmail } from "@/server/auth.server";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    const decodedEmail = decodeURIComponent(email as string).replace(/ /g, "+");

    console.log(decodedEmail);

    if (!token || !email) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
        },
      });
    }

    const serverResponse = await svVerifyEmail(decodedEmail, token);

    if (!serverResponse.success) {
      return new Response(JSON.stringify(serverResponse), {
        status: serverResponse.code,
        headers: {
          Location: "/login",
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }
}
