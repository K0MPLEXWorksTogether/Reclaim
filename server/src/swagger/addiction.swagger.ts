import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const addictionSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Addiction API",
    version: "1.0.0",
    description:
      "API documentation for the Addiction tracking endpoints in Reclaim Habit Tracker. Supports addiction creation, retrieval, update, relapse, and deletion.",
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
      Addiction: {
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
          lastRelapse: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2025-02-10T09:30:00Z",
          },
          userId: {
            type: "string",
            example: "user_456def",
          },
          name: {
            type: "string",
            example: "Smoking",
          },
          description: {
            type: "string",
            nullable: true,
            example: "Quit smoking cigarettes completely.",
          },
          startTime: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T00:00:00Z",
          },
          resetCount: {
            type: "integer",
            example: 3,
          },
        },
        required: ["id", "createdAt", "userId", "name", "startTime"],
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
    "/addictions": {
      post: {
        summary: "Create a new addiction",
        description:
          "Create a new addiction record for the authenticated user. Requires JWT authentication.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Caffeine" },
                  description: {
                    type: "string",
                    example:
                      "Track caffeine consumption and cut down gradually.",
                  },
                  startTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-01-01T00:00:00Z",
                  },
                },
                required: ["name", "startTime"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Addiction successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Addiction" },
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
        summary: "Get all addictions",
        description:
          "Retrieve all addictions belonging to the authenticated user, with optional pagination.",
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
            description: "List of addictions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Addiction" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/addictions/{id}": {
      get: {
        summary: "Get an addiction by ID",
        description: "Retrieve a specific addiction record by its ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the addiction to retrieve",
          },
        ],
        responses: {
          200: {
            description: "Addiction retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Addiction" },
              },
            },
          },
          404: { description: "Addiction not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        summary: "Update an existing addiction",
        description:
          "Update the details of an addiction owned by the authenticated user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the addiction to update",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Sugar" },
                  description: {
                    type: "string",
                    example: "Cut down on added sugar and sweets.",
                  },
                  startTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-02-01T00:00:00Z",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Addiction updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Addiction" },
              },
            },
          },
          404: { description: "Addiction not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        summary: "Delete an addiction",
        description:
          "Delete an addiction by its ID. Only the owner of the addiction can delete it.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the addiction to delete",
          },
        ],
        responses: {
          200: { description: "Addiction deleted successfully" },
          404: { description: "Addiction not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/addictions/{id}/relapse": {
      post: {
        summary: "Record a relapse for an addiction",
        description:
          "Mark a relapse event for a specific addiction and increment the reset count.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the addiction to mark as relapsed",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  relapseDateTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-01T10:00:00Z",
                  },
                },
                required: ["relapseDateTime"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Relapse recorded successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Addiction" },
              },
            },
          },
          400: { description: "Validation error" },
          404: { description: "Addiction not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
};

// Serve Swagger UI
router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(addictionSwaggerDocument));
});

export default router;
