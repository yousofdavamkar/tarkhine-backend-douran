const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: process.env.API_DOCS_TITLE || 'Tarkhine API',
    version: process.env.API_DOCS_VERSION || '1.0.0',
    description: process.env.API_DOCS_DESCRIPTION || 'API documentation for Tarkhine backend',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      JSendSuccess: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: { type: 'object' },
        },
      },
      JSendError: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string' },
          code: { type: 'string' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          totalItems: { type: 'number' },
          totalPages: { type: 'number' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          username: { type: 'string' },
          role: {
            type: 'string',
            enum: ['ADMIN', 'USER'],
            description: 'User role - first signup becomes ADMIN'
          },
          isActive: { type: 'boolean' },
        },
      },
      Resource: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          category: { type: 'string' },
          userId: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ResourceListResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/Resource' }
              },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      },
      SubMenu: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          menuId: { type: 'number' },
          name: { type: 'string' },
          link: { type: 'string' },
          isActive: { type: 'boolean' },
          position: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Menu: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          link: { type: 'string' },
          hasSubmenu: { type: 'boolean' },
          isActive: { type: 'boolean' },
          position: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          submenus: {
            type: 'array',
            items: { $ref: '#/components/schemas/SubMenu' }
          },
        },
      },
      MenuListResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/Menu' }
              },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      },
      UserListResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          data: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      },
      SystemStats: {
        type: 'object',
        properties: {
          totalUsers: { type: 'number' },
          adminCount: { type: 'number' },
          userCount: { type: 'number' },
          activeUsers: { type: 'number' },
          inactiveUsers: { type: 'number' }
        }
      },
    },
    securitySchemes: {
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'Authentication cookie (httpOnly)'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendSuccess' },
              },
            },
          },
        },
      },
    },
    '/api/users/signup': {
      post: {
        summary: 'Create a new user account',
        description: 'Create a new user account. First registered user automatically becomes ADMIN.',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password', 'confirmPassword'],
                properties: {
                  username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 30,
                    pattern: '^[a-zA-Z0-9]+$',
                    description: 'Username (letters and numbers only)',
                    example: 'johndoe123'
                  },
                  password: {
                    type: 'string',
                    minLength: 8,
                    description: 'Password (minimum 8 characters)',
                    example: 'SecurePass123'
                  },
                  confirmPassword: {
                    type: 'string',
                    description: 'Must match password',
                    example: 'SecurePass123'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        message: { type: 'string', example: 'Account created successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '409': {
            description: 'Username already taken',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/signin': {
      post: {
        summary: 'Sign in to existing account',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: {
                    type: 'string',
                    description: 'Your username',
                    example: 'johndoe123'
                  },
                  password: {
                    type: 'string',
                    description: 'Your password',
                    example: 'SecurePass123'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Signed in successfully',
            headers: {
              'Set-Cookie': {
                description: 'Authentication cookie (httpOnly)',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        message: { type: 'string', example: 'Signed in successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Account disabled',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/signout': {
      post: {
        summary: 'Sign out from current session',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        responses: {
          '200': {
            description: 'Signed out successfully',
            headers: {
              'Set-Cookie': {
                description: 'Cookie cleared',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Signed out successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/me': {
      get: {
        summary: 'Get current authenticated user',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        responses: {
          '200': {
            description: 'User information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Get all users (Admin only)',
        description: 'Retrieve a paginated list of all users with their roles and status',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'number', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page',
            schema: { type: 'number', minimum: 1, maximum: 100, default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserListResponse' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions - admin only',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID (Admin only)',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions - admin only',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}/role': {
      put: {
        summary: 'Update user role (Admin only)',
        description: 'Change a user\'s role between ADMIN and USER. Cannot remove the last admin.',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'number' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: {
                    type: 'string',
                    enum: ['ADMIN', 'USER'],
                    description: 'New role for the user'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Role updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        message: { type: 'string', example: 'User role updated successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid role or cannot remove last admin',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions - admin only',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}/status': {
      put: {
        summary: 'Toggle user active status (Admin only)',
        description: 'Activate or deactivate a user account. Cannot deactivate the last active admin.',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'User status updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        message: { type: 'string', example: 'User activated successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Cannot deactivate last active admin',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions - admin only',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/users/stats': {
      get: {
        summary: 'Get system statistics (Admin only)',
        description: 'Retrieve system-wide user statistics including counts by role and status',
        tags: ['Users'],
        security: [{ CookieAuth: [] }],
        responses: {
          '200': {
            description: 'System statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        stats: { $ref: '#/components/schemas/SystemStats' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '403': {
            description: 'Insufficient permissions - admin only',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/resources': {
      get: {
        summary: 'Get all resources with pagination, filtering, and sorting',
        tags: ['Resources'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'number', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page (max 100)',
            schema: { type: 'number', minimum: 1, maximum: 100, default: 10 }
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort by field and direction (field:asc or field:desc)',
            schema: { type: 'string', example: 'name:asc' }
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter by status',
            schema: { type: 'string', enum: ['active', 'inactive'] }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter by category',
            schema: { type: 'string' }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Full-text search in name and description',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'List of resources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Resource' }
                        },
                        pagination: { $ref: '#/components/schemas/Pagination' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new resource',
        tags: ['Resources'],
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 100,
                    description: 'Resource name',
                    example: 'My Resource'
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                    description: 'Resource description',
                    example: 'A detailed description'
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Resource status',
                    example: 'active'
                  },
                  category: {
                    type: 'string',
                    maxLength: 50,
                    description: 'Resource category',
                    example: 'technology'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Resource' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/resources/{id}': {
      get: {
        summary: 'Get a resource by ID',
        tags: ['Resources'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Resource ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'Resource details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Resource' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update a resource',
        tags: ['Resources'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Resource ID',
            schema: { type: 'number' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 100,
                    example: 'Updated Resource Name'
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                    example: 'Updated description'
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    example: 'inactive'
                  },
                  category: {
                    type: 'string',
                    maxLength: 50,
                    example: 'science'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Resource updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Resource' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error or no fields provided',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete a resource',
        tags: ['Resources'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Resource ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Resource deleted successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/menus': {
      get: {
        summary: 'Get all menus with pagination, filtering, and sorting',
        tags: ['Menus'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'number', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page (max 100)',
            schema: { type: 'number', minimum: 1, maximum: 100, default: 10 }
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort by field and direction (field:asc or field:desc)',
            schema: { type: 'string', example: 'position:asc' }
          },
          {
            name: 'isActive',
            in: 'query',
            description: 'Filter by active status',
            schema: { type: 'boolean' }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Full-text search in name',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'List of menus',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MenuListResponse' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new menu',
        tags: ['Menus'],
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Menu name',
                    example: 'Main Navigation'
                  },
                  link: {
                    type: 'string',
                    description: 'Link URL',
                    example: '/'
                  },
                  hasSubmenu: {
                    type: 'boolean',
                    description: 'Specifies if this menu contains submenus',
                    example: true
                  },
                  isActive: {
                    type: 'boolean',
                    description: 'Menu active status',
                    example: true
                  },
                  position: {
                    type: 'number',
                    minimum: 0,
                    description: 'Display position',
                    example: 1
                  },
                  submenus: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Home' },
                        link: { type: 'string', example: '/home' },
                        position: { type: 'number', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Menu created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Menu' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/menus/{id}': {
      get: {
        summary: 'Get a menu by ID with all items and subitems',
        tags: ['Menus'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'Menu details with nested items',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Menu' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Menu not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update a menu',
        tags: ['Menus'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'number' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    example: 'Updated Menu Name'
                  },
                  link: {
                    type: 'string',
                    example: '/updated'
                  },
                  hasSubmenu: {
                    type: 'boolean',
                    example: false
                  },
                  isActive: {
                    type: 'boolean',
                    example: false
                  },
                  position: {
                    type: 'number',
                    minimum: 0,
                    example: 2
                  },
                  submenus: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Home' },
                        link: { type: 'string', example: '/home' },
                        position: { type: 'number', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Menu updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Menu' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error or no fields provided',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'Menu not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete a menu (cascade deletes all items)',
        tags: ['Menus'],
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Menu ID',
            schema: { type: 'number' }
          }
        ],
        responses: {
          '200': {
            description: 'Menu deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Menu deleted successfully' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '404': {
            description: 'Menu not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    },
    '/api/logo': {
      get: {
        summary: 'Get global site logo',
        tags: ['Menu Logos'],
        responses: {
          '200': {
            description: 'Site logo path',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        logo: { type: 'string', nullable: true, example: '/uploads/menus/logo-123.png' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Upload or replace global site logo',
        tags: ['Menu Logos'],
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['logo'],
                properties: {
                  logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Logo image file (jpg, jpeg, png, svg, webp - max 2MB)'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Logo uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Logo updated successfully' },
                        logo: { type: 'string', example: '/uploads/menus/logo-123.png' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'No file provided or invalid file type/size',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          },
          '401': {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JSendError' }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerConfig;
