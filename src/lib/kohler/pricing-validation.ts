import { z } from "zod";

const priceRecordSchema = z.object({
  sku: z.string(),
  name: z.string(),
  priceUsd: z.number().positive(),
  productUrl: z.url(),
  priceSourceUrl: z.url(),
});

export const pricingCatalogSchema = z.object({
  manufacturer: z.literal("KOHLER"),
  market: z.literal("US"),
  retrievedAt: z.string(),
  currency: z.literal("USD"),
  basis: z.string(),
  sourceUrl: z.url(),
  products: z.array(priceRecordSchema).min(18),
});
