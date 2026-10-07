const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address with domain',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      select: false, // Do not return passwordHash in queries by default
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER', 'TECHNICIAN', 'SUPPORT_STAFF', 'ADMIN'],
      default: 'CUSTOMER',
      uppercase: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ['LOCAL', 'GOOGLE'],
      default: 'LOCAL',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ta', 'hi', 'te', 'ml'],
      default: 'en',
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
