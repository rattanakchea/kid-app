import { Capacitor, registerPlugin } from "@capacitor/core";
import { appConfig } from "./appConfig";

const premiumUnlockPlugin = registerPlugin<PremiumUnlockPlugin>("PremiumUnlock", {
  web: () =>
    import("./premiumUnlock.web").then(({ PremiumUnlockWeb }) => new PremiumUnlockWeb()),
});

export const premiumProductId = `${appConfig.appId}.premiumunlock`;

export type PremiumProduct = {
  id: string;
  title: string;
  description: string;
  displayPrice: string;
};

export type PurchaseResult = {
  success: boolean;
  cancelled?: boolean;
  premiumUnlocked: boolean;
  message?: string;
};

export type RestoreResult = {
  restored: boolean;
  premiumUnlocked: boolean;
  message?: string;
};

export type EntitlementState = {
  hasPremiumAccess: boolean;
};

export type PremiumUnlockPlugin = {
  loadProducts(options: { productIds: string[] }): Promise<{ products: PremiumProduct[] }>;
  purchaseProduct(options: { productId: string }): Promise<PurchaseResult>;
  restorePurchases(): Promise<RestoreResult>;
  getEntitlementState(): Promise<EntitlementState>;
};

export async function loadPremiumProducts() {
  const result = await premiumUnlockPlugin.loadProducts({
    productIds: [premiumProductId],
  });

  return result.products;
}

export async function purchasePremium() {
  return premiumUnlockPlugin.purchaseProduct({ productId: premiumProductId });
}

export async function restorePremium() {
  return premiumUnlockPlugin.restorePurchases();
}

export async function refreshEntitlements() {
  return premiumUnlockPlugin.getEntitlementState();
}

export function isNativePlatform() {
  return Capacitor.getPlatform() === "ios";
}
