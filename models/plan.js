const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0.00
    },
    phases: {
        type: String,
        required: true,
        default: ""
    }
}, {
    collection: "plans",
    timestamps: true
});

// Static method to migrate plan data
PlanSchema.statics.migrate = async function() {
    await this.deleteMany({});
};

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
