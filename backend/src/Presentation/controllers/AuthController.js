class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    register = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.register(email, password);

            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getCurrentUser = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.substring(7);
            const user = await this.authService.verifyToken(token);

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = AuthController;
