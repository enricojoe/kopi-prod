import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv  from "dotenv"

dotenv.config()

const saltRound = 1

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password) => {
  return bcrypt.hash(password, 1)
}

export const createJWT = (user) => {
  const token = jwt.sign({
      id: user.id, 
      username: user.username,
      role: user.role
    }, 
    process.env.JWT_SECRET
  )
  return token
}

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    res.status(401)
    res.json({message: "Tidak authorized"})
    return
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    res.status(401)
    res.json({message: "Token tidak valid"})
    return
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (e) {
    console.log(e)
    res.status(401)
    res.json({message: "Tidak authorized"})
    return
  }
}