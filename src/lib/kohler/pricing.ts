import pricingData from "../../../data/kohler/pricing.json";

export interface KohlerPriceRecord {
  sku: string;
  name: string;
  priceUsd: number;
  productUrl: string;
  priceSourceUrl: string;
}

interface KohlerPricingCatalog {
  manufacturer: "KOHLER";
  market: "US";
  retrievedAt: string;
  currency: "USD";
  basis: string;
  sourceUrl: string;
  products: KohlerPriceRecord[];
}

export const KOHLER_PRICING = pricingData as KohlerPricingCatalog;

/**
 * Prices are intentionally separate from the sizing catalog: KOHLER list prices
 * are volatile, while the published capacity and electrical rules are not the
 * same kind of evidence. Finish-priced accessories currently use CP as the
 * transparent reference when another finish is selected.
 */
export function getKohlerPrice(sku: string) {
  const exact = KOHLER_PRICING.products.find((product) => product.sku === sku);
  if (exact) return { record: exact, isReference: false };

  const finishless = sku.replace(/-(?:CP|SN|AF|BN|BV|BL|2MB|TT|BGP|DR)$/, "");
  const reference = KOHLER_PRICING.products.find((product) => product.sku === `${finishless}-CP`);
  return reference ? { record: reference, isReference: true } : null;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
