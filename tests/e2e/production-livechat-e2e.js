const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("=== STARTING FULL PRODUCTION LIVE CHAT E2E ACCEPTANCE TEST ===");

  const PROD_URL = "https://p2r-web-zeta.vercel.app";
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const capturedRequests = [];
  const capturedResponses = [];

  page.on("request", (req) => {
    if (req.url().includes("/chat")) {
      capturedRequests.push({
        url: req.url(),
        method: req.method(),
        postData: req.postData(),
      });
    }
  });

  page.on("response", async (res) => {
    if (res.url().includes("/chat")) {
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {}
      capturedResponses.push({
        url: res.url(),
        status: res.status(),
        method: res.request().method(),
        body: bodyText,
      });
    }
  });

  // Step 1: Open production website
  console.log(`1. Navigating to production website: ${PROD_URL}...`);
  await page.goto(PROD_URL);
  await page.evaluate(() => {
    localStorage.setItem("p2r_auth_token", "customer-prod-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({
        id: 77,
        name: "Pengunjung Pameran",
        email: "pengunjung@pixel2reality.local",
      })
    );
  });
  await page.reload();

  // Step 2: Open Live Chat
  console.log("2. Opening Live Chat Modal on Production...");
  const launcher = page.locator('button[aria-label*="Live Chat"]');
  await launcher.click();
  await page.waitForSelector('div[role="dialog"]');

  // Wait for session creation
  await page.waitForTimeout(2500);

  // Step 3: Type and Send Unique Message
  const uniqueMessage = `P2R-PRODUCTION-LIVECHAT-FINAL-${Date.now()}`;
  console.log("3. Customer typing message in Production UI:", uniqueMessage);
  const input = page
    .locator(
      'input[placeholder*="Tulis pesan ke Admin"], input[placeholder*="Ketik pesan"], textarea, input[type="text"]'
    )
    .last();
  await input.fill(uniqueMessage);

  console.log("4. Customer clicks Send button...");
  const sendBtn = page.locator('button[type="submit"]').last();
  await sendBtn.click();

  // Wait 3 seconds for send and state update
  await page.waitForTimeout(3500);

  console.log("\n=== CAPTURED PRODUCTION HTTP REQUESTS ===");
  console.log(JSON.stringify(capturedRequests, null, 2));

  console.log("\n=== CAPTURED PRODUCTION HTTP RESPONSES ===");
  console.log(JSON.stringify(capturedResponses, null, 2));

  // Step 4: Verify Session Token stored in customer localStorage
  const sessionToken = await page.evaluate(() =>
    localStorage.getItem("p2r_live_chat_session_token")
  );
  console.log(
    "\n5. Customer Session Token in localStorage:",
    sessionToken ? `[EXISTS: ${sessionToken.slice(0, 12)}...]` : "[MISSING]"
  );

  // Step 5: Verify Message rendered in Customer UI
  const dialogText = await page.locator('div[role="dialog"]').innerText();
  const customerMsgVisible = dialogText.includes(uniqueMessage);
  console.log("6. Customer Message rendered in Production UI:", customerMsgVisible);

  // Verify NO mock reply exists
  const hasMockReply = dialogText.includes("Terima kasih atas pesannya");
  console.log("7. Mock Auto-Reply Present (Should be FALSE):", hasMockReply);

  // Step 6: Verify Database Persistence directly in PostgreSQL
  console.log("\n8. Inspecting PostgreSQL Database Records...");
  const dbScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    $s = \\App\\Domains\\Chat\\Models\\ChatSession::with('messages')->where('session_token', '${sessionToken}')->first();
    echo json_encode($s);
  `;
  const dbCheck = execFileSync("php", ["-r", dbScript], { encoding: "utf8" });
  const dbSession = JSON.parse(dbCheck.trim());

  console.log("   - Database Session Found:", Boolean(dbSession));
  console.log("   - Database Session ID:", dbSession?.id);
  console.log("   - Database Guest Name:", dbSession?.guest_name);
  console.log("   - Total Messages in DB Session:", dbSession?.messages?.length);

  const matchedDbMsg = dbSession?.messages?.find(
    (m) => m.message === uniqueMessage
  );
  console.log("   - Specific Test Message in DB:", Boolean(matchedDbMsg));
  console.log("   - DB Message ID:", matchedDbMsg?.id);
  console.log("   - DB Message Sender Type:", matchedDbMsg?.sender_type);

  // Step 7: Simulate Admin CS Reply & Broadcasting to Reverb WebSocket
  console.log(
    "\n9. Admin CS Reply & Broadcasting via Reverb WebSocket..."
  );
  const replyText = "Halo Pengunjung! Pesan kamu telah terverifikasi resmi oleh Admin CS di pameran.";
  const replyScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    $m = \\App\\Domains\\Chat\\Models\\ChatMessage::create([
      'chat_session_id' => ${dbSession.id},
      'sender_type' => 'admin',
      'message' => '${replyText}'
    ]);
    \\App\\Domains\\Chat\\Events\\ChatMessageSent::dispatch($m, '${sessionToken}');
    echo 'DISPATCHED';
  `;
  execFileSync("php", ["-r", replyScript], { encoding: "utf8" });
  console.log(
    "   - Reply created in DB & ChatMessageSent event dispatched to Reverb WebSocket!"
  );

  // Step 8: Wait for Admin Reply to appear in Customer browser via Reverb WebSocket
  console.log(
    "10. Waiting for Admin Reply to arrive in Customer browser via Reverb WebSocket..."
  );
  await page.waitForTimeout(4000);

  const updatedDialogText = await page.locator('div[role="dialog"]').innerText();
  const adminReplyVisible = updatedDialogText.includes(replyText);
  console.log(
    "11. Admin Reply rendered in Customer Browser in Realtime:",
    adminReplyVisible
  );

  // Step 9: Clean up test session
  console.log("\n12. Cleaning up test session via official API...");
  const cleanScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    $s = \\App\\Domains\\Chat\\Models\\ChatSession::where('session_token', '${sessionToken}')->first();
    if ($s) {
      $s->messages()->delete();
      $s->delete();
    }
    echo 'CLEANED';
  `;
  execFileSync("php", ["-r", cleanScript], { encoding: "utf8" });
  console.log("13. Production cleanup completed.");

  await browser.close();

  const allPassed =
    customerMsgVisible &&
    !hasMockReply &&
    matchedDbMsg &&
    matchedDbMsg.sender_type === "guest" &&
    adminReplyVisible;

  if (allPassed) {
    console.log("\n====================================================================");
    console.log(">>> FULL PRODUCTION E2E ACCEPTANCE TEST: 100% VERIFIED & PASSED! <<<");
    console.log("====================================================================");
    process.exit(0);
  } else {
    console.error("\n>>> FULL PRODUCTION E2E ACCEPTANCE TEST FAILED <<<");
    process.exit(1);
  }
})();
