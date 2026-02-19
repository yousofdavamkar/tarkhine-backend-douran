const makeUploadController = ({ uploadService }) => ({
  /**
   * Upload single file
   */
  uploadSingle: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.error(
          'No file uploaded',
          'NO_FILE',
          400
        );
      }

      const metadata = await uploadService.saveFileMetadata(req.file, req.validatedData);

      res.status(201).success({
        file: metadata,
        message: 'File uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upload multiple files
   */
  uploadMultiple: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.error(
          'No files uploaded',
          'NO_FILES',
          400
        );
      }

      const files = await Promise.all(
        req.files.map(file => uploadService.saveFileMetadata(file))
      );

      res.status(201).success({
        files,
        count: files.length,
        message: `${files.length} files uploaded successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete file
   */
  deleteFile: async (req, res, next) => {
    try {
      const { filename } = req.params;
      const filePath = `./uploads/${filename}`;

      const result = await uploadService.deleteFile(filePath);

      if (!result.success) {
        return res.error(
          'File not found',
          'FILE_NOT_FOUND',
          404
        );
      }

      res.success({
        message: 'File deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get file info
   */
  getFileInfo: async (req, res, next) => {
    try {
      const { filename } = req.params;
      const filePath = `./uploads/${filename}`;

      const info = await uploadService.getFileInfo(filePath);

      if (!info.exists) {
        return res.error(
          'File not found',
          'FILE_NOT_FOUND',
          404
        );
      }

      res.success(info);
    } catch (error) {
      next(error);
    }
  }
});

module.exports = makeUploadController;
