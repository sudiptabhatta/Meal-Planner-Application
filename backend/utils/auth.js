import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

import jwt from 'jsonwebtoken';

// run this command line: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET;
const KEYLEN = 32;

const hash = async (password) => {
    return new Promise((resolve, reject) => {
        // Generate a random 16-byte salt
        const salt = randomBytes(16).toString('hex');

        // Use scrypt to hash the password with the salt
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            // Convert the derived key to a hexadecimal string
            const derivedHex = derivedKey.toString('hex');
            console.log(`${salt}:${derivedHex}`)

            // combine salt and derivedHex as the final hashed password
            resolve(`${salt}:${derivedHex}`);
        });
    });
};

const compare = async (password, dbPassword) => {
    return new Promise((resolve, reject) => {
        const [salt, hash] = dbPassword.split(':');

        // Convert the stored hash to a Buffer
        const hashBuffer = Buffer.from(hash, 'hex');

        // Rehash the input password using the same salt
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            // Use timingSafeEqual to prevent timing attacks
            const isEqual = timingSafeEqual(hashBuffer, derivedKey);
            resolve(isEqual);
        });
    });
};

const signToken = (username, _id) => {
    const guest = { username, user_id: _id };
    return jwt.sign(guest, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { hash, compare, signToken, verifyToken };