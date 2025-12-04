class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    createOrder = async (req, res, next) => {
        try {
            const { userId } = req.body;
            const order = await this.orderService.createOrder(userId, req.body);

            res.status(201).json({
                status: 'success',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    };

    getUserOrders = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const orders = await this.orderService.getOrdersByUserId(userId);

            res.status(200).json({
                status: 'success',
                data: { orders }
            });
        } catch (error) {
            next(error);
        }
    };

    getOrder = async (req, res, next) => {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrderById(id);

            res.status(200).json({
                status: 'success',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    };

    updateOrderStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await this.orderService.updateOrderStatus(id, status);

            res.status(200).json({
                status: 'success',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    };

    getAllOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getAllOrders();

            res.status(200).json({
                status: 'success',
                data: { orders }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteOrder = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.orderService.deleteOrder(id);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = OrderController;
