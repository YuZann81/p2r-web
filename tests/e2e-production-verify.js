const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("===================================================================================");
  console.log("=== PHASE 5.7.3: PRODUCTION LIVE REAL BROWSER E2E & DUPLICATE CHAT VERIFICATION ===");
  console.log("===================================================================================");

  const prodWebUrl = "https://p2r-web-zeta.vercel.app";
  const prodPanelUrl = "https://panel.razzan.site/chat";

  // 1. Create dedicated customer and admin authentication in PostgreSQL backend
  const userSetupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    
    $email = 'prod.audit.' . time() . '@pixel2reality.local';
    $user = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'Aditya Prod Audit',
        'email' => $email,
        'password' => bcrypt('password123'),
        'role' => 'customer',
        'phone' => '081234567891',
    ]);
    $token = $user->createToken('prod-customer-token')->plainTextToken;
    
    $admin = \\App\\Domains\\Auth\\Models\\User::where('role', 'admin_cs')->first();
    $adminToken = $admin->createToken('prod-admin-token')->plainTextToken;

    echo json_encode([
        'user_id' => $user->id,
        'user_name' => $user->name,
        'user_email' => $user->email,
        'customer_token' => $token,
        'admin_token' => $adminToken,
    ]);
  `;
  const setupData = JSON.parse(execFileSync("php", ["-r", userSetupScript], { encoding: "utf8" }));
  console.log("[SETUP] Live tokens created for:", setupData.user_email);

  const browser = await chromium.launch({ headless: true });
  let nativeDialogCount = 0;

  // ---------------------------------------------------------------------------------
  // BROWSER A: CUSTOMER DESKTOP (Viewport 1440x900)
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 1] Customer Desktop (Browser A) - Open Live Production Chat");
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  desktopPage.on("dialog", (d) => {
    nativeDialogCount++;
    console.error(`  ❌ Native dialog detected on Desktop: ${d.type()} - ${d.message()}`);
    d.dismiss();
  });

  await desktopPage.goto(prodWebUrl);
  await desktopPage.evaluate((data) => {
    localStorage.setItem("p2r_auth_token", data.customer_token);
    localStorage.setItem("p2r_auth_user", JSON.stringify({
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
    }));
  }, setupData);
  await desktopPage.reload();
  await desktopPage.waitForTimeout(1500);

  // Open Chat
  const desktopChatBtn = desktopPage.locator('button[aria-label*="Live Chat"]');
  await desktopChatBtn.click();
  await desktopPage.waitForSelector('div[role="dialog"]');
  await desktopPage.waitForTimeout(2000);
  console.log("  ✓ Desktop chat opened and session initialized");

  // ---------------------------------------------------------------------------------
  // BROWSER B: CUSTOMER MOBILE (Viewport 390x844) - Same Account
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 2] Customer Mobile (Browser B) - Multi-Device Session Restore");
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on("dialog", (d) => {
    nativeDialogCount++;
    console.error(`  ❌ Native dialog detected on Mobile: ${d.type()} - ${d.message()}`);
    d.dismiss();
  });

  await mobilePage.goto(prodWebUrl);
  await mobilePage.evaluate((data) => {
    localStorage.setItem("p2r_auth_token", data.customer_token);
    localStorage.setItem("p2r_auth_user", JSON.stringify({
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
    }));
  }, setupData);
  await mobilePage.reload();
  await mobilePage.waitForTimeout(1500);

  const mobileChatBtn = mobilePage.locator('button[aria-label*="Live Chat"]');
  await mobileChatBtn.click();
  await mobilePage.waitForSelector('div[role="dialog"]');
  await mobilePage.waitForTimeout(2000);
  console.log("  ✓ Mobile chat opened and attached to same active session");

  // ---------------------------------------------------------------------------------
  // BROWSER C: ADMIN CS PANEL (https://panel.razzan.site/chat)
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 3] Admin CS Panel (Browser C) - Verification");
  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await adminContext.addCookies([
    {
      name: "p2r_admin_token",
      value: setupData.admin_token,
      domain: ".razzan.site",
      path: "/",
    },
  ]);
  const adminPage = await adminContext.newPage();
  await adminPage.goto(prodPanelUrl);
  await adminPage.waitForSelector('input[placeholder*="Cari nama"]');
  await adminPage.waitForTimeout(2000);

  // ---------------------------------------------------------------------------------
  // TEST 4: DUPLICATE MESSAGE CHECK ON DESKTOP & REALTIME TO ADMIN
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 4] Duplicate Message Fix on Production & Realtime to Admin");
  const prodCheckMsg = "P2R-PHASE-5.7.3-PRODUCTION-DUPLICATE-CHECK-" + Date.now();
  const desktopInput = desktopPage.locator('input[placeholder*="Tulis pesan ke Admin"]');
  await desktopInput.fill(prodCheckMsg);
  const desktopSendBtn = desktopPage.locator('button[aria-label="Kirim pesan"]');
  await desktopSendBtn.click();

  // Wait for HTTP 201 + WebSocket event
  await desktopPage.waitForTimeout(3000);

  const desktopBubbleCount = await desktopPage.locator(`text="${prodCheckMsg}"`).count();
  console.log("  ✓ Desktop rendered bubble count:", desktopBubbleCount, "(MUST BE EXACTLY 1)");

  // Check Mobile received it in realtime
  const mobileBubbleCount = await mobilePage.locator(`text="${prodCheckMsg}"`).count();
  console.log("  ✓ Mobile received Desktop message in realtime:", mobileBubbleCount === 1 ? "PASS (Exact 1)" : "FAIL");

  // Check Admin Panel received it in realtime without reload
  const adminPageContent = await adminPage.content();
  const adminReceivedMsg = adminPageContent.includes(prodCheckMsg);
  console.log("  ✓ Admin Panel received message in realtime without reload:", adminReceivedMsg ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // TEST 5: ADMIN REPLIES -> BOTH DESKTOP & MOBILE RECEIVE SIMULTANEOUSLY
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 5] Admin CS Reply -> Simultaneous Realtime Arrival on Desktop & Mobile");
  const adminReplyMsg = "Halo Aditya! Balasan resmi Admin CS Production [Timestamp " + Date.now() + "]";
  const adminSessionItem = adminPage.locator(`aside >> text="${setupData.user_name}"`).first();
  if (await adminSessionItem.isVisible()) {
    await adminSessionItem.click();
    await adminPage.waitForTimeout(400);
  }
  const adminInput = adminPage.locator('input[placeholder*="Ketik balasan CS"], textarea, input[type="text"]').last();
  await adminInput.fill(adminReplyMsg);
  const adminSendBtn = adminPage.locator('button:has-text("Kirim")').last();
  await adminSendBtn.click();

  await desktopPage.waitForTimeout(2500);
  await mobilePage.waitForTimeout(1000);

  const desktopSawAdminReply = (await desktopPage.locator('div[role="dialog"]').innerText()).includes(adminReplyMsg);
  const mobileSawAdminReply = (await mobilePage.locator('div[role="dialog"]').innerText()).includes(adminReplyMsg);

  console.log("  ✓ Desktop received Admin reply in realtime (0 reload):", desktopSawAdminReply ? "PASS" : "FAIL");
  console.log("  ✓ Mobile received Admin reply in realtime (0 reload):", mobileSawAdminReply ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // TEST 6: CUSTOM DIALOG ON CLOSE SESSION
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 6] CustomDialog on Close Session");
  const closeSessionBtn = desktopPage.locator('button[aria-label="Akhiri sesi percakapan"]');
  let customDialogPassed = false;
  if (await closeSessionBtn.isVisible()) {
    await closeSessionBtn.click();
    await desktopPage.waitForTimeout(500);

    const dialogTitle = desktopPage.locator('text="Tutup Percakapan?"');
    const isCustomDialogVisible = await dialogTitle.isVisible();

    const cancelBtn = desktopPage.locator('button:has-text("Batal")').last();
    await cancelBtn.click();
    await desktopPage.waitForTimeout(300);
    const isDismissed = !(await dialogTitle.isVisible());

    customDialogPassed = isCustomDialogVisible && isDismissed;
    console.log("  ✓ CustomDialog rendered and cancelled cleanly:", customDialogPassed ? "PASS" : "FAIL");
  }

  // ---------------------------------------------------------------------------------
  // TEST 7: INLINE VALIDATION TEST
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 7] Inline Custom Validation Error on Empty Input");
  await desktopInput.fill("");
  await desktopSendBtn.click();
  await desktopPage.waitForTimeout(300);

  const valError = desktopPage.locator('text="Pesan tidak boleh kosong."');
  const hasValError = await valError.isVisible();
  console.log("  ✓ Custom inline validation error shown:", hasValError ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // TEST 8: CLEANUP
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 8] Cleaning up test data in backend...");
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

  console.log("\n===================================================================================");
  console.log("=== PRODUCTION LIVE REAL BROWSER E2E SUMMARY ===");
  console.log("===================================================================================");
  console.log("1. Customer -> Admin Realtime:", adminReceivedMsg ? "PASS" : "FAIL");
  console.log("2. Admin -> Customer Realtime:", desktopSawAdminReply && mobileSawAdminReply ? "PASS" : "FAIL");
  console.log("3. Multi-Device Desktop <-> Mobile Realtime:", mobileBubbleCount === 1 ? "PASS" : "FAIL");
  console.log("4. Duplicate Message Elimination:", desktopBubbleCount === 1 ? "PASS (Exact 1)" : "FAIL");
  console.log("5. Custom Dialog Interaction:", customDialogPassed ? "PASS" : "FAIL");
  console.log("6. Inline Validation:", hasValError ? "PASS" : "FAIL");
  console.log("7. Zero Native Dialogs (alert/confirm/prompt):", nativeDialogCount === 0 ? "PASS" : "FAIL");

  if (
    adminReceivedMsg &&
    desktopSawAdminReply &&
    mobileSawAdminReply &&
    mobileBubbleCount === 1 &&
    desktopBubbleCount === 1 &&
    customDialogPassed &&
    hasValError &&
    nativeDialogCount === 0
  ) {
    console.log("\n>>> SUCCESS: PRODUCTION LIVE E2E 100% VERIFIED & READY! <<<");
    process.exit(0);
  } else {
    console.error("\n>>> FAILED: Production verification failed <<<");
    process.exit(1);
  }
})();
