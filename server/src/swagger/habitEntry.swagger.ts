import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const habitEntrySwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Habit Entry API",
    version: "1.0.0",
    description:
      "API documentation for Habit Entry endpoints in Reclaim Habit Tracker. Supports logging habit progress with period + frequency validation, updating entries, retrieving them, and deleting them.",
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
      HabitEntry: {
        type: "object",
        properties: {
          id: { type: "string", example: "entry_123abc" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T12:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-01-01T12:05:00Z",
          },
          habitId: { type: "string", example: "habit_789xyz" },
          userId: { type: "string", example: "user_456def" },
          entryTime: {
            type: "string",
            format: "date-time",
            example: "2025-01-15T09:30:00Z",
          },
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "habitId",
          "userId",
          "entryTime",
        ],
      },

      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Validation error: Entry limit exceeded for this period.",
          },
        },
      },
    },
  },

  paths: {
    "/habit-entry": {
      post: {
        summary: "Create a new habit entry",
        description:
          "Log a new habit entry for a specific habit. This checks whether the user has remaining allowable entries for the habit's period/frequency.",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  habitId: {
                    type: "string",
                    example: "habit_123abc",
                  },
                  entryTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-01-20T14:00:00Z",
                  },
                },
                required: ["habitId", "entryTime"],
              },
            },
          },
        },

        responses: {
          201: {
            description: "Habit entry created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HabitEntry" },
              },
            },
          },
          400: {
            description: "Validation error (e.g., frequency limit exceeded)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },

      get: {
        summary: "Get all habit entries for the user",
        description:
          "Retrieve all habit entries belonging to the authenticated user, with pagination.",
        security: [{ bearerAuth: [] }],

        parameters: [
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
            description: "List of habit entries retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/HabitEntry" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/habit-entry/{id}": {
      get: {
        summary: "Get a habit entry by ID",
        description: "Retrieve a specific habit entry by its ID.",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Habit entry ID",
          },
        ],

        responses: {
          200: {
            description: "Habit entry retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HabitEntry" },
              },
            },
          },
          404: { description: "Habit entry not found" },
          401: { description: "Unauthorized" },
        },
      },

      put: {
        summary: "Update an existing habit entry",
        description:
          "Update the `entryTime` or move the entry to another habit. Frequency/period validation applies again.",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the habit entry",
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  habitId: {
                    type: "string",
                    example: "habit_987xyz",
                  },
                  entryTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-01-22T10:00:00Z",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Habit entry updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HabitEntry" },
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
          404: { description: "Habit entry not found" },
          401: { description: "Unauthorized" },
        },
      },

      delete: {
        summary: "Delete a habit entry",
        description: "Delete a habit entry by its ID.",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: { description: "Habit entry deleted successfully" },
          404: { description: "Habit entry not found" },
          401: { description: "Unauthorized" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
};

// Serve Swagger UI
router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(habitEntrySwaggerDocument));
});

export default router;
