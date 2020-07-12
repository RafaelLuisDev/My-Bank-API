import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    agencia: {
        type: Number,
        required: true,
    },
    conta: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) throw new Error('Saldo negativo!');
        },
    },
});

const accountModel = mongoose.model('account', accountSchema, 'accounts');

export { accountModel };
