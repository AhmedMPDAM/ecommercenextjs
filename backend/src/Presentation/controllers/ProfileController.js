class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }

    getProfile = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const profile = await this.profileService.getProfileByUserId(userId);

            res.status(200).json({
                status: 'success',
                data: { profile }
            });
        } catch (error) {
            next(error);
        }
    };

    createProfile = async (req, res, next) => {
        try {
            const { userId } = req.body;
            const profile = await this.profileService.createProfile(userId, req.body);

            res.status(201).json({
                status: 'success',
                data: { profile }
            });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const profile = await this.profileService.updateProfile(userId, req.body);

            res.status(200).json({
                status: 'success',
                data: { profile }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProfile = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const result = await this.profileService.deleteProfile(userId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ProfileController;
