import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rattanakchea.kidgames",
  appName: "Emoji Flashcard",
  webDir: "dist",
  ios: {
    contentInset: "always",
  },
};

export default config;
