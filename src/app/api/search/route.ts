import { BrowserManager } from "@/lib/playwright";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const browser = await BrowserManager.getBrowser();
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });

  if(!url) {
    return new NextResponse(null, {
      status: 404
    })
  }
  try {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    const buffer = await page.screenshot({fullPage: true});
    console.log(buffer)
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png"
      }
    });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, {
      status: 500
    })
  } finally {
    await page.close();
  }
}