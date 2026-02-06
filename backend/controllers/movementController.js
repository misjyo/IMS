import Movement from "../models/Movement.js";

// @desc    Get all stock movements (Audit Logs)
// @route   GET /api/movements
// @access  Private
export const getMovements = async (req, res) => {
    try {
        // Pagination logic
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const movements = await Movement.find()
            .populate('productId', 'name sku') 
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Movement.countDocuments();

        res.status(200).json({
            success: true,
            count: movements.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: movements
        });
    } catch (error) {
        console.error("Error in getMovements:", error);
        res.status(500).json({ message: "Server error while fetching logs" });
    }
};