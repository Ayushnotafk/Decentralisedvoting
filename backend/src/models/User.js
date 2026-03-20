const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'voter', 'observer'], default: 'voter' },
    walletAddress: { type: String, default: null, lowercase: true, trim: true },

    // Used by frontend to gate voting
    verified: { type: Boolean, default: false },

    // Off-chain verification record (Aadhaar/college ID demo)
    verification: {
      status: {
        type: String,
        enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
        default: 'unsubmitted',
      },
      idType: { type: String, enum: ['aadhaar', 'college'], default: null },
      idNumberHash: { type: String, default: null },
      requestedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)

