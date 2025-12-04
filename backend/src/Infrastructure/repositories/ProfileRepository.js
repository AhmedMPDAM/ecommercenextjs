const IProfileRepository = require('../../Domain/repositories/IProfileRepository');
const Profile = require('../../Domain/entities/Profile');
const { getDatabase } = require('../database/database');

class ProfileRepository extends IProfileRepository {
    constructor() {
        super();
        this.db = getDatabase();
        this.collectionName = 'profiles';
    }

    async findById(id) {
        await this.db.initialize();
        const profile = await this.db.findInCollection(this.collectionName, p => p.id === parseInt(id));
        return profile ? new Profile(profile) : null;
    }

    async findByUserId(userId) {
        await this.db.initialize();
        const profile = await this.db.findInCollection(this.collectionName, p => p.userId === parseInt(userId));
        return profile ? new Profile(profile) : null;
    }

    async create(profileData) {
        await this.db.initialize();
        const newProfile = await this.db.addToCollection(this.collectionName, profileData);
        return new Profile(newProfile);
    }

    async update(userId, profileData) {
        await this.db.initialize();
        const profile = await this.findByUserId(userId);

        if (!profile) {
            return null;
        }

        const updatedProfile = await this.db.updateInCollection(this.collectionName, profile.id, profileData);
        return updatedProfile ? new Profile(updatedProfile) : null;
    }

    async delete(id) {
        await this.db.initialize();
        return await this.db.deleteFromCollection(this.collectionName, parseInt(id));
    }

    async getAll() {
        await this.db.initialize();
        const profiles = this.db.getCollection(this.collectionName);
        return profiles.map(p => new Profile(p));
    }
}

module.exports = ProfileRepository;
