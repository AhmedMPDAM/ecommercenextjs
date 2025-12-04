const Profile = require('../../Domain/entities/Profile');

class ProfileService {
    constructor(profileRepository, userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    async getProfileByUserId(userId) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            const error = new Error('Profile not found');
            error.statusCode = 404;
            throw error;
        }

        return profile.toJSON();
    }

    async createProfile(userId, data) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Check if profile already exists
        const existingProfile = await this.profileRepository.findByUserId(userId);
        if (existingProfile) {
            const error = new Error('Profile already exists for this user');
            error.statusCode = 400;
            throw error;
        }

        // Validate profile data
        const profileData = {
            userId: parseInt(userId),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || user.email,
            phone: data.phone || '',
            address: data.address || ''
        };

        const validation = Profile.validate(profileData);
        if (!validation.isValid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        const newProfile = await this.profileRepository.create(profileData);
        return newProfile.toJSON();
    }

    async updateProfile(userId, data) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const existingProfile = await this.profileRepository.findByUserId(userId);

        if (!existingProfile) {
            const error = new Error('Profile not found');
            error.statusCode = 404;
            throw error;
        }

        // Prepare update data
        const updateData = {
            firstName: data.firstName || existingProfile.firstName,
            lastName: data.lastName || existingProfile.lastName,
            email: data.email || existingProfile.email,
            phone: data.phone !== undefined ? data.phone : existingProfile.phone,
            address: data.address !== undefined ? data.address : existingProfile.address
        };

        const updatedProfile = await this.profileRepository.update(userId, updateData);
        return updatedProfile.toJSON();
    }

    async deleteProfile(userId) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new NotFoundError('Profile not found');
        }

        await this.profileRepository.delete(profile.id);
        return { message: 'Profile deleted successfully' };
    }
}

module.exports = ProfileService;
