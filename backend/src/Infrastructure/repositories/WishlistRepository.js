const IWishlistRepository = require('../../Domain/repositories/IWishlistRepository');
const Wishlist = require('../../Domain/entities/Wishlist');
const { getDatabase } = require('../database/database');

class WishlistRepository extends IWishlistRepository {
    constructor() {
        super();
        this.db = getDatabase();
        this.collectionName = 'wishlists';
    }

    async findById(id) {
        await this.db.initialize();
        const wishlist = await this.db.findInCollection(this.collectionName, w => w.id === parseInt(id));
        return wishlist ? new Wishlist(wishlist) : null;
    }

    async findByUserId(userId) {
        await this.db.initialize();
        const wishlists = await this.db.filterCollection(this.collectionName, w => w.userId === parseInt(userId));
        return wishlists.map(w => new Wishlist(w));
    }

    async findByUserIdAndProductId(userId, productId) {
        await this.db.initialize();
        const wishlist = await this.db.findInCollection(
            this.collectionName,
            w => w.userId === parseInt(userId) && w.productId === parseInt(productId)
        );
        return wishlist ? new Wishlist(wishlist) : null;
    }

    async create(wishlistData) {
        await this.db.initialize();
        const newWishlist = await this.db.addToCollection(this.collectionName, wishlistData);
        return new Wishlist(newWishlist);
    }

    async delete(id) {
        await this.db.initialize();
        return await this.db.deleteFromCollection(this.collectionName, parseInt(id));
    }

    async getAll() {
        await this.db.initialize();
        const wishlists = this.db.getCollection(this.collectionName);
        return wishlists.map(w => new Wishlist(w));
    }
}

module.exports = WishlistRepository;
