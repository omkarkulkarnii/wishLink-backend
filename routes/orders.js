import express from 'express';
import db from '../database.js';
import {authMiddleware, roleMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(express.json());



router.get('/',authMiddleware, async (req, res) => {
    try{
        const [result] = await db.pool.query('select buyer_id, order_status, total_price from orders') 
        res.status(200).json(result)
    }catch(er){
        console.log(er);
        res.status(500).json({message: "error fetching orders"})
    }
})

router.post('/',authMiddleware, async (req, res) => {
    try{
        const {buyer_id, product_id, quantity,  order_status} = req.body;
        const [rows] = await db.pool.query('select price from products where product_id = ?', [product_id])
        const total_price = quantity * rows[0].price
        const [result] = await db.pool.query(`INSERT INTO orders (buyer_id, product_id, quantity, total_price, order_status) 
           VALUES (?, ?, ?, ?, ?)`, [buyer_id, product_id, quantity, total_price, order_status] )
        res.status(200).json({
            message: "order created successfully", order_id: result.insertId
        })

    }catch(er){
        console.log(er);
        res.status(500).json({message: "error creating order"})

    }
})

router.get('/sales', authMiddleware, roleMiddleware(['seller']), async (req, res) =>{
    try {
        const [sales] = await db.pool.query(
            `SELECT SUM(orders.total_price) as total_sales
            FROM orders
            JOIN products ON orders.product_id = products.product_id
            WHERE products.user_id = ?`, [req.userId]
        )
        res.json({total_sales: sales[0].total_sales || 0})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "error fetching sales data"})
    }
})

router.get('/:buyer_id', authMiddleware, async (req, res) => {
    try{
        const buyer_id = req.params.buyer_id;
        const [result] = await db.pool.query('SELECT * FROM orders WHERE buyer_id = ?', [buyer_id]);
        if(result.length === 0){
            return res.status(404).json({message: "no orders found for this user"})
        }
        res.json(result);
    }catch(er){
        console.log(er);
        res.status(500).json({message: "error fetching orders"})
    }
    
})

router.delete('/:order_id',authMiddleware, async (req, res) => {
    try{
        const order_id = req.params.order_id;
        const [result] = await db.pool.query('delete FROM orders WHERE order_id = ?', [order_id]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "no orders found for this user"})
        }
        res.json("order deleted successfully");
    }catch(er){
        console.log(er);
        res.status(500).json({message: "error fetching orders"})
    }
    
})

router.put('/:order_id',authMiddleware, async (req, res) => {
    try{
        const order_id = req.params.order_id;
        const {order_status} = req.body;
        const [result] = await db.pool.query('update orders set order_status = ? where order_id = ?', [order_status, order_id])
        if(result.affectedRows === 0){
            return res.status(404).json({message: "order not found"})
        }
        res.json({message: "order status updated successfully"})
    }catch(er){
        console.log(er);
        res.status(500).json({message: "error updating order status"})
    }
})




export default router;