const prisma = require('../config/database');
const { executePaginatedQuery } = require('../utils/prismaQuery');
const fs = require('fs');
const path = require('path');

const makeSliderService = () => ({
    findAll: async (parsedQuery) => {
        const searchableFields = { title: true };
        return await executePaginatedQuery(prisma, 'slider', parsedQuery, searchableFields);
    },

    findById: async (id) => {
        const slider = await prisma.slider.findUnique({
            where: { id: parseInt(id) }
        });
        if (!slider) throw new Error('Slider not found');
        return slider;
    },

    create: async (data) => {
        return await prisma.slider.create({ data });
    },

    update: async (id, data) => {
        const existing = await prisma.slider.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) throw new Error('Slider not found');

        return await prisma.slider.update({
            where: { id: parseInt(id) },
            data
        });
    },

    updateImage: async (id, imagePath) => {
        const existing = await prisma.slider.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) throw new Error('Slider not found');

        if (existing.image) {
            const oldImagePath = path.join(process.cwd(), 'public', existing.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        return await prisma.slider.update({
            where: { id: parseInt(id) },
            data: { image: imagePath }
        });
    },

    delete: async (id) => {
        const existing = await prisma.slider.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) throw new Error('Slider not found');

        if (existing.image) {
            const imagePath = path.join(process.cwd(), 'public', existing.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.slider.delete({
            where: { id: parseInt(id) }
        });
        return { message: 'Slider deleted successfully' };
    }
});

module.exports = makeSliderService;
