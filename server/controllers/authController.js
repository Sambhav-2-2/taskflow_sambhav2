const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const userId = uuidv4();
        const now = new Date().toISOString();

        const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, name, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        insertUser.run(userId, email, hashedPassword, name, now, now);

        // Get created user
        const user = db.prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?').get(userId);

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user'
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
const getProfile = (req, res) => {
    try {
        const user = db.prepare('SELECT id, email, name, createdAt, updatedAt FROM users WHERE id = ?')
            .get(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get current user
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let hashedPassword = user.password;

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required to set a new password'
                });
            }

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            const salt = await bcrypt.genSalt(12);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        const now = new Date().toISOString();

        // Update user
        const updateUser = db.prepare(`
      UPDATE users 
      SET name = ?, password = ?, updatedAt = ?
      WHERE id = ?
    `);

        updateUser.run(name || user.name, hashedPassword, now, userId);

        // Get updated user
        const updatedUser = db.prepare('SELECT id, email, name, createdAt, updatedAt FROM users WHERE id = ?')
            .get(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
