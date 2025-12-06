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

    createProduct = async (req, res, next) => {
        try {
            const productData = req.body;
            const product = await this.productService.createProduct(productData);

            res.status(201).json({
                status: 'success',
                data: { product }
            });
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const productData = req.body;
            const product = await this.productService.updateProduct(id, productData);

            res.status(200).json({
                status: 'success',
                data: { product }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteProduct(id);

            res.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };

    createCategory = async (req, res, next) => {
        try {
            const categoryData = req.body;
            const category = await this.productService.createCategory(categoryData);

            res.status(201).json({
                status: 'success',
                data: { category }
            });
        } catch (error) {
            next(error);
        }
    };

    updateCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            const category = await this.productService.updateCategory(id, categoryData);

            res.status(200).json({
                status: 'success',
                data: { category }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteCategory(id);

            res.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ProductController;
