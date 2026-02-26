/**
 * Factory for creating standard CRUD controller handlers.
 * Allows passing a service and specific methods to automatically
 * handle request/response flow without repetitive boilerplate.
 */
const factory = {
    /**
     * Create a record
     * @param {Object} service The service to use
     * @param {String} methodName The method name on the service to call
     */
    createOne: (service, methodName = 'create') => async (req, res, next) => {
        try {
            const data = req.validatedData || req.body;
            const doc = await service[methodName](data);
            res.status(201).success(doc);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get a single record by ID
     * @param {Object} service The service to use
     * @param {String} methodName The method name on the service to call
     */
    getOne: (service, methodName = 'findById') => async (req, res, next) => {
        try {
            // Allow for field selection querying if supported by service
            const doc = await service[methodName](req.params.id, req.parsedQuery);
            res.status(200).success(doc);
        } catch (error) {
            if (error.message.toLowerCase().includes('not found')) {
                return res.status(404).error('Document not found', 'NOT_FOUND', 404);
            }
            next(error);
        }
    },

    /**
     * Get all records with pagination, filtering, sorting, and field selection
     * @param {Object} service The service to use
     * @param {String} methodName The method name on the service to call
     */
    getAll: (service, methodName = 'findAll') => async (req, res, next) => {
        try {
            // parsedQuery usually comes from queryParser middleware
            const query = req.parsedQuery || req.query;
            const result = await service[methodName](query);
            res.status(200).success(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update a record by ID
     * @param {Object} service The service to use
     * @param {String} methodName The method name on the service to call
     */
    updateOne: (service, methodName = 'update') => async (req, res, next) => {
        try {
            const data = req.validatedData || req.body;
            const doc = await service[methodName](req.params.id, data);
            res.status(200).success(doc);
        } catch (error) {
            if (error.message.toLowerCase().includes('not found')) {
                return res.status(404).error('Document not found', 'NOT_FOUND', 404);
            }
            next(error);
        }
    },

    /**
     * Delete a record by ID
     * @param {Object} service The service to use
     * @param {String} methodName The method name on the service to call
     */
    deleteOne: (service, methodName = 'delete') => async (req, res, next) => {
        try {
            const doc = await service[methodName](req.params.id);
            res.status(200).success(doc); // often returns a success message object
        } catch (error) {
            if (error.message.toLowerCase().includes('not found')) {
                return res.status(404).error('Document not found', 'NOT_FOUND', 404);
            }
            next(error);
        }
    }
};

module.exports = factory;
