require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { authRouter } = require('./routes/auth')
const { verificationRouter } = require('./routes/verification')
const User = require('./models/User')

const PORT = Number(process.env.PORT || 4000)
const MONGODB_URI = process.env.MONGODB_URI

async function start() {
  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment')
  }

  await mongoose.connect(MONGODB_URI)

  // Create a bootstrap admin account for the demo (only if env vars exist)
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD
  const adminName = process.env.ADMIN_BOOTSTRAP_NAME || 'Admin'

  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ role: 'admin' }).lean()
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12)
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'admin',
        verified: true,
      })
      // eslint-disable-next-line no-console
      console.log(`Bootstrap admin created: ${adminEmail}`)
    }
  }

  const app = express()
  app.use(express.json({ limit: '1mb' }))

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || true,
      credentials: true,
    }),
  )

  app.get('/health', (_req, res) => res.json({ ok: true }))

  app.use('/auth', authRouter)
  app.use('/verification', verificationRouter)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

