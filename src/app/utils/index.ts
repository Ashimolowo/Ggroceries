// Minimal shape of a Clerk API error — avoids depending on @clerk/types directly,
// since it's a transitive dependency and not guaranteed to resolve.
type ClerkLikeError = {
  code?: string;
  message?: string;
  longMessage?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  form_identifier_not_found: "We couldn't find an account with that email.",
  form_password_incorrect: "That password doesn't look right. Try again.",
  form_identifier_exists: "An account with that email already exists.",
  form_password_pwned:
    "That password has appeared in a data breach. Please choose a different one.",
  form_password_length_too_short:
    "Your password needs to be at least 8 characters.",
  form_param_format_invalid: "Please enter a valid email address.",
  verification_expired:
    "That code has expired. Request a new one and try again.",
  form_code_incorrect: "That code isn't right. Double-check and try again.",
  too_many_requests: "Too many attempts. Please wait a moment and try again.",
  // utils/clerkErrors.ts — add these two lines to ERROR_MESSAGES
  verification_already_verified:
    "That code was already used. If you already verified, try signing in.",
  session_exists: "You're already signed in on this device.",
};

export function getFriendlyErrorMessage(
  errors: ClerkLikeError[] | ClerkLikeError | null | undefined,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!errors) return "";

  const first = Array.isArray(errors) ? errors[0] : errors;
  if (!first) return "";

  return (
    ERROR_MESSAGES[first.code ?? ""] ??
    first.longMessage ??
    first.message ??
    fallback
  );
}

export function getUnexpectedErrorMessage(): string {
  return "Something went wrong. Check your connection and try again.";
}


