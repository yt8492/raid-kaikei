import express from 'express';

const app = express();
const port = 3000;

app.post('/webhook', (_, res:any) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});