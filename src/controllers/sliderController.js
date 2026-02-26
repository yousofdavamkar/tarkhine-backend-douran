const factory = require('./handlerFactory');
const makeSliderService = require('../services/sliderService');

const sliderService = makeSliderService();

const makeSliderController = () => ({
    getAll: factory.getAll(sliderService),
    getById: factory.getOne(sliderService),
    create: factory.createOne(sliderService),
    update: factory.updateOne(sliderService),
    delete: factory.deleteOne(sliderService),

    uploadImage: async (req, res, next) => {
        try {
            if (!req.file && !req.imagePath) {
                return res.error('No image file provided', 'NO_FILE', 400);
            }
            const slider = await sliderService.updateImage(req.params.id, req.imagePath);
            res.success(slider);
        } catch (error) {
            if (error.message === 'Slider not found') {
                return res.error('Slider not found', 'NOT_FOUND', 404);
            }
            next(error);
        }
    }
});

module.exports = makeSliderController;
