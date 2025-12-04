class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }

    addToWishlist = async (req, res, next) => {
        try {
            const { userId } = req.body;
            const wishlistItem = await this.wishlistService.addToWishlist(userId, req.body);

            res.status(201).json({
                status: 'success',
                data: { wishlistItem }
            });
        } catch (error) {
            next(error);
        }
    };

    getUserWishlist = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const wishlist = await this.wishlistService.getWishlistByUserId(userId);

            res.status(200).json({
                status: 'success',
                data: { wishlist }
            });
        } catch (error) {
            next(error);
        }
    };

    removeFromWishlist = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.wishlistService.removeFromWishlist(id);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    clearWishlist = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const result = await this.wishlistService.clearWishlist(userId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = WishlistController;
