require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Initialize Express app
const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://atorix-it.vercel.app',
  'https://atorix-blogs-server1.onrender.com'   // 👈 yaha apna new link daalo
    // (optional) aur bhi add kar sakte ho
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, server-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());



// Database connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!MONGODB_URI) {
  console.error('❌ MongoDB URI not found in environment variables');
  process.exit(1);
}


// Admin Model
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin'
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


// ✅ PRE-SAVE HOOK
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }


  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    next(error);
  }
});


// Methods
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


adminSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};


const Admin = mongoose.model('Admin', adminSchema);


// ==================== ROUTES ====================


// LOGIN ROUTE
app.post('/api/blog/login', async (req, res) => {
  try {
    const { username, password } = req.body;


    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide username/email and password' 
      });
    }


    // Check if login is using email (contains @) or username
    const isEmail = username.includes('@');

    let query;
    if (isEmail) {
      console.log('🔍 Login attempt with email:', username);
      query = { email: username.toLowerCase() };
    } else {
      console.log('🔍 Login attempt with username:', username);
      query = { username: username.toLowerCase() };
    }


    // Find admin by email or username
    const admin = await Admin.findOne(query).select('+password');

    console.log('👤 Admin found:', !!admin);


    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }


    const isPasswordMatch = await admin.matchPassword(password);
    console.log('✅ Password match result:', isPasswordMatch);


    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }


    const token = admin.getSignedJwtToken();
    admin.lastLogin = Date.now();
    await admin.save();


    console.log('✅ Login successful for:', username);


    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// ✅ FETCH ADMIN WITH USERNAME + PASSWORD VERIFICATION (NEW ROUTE)
app.post('/api/blog/fetch-admin-verified', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide both username and password' 
      });
    }

    console.log('🔍 Fetching admin with username:', username);

    // Check if login is using email (contains @) or username
    const isEmail = username.includes('@');

    let query;
    if (isEmail) {
      console.log('📧 Email detected, searching by email...');
      query = { email: username.toLowerCase() };
    } else {
      console.log('👤 Username detected, searching by username...');
      query = { username: username.toLowerCase() };
    }

    // Find admin by username or email (with password included)
    const admin = await Admin.findOne(query).select('+password');

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username/email or password' 
      });
    }

    // Verify password
    const isPasswordMatch = await admin.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username/email or password' 
      });
    }

    console.log('✅ Admin verified:', admin.username);

    // Return admin data WITHOUT password
    res.status(200).json({
      success: true,
      message: 'Admin verified and fetched successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Fetch admin verified error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// ✅ GET ALL ADMINS (WITHOUT PASSWORD)
app.get('/api/blog/admins', async (req, res) => {
  try {
    console.log('📋 Fetching all admins...');

    // Password exclude hota hai by default kyunki schema mein select: false hai
    const admins = await Admin.find().select('-password');

    console.log('✅ Found admins:', admins.length);


    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// ✅ GET SINGLE ADMIN BY ID (WITHOUT PASSWORD)
app.get('/api/blog/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching admin with ID:', id);


    // Password automatically exclude hota hai
    const admin = await Admin.findById(id).select('-password');

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }


    console.log('✅ Admin found:', admin.username);


    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// ✅ GET ADMIN BY USERNAME (WITHOUT PASSWORD)
app.get('/api/blog/admin/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('🔍 Fetching admin with username:', username);


    const admin = await Admin.findOne({ username }).select('-password');

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }


    console.log('✅ Admin found:', admin.username);


    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// ✅ FETCH ADMIN WITH PASSWORD (SECURE - DEBUGGING ONLY)
app.get('/api/blog/admin-debug/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔐 DEBUG: Fetching admin with PASSWORD for ID:', id);


    // Password explicitly include karo for debugging
    const admin = await Admin.findById(id).select('+password');

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }


    console.log('🔐 DEBUG - Admin password (first 10 chars):', admin.password.substring(0, 10));


    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        password: admin.password,
        passwordHashStart: admin.password.substring(0, 10) + '...'
      }
    });
  } catch (error) {
    console.error('Get admin debug error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// Protected route
app.get('/api/blog/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route' 
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const admin = await Admin.findById(decoded.id).select('-password');


    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route' 
      });
    }


    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route' 
    });
  }
});


// Connect to MongoDB and start server
// Force port to 5001 for blog server
const PORT = 5001;


// Function to create or update admin user
async function createOrUpdateAdmin(username, password, email, role = 'admin') {
  try {
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      console.log(`ℹ️ Admin '${username}' already exists. Updating password if needed...`);
      // Update password if it's not hashed
      if (!existingAdmin.password.startsWith('$2a$') && !existingAdmin.password.startsWith('$2b$')) {
        existingAdmin.password = password;
        await existingAdmin.save();
        console.log(`✅ Updated password for admin '${username}'`);
      }
      return;
    }


    // Create new admin
    const admin = new Admin({
      username,
      password,
      email: email || `${username}@example.com`,
      role
    });

    await admin.save();
    console.log(`✅ Created new admin '${username}'`);
  } catch (error) {
    console.error(`❌ Error creating/updating admin '${username}':`, error.message);
  }
}


const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');


    // Check and clean up any unhashed passwords
    const unhashedAdmins = await Admin.find({
      $or: [
        { password: { $not: { $regex: '^\$2[ab]\$' } } },
        { password: { $exists: false } }
      ]
    });


    if (unhashedAdmins.length > 0) {
      console.log('⚠️ Found unhashed passwords! Cleaning up...');
      await Admin.deleteMany({
        _id: { $in: unhashedAdmins.map(a => a._id) }
      });
      console.log('✅ Cleaned up unhashed admin accounts');
    }


    // Create default admin users if they don't exist
    await createOrUpdateAdmin(
      process.env.BLOG_ADMIN_USERNAME || 'blog',
      process.env.BLOG_ADMIN_PASSWORD || 'blog123',
      process.env.BLOG_ADMIN_EMAIL || 'blog@example.com'
    );


    // Create the requested admin user
    await createOrUpdateAdmin(
      'riddhi',
      'riddhi123',
      'riddhi@example.com'
    );


    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 Available Admin Accounts:');
    const admins = await Admin.find().select('username email role -_id');
    admins.forEach(admin => {
      console.log(`📌 Username: ${admin.username}, Email: ${admin.email}, Role: ${admin.role}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');


    app.listen(PORT, '0.0.0.0', () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Blog server running on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api/blog`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 Available Routes:');
      console.log(`   POST   /api/blog/login                        - Login`);
      console.log(`   POST   /api/blog/fetch-admin-verified         - Fetch with username+password ✨ NEW`);
      console.log(`   GET    /api/blog/admins                       - All admins (no password)`);
      console.log(`   GET    /api/blog/admin/:id                    - Single admin by ID (no password)`);
      console.log(`   GET    /api/blog/admin/username/:username     - Admin by username (no password)`);
      console.log(`   GET    /api/blog/admin-debug/:id              - Admin with password (DEBUG ONLY)`);
      console.log(`   GET    /api/blog/me                           - Current user (protected)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Failed to start blog server:', error.message);
    process.exit(1);
  }
};


process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});


startServer();