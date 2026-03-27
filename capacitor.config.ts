import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rattanakchea.kidgames",
  appName: "Emoji Learning Flashcard Game for Kids",
  webDir: "dist",
  ios: {
    contentInset: "always",
  },
};

export default config;
