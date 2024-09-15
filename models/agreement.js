const { version } = require("i18n");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const AgreementSchema = new Schema({
    agreementURL: { type: String, required: true},
    version: { type: String, required: true, unique: true }
})


const Agreement = mongoose.model('Agreement', AgreementSchema)

module.exports = Agreement 

