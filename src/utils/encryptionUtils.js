import CryptoJS from "crypto-js";

/**
 * Encrypts a password using AES-256 encryption with PBKDF2 key derivation
 * @param {string} password - The password to encrypt
 * @param {string} masterPassword - The master password used for encryption
 * @returns {Object} Object containing encrypted password and salt
 */
export const encryptPassword = (password, masterPassword) => {
  // Generate a random salt for this encryption
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

  // Derive a key from the master password using PBKDF2
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 100000,
  });

  // Encrypt the password using AES
  const encrypted = CryptoJS.AES.encrypt(password, key.toString()).toString();

  return {
    encrypted,
    salt,
  };
};

/**
 * Decrypts a password using AES-256 decryption with PBKDF2 key derivation
 * @param {string} encryptedPassword - The encrypted password
 * @param {string} salt - The salt used during encryption
 * @param {string} masterPassword - The master password used for decryption
 * @returns {string} The decrypted password
 * @throws {Error} If decryption fails (wrong master password)
 */
export const decryptPassword = (encryptedPassword, salt, masterPassword) => {
  try {
    // Derive the same key using the stored salt
    const key = CryptoJS.PBKDF2(masterPassword, salt, {
      keySize: 256 / 32,
      iterations: 100000,
    });

    // Decrypt the password
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, key.toString());
    const decryptedPassword = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedPassword) {
      throw new Error("Decryption failed");
    }

    return decryptedPassword;
  } catch (error) {
    throw new Error("Failed to decrypt password. Wrong master password?");
  }
};

/**
 * Generates a secure random password
 * @param {number} length - Length of the password (default: 16)
 * @param {Object} options - Options for password generation
 * @returns {string} Generated password
 */
export const generateSecurePassword = (length = 16, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
  } = options;

  let charset = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
};

/**
 * Validates master password strength
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateMasterPassword = (password) => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Master password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Master password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Master password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Master password must contain at least one number",
    };
  }

  return { isValid: true, message: "Password is strong" };
};
