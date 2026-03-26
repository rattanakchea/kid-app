import { WebPlugin } from "@capacitor/core";
import {
  premiumProductId,
  type EntitlementState,
  type PremiumProduct,
  type PremiumUnlockPlugin,
  type PurchaseResult,
  type RestoreResult,
} from "./premiumUnlock";

const premiumStorageKey = "kid-games-premium-access";

function readPremiumAccess() {
  return window.localStorage.getItem(premiumStorageKey) === "true";
}

function writePremiumAccess(value: boolean) {
  window.localStorage.setItem(premiumStorageKey, value ? "true" : "false");
}

export class PremiumUnlockWeb
  extends WebPlugin
  implements PremiumUnlockPlugin
{
  async loadProducts(): Promise<{ products: PremiumProduct[] }> {
    return {
      products: [
        {
          id: premiumProductId,
          title: "Premium Pack Unlock",
          description:
            "Unlock extra themed packs for flashcards and pair games.",
          displayPrice: "$4.99",
        },
      ],
    };
  }

  async purchaseProduct(): Promise<PurchaseResult> {
    writePremiumAccess(true);

    return {
      success: true,
      premiumUnlocked: true,
      message: "Premium unlocked in the web preview.",
    };
  }

  async restorePurchases(): Promise<RestoreResult> {
    const hasPremiumAccess = readPremiumAccess();

    return {
      restored: hasPremiumAccess,
      premiumUnlocked: hasPremiumAccess,
      message: hasPremiumAccess
        ? "Premium restored from this browser."
        : "No browser purchase to restore.",
    };
  }

  async getEntitlementState(): Promise<EntitlementState> {
    return {
      hasPremiumAccess: readPremiumAccess(),
    };
  }
}
