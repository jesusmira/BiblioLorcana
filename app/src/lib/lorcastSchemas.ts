import { z } from "zod";

export const LorcanaSetSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    code: z.string(),
    released_at: z.string().optional().nullable(),
  })
  .passthrough();

export const LorcanaCardSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().optional().nullable(),
    version: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    flavor_text: z.string().optional().nullable(),
    ink: z.string().optional().nullable(),
    cost: z.number().optional().nullable(),
    rarity: z.string().optional().nullable(),
    type: z.array(z.string()).optional().nullable(),
    strength: z.number().optional().nullable(),
    willpower: z.number().optional().nullable(),
    lore: z.number().optional().nullable(),
    collector_number: z.string().optional().nullable(),
    classifications: z.array(z.string()).optional().nullable(),
    image_uris: z
      .object({
        digital: z
          .object({
            small: z.string().optional().nullable(),
            normal: z.string().optional().nullable(),
            large: z.string().optional().nullable(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
    set: z
      .object({
        name: z.string().optional().nullable(),
        code: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
  })
  .passthrough();

export const ResultsSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .object({
      results: z.array(schema).optional(),
    })
    .passthrough();
