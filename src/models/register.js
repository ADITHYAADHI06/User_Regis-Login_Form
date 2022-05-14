const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registrationSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// to genrate token
registrationSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    // console.log(token);

    this.tokens = this.tokens.concat({ token: token });

    await this.save();
    return token;
  } catch (error) {
    res.send(e);
    console.log(`token error ${error}`);
  }
};

// registrationSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = jwt.sign(
//       { _id: this._id.toString() },
//       process.env.SECRET_KEY
//     );
//     console.log(token);

//     return token;
//   } catch (error) {
//     res.send(e);
//     // console.log(`token error ${error}`);
//   }
// };

// middlewere -1
// to hashing pasword
registrationSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(this.password);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Registration = new mongoose.model("UserRegistraion", registrationSchema);

module.exports = Registration;
