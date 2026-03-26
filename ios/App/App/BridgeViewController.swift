import UIKit
import Capacitor

class BridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        bridge?.registerPluginType(PremiumUnlockPlugin.self)
    }
}
