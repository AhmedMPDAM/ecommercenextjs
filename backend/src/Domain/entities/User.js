class User {
    constructor({ id, email, password }) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        // At least 6 characters
        return password && password.length >= 6;
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            password: this.password
        };
    }

    toSafeJSON() {
        return {
            id: this.id,
            email: this.email
        };
    }
}

module.exports = User;
