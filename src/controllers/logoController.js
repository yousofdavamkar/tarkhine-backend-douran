const prisma = require('../config/database');
const path = require('path');
const fs = require('fs');

const makeLogoController = () => ({
    /**
     * Get the global site logo
     */
    getLogo: async (req, res, next) => {
        try {
            const setting = await prisma.setting.findUnique({
                where: { key: 'site_logo' }
            });

            res.success({
                logo: setting ? setting.value : null
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Upload and set the global site logo
     */
    uploadLogo: async (req, res, next) => {
        try {
            if (!req.file && !req.logoPath) {
                return res.error(
                    'No logo file provided',
                    'NO_FILE',
                    400
                );
            }

            // Check for an existing logo to delete the old file
            const existing = await prisma.setting.findUnique({
                where: { key: 'site_logo' }
            });

            if (existing && existing.value) {
                const oldLogoPath = path.join(process.cwd(), 'public', existing.value);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }
            }

            // Upsert the new logo setting
            const setting = await prisma.setting.upsert({
                where: { key: 'site_logo' },
                update: { value: req.logoPath },
                create: {
                    key: 'site_logo',
                    value: req.logoPath
                }
            });

            res.success({
                message: 'Logo updated successfully',
                logo: setting.value
            });
        } catch (error) {
            next(error);
        }
    }
});

module.exports = makeLogoController;
