import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

const habitSwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Habit API",
    version: "1.0.0",
    description:
      "Habit management API documentation for Reclaim Habit Tracker. Includes habit creation, retrieval, update, and deletion endpoints.",
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
            example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
          },
          name: {
            type: "string",
            example: "Drink water",
          },
          frequency: {
            type: "integer",
            example: 3,
          },
          period: {
            type: "string",
            example: "Daily",
          },
          start: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T00:00:00Z",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-10-01T12:00:00Z",
          },
        },
        required: [
          "id",
          "name",
          "frequency",
          "period",
          "start",
          "createdAt",
          "updatedAt",
        ],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Validation error: Missing start date",
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
          "Allows a user to create a new habit with the required information including name, frequency, period, and start date.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Drink water" },
                  frequency: { type: "integer", example: 3 },
                  period: { type: "string", example: "Daily" },
                  start: {
                    type: "string",
                    format: "date-time",
                    example: "2023-10-01T00:00:00Z",
                  },
                },
                required: ["name", "frequency", "period", "start"],
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
      get: {
        summary: "Get all habits",
        description:
          "Retrieves all habits associated with the authenticated user.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Habits retrieved successfully",
            content: {
              "application/json": {
                type: "array",
                items: { $ref: "#/components/schemas/Habit" },
              },
            },
          },
          401: {
            description: "Unauthorized - Missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/habits/{id}": {
      get: {
        summary: "Get a specific habit by ID",
        description: "Retrieves a habit based on the provided ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
            },
            description: "The unique ID of the habit to retrieve",
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
          404: {
            description: "Habit not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update an existing habit",
        description:
          "Allows the user to update the details of an existing habit, including name, frequency, period, and start date.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
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
                  name: { type: "string", example: "Drink water" },
                  frequency: { type: "integer", example: 3 },
                  period: { type: "string", example: "Daily" },
                  start: {
                    type: "string",
                    format: "date-time",
                    example: "2023-10-01T00:00:00Z",
                  },
                },
                required: ["name", "frequency", "period", "start"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Habit successfully updated",
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
          404: {
            description: "Habit not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a specific habit",
        description: "Deletes a habit based on the provided ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "1c3f5d3b-5b43-4f09-bf72-0537b7cc6b4f",
            },
            description: "The unique ID of the habit to delete",
          },
        ],
        responses: {
          200: {
            description: "Habit successfully deleted",
          },
          404: {
            description: "Habit not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/habits/period/{period}": {
      get: {
        summary: "Get habits by period",
        description:
          "Retrieve habits filtered by a specific period (e.g., daily, weekly).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "period",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "daily",
            },
            description: "The period to filter habits by (e.g., daily, weekly)",
          },
        ],
        responses: {
          200: {
            description: "Habits filtered by period retrieved successfully",
            content: {
              "application/json": {
                type: "array",
                items: { $ref: "#/components/schemas/Habit" },
              },
            },
          },
          404: {
            description: "No habits found for the specified period",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/habits/frequency/{frequency}": {
      get: {
        summary: "Get habits by frequency",
        description:
          "Retrieve habits filtered by a specific frequency (e.g., 1, 2).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "frequency",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 2,
            },
            description: "The frequency to filter habits by (e.g., 1, 2)",
          },
        ],
        responses: {
          200: {
            description: "Habits filtered by period retrieved successfully",
            content: {
              "application/json": {
                type: "array",
                items: { $ref: "#/components/schemas/Habit" },
              },
            },
          },
          404: {
            description: "No habits found for the specified period",
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

router.use("/", swaggerUi.serve, (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(habitSwaggerDocument));
});

export default router;
