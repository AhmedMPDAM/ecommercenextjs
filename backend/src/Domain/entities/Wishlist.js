class Wishlist {
    constructor({ id, userId, productId, title, image, price }) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.title = title;
        this.image = image;
        this.price = price;
    }

    static validate(data) {
        const errors = [];

        if (!data.userId) {
            errors.push('userId is required');
        }

        if (!data.productId) {
            errors.push('productId is required');
        }

        if (!data.title || data.title.trim().length === 0) {
            errors.push('title is required');
        }

        if (!data.price || typeof data.price !== 'number') {
            errors.push('price must be a valid number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            productId: this.productId,
            title: this.title,
            image: this.image,
            price: this.price
        };
    }
}

module.exports = Wishlist;
