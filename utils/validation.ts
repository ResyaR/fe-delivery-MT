// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Username validation
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username harus diisi' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username minimal 3 karakter' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'Username maksimal 20 karakter' };
  }
  
  // Only allow alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username hanya boleh huruf, angka, dan underscore' };
  }
  
  return { valid: true };
}

// Password strength validation (returns 0-4)
export function validatePassword(password: string): { strength: number; feedback: string } {
  if (!password) {
    return { strength: 0, feedback: 'Password harus diisi' };
  }
  
  let strength = 0;
  
  // Level 1: At least 8 characters
  if (password.length >= 8) {
    strength = 1;
  } else {
    return { strength: 0, feedback: 'Password minimal 8 karakter' };
  }
  
  // Level 2: Has both uppercase and lowercase
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  if (hasUpperCase && hasLowerCase) {
    strength = 2;
  }
  
  // Level 3: Has numbers
  const hasNumber = /[0-9]/.test(password);
  if (strength >= 2 && hasNumber) {
    strength = 3;
  }
  
  // Level 4: Has special characters
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (strength >= 3 && hasSpecialChar) {
    strength = 4;
  }
  
  // Generate feedback based on strength
  const feedbackMessages = {
    0: 'Password terlalu lemah',
    1: 'Password lemah - tambahkan huruf besar dan kecil',
    2: 'Password cukup - tambahkan angka',
    3: 'Password kuat - tambahkan karakter spesial untuk password sangat kuat',
    4: 'Password sangat kuat',
  };
  
  return {
    strength,
    feedback: feedbackMessages[strength as keyof typeof feedbackMessages],
  };
}

// Full name validation
export function validateFullName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: 'Nama lengkap harus diisi' };
  }
  
  if (name.length < 3) {
    return { valid: false, error: 'Nama lengkap minimal 3 karakter' };
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'Nama lengkap maksimal 50 karakter' };
  }
  
  // Only allow letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Nama hanya boleh huruf dan spasi' };
  }
  
  return { valid: true };
}

// Get password strength color
export function getPasswordStrengthColor(strength: number): string {
  const colors = {
    0: '#DC2626', // red-600
    1: '#F59E0B', // amber-500
    2: '#EAB308', // yellow-500
    3: '#22C55E', // green-500
    4: '#16A34A', // green-600
  };
  return colors[strength as keyof typeof colors] || colors[0];
}

// Get password strength label
export function getPasswordStrengthLabel(strength: number): string {
  const labels = {
    0: 'Sangat Lemah',
    1: 'Lemah',
    2: 'Cukup',
    3: 'Kuat',
    4: 'Sangat Kuat',
  };
  return labels[strength as keyof typeof labels] || labels[0];
}

