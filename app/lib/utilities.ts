import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');
    if (!salt || !storedHash) return false;
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedBuffer = Buffer.from(storedHash, 'hex');
    return timingSafeEqual(derivedKey, storedBuffer);
}

export default function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
