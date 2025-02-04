import { Browser, chromium } from "@playwright/test";

export class BrowserManager {
  private static browser: Browser | null = null;
  
  static async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      return this.browser = await chromium.launch();
    }
    process.on('exit', async () => {
      await this.closeBrowser();
    })
    return this.browser;

  }

  static async closeBrowser(): Promise<void> {
    if(this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}