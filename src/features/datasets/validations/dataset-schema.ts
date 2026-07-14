import { z } from "zod";

export const createDatasetSchema = z.object({

    corpus_id: z
        .number()
        .int()
        .positive(),

    name: z
        .string()
        .trim()
        .min(1, "Dataset name is required.")
        .max(255),

    domain: z
        .string()
        .trim()
        .min(1, "Domain is required.")
        .max(100),

    version: z
        .string()
        .trim()
        .min(1, "Version is required.")
        .max(50),

    description: z
        .string()
        .trim()
        .max(5000)
        .optional()
        .or(z.literal("")),

    source: z
        .string()
        .trim()
        .max(255)
        .optional()
        .or(z.literal("")),

});

export type CreateDatasetForm = z.infer<
    typeof createDatasetSchema
>;