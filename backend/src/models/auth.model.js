import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["superadmin","admin","finance","detail","enroll"],
      default: "enroll",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
        type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
    resetOTP: {
      type: String,
      default: null
    },
    resetOTPExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};



const User = mongoose.model("User", userSchema);

export default User;
