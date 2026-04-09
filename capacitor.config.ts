import type { CapacitorConfig } from "@capacitor/cli";
import { appConfig } from "./src/lib/appConfig";

const config: CapacitorConfig = {
  appId: appConfig.appId,
  appName: appConfig.appName,
  webDir: "dist",
  ios: {
    contentInset: "always",
  },
};

export default config;
