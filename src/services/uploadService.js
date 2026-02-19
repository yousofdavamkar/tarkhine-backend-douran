const fs = require('fs');
const path = require('path');

const makeUploadService = () => ({
  /**
   * Save file metadata
   */
  saveFileMetadata: async (file, metadata = {}) => {
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
      ...metadata
    };
  },

  /**
   * Delete file from filesystem
   */
  deleteFile: async (filePath) => {
    const fullPath = path.join(process.cwd(), filePath);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return { success: true };
      }
      return { success: false, message: 'File not found' };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  /**
   * Get file info
   */
  getFileInfo: async (filePath) => {
    const fullPath = path.join(process.cwd(), filePath);

    try {
      const stats = fs.statSync(fullPath);
      return {
        exists: true,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      return { exists: false };
    }
  }
});

module.exports = makeUploadService;
