import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const userSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "User API",
    version: "1.0.0",
    description:
      "User management API documentation for Reclaim Habit Tracker. Includes authentication and profile management endpoints.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
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
        required: ["id", "username", "createdAt", "updatedAt"],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Validation error: Invalid username",
          },
        },
      },
    },
  },
  paths: {
    "/users/signup": {
      post: {
        summary: "Signup a new user",
        description:
          "Allows a new user to sign up using a username and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "john_doe" },
                  password: { type: "string", example: "password123" },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
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
          "Authenticates a user and returns a JWT token for subsequent requests.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "john_doe" },
                  password: { type: "string", example: "password123" },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          200: {
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
          400: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/profile": {
      get: {
        summary: "Get logged-in user profile",
        description:
          "Retrieves the authenticated user's profile. Requires a valid JWT token.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: {
            description: "Unauthorized - missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/reset-password": {
      patch: {
        summary: "Reset user password",
        description:
          "Allows the authenticated user to reset their own password.",
        security: [{ bearerAuth: [] }],
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
          200: {
            description: "Password successfully reset",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized - missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/change-username": {
      patch: {
        summary: "Change user username",
        description: "Allows the authenticated user to change their username.",
        security: [{ bearerAuth: [] }],
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
          200: {
            description: "Username successfully changed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized - missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

router.use("/", swaggerUi.serve, swaggerUi.setup(userSwaggerDocument));

export default router;
