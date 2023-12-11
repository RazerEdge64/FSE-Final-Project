const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reputation: { type: Number, default: 0 }, // New field for User reputation
    joinDate: { type: Date, default: Date.now }, // New field for join date

    // You can add more fields as needed
});

/**
 *
 * const userSchema = new mongoose.Schema({
 *     username: { type: String, required: true, unique: true },
 *     email: { type: String, required: true, unique: true },
 *     password: { type: String, required: true },
 *     joinDate: { type: Date, default: Date.now },
 *     reputation: { type: Number, default: 0 },
 *     questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
 *     tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
 *     answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
 *     // Additional fields can be added as needed
 * });
 */

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

// Method to compare the password
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log("compare password");
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
