import bcrypt from 'bcrypt';
import db from '../database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
 const {username, email, password, role} = req.body;

 const [existingUser] = await db.pool.query('select * from users where email = ?', [email])
 if(existingUser.length > 0){
    return res.status(400).json("user already exists")
 } 
 else{
    const hashedPass = await bcrypt.hash(password, 10);
    try{
        const [result] = await db.pool.query('insert into users (username, email, password_hash, role) values (?, ?, ?, ?)', [username, email, hashedPass, role])
        return res.status(201).json({message :"user registered successfully with id:", id: result.insertId})
    }catch(error){
        console.log(error);
        return res.status(500).json("error registering user")
    }
  
 }

}


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Get user with all fields including role
        const [users] = await db.pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = users[0];
        console.log("Found user:", { ...user, password_hash: '[HIDDEN]' }); // Debug log

        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { 
                userId: user.user_id, 
                role: user.role // Include role in token
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response with explicit role
        const response = {
            message: "Login successful",
            token,
            role: user.role, // Make sure role is included
            userId: user.user_id
        };

        console.log("Sending response:", response); // Debug log
        res.status(200).json(response);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Error logging in" });
    }
};

export const getUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const [user] = await db.pool.query('select * from users where user_id = ? ', [userId])
        if(user.length === 0){
          return  res.status(404).json("user not found")
        }
        else{
          return  res.status(200).json(user[0])
        }

    } catch (error) { 
        console.log(error);
        return res.status(500).json("error fetching user profile")
        
    }
}

export const getSellers = async (req, res) => {
    try {
        const [sellers] = await db.pool.query('select user_id, username from users where role = "seller"')
        return res.status(200).json(sellers)
    }catch(error){
        console.log(error);
        return res.status(500).json("error fetching sellers")
    }
}       

