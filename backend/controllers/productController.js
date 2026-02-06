import Product from "../models/Product.js";
import Movement from "../models/Movement.js";

export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';

        // Search logic : name or sku matching
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ]
        };

        const products = await Product.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            count
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error while fetching products' });
    }
};

// Stock Adjustment Logic(IN /OUT)

export const adjustStock = async (req,res) => {
    const { productId,type,quantity}= req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({message:"Product not found"});

        // logic: Quantity cannot go negative
        if (type === 'OUT' && product.quantity < quantity){
            return res.status(400).json({ message: "Insufficient stock! Cannot go negative."});
        }

        //Update quantity
        product.quantity = type === 'IN' ? product.quantity + quantity : product.quantity - quantity;
        await product.save();

        //Record Movement
        const movement = new Movement({productId, type,quantity });
        await movement.save();

        res.json({message: "Stock updated successfully ",product});
    } catch (error) {
        res.status(500).json({message : "Error updating stock"});
    }
};


export const getDashboardStats = async (req, res) => {
    try {
        const products = await Product.find();
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => p.quantity <= (p.lowStockThreshold || 10));

        const recentMovements = products
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5); 

        res.json({
            totalProducts,
            lowStockCount: lowStockProducts.length,
            recentMovements 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, sku, category, price, quantity, lowStockThreshold } = req.body;

        // 1. Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this SKU already exists" });
        }

        // 2. Create new product
        const product = new Product({
            name,
            sku,
            category,
            price,
            quantity: quantity || 0,
            lowStockThreshold: lowStockThreshold || 10
        });

        await product.save();

        // 3. Record initial stock movement if quantity > 0
        if (quantity > 0) {
            const movement = new Movement({
                productId: product._id,
                type: 'IN',
                quantity: quantity,
                reason: 'Initial Stock'
            });
            await movement.save();
        }

        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ message: "Error creating product", error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Product.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during deletion", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};