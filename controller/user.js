const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const db = require("../db");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory!",
      });
    }
    const [[userExist]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    const [[userExist]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const token = jwt.sign({ id: userExist.id }, process.env.jwt_sec)
    if (userExist && (await bcrypt.compare(password, userExist.password))) {
      return res.status(200).json({
        success: true,
        user: userExist,
        token: token
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No user found with this email!",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "All fields are mandatory",
        });
    }
    if (req.user === +req.params.id) {
        const [data] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id])
        res.status(200).json({
            success: true,
            user: data
        })
    } else {
        res.status(401).json({ 
            success: false,
            message: 'You are not allowed!'
        })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user === +req.params.id) {
            await db.query('DELETE FROM users WHERE id = ?', [req.params.id])
            res.status(200).json({
                success: true,
                message: 'User deleted!'
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'You are not allowed!'
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { register, login, updateUser, deleteUser };
