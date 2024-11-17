import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    primarySport: {
      type: String,
      required: true,
    },
    primaryPositionRole: {
      type: String,
    },
    height: {
      type: String, // Consider a format like "6'2" or centimeters
    },
    weight: {
      type: String, // Could be in kg or lbs
    },
    dominantHandFoot: {
      type: String,
      enum: ["Right", "Left"],
    },
    bio: {
      type: String, // A brief bio/description
      trim: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: true, // Must be true to proceed
    },
    profileImg: {
      cloudinary_public_id: { type: String },
      url: { type: String },
    },
    password: { type: String, required: true },
    isSuperAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
