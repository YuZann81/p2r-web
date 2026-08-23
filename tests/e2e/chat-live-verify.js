const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("=== STARTING COMPLETE BROWSER CUSTOMER -> ADMIN CS E2E VERIFICATION ===");

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

  // Step 1: Open website on http://localhost:3000 and set customer auth
  console.log("1. Navigating to customer web (http://localhost:3000)...");
  await page.goto("http://localhost:3000");
  await page.evaluate(() => {
    localStorage.setItem("p2r_auth_token", "customer-verified-token");
    localStorage.setItem(
      "p2r_auth_user",
      JSON.stringify({
        id: 88,
        name: "Budi Pameran",
        email: "budi.pameran@pixel2reality.local",
      })
    );
  });
  await page.reload();

  // Step 2: Open Chat Modal
  console.log("2. Opening Live Chat Modal in Browser...");
  const launcher = page.locator('button[aria-label*="Live Chat"]');
  await launcher.click();
  await page.waitForSelector('div[role="dialog"]');

  // Wait for session creation
  await page.waitForTimeout(2000);

  // Step 3: Type and Send Message
  const uniqueMessage = "P2R-REAL-MSG-VERIFIED-" + Date.now();
  console.log("3. Customer typing message in UI:", uniqueMessage);
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
  await page.waitForTimeout(3000);

  console.log("\n=== CAPTURED HTTP REQUESTS ===");
  console.log(JSON.stringify(capturedRequests, null, 2));

  console.log("\n=== CAPTURED HTTP RESPONSES ===");
  console.log(JSON.stringify(capturedResponses, null, 2));

  // Step 4: Verify Session Token stored in customer localStorage
  const sessionToken = await page.evaluate(() =>
    localStorage.getItem("p2r_live_chat_session_token")
  );
  console.log(
    "\n5. Customer Session Token in localStorage:",
    sessionToken ? `[EXISTS: ${sessionToken.slice(0, 10)}...]` : "[MISSING]"
  );

  // Step 5: Verify Message rendered in Customer UI
  const dialogText = await page.locator('div[role="dialog"]').innerText();
  const customerMsgVisible = dialogText.includes(uniqueMessage);
  console.log("6. Customer Message rendered in Customer UI:", customerMsgVisible);

  // Step 6: Verify Database Persistence directly in PostgreSQL
  console.log("\n7. Inspecting PostgreSQL Database Records...");
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

  // Step 7: Simulate Admin CS sending reply and dispatching Broadcast Event to Reverb
  console.log(
    "\n8. Simulating Admin CS Reply & Broadcasting to Reverb WebSocket..."
  );
  const replyText = "Halo Budi! Pesan kamu sudah diterima Admin CS di booth pameran.";
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
    "   - Reply created & ChatMessageSent event dispatched to Reverb!"
  );

  // Step 8: Wait for Admin Reply to appear in Customer browser via Reverb WebSocket
  console.log(
    "9. Waiting for Admin Reply to arrive in Customer browser via Reverb WebSocket..."
  );
  await page.waitForTimeout(4000);

  const updatedDialogText = await page.locator('div[role="dialog"]').innerText();
  const adminReplyVisible = updatedDialogText.includes(replyText);
  console.log(
    "10. Admin Reply rendered in Customer Browser in Realtime:",
    adminReplyVisible
  );

  // Step 9: Clean up test session
  console.log("\n11. Cleaning up test session...");
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
  console.log("12. Cleaned up.");

  await browser.close();

  if (customerMsgVisible && matchedDbMsg && adminReplyVisible) {
    console.log("\n========================================================");
    console.log(">>> SUCCESS: 2-WAY BROWSER CUSTOMER <-> ADMIN CS CONFIRMED <<<");
    console.log("========================================================");
    process.exit(0);
  } else {
    console.error("\n>>> FAILED: Verification failed <<<");
    process.exit(1);
  }
})();
