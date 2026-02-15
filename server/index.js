// Source - https://stackoverflow.com/a/62749284
// Posted by jfriend00
// Retrieved 2026-02-15, License - CC BY-SA 4.0

// app.mjs

import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(80);
