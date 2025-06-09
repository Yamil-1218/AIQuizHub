import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'devsecret'

interface DecodedToken {
  id: string
  role: 'student' | 'instructor'
  email: string
  fullName: string
  institution?: string
  department?: string
  iat: number
  exp: number
}

export function generateToken(payload: Omit<DecodedToken, 'iat' | 'exp'>) {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<DecodedToken> {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken
    
    // Validación adicional de la estructura
    if (!decoded.id || !decoded.role || !decoded.email) {
      throw new Error('Token con estructura inválida')
    }

    return decoded
  } catch (error) {
    console.error('Error en verificación de token:', error)
    throw new Error('Token inválido o expirado')
  }
}

export async function getUserFromToken(token: string) {
  try {
    const user = await verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}
