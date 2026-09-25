const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens } = require("../utils/tokens");
const register = async (req, res) => { const { name, email, password, role } = req.body; const existing = await User.findOne({ email }); if (existing) return res.status(400).json({ message: "Email already in use" }); const user = await User.create({ name, email, password, role }); const tokens = generateTokens(user._id, user.role); res.status(201).json({ message: "Registered successfully", ...tokens, user: { id: user._id, name: user.name, role: user.role } }); };
const login = async (req, res) => { const { email, password } = req.body; const user = await User.findOne({ email }); if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid credentials" }); const tokens = generateTokens(user._id, user.role); res.json({ message: "Logged in", ...tokens, user: { id: user._id, name: user.name, role: user.role } }); };
const refresh = async (req, res) => { const token = req.headers["x-refresh-token"]; if (!token) return res.status(401).json({ message: "No refresh token" }); try { const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); res.json({ message: "Tokens refreshed", ...generateTokens(decoded.userId, decoded.role) }); } catch { res.status(401).json({ message: "Invalid refresh token" }); } };
const logout = (req, res) => res.json({ message: "Logged out" });
module.exports = { register, login, refresh, logout };
