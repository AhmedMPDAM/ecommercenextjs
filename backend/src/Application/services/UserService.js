
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserById(id) {
        if (!id) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        return user.toSafeJSON();
    }

    async updateUser(id, data) {
        if (!id) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Only allow updating email
        const updateData = {};
        if (data.email) {
            updateData.email = data.email;
        }

        const updatedUser = await this.userRepository.update(id, updateData);
        return updatedUser.toSafeJSON();
    }

    async deleteUser(id) {
        if (!id) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        await this.userRepository.delete(id);
        return { message: 'User deleted successfully' };
    }

    async getAllUsers() {
        const users = await this.userRepository.getAll();
        return users.map(u => u.toSafeJSON());
    }
}

module.exports = UserService;
