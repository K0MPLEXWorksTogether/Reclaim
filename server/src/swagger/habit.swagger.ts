import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const habitSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Habit API",
    version: "1.1.0",
    description:
      "API documentation for the Habit management endpoints in Reclaim Habit Tracker. Supports habit creation, retrieval, update, filtering, and deletion.",
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
      Habit: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "cuid_123abc",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T12:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-01-02T12:00:00Z",
          },
          userId: {
            type: "string",
            example: "user_456def",
          },
          name: {
            type: "string",
            example: "Drink Water",
          },
          description: {
            type: "string",
            nullable: true,
            example: "Drink 8 glasses of water per day",
          },
          start: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T00:00:00Z",
          },
          frequency: {
            type: "integer",
            example: 3,
          },
          period: {
            type: "string",
            example: "Daily",
          },
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "userId",
          "name",
          "start",
          "frequency",
          "period",
        ],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Validation error: Missing required fields.",
          },
        },
      },
    },
  },
  paths: {
    "/habits": {
      post: {
        summary: "Create a new habit",
        description:
          "Create a new habit for the authenticated user. Requires JWT authentication.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Read a book" },
                  description: {
                    type: "string",
                    example: "Read for at least 30 minutes",
                  },
                  start: {
                    type: "string",
                    format: "date-time",
                    example: "2025-01-01T00:00:00Z",
                  },
                  frequency: { type: "integer", example: 3 },
                  period: { type: "string", example: "Weekly" },
                },
                required: ["name", "start", "frequency", "period"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Habit successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Habit" },
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
          401: { description: "Unauthorized - Missing or invalid token" },
          500: { description: "Internal server error" },
        },
      },
      get: {
        summary: "Get all habits",
        description:
          "Retrieve all habits belonging to the authenticated user, with optional pagination.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
            description: "Page number for pagination",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", example: 10 },
            description: "Number of results per page",
          },
        ],
        responses: {
          200: {
            description: "List of habits retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Habit" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/habits/{id}": {
      get: {
        summary: "Get a habit by ID",
        description: "Retrieve a specific habit by its ID for the user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the habit to retrieve",
          },
        ],
        responses: {
          200: {
            description: "Habit retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Habit" },
              },
            },
          },
          404: { description: "Habit not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        summary: "Update an existing habit",
        description:
          "Update details of a specific habit owned by the authenticated user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the habit to update",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Drink Water" },
                  description: {
                    type: "string",
                    example: "Updated: Drink 2 liters of water",
                  },
                  start: {
                    type: "string",
                    format: "date-time",
                    example: "2025-02-01T00:00:00Z",
                  },
                  frequency: { type: "integer", example: 2 },
                  period: { type: "string", example: "Weekly" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Habit updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Habit" },
              },
            },
          },
          404: { description: "Habit not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        summary: "Delete a specific habit",
        description:
          "Delete a habit by its ID. Only the owner of the habit can delete it.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the habit to delete",
          },
        ],
        responses: {
          200: { description: "Habit deleted successfully" },
          404: { description: "Habit not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/habits/period/{period}": {
      get: {
        summary: "Get habits by period",
        description:
          "Retrieve habits filtered by a specific period (e.g., 'daily', 'weekly'). Supports pagination.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "period",
            in: "path",
            required: true,
            schema: { type: "string", example: "daily" },
            description: "The period to filter habits by",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", example: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", example: 10 },
          },
        ],
        responses: {
          200: {
            description: "Habits retrieved successfully by period",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Habit" },
                },
              },
            },
          },
          404: { description: "No habits found for the given period" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/habits/frequency/{frequency}": {
      get: {
        summary: "Get habits by frequency",
        description:
          "Retrieve habits filtered by a specific frequency (e.g., 1, 2). Supports pagination.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "frequency",
            in: "path",
            required: true,
            schema: { type: "integer", example: 3 },
            description: "The frequency to filter habits by",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", example: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", example: 10 },
          },
        ],
        responses: {
          200: {
            description: "Habits retrieved successfully by frequency",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Habit" },
                },
              },
            },
          },
          404: { description: "No habits found for the given frequency" },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};

// Serve Swagger UI
router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(habitSwaggerDocument));
});

export default router;
