const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'TaskFlow API',
        version: '1.0.0',
        description: `
# TaskFlow API Documentation

TaskFlow is a comprehensive task management system that allows users to create, organize, and track their tasks efficiently.

## Features
- User authentication (Register/Login)
- JWT-based authorization
- Full CRUD operations for tasks
- Task categorization and prioritization
- Task statistics and analytics

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`
    `,
        contact: {
            name: 'TaskFlow Support',
            email: 'support@taskflow.app'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        },
        {
            url: 'https://taskflow-api.vercel.app',
            description: 'Production server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique user identifier',
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    },
                    name: {
                        type: 'string',
                        description: 'User full name',
                        example: 'John Doe'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'john@example.com'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Account creation timestamp'
                    }
                }
            },
            Task: {
                type: 'object',
                required: ['title'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique task identifier',
                        example: '550e8400-e29b-41d4-a716-446655440001'
                    },
                    title: {
                        type: 'string',
                        description: 'Task title',
                        example: 'Complete project documentation'
                    },
                    description: {
                        type: 'string',
                        description: 'Detailed task description',
                        example: 'Write comprehensive README and API docs'
                    },
                    category: {
                        type: 'string',
                        description: 'Task category/tag',
                        example: 'Work'
                    },
                    priority: {
                        type: 'string',
                        enum: ['High', 'Medium', 'Low'],
                        description: 'Task priority level',
                        example: 'High'
                    },
                    status: {
                        type: 'string',
                        enum: ['Pending', 'In Progress', 'Completed'],
                        description: 'Current task status',
                        example: 'Pending'
                    },
                    dueDate: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task due date',
                        example: '2024-12-31T23:59:59.000Z'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task creation timestamp'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update timestamp'
                    },
                    userId: {
                        type: 'string',
                        description: 'Owner user ID'
                    }
                }
            },
            TaskInput: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 200,
                        description: 'Task title',
                        example: 'Complete project documentation'
                    },
                    description: {
                        type: 'string',
                        maxLength: 1000,
                        description: 'Detailed task description',
                        example: 'Write comprehensive README and API docs'
                    },
                    category: {
                        type: 'string',
                        maxLength: 50,
                        description: 'Task category/tag',
                        example: 'Work'
                    },
                    priority: {
                        type: 'string',
                        enum: ['High', 'Medium', 'Low'],
                        default: 'Medium',
                        description: 'Task priority level'
                    },
                    status: {
                        type: 'string',
                        enum: ['Pending', 'In Progress', 'Completed'],
                        default: 'Pending',
                        description: 'Current task status'
                    },
                    dueDate: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task due date'
                    }
                }
            },
            TaskStats: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        description: 'Total number of tasks',
                        example: 25
                    },
                    pending: {
                        type: 'integer',
                        description: 'Number of pending tasks',
                        example: 10
                    },
                    inProgress: {
                        type: 'integer',
                        description: 'Number of in-progress tasks',
                        example: 8
                    },
                    completed: {
                        type: 'integer',
                        description: 'Number of completed tasks',
                        example: 7
                    },
                    highPriority: {
                        type: 'integer',
                        description: 'Number of high priority tasks',
                        example: 5
                    },
                    overdue: {
                        type: 'integer',
                        description: 'Number of overdue tasks',
                        example: 3
                    },
                    dueSoon: {
                        type: 'integer',
                        description: 'Tasks due within 3 days',
                        example: 4
                    },
                    byCategory: {
                        type: 'object',
                        additionalProperties: {
                            type: 'integer'
                        },
                        description: 'Task count by category',
                        example: { 'Work': 15, 'Personal': 10 }
                    }
                }
            },
            RegisterInput: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 100,
                        description: 'User full name',
                        example: 'John Doe'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'john@example.com'
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        description: 'User password (min 6 characters)',
                        example: 'securepassword123'
                    }
                }
            },
            LoginInput: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'john@example.com'
                    },
                    password: {
                        type: 'string',
                        description: 'User password',
                        example: 'securepassword123'
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    message: {
                        type: 'string',
                        example: 'Login successful'
                    },
                    token: {
                        type: 'string',
                        description: 'JWT authentication token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    user: {
                        $ref: '#/components/schemas/User'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    message: {
                        type: 'string',
                        example: 'Error message'
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: {
                                    type: 'string'
                                },
                                message: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User registration and login endpoints'
        },
        {
            name: 'Tasks',
            description: 'Task management endpoints'
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
