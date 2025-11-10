import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const userSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "User API",
    version: "1.0.0",
    description: "User management API documentation for Reclaim Habit Tracker",
  },
  paths: {
    "/users/signup": {
      post: {
        summary: "Signup a new user",
        description:
          "This endpoint allows a user to sign up with a username and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    example: "john_doe",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User successfully created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/login": {
      post: {
        summary: "Login and get JWT token",
        description:
          "This endpoint allows a user to login and receive a JWT token for authentication.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    example: "john_doe",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "JWT token successfully generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get user profile",
        description: "Retrieve the profile of a user by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "User ID",
            schema: {
              type: "string",
              example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
            },
          },
        ],
        responses: {
          "200": {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}/reset-password": {
      patch: {
        summary: "Reset user password",
        description: "Reset the password of a user by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "User ID",
            schema: {
              type: "string",
              example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newPassword: {
                    type: "string",
                    example: "newPassword123",
                  },
                },
                required: ["newPassword"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password successfully reset",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}/change-username": {
      patch: {
        summary: "Change user username",
        description: "Change the username of a user by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "User ID",
            schema: {
              type: "string",
              example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newUsername: {
                    type: "string",
                    example: "jane_doe",
                  },
                },
                required: ["newUsername"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Username successfully changed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
          },
          username: {
            type: "string",
            example: "john_doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2021-01-01T12:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2021-01-01T12:00:00Z",
          },
        },
        required: ["id", "username", "email", "createdAt", "updatedAt"],
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Invalid credentials",
          },
          code: {
            type: "integer",
            example: 400,
          },
        },
        required: ["message", "code"],
      },
    },
  },
};

router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(userSwaggerDocument));
});

export default router;
