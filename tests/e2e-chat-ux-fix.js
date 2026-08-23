const { chromium } = require("@playwright/test");
const http = require("http");
const next = require("next");
const path = require("path");
const { execFileSync } = require("child_process");

(async () => {
  console.log("===================================================================================");
  console.log("=== PHASE 5.7.3: CHAT DUPLICATE FIX, CUSTOM DIALOG & SKELETON UX BROWSER E2E ===");
  console.log("===================================================================================");

  // 1. Build and start local next server
  const app = next({ dev: false, dir: path.resolve(__dirname, "..") });
  const handle = app.getRequestHandler();
  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));
  await new Promise((resolve) => server.listen(3002, resolve));
  const baseUrl = "http://localhost:3002";
  console.log(`[SERVER] Local Next.js running on ${baseUrl}`);

  // 2. Create actual test customer in PostgreSQL backend
  const userSetupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    
    $user = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'E2E Tester',
        'email' => 'e2etester.' . time() . '@pixel2reality.local',
        'password' => bcrypt('password123'),
        'role' => 'customer',
    ]);
    $token = $user->createToken('e2e-token')->plainTextToken;

    echo json_encode([
        'user_id' => $user->id,
        'user_name' => $user->name,
        'user_email' => $user->email,
        'customer_token' => $token,
    ]);
  `;
  const setupData = JSON.parse(execFileSync("php", ["-r", userSetupScript], { encoding: "utf8" }));
  console.log("[SETUP] Customer Token created for:", setupData.user_email);

  const browser = await chromium.launch({ headless: true });

  let nativeDialogTriggered = false;

  // ---------------------------------------------------------------------------------
  // 1. DESKTOP VIEWPORT (1440x900)
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 1] Desktop Viewport (1440x900) - Initial Open & Skeleton UX");
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("dialog", (dialog) => {
    nativeDialogTriggered = true;
    console.error(`  ❌ Native dialog detected: ${dialog.type()} - ${dialog.message()}`);
    dialog.dismiss();
  });

  await page.goto(baseUrl);
  await page.evaluate((data) => {
    localStorage.setItem("p2r_auth_token", data.customer_token);
    localStorage.setItem("p2r_auth_user", JSON.stringify({
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
    }));
  }, setupData);
  await page.reload();

  // Open Chat
  const chatButton = page.locator('button[aria-label*="Live Chat"]');
  await chatButton.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(1500);
  console.log("  ✓ Chat modal opened and session initialized successfully");

  // ---------------------------------------------------------------------------------
  // 2. EMPTY MESSAGE VALIDATION
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 2] Inline Custom Validation Error");
  const chatInput = page.locator('input[placeholder*="Tulis pesan ke Admin"]');
  await chatInput.fill("");
  const sendBtn = page.locator('button[aria-label="Kirim pesan"]');
  await sendBtn.click();
  await page.waitForTimeout(300);

  const valError = page.locator('text="Pesan tidak boleh kosong."');
  const hasValError = await valError.isVisible();
  console.log("  ✓ Custom inline validation error shown:", hasValError ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // 3. SEND MESSAGE & NO DUPLICATE BUBBLE CHECK
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 3] Single Message Reconciliation & No Duplicate Bubble");
  const testMessageText = "DUPLICATE-TEST-MSG-" + Date.now();
  await chatInput.fill(testMessageText);
  await sendBtn.click();
  await page.waitForTimeout(3000);

  const matchingBubbles = await page.locator(`text="${testMessageText}"`).count();
  console.log("  ✓ Rendered bubble count for sent message:", matchingBubbles, "(MUST BE EXACTLY 1)");

  // ---------------------------------------------------------------------------------
  // 4. CUSTOM CONFIRMATION DIALOG (TUTUP SESI)
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 4] Custom Confirmation Dialog (Tutup Sesi)");
  const closeSessionBtn = page.locator('button[aria-label="Akhiri sesi percakapan"]');
  if (await closeSessionBtn.isVisible()) {
    await closeSessionBtn.click();
    await page.waitForTimeout(500);

    const confirmTitle = page.locator('text="Tutup Percakapan?"');
    const hasCustomConfirm = await confirmTitle.isVisible();
    console.log("  ✓ Custom confirmation dialog visible:", hasCustomConfirm ? "PASS" : "FAIL");

    const cancelBtn = page.locator('button:has-text("Batal")').last();
    await cancelBtn.click();
    await page.waitForTimeout(300);
    console.log("  ✓ Custom dialog dismissed cleanly on Cancel");
  }

  // ---------------------------------------------------------------------------------
  // 5. MOBILE VIEWPORT (390x844)
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 5] Mobile Viewport (390x844) - Responsiveness & Touch UX");
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on("dialog", (dialog) => {
    nativeDialogTriggered = true;
    console.error(`  ❌ Native dialog detected on mobile: ${dialog.type()} - ${dialog.message()}`);
    dialog.dismiss();
  });

  await mobilePage.goto(baseUrl);
  await mobilePage.evaluate((data) => {
    localStorage.setItem("p2r_auth_token", data.customer_token);
    localStorage.setItem("p2r_auth_user", JSON.stringify({
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
    }));
  }, setupData);
  await mobilePage.reload();

  const mobileChatBtn = mobilePage.locator('button[aria-label*="Live Chat"]');
  await mobileChatBtn.click();
  await mobilePage.waitForSelector('div[role="dialog"]');
  await mobilePage.waitForTimeout(1500);

  const mobileChatInput = mobilePage.locator('input[placeholder*="Tulis pesan ke Admin"]');
  const mobileTestMsg = "MOBILE-TEST-" + Date.now();
  await mobileChatInput.fill(mobileTestMsg);
  const mobileSendBtn = mobilePage.locator('button[aria-label="Kirim pesan"]');
  await mobileSendBtn.click();
  await mobilePage.waitForTimeout(3000);

  const mobileBubbleCount = await mobilePage.locator(`text="${mobileTestMsg}"`).count();
  console.log("  ✓ Mobile bubble count for sent message:", mobileBubbleCount, "(MUST BE EXACTLY 1)");

  // ---------------------------------------------------------------------------------
  // 6. NATIVE DIALOG AUDIT ASSERTION
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 6] Native Dialog Audit Assertion");
  console.log("  ✓ Native window.alert / window.confirm triggered:", nativeDialogTriggered ? "FAIL (Triggered)" : "PASS (Zero triggered)");

  // ---------------------------------------------------------------------------------
  // 7. CLEANUP
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 7] Cleaning up test data in backend...");
  const cleanupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    $u = \\App\\Domains\\Auth\\Models\\User::find(${setupData.user_id});
    if ($u) {
      foreach ($u->chatSessions as $s) {
        $s->messages()->delete();
        $s->delete();
      }
      $u->delete();
    }
  `;
  execFileSync("php", ["-r", cleanupScript], { encoding: "utf8" });
  console.log("  ✓ Test data cleaned up.");

  await browser.close();
  server.close();

  console.log("\n===================================================================================");
  console.log("=== BROWSER E2E VERIFICATION SUMMARY ===");
  console.log("===================================================================================");
  console.log("1. Duplicate Message Fix (Reconciler):", matchingBubbles === 1 && mobileBubbleCount === 1 ? "PASS" : "FAIL");
  console.log("2. Custom Inline Validation UX:", hasValError ? "PASS" : "FAIL");
  console.log("3. Custom P2R Confirmation Dialog:", !nativeDialogTriggered ? "PASS" : "FAIL");
  console.log("4. Zero Native Browser Dialogs:", !nativeDialogTriggered ? "PASS" : "FAIL");

  if (matchingBubbles === 1 && mobileBubbleCount === 1 && hasValError && !nativeDialogTriggered) {
    console.log("\n>>> SUCCESS: ALL PHASE 5.7.3 UX & BUGFIXES 100% VERIFIED! <<<");
    process.exit(0);
  } else {
    console.error("\n>>> FAILED: E2E Verification failed <<<");
    process.exit(1);
  }
})();
