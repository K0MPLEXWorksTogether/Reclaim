import { Addiction, PrismaClient } from "../../generated/prisma-client";
import { AddictionInterface } from "../interfaces/addiction.interface";
import { ValidationError, InvalidError } from "../types/errors";
import {
  createAddictionPayload,
  updateAddictionPayload,
} from "../types/addictions/addictions";
import AppLogger from "../utils/logger";

const prisma = new PrismaClient();

export class AddictionRepository implements AddictionInterface {
  private logger = AppLogger.getInstance();

  async createAddiction(
    data: createAddictionPayload,
    userId: string
  ): Promise<Addiction> {
    this.logger.info(`[repo] createAddiction called with userId: ${userId}`);
    try {
      if (!data.name || !data.startTime) {
        this.logger.warn(
          `[repo] Validation failed: Missing required fields in addiction data.`
        );
        throw new ValidationError("Addiction name or startTime is missing.");
      }

      const existingAddiction = await prisma.addiction.findFirst({
        where: { name: data.name, userId },
      });

      if (existingAddiction) {
        this.logger.warn(
          `[repo] Invalid: Addiction with the same name already exists.`
        );
        throw new InvalidError("Addiction with the same name already exists.");
      }

      this.logger.info(
        `[repo] Creating new addiction in the database: ${data.name}`
      );
      data.userId = userId;
      const newAddiction = await prisma.addiction.create({ data });

      this.logger.success(
        `[repo] Addiction created successfully with id: ${newAddiction.id}`
      );
      return newAddiction;
    } catch (error: any) {
      this.logger.error(`[repo] createAddiction error: ${error.message}`);
      throw error instanceof ValidationError || error instanceof InvalidError
        ? error
        : new Error(`Error during createAddiction: ${error.message}`);
    }
  }

  async getAddiction(
    addictionId: string,
    userId: string
  ): Promise<Addiction | null> {
    this.logger.info(
      `[repo] getAddiction() called with addictionId: ${addictionId}`
    );
    try {
      if (!addictionId) {
        this.logger.warn(`[repo] addictionId cannot be empty`);
        throw new InvalidError("addictionId cannot be empty.");
      }

      const addiction = await prisma.addiction.findUnique({
        where: { id: addictionId, userId },
      });

      if (!addiction) {
        this.logger.warn(`[repo] Addiction not found: ${addictionId}`);
      } else {
        this.logger.success(
          `[repo] Addiction found successfully: ${addictionId}`
        );
      }

      return addiction;
    } catch (error: any) {
      this.logger.error(`[repo] getAddiction error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getAddiction: ${error.message}`);
    }
  }

  async getAddictions(
    page: number,
    limit: number,
    userId: string
  ): Promise<Addiction[]> {
    this.logger.info(`[repo] getAddictions() called.`);
    try {
      if (!page || !limit) {
        this.logger.warn("[repo] page or limit is empty");
        throw new InvalidError("Page or limit is empty.");
      }

      const skip: number = (page - 1) * limit;
      const addictions = await prisma.addiction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      this.logger.success(`[repo] All addictions retrieved successfully.`);
      return addictions;
    } catch (error: any) {
      this.logger.error(`[repo] getAddictions error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during getAddictions: ${error.message}`);
    }
  }

  async updateAddiction(
    addictionId: string,
    userId: string,
    data: updateAddictionPayload
  ): Promise<Addiction> {
    this.logger.info(
      `[repo] updateAddiction called with addictionId: ${addictionId}`
    );
    try {
      const addictionExists = await prisma.addiction.findUnique({
        where: { id: addictionId, userId },
      });

      if (!addictionExists) {
        this.logger.warn(
          `[repo] Addiction not found for update: ${addictionId}`
        );
        throw new InvalidError("Addiction not found.");
      }

      this.logger.info(`[repo] Updating addiction: ${addictionId}`);
      const updatedAddiction = await prisma.addiction.update({
        where: { id: addictionId, userId },
        data,
      });

      this.logger.success(
        `[repo] Addiction updated successfully with id: ${updatedAddiction.id}`
      );
      return updatedAddiction;
    } catch (error: any) {
      this.logger.error(`[repo] updateAddiction error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during updateAddiction: ${error.message}`);
    }
  }

  async deleteAddiction(
    addictionId: string,
    userId: string
  ): Promise<Addiction> {
    this.logger.info(
      `[repo] deleteAddiction called with addictionId: ${addictionId}`
    );
    try {
      const addictionExists = await prisma.addiction.findUnique({
        where: { id: addictionId, userId },
      });

      if (!addictionExists) {
        this.logger.warn(
          `[repo] Addiction not found for deletion: ${addictionId}`
        );
        throw new InvalidError("Addiction not found.");
      }

      this.logger.info(`[repo] Deleting addiction: ${addictionId}`);
      const deletedAddiction = await prisma.addiction.delete({
        where: { id: addictionId, userId },
      });

      this.logger.success(
        `[repo] Addiction deleted successfully with id: ${deletedAddiction.id}`
      );
      return deletedAddiction;
    } catch (error: any) {
      this.logger.error(`[repo] deleteAddiction error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during deleteAddiction: ${error.message}`);
    }
  }

  async relapse(
    addictionId: string,
    relapseDateTime: Date,
    userId: string
  ): Promise<Addiction> {
    this.logger.info(`[repo] relapse() called for addictionId: ${addictionId}`);
    try {
      const addiction = await prisma.addiction.findUnique({
        where: { id: addictionId, userId },
      });

      if (!addiction) {
        this.logger.warn(
          `[repo] Addiction not found for relapse: ${addictionId}`
        );
        throw new InvalidError("Addiction not found.");
      }

      this.logger.info(
        `[repo] Updating relapse time for addiction: ${addictionId}`
      );
      const updatedAddiction = await prisma.addiction.update({
        where: { id: addictionId, userId },
        data: {
          lastRelapse: relapseDateTime,
          resetCount: { increment: 1 },
        },
      });

      this.logger.success(
        `[repo] Addiction relapse recorded successfully for id: ${updatedAddiction.id}`
      );
      return updatedAddiction;
    } catch (error: any) {
      this.logger.error(`[repo] relapse error: ${error.message}`);
      throw error instanceof InvalidError
        ? error
        : new Error(`Error during relapse: ${error.message}`);
    }
  }
}
