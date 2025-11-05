import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validateCuId(cuId: string): boolean {
  const cuIdRegex = /^CU[0-9]{3,8}$/
  return cuIdRegex.test(cuId)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 5 || password.length > 8) {
    return { valid: false, message: "Password must be 5-8 characters long" }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { valid: false, message: "Password must contain uppercase, lowercase, and numbers" }
  }

  return { valid: true }
}
