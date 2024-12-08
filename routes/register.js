import client from "../db/db.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // Import Zod

// Zod schema for validating the registration form
const registerSchema = z.object({
    username: z.string().email({ message: "Invalid email address" }).max(50, "Email must not exceed 50 characters"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    birthdate: z.string().refine((date) => {
        // Ensure birthdate is a valid date (and optionally check for age)
        const birthDateObj = new Date(date);
        return !isNaN(birthDateObj.getTime()); // Check if it's a valid date
    }, { message: "Invalid birthdate" }),
    role: z.enum(["reserver", "administrator"], { message: "Invalid role" }),
});

// Helper function to check if a username (email) already exists
async function isUniqueUsername(email) {
    const result = await client.queryArray(`SELECT username FROM yk123_users WHERE username = $1`, [email]);
    return result.rows.length === 0;
}

// Handle user registration
export async function registerUser(c) {
    const username = c.get('username');
    const password = c.get('password');
    const birthdate = c.get('birthdate');
    const role = c.get('role');
    try {
        // Validate the input data using Zod
        registerSchema.parse({ username, password, birthdate, role });
        // Check if the email is unique
        if (!(await isUniqueUsername(username))) {
            return new Response("Email already in use", { status: 400 });
        }
        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        await client.queryArray(`INSERT INTO yk123_users (username, password_hash, role, birthdate) VALUES ($1, $2, $3, $4)`, [username, hashedPassword, role, birthdate]);
        // Success response, redirect to the index page
        return new Response(null, { status: 302, headers: { Location: "/", }, });

    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors from Zod
            return new Response(`Validation Error: ${error.errors.map(e => e.message).join(", ")}`, { status: 400 });
        }
        console.error(error);
        return new Response("Error during registration", { status: 500 });
    }
}