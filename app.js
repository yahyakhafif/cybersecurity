import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { registerUser } from "./routes/register.js";

const app = new Hono();
app.use('/static/*', serveStatic({ root: '/' }));

app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});

app.post('/register', registerUser);

console.log('Server running on http://localhost:3000');
Deno.serve(app.fetch)
