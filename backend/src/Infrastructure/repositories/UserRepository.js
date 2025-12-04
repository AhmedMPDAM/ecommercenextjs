const IUserRepository = require('../../Domain/repositories/IUserRepository');
const User = require('../../Domain/entities/User');
const { getDatabase } = require('../database/database');

class UserRepository extends IUserRepository {
    constructor() {
        super();
        this.db = getDatabase();
        this.collectionName = 'users';
    }

    async findById(id) {
        await this.db.initialize();
        const user = await this.db.findInCollection(this.collectionName, u => u.id === parseInt(id));
        return user ? new User(user) : null;
    }

    async findByEmail(email) {
        await this.db.initialize();
        const user = await this.db.findInCollection(this.collectionName, u => u.email === email);
        return user ? new User(user) : null;
    }

    async create(userData) {
        await this.db.initialize();
        const newUser = await this.db.addToCollection(this.collectionName, userData);
        return new User(newUser);
    }

    async update(id, userData) {
        await this.db.initialize();
        const updatedUser = await this.db.updateInCollection(this.collectionName, parseInt(id), userData);
        return updatedUser ? new User(updatedUser) : null;
    }

    async delete(id) {
        await this.db.initialize();
        return await this.db.deleteFromCollection(this.collectionName, parseInt(id));
    }

    async getAll() {
        await this.db.initialize();
        const users = this.db.getCollection(this.collectionName);
        return users.map(u => new User(u));
    }
}

module.exports = UserRepository;
