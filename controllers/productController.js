export const getProducts = async (req, res) => {
    try {
        const [products] = await db.pool.query(`
            SELECT p.*, u.username as seller_name 
            FROM products p 
            JOIN users u ON p.user_id = u.user_id
        `);
        
        // Ensure we're sending an array
        res.status(200).json(Array.isArray(products) ? products : []);
    } catch (error) {
        console.error("Error fetching products:", error);
        // Send empty array instead of error message
        res.status(500).json([]);
    }
}; 