import Foundation
import Capacitor
import StoreKit

@objc(PremiumUnlockPlugin)
public class PremiumUnlockPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PremiumUnlockPlugin"
    public let jsName = "PremiumUnlock"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "loadProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchaseProduct", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getEntitlementState", returnType: CAPPluginReturnPromise)
    ]

    private func hasPremiumAccess() async -> Bool {
        for await entitlement in Transaction.currentEntitlements {
            guard case .verified(let transaction) = entitlement else {
                continue
            }

            if transaction.productID == "com.rattanakchea.kidgames.premiumunlock" {
                return true
            }
        }

        return false
    }

    @objc func loadProducts(_ call: CAPPluginCall) {
        let productIds = call.getArray("productIds", String.self) ?? ["com.rattanakchea.kidgames.premiumunlock"]

        Task {
            do {
                let products = try await Product.products(for: productIds)
                let payload = products.map { product in
                    [
                        "id": product.id,
                        "title": product.displayName,
                        "description": product.description,
                        "displayPrice": product.displayPrice
                    ]
                }

                call.resolve(["products": payload])
            } catch {
                call.reject("Unable to load premium products.", nil, error)
            }
        }
    }

    @objc func purchaseProduct(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("A productId is required.")
            return
        }

        Task {
            do {
                guard let product = try await Product.products(for: [productId]).first else {
                    call.reject("Premium product was not found.")
                    return
                }

                let result = try await product.purchase()

                switch result {
                case .success(let verification):
                    guard case .verified(let transaction) = verification else {
                        call.resolve([
                            "success": false,
                            "premiumUnlocked": false,
                            "message": "Purchase could not be verified."
                        ])
                        return
                    }

                    await transaction.finish()

                    call.resolve([
                        "success": true,
                        "premiumUnlocked": true,
                        "message": "Premium unlocked on this device."
                    ])
                case .userCancelled:
                    call.resolve([
                        "success": false,
                        "cancelled": true,
                        "premiumUnlocked": await hasPremiumAccess(),
                        "message": "Purchase cancelled."
                    ])
                case .pending:
                    call.resolve([
                        "success": false,
                        "premiumUnlocked": await hasPremiumAccess(),
                        "message": "Purchase is pending approval."
                    ])
                @unknown default:
                    call.resolve([
                        "success": false,
                        "premiumUnlocked": await hasPremiumAccess(),
                        "message": "Purchase did not complete."
                    ])
                }
            } catch {
                call.reject("Premium purchase failed.", nil, error)
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                let unlocked = await hasPremiumAccess()

                call.resolve([
                    "restored": unlocked,
                    "premiumUnlocked": unlocked,
                    "message": unlocked ? "Premium purchases restored." : "No premium purchases were found."
                ])
            } catch {
                call.reject("Unable to restore purchases.", nil, error)
            }
        }
    }

    @objc func getEntitlementState(_ call: CAPPluginCall) {
        Task {
            call.resolve([
                "hasPremiumAccess": await hasPremiumAccess()
            ])
        }
    }
}
