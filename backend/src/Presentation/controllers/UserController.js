class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.userService.updateUser(id, req.body);

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.userService.deleteUser(id);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getAllUsers = async (req, res, next) => {
        try {
            const users = await this.userService.getAllUsers();

            res.status(200).json({
                status: 'success',
                data: { users }
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = UserController;
