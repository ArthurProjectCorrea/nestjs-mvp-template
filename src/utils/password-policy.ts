export function validatePassword(password: string) {
  const min = Number(process.env.PASSWORD_MIN_LENGTH || 10);
  if (password.length < min) return 'minimum length';
  if (process.env.PASSWORD_REQUIRE_UPPER === 'true' && !/[A-Z]/.test(password))
    return 'uppercase missing';
  if (process.env.PASSWORD_REQUIRE_LOWER === 'true' && !/[a-z]/.test(password))
    return 'lowercase missing';
  if (process.env.PASSWORD_REQUIRE_NUMBER === 'true' && !/[0-9]/.test(password))
    return 'number missing';
  if (
    process.env.PASSWORD_REQUIRE_SYMBOL === 'true' &&
    !/[^A-Za-z0-9]/.test(password)
  )
    return 'symbol missing';
  return null;
}
