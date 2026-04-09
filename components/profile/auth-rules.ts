const RESERVED_USERNAMES = new Set([
  "admin",
  "support",
  "nightpulse",
  "help",
  "security",
  "staff",
]);

const offensivePattern = /(fuck|shit|bitch|asshole)/i;

export function validateUsername(raw: string, existing: string[]) {
  const value = raw.trim().toLowerCase();

  if (!value) return "Username is required.";
  if (value.length < 3 || value.length > 20) return "Username must be 3–20 characters.";
  if (!/^[a-z0-9._]+$/.test(value)) return "Use lowercase letters, numbers, periods, or underscores only.";
  if (value.includes(" ")) return "Username cannot contain spaces.";
  if (RESERVED_USERNAMES.has(value)) return "This username is reserved.";
  if (offensivePattern.test(value)) return "This username is unavailable.";
  if (existing.includes(value)) return "This username is already taken.";

  return "";
}

export function validatePassword(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  return "";
}
