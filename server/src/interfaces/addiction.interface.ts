import { Addiction } from "../../generated/prisma-client";
import {
  createAddictionPayload,
  updateAddictionPayload,
} from "../types/addictions/addictions";

export interface AddictionInterface {
  createAddiction(
    data: createAddictionPayload,
    userId: string
  ): Promise<Addiction>;
  getAddiction(addictionId: string, userId: string): Promise<Addiction | null>;
  getAddictions(
    page: number,
    limit: number,
    userId: string
  ): Promise<Addiction[]>;
  updateAddiction(
    addictionId: string,
    userId: string,
    data: updateAddictionPayload
  ): Promise<Addiction>;
  deleteAddiction(addictionId: string, userId: string): Promise<Addiction>;
  relapse(
    addictionId: string,
    relapseDateTime: Date,
    userId: string
  ): Promise<Addiction>;
}
