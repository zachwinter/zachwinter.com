import { config } from 'dotenv';
import express from 'express';
import path from 'path';
import * as url from 'url';
import fallback from 'express-history-api-fallback';
import sslRedirect from 'heroku-ssl-redirect';

config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const root = path.resolve(__dirname, '../dist');

app.use(sslRedirect.default());
app.use(express.static(root));
app.use(fallback('index.html', { root }));

const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`server • listening on port ${port}`));
