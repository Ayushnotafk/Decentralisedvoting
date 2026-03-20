const express = require('express')
const crypto = require('crypto')
const { z } = require('zod')

const User = require('../models/User')
const { requireAuth } = require('../middleware/auth')

const verificationRouter = express.Router()

const RequestSchema = z.object({
  idType: z.enum(['aadhaar', 'college']),
  idNumber: z.string().min(4).max(50),
  walletAddress: z.string().min(6).max(80).optional(),
})

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex')
}

// User submits a verification request (demo: we store only that it's pending)
verificationRouter.post('/request', requireAuth, async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { idType, idNumber, walletAddress } = parsed.data
  const idNumberHash = sha256Hex(idNumber)

  const updates = {
    verified: false,
    verification: {
      status: 'pending',
      idType,
      idNumberHash,
      requestedAt: new Date(),
      approvedAt: null,
    },
  }

  if (walletAddress) updates.walletAddress = walletAddress.toLowerCase()

  await User.updateOne({ _id: req.user._id }, { $set: updates })
  res.json({ ok: true, status: 'pending' })
})

verificationRouter.get('/status', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).lean()
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({
    status: user.verified ? 'verified' : user.verification?.status ?? 'unverified',
    walletAddress: user.walletAddress ?? null,
  })
})

// Admin approves a user (demo admin endpoint)
verificationRouter.post('/admin/approve', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  const ApproveSchema = z
    .object({
      email: z.string().email().optional(),
      userId: z.string().min(1).optional(),
    })
    .refine((x) => Boolean(x.email || x.userId), 'Provide email or userId')

  const parsed = ApproveSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const filter = parsed.data.userId
    ? { _id: parsed.data.userId }
    : { email: parsed.data.email.toLowerCase() }

  const result = await User.updateOne(filter, {
    $set: {
      verified: true,
      'verification.status': 'verified',
      'verification.approvedAt': new Date(),
    },
  })

  res.json({ ok: true, matched: result.matchedCount, modified: result.modifiedCount })
})

verificationRouter.get('/admin/pending', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

  const pending = await User.find(
    { verified: false, 'verification.status': 'pending' },
    {
      name: 1,
      email: 1,
      walletAddress: 1,
      role: 1,
      'verification.idType': 1,
      'verification.requestedAt': 1,
      'verification.approvedAt': 1,
      verified: 1,
    },
  )
    .sort({ 'verification.requestedAt': -1 })
    .lean()

  res.json({
    ok: true,
    pending: pending.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      walletAddress: u.walletAddress,
      idType: u.verification?.idType ?? null,
      requestedAt: u.verification?.requestedAt ?? null,
      role: u.role,
      verified: u.verified,
    })),
  })
})

module.exports = { verificationRouter }

