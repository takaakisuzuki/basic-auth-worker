export interface Env {
  BASIC_AUTH_USER: string;
  BASIC_AUTH_PASS: string;
}

const REALM = "put username and password";

/**
 * Authorization ヘッダーから Basic 認証の資格情報を検証する
 */
function isAuthorized(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const encoded = authHeader.slice(6); // "Basic " の後ろ
  const decoded = atob(encoded);
  const [username, ...rest] = decoded.split(":");
  const password = rest.join(":"); // パスワードに ":" が含まれるケースに対応

  return username === env.BASIC_AUTH_USER && password === env.BASIC_AUTH_PASS;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Basic 認証チェック
    if (!isAuthorized(request, env)) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="${REALM}"`,
        },
      });
    }

    // 認証通過後はオリジンへプロキシ
    return fetch(request);
  },
};
