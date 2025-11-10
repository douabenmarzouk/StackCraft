import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function() {
      return !this.authProvider;
    }
  },
  lastName: {
    type: String,
    required: function() {
      return !this.authProvider;
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: function() {
      return !this.authProvider;
    }
  },
  job: {
    type: String,
    enum: ['devops', 'frontend', 'backend', 'cybersecurity', 'data-science'], // ← CHANGÉ
    required: true
  },
  authProvider: {
    type: String,
    enum: ['google', 'linkedin', null],
    default: null
  },
  authId: {
    type: String
  },
  profilePicture: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.index(
  { authProvider: 1, authId: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { authProvider: { $ne: null } }
  }
);

userSchema.methods.isAuthUser = function() {
  return this.authProvider !== null;
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`.trim();
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;