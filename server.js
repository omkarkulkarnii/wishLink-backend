import express from 'express';
//import db from './database.js';
import productRouter from './routes/product.js';
import ordersRouter from './routes/orders.js'
import userRoutes from './routes/user.js';
import cors from 'cors';


const app = express();
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://wishlist-tfz7.onrender.com',
    credentials: true
  }));

app.use('/users', userRoutes);
app.use('/products', productRouter)
app.use('/orders', ordersRouter)





app.listen(port, () => {
    console.log(`listening on port ${port}`);
}).on('error', (err) => {
    console.log(err);
})


