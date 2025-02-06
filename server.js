import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { BrowserManager } from "./src/lib/playwright.js";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const browser = await BrowserManager.getBrowser();
const page = await browser.newPage({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
});
app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("typing", (value) => {
      socket.broadcast.emit("typing", value);
    });

    socket.on("search", async (req) => {
      const parseReq = JSON.parse(req);
      try {
        await page.goto(parseReq.url);
        await page.waitForLoadState('domcontentloaded', {timeout: 5000});
        const buffer = await page.screenshot({fullPage: true});
        io.emit("search", JSON.stringify({code: 200, data: buffer.toString("base64")}));
      } catch (e) {
        console.log(e);
        io.broadcast.emit("search", JSON.stringify({code: 404}));
      }
    })
  });



  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});