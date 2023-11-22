import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  codeForget: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetLink: {
    type: {
      data: {
        type: String,
        default: function () {
          return '';
        },
      },
    },
    default: {},
  },
  token: {
    type: String,
  },
});

export default mongoose.model('User', userSchema);
