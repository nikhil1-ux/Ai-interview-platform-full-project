import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "recruiter" ],
       
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resumeUrl: {
    type: String,
    default: "",
},
    resumeText: {
    type: String,
    default: "",
},
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.JWT_ACCESS_SECRET,
       { expiresIn: process.env.ACCESS_EXPIRY } 
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_SECRET,
     {expiresIn: process.env.REFRESH_EXPIRY}
    
  );
};

userSchema.methods.generateTokens = function () {
  return {
    accessToken: this.generateAccessToken(),
    refreshToken: this.generateRefreshToken(),
  };
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model("User",userSchema);