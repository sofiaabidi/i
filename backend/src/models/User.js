import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
      type: String,
      required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  provider: {
    type: String,
    default: 'local',
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);