import jwt from 'jsonwebtoken'

export default {
  sign: (payload, JWTPrivateKey) => {
    const signOptions = {
      issuer: "SikopiServer",
      audience: "SikopiClient",
      expiresIn: "30m",
      algorithm: "RS256"
    }
    return jwt.sign(payload, JWTPrivateKey, signOptions)
  },
  verify: (token, JWTPublicKey) => {
    const verifyOptions = {
      issuer: "SikopiServer",
      audience: "SikopiClient",
      expiresIn: "30m",
      algorithm: ["RS256"]
    }
    try {
      return jwt.verify(token, JWTPublicKey, verifyOptions)
    } catch (e) {
      return false
    }
  },
  decode: (token) => {
    return jwt.decode(token, {complete: true})
  }
}