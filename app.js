import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { loginUser } from "./routes/login.js";
import { registerUser } from "./routes/register.js";

// Create the Hono app
const app = new Hono();

// Middleware to set security headers globally
app.use('*', (c, next) => {
    // Set the Content-Type header (automatically set by Hono for HTML, CSS, JS)
    c.header('Content-Type', 'text/html'); // Adjust this for specific content types, if needed

    // Set Content-Security-Policy header to restrict resource loading
    c.header(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"
    );

    // Set X-Frame-Options header to prevent Clickjacking
    c.header('X-Frame-Options', 'DENY');
    c.header('X-Content-Type-Options', 'nosniff');

    return next();
});


// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: '.' }));

app.get('/', async (c) => {
    return c.html(await Deno.readTextFile('./views/index.html'));
});

// Serve the registration page with CSRF token
app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});

// Handle user registration
app.post('/register', registerUser);

// Serve the login page with CSRF token
app.get('/login', async (c) => {
    return c.html(await Deno.readTextFile('./views/login.html'));
});

// Handle user login
app.post('/login', loginUser);

// Start the server
console.log('Server running on http://localhost:8000');
Deno.serve(app.fetch);
