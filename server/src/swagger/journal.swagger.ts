import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const journalSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Journal API",
    version: "1.0.0",
    description:
      "API documentation for the Journal management endpoints. Supports journal creation, retrieval, update, and deletion.",
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
      Journal: {
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
          title: {
            type: "string",
            example: "Gratitude Journal",
          },
          content: {
            type: "string",
            example: "Today I am thankful for my health and family.",
          },
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "userId",
          "title",
          "content",
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
    "/journals": {
      post: {
        summary: "Create a new journal entry",
        description:
          "Create a new journal entry for the authenticated user. Requires JWT authentication.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Gratitude Journal" },
                  content: {
                    type: "string",
                    example: "Feeling thankful today!",
                  },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Journal entry successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Journal" },
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
        summary: "Get all journal entries",
        description:
          "Retrieve all journal entries belonging to the authenticated user.",
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
            description: "List of journal entries retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Journal" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/journals/{id}": {
      get: {
        summary: "Get a journal entry by ID",
        description:
          "Retrieve a specific journal entry by its ID for the user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the journal entry to retrieve",
          },
        ],
        responses: {
          200: {
            description: "Journal entry retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Journal" },
              },
            },
          },
          404: { description: "Journal entry not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        summary: "Update an existing journal entry",
        description:
          "Update details of a specific journal entry owned by the authenticated user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the journal entry to update",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated Journal Title" },
                  content: {
                    type: "string",
                    example: "Updated content for the journal entry.",
                  },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Journal entry updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Journal" },
              },
            },
          },
          404: { description: "Journal entry not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        summary: "Delete a specific journal entry",
        description:
          "Delete a journal entry by its ID. Only the owner of the journal entry can delete it.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "The ID of the journal entry to delete",
          },
        ],
        responses: {
          200: { description: "Journal entry deleted successfully" },
          404: { description: "Journal entry not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
};

// Serve Swagger UI
router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(journalSwaggerDocument));
});

export default router;
