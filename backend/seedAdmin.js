const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 

dotenv.config(); 

const createGenesisAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // bail out if admin already exists
        const adminExists = await User.findOne({ email: 'superadmin@doconnect.com' });
        
        if (adminExists) {
            console.log('Genesis Admin already exists! Exiting...');
            process.exit();
        }

        await User.create({
            name: 'System Admin',
            email: 'superadmin@doconnect.com',
            password: 'SecureAdminPassword123!', // gets hashed automatically by the pre('save') hook
            role: 'admin',
            isActive: true
        });

        console.log('SUCCESS: Genesis Admin created!');
        console.log('Email: superadmin@doconnect.com');
        console.log('Password: SecureAdminPassword123!');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

createGenesisAdmin();