class Product {
    constructor({ id, title, price, description, category, image, rating }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = category;
        this.image = image;
        this.rating = rating;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            description: this.description,
            category: this.category,
            image: this.image,
            rating: this.rating
        };
    }
}

module.exports = Product;
