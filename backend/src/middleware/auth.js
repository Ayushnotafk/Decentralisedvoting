const jwt = require('jsonwebtoken')
const User = require('../models/User')

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET in environment')
  return secret
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' },
  )
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [, token] = header.split(' ')
    if (!token) return res.status(401).json({ error: 'Missing token' })

    const payload = jwt.verify(token, getJwtSecret())
    const user = await User.findById(payload.sub).lean()
    if (!user) return res.status(401).json({ error: 'Invalid token' })

    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = { signToken, requireAuth }

