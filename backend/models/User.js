const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const memoryStorage = require("../memory-storage")

// Check if mongoose is connected
const isConnected = mongoose.connection.readyState === 1

let User

if (isConnected) {
  const userSchema = new mongoose.Schema(
    {
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
      name: {
        type: String,
        required: true,
        trim: true,
      },
      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    },
    {
      timestamps: true,
    },
  )

  // Hash password before saving
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
      next()
    } catch (error) {
      next(error)
    }
  })

  // Compare password method
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }

  User = mongoose.model("User", userSchema)
} else {
  // Fallback to memory storage
  User = class {
    constructor(userData) {
      Object.assign(this, userData)
    }

    async save() {
      const hashedPassword = await bcrypt.hash(this.password, 10)
      const userData = {
        ...this,
        password: hashedPassword
      }
      return memoryStorage.createUser(userData)
    }

    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password)
    }

    static async create(userData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      return memoryStorage.createUser({
        ...userData,
        password: hashedPassword
      })
    }

    static async findOne(query) {
      return memoryStorage.findUser(query)
    }

    static async findById(id) {
      return memoryStorage.findUser({ _id: id })
    }
  }
}

module.exports = User
