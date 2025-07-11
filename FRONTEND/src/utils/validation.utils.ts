export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function getPasswordStrength(password: string): 'Weak' | 'Medium' | 'Strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) score++;
  if (score <= 1) return 'Weak';
  if (score === 2) return 'Medium';
  return 'Strong';
}
