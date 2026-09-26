// Smart post-login routing:
//   ?next= wins → else a profile exists → /dashboard → else onboarding.
// Onboarding is just "create your individual profile" and lives at /profile/me.
//   - 404 on /profiles/me ⇒ route to /profile/me (with `setup=1` so the empty
//     state shows the create form on top of the same page).

import { ApiError } from "./api";
import { getMyProfile } from "./api-helpers";

export async function resolvePostLoginRoute(): Promise<string> {
  const next =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null;
  if (next && next.startsWith("/")) return next;

  try {
    await getMyProfile();
    return "/dashboard";
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return "/profile/me?setup=1";
    }
    // Unexpected → land somewhere safe.
    return "/dashboard";
  }
}
