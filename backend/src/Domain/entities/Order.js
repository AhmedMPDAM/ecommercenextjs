class Order {
    constructor({ id, userId, status, date, items, total, lineItems, shipping }) {
        this.id = id;
        this.userId = userId;
        this.status = status;
        this.date = date;
        this.items = items;
        this.total = total;
        this.lineItems = lineItems || [];
        this.shipping = shipping;
    }

    static VALID_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    static validateStatus(status) {
        return Order.VALID_STATUSES.includes(status);
    }

    static validate(data) {
        const errors = [];

        if (!data.userId) {
            errors.push('userId is required');
        }

        if (!data.status || !Order.validateStatus(data.status)) {
            errors.push(`status must be one of: ${Order.VALID_STATUSES.join(', ')}`);
        }

        if (!data.lineItems || !Array.isArray(data.lineItems) || data.lineItems.length === 0) {
            errors.push('lineItems must be a non-empty array');
        }

        if (!data.shipping || typeof data.shipping !== 'object') {
            errors.push('shipping information is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    calculateTotal() {
        const subtotal = this.lineItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const shipping = 8.00; // Fixed shipping cost
        const tax = subtotal * 0.08; // 8% tax
        return parseFloat((subtotal + shipping + tax).toFixed(2));
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            status: this.status,
            date: this.date,
            items: this.items,
            total: this.total,
            lineItems: this.lineItems,
            shipping: this.shipping
        };
    }
}

module.exports = Order;
