import crypto from "crypto";

export const generateValidationToken = (req, res) => {
    return crypto.randomBytes(32).toString('hex');
}