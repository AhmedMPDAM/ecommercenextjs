class Profile {
    constructor({ id, userId, firstName, lastName, email, phone, address }) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    static validate(data) {
        const errors = [];

        if (!data.userId) {
            errors.push('userId is required');
        }

        if (!data.firstName || data.firstName.trim().length === 0) {
            errors.push('firstName is required');
        }

        if (!data.lastName || data.lastName.trim().length === 0) {
            errors.push('lastName is required');
        }

        if (!data.email || data.email.trim().length === 0) {
            errors.push('email is required');
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
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }
}

module.exports = Profile;
