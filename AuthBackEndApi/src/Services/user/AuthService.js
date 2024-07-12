const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class AuthService {
  constructor(userRepository, otpStore, transporter) {
    this.userRepository = userRepository;
    this.otpStore = otpStore;
    this.transporter = transporter;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    this.otpStore.set(email, { otp, expiry: otpExpiry });

    await this.transporter.sendMail({
      from: 'corporatehariom@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    return { message: 'OTP sent to email' };
  }

  async verifyOtp(email, otp) {
    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    const storedOtp = this.otpStore.get(email);
    if (!storedOtp) {
      throw new Error('Invalid or expired OTP');
    }

    const { otp: correctOtp, expiry } = storedOtp;
    if (Date.now() > expiry) {
      this.otpStore.delete(email);
      throw new Error('OTP has expired');
    }

    if (otp !== correctOtp) {
      throw new Error('Invalid OTP');
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
     
  const userIdForRoles = await this.userRepository.findUserIdByEmail(email)
    // get the role name with the help of UserId
   const roleName = await this.userRepository.findRoleById(userIdForRoles)


   console.log("Role Name: ",roleName)
    const token = jwt.sign(
      { organizationId: user.organizationId, username: user.username,RoleName:roleName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    this.otpStore.delete(email);
    return { message: 'Login successful', token };
  }
}

module.exports = AuthService;
