const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    kyc: { type: mongoose.Schema.Types.ObjectId, ref: "KYC" },
    email: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      required: true,
      default: null,
    },
    nickName: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      required: true,
    },
    accounts: {
      type: Number,
      required: true,
      default: 0,
    },
    orders: {
      type: Number,
      required: true,
      default: 0,
    },
    referrals: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      enum: ["en"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    externalID1: {
      type: Number,
      default: null,
    },
    externalID2: {
      type: Number,
      default: null,
    },
    agreementSigned: {
      type: Boolean,
      default: false,
    },
    agreementID: {
      type: String,
      default: null,
    },
    agreementIP: {
      type: String,
      default: null,
    },
    agreementLegalName: {
      type: String,
      default: null,
    },
    agreementTs: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "allow", "block"],
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      default: null,
    },
    addressLine3: {
      type: String,
      default: null,
    },
  },
  {
    collection: "customers",
    timestamps: true,
  }
);

// Pre-save middleware to hash the password if it is new or modified
CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Static method to migrate customer data
CustomerSchema.statics.migrate = async function () {
  await this.deleteMany({});
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Uncomment and modify as needed to create a default customer
  // await this.create({
  //     email: 'customer@gmail.com',
  //     companyEmail: 'admin@gmail.com',
  //     password: hashedPassword,
  //     active: true,
  //     firstName: "TestFistName",
  //     lastName: "TestLastName",
  //     nickName: "TestNickName",
  //     birthday: new Date("2000-01-01"),
  //     accounts: 0,
  //     orders: 0,
  //     language: "en",
  //     phone: "+380 123456789",
  //     status: "allow",
  //     country: "Ukraine",
  //     state: "KR",
  //     city: "",
  //     zip: "00000",
  //     addressLine1: "",
  // })
};

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
