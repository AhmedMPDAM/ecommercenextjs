class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    getAllProducts = async (req, res, next) => {
        try {
            const filters = {
                category: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                sortBy: req.query.sortBy
            };

            const products = await this.productService.getAllProducts(filters);

            res.status(200).json({
                status: 'success',
                data: { products }
            });
        } catch (error) {
            next(error);
        }
    };

    getProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);

            res.status(200).json({
                status: 'success',
                data: { product }
            });
        } catch (error) {
            next(error);
        }
    };

    getProductsByCategory = async (req, res, next) => {
        try {
            const { category } = req.params;
            const products = await this.productService.getProductsByCategory(category);

            res.status(200).json({
                status: 'success',
                data: { products }
            });
        } catch (error) {
            next(error);
        }
    };

    getCategories = async (req, res, next) => {
        try {
            const categories = await this.productService.getCategories();

            res.status(200).json({
                status: 'success',
                data: { categories }
            });
        } catch (error) {
            next(error);
        }
    };

    searchProducts = async (req, res, next) => {
        try {
            const { q } = req.query;
            const products = await this.productService.searchProducts(q);

            res.status(200).json({
                status: 'success',
                data: { products }
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ProductController;
