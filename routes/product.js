import express from 'express';
import db from '../database.js';
import { fetchProductDetails } from '../utils/scrapper.js';
import {roleMiddleware, authMiddleware} from '../middleware/authMiddleware.js';
import { getProducts } from '../controllers/productController.js';
const router = express.Router();
router.use(express.json());



router.get('/' , async(req, res) => {
    try{
        const result = await db.pool.query(`
            SELECT p.*, u.username as seller_name, p.user_id as seller_id 
            FROM products p 
            LEFT JOIN users u ON p.user_id = u.user_id
        `);
        res.json(result[0])
    }catch(er){
        console.log(er);
        res.status(500).json({error: 'Internal server error'})
    }
})

router.post('/', authMiddleware, roleMiddleware(['seller']), async (req, res) => {
    try {
        const { product_url, source } = req.body;

        // Fetch dynamic product details using the provided URL
        const productDetails = await fetchProductDetails(product_url);
        if (productDetails.error) {
            return res.status(400).json({ error: productDetails.error });
        }

        const { name, description, price, imageUrl } = productDetails;

        // Insert the product data into the database with current timestamp for last_fetched_at
        const [result] = await db.pool.query(
            `INSERT INTO products (
                user_id, name, price, source, description, 
                product_url, image_url, last_fetched_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [req.userId, name, price, source, description, product_url, imageUrl]
        );

        res.status(201).json({ message: "Product added successfully", product_id: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
try{
 const id = req.params.id;
 const [result] = await db.pool.query('select * from products where product_id = ? ', [id])
 if(result.length === 0){
    res.status(404).json({error: "Product not found"})
 }else{
    res.status(200).json(result)
 }
}catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal server error'})
}
})
router.get('/', getProducts);  // This route will fetch all products with seller names


router.get('/orders', authMiddleware, roleMiddleware(['buyer']), async (req, res) => {
    try {
       const [orders] = await db.pool.query( 'SELECT * FROM orders WHERE buyer_id = ?', [req.userId])
       res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).json("error fetching orders")
    }
})

router.put('/:id', authMiddleware, roleMiddleware(['seller']), async (req, res) => {
    try {
        const { name, price, source, description, product_url } = req.body;
        const [result] = await db.pool.query(
            `UPDATE products 
             SET name = ?, price = ?, source = ?, description = ?, 
                 product_url = ?, last_fetched_at = NOW()
             WHERE product_id = ? AND user_id = ?`,
            [name, price, source, description, product_url, req.params.id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "You can only edit your own products" });
        }

        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//router.get('/user/:id', async (req, res) =>  SOmething i know i will need 

router.delete('/:id',authMiddleware,roleMiddleware(['seller']), async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await db.pool.query('DELETE FROM products WHERE product_id = ? AND user_id = ?', [id, req.userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Product not found"});
        }
        res.status(200).json({message: `Deleted product with id ${id}`});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})


router.get('/sellers/:id', async (req, res) => {
    try{
        const sellerId = req.params.id;
        const [result] = await db.pool.query('SELECT * FROM products WHERE user_id = ?', [sellerId])
        res.json(result)
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
})
//-----------------------------------------------------------------
//Products where rolebased access control is implemented
//-----------------------------------------------------------------






export default router;
