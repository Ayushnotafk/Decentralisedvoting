const express = require('express')
const bcrypt = require('bcrypt')
const { z } = require('zod')

const User = require('../models/User')
const { signToken, requireAuth } = require('../middleware/auth')

const authRouter = express.Router()

const RegisterSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(200),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { name, email, password } = parsed.data
  const existing = await User.findOne({ email }).lean()
  if (existing) return res.status(409).json({ error: 'Email already registered' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash, role: 'voter' })
  const token = signToken(user)

  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  })
})

authRouter.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { email, password } = parsed.data
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

  const token = signToken(user)
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = req.user
  res.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      verified: user.verified,
    },
  })
})

module.exports = { authRouter }

