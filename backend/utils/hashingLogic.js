import bcrypt from 'bcryptjs'
const saltRounds = 10;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

const isHashMatched = async (password, hash) => { return await bcrypt.compare(password, hash) }

export {
    hashPassword,
    isHashMatched
} 