const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("==========================================================================================");
  console.log("=== PHASE 5.8.1: FINAL TARGETED AUDIT & COMPLETE E2E VERIFICATION MATRIX ===");
  console.log("==========================================================================================");

  const timestamp = Date.now();

  // 1. Setup Test Accounts via PHP Backend
  const setupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    
    // Customer Account A
    $userA = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'Gamer Customer ${timestamp}',
        'email' => 'customer.${timestamp}@pixel2reality.local',
        'password' => bcrypt('password123'),
        'role' => 'customer',
    ]);
    $tokenA = $userA->createToken('cust-a')->plainTextToken;

    // Customer Account B (For Account Isolation audit)
    $userB = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'Other Customer ${timestamp}',
        'email' => 'other.${timestamp}@pixel2reality.local',
        'password' => bcrypt('password123'),
        'role' => 'customer',
    ]);
    $tokenB = $userB->createToken('cust-b')->plainTextToken;

    // Admin User
    $admin = \\App\\Domains\\Auth\\Models\\User::firstOrCreate(
        ['email' => 'admin_cs_audit@arcade.local'],
        ['name' => 'Admin CS Audit', 'password' => bcrypt('password123'), 'role' => 'admin_cs']
    );
    $adminToken = $admin->createToken('admin-audit')->plainTextToken;

    echo json_encode([
        'customerA' => [
            'id' => $userA->id,
            'name' => $userA->name,
            'email' => $userA->email,
            'token' => $tokenA,
        ],
        'customerB' => [
            'id' => $userB->id,
            'name' => $userB->name,
            'email' => $userB->email,
            'token' => $tokenB,
        ],
        'admin' => [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'token' => $adminToken,
        ]
    ]);
  `;

  const setupData = JSON.parse(execFileSync("php", ["-r", setupScript], { encoding: "utf8" }));
  console.log(`[SETUP] Customer A: ${setupData.customerA.name} (${setupData.customerA.email})`);
  console.log(`[SETUP] Customer B: ${setupData.customerB.name} (${setupData.customerB.email})`);
  console.log(`[SETUP] Admin: ${setupData.admin.name} (${setupData.admin.email})`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    // -------------------------------------------------------------------------------------
    // BROWSER INITIALIZATION
    // -------------------------------------------------------------------------------------
    console.log("\n[SETUP] Launching Admin A, Admin B, Customer (Device 1), and Customer (Device 2)...");
    
    // 1. Admin A
    const adminAContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const adminAPage = await adminAContext.newPage();
    await adminAPage.goto("http://localhost:3001/login");
    await adminAPage.fill("#login-email", setupData.admin.email);
    await adminAPage.fill("#login-password", "password123");
    await adminAPage.click('button[type="submit"]');
    await adminAPage.waitForURL("**/dashboard", { timeout: 10000 });
    await adminAPage.goto("http://localhost:3001/chat");
    await adminAPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });

    // 2. Admin B
    const adminBContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const adminBPage = await adminBContext.newPage();
    await adminBPage.goto("http://localhost:3001/login");
    await adminBPage.fill("#login-email", setupData.admin.email);
    await adminBPage.fill("#login-password", "password123");
    await adminBPage.click('button[type="submit"]');
    await adminBPage.waitForURL("**/dashboard", { timeout: 10000 });
    await adminBPage.goto("http://localhost:3001/chat");
    await adminBPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });

    // 3. Customer A - Device 1
    const cust1Context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const cust1Page = await cust1Context.newPage();
    await cust1Page.goto("http://localhost:3000/");
    await cust1Page.evaluate((data) => {
      localStorage.setItem("p2r_auth_token", data.token);
      localStorage.setItem("p2r_auth_user", JSON.stringify(data));
    }, setupData.customerA);
    await cust1Page.reload();
    await cust1Page.waitForTimeout(1000);
    const chatBtn1 = cust1Page.locator('button[aria-label="Buka Live Chat Admin Support"]');
    await chatBtn1.click();
    await cust1Page.waitForSelector('text=Admin Support P2R', { timeout: 10000 });

    // 4. Customer A - Device 2 (Multi-device consistency check)
    const cust2Context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const cust2Page = await cust2Context.newPage();
    await cust2Page.goto("http://localhost:3000/");
    await cust2Page.evaluate((data) => {
      localStorage.setItem("p2r_auth_token", data.token);
      localStorage.setItem("p2r_auth_user", JSON.stringify(data));
    }, setupData.customerA);
    await cust2Page.reload();
    await cust2Page.waitForTimeout(1000);
    const chatBtn2 = cust2Page.locator('button[aria-label="Buka Live Chat Admin Support"]');
    await chatBtn2.click();
    await cust2Page.waitForSelector('text=Admin Support P2R', { timeout: 10000 });

    console.log("  ✓ All 4 browser contexts connected successfully.\n");

    // =====================================================================================
    // SCENARIO 10: Multi-device account -> same session token
    // =====================================================================================
    console.log("[MATRIX 10/10] Multi-device account -> same session token across Device 1 & Device 2");
    await cust1Page.waitForFunction(() => localStorage.getItem("p2r_live_chat_session_token") !== null, { timeout: 10000 });
    await cust2Page.waitForFunction(() => localStorage.getItem("p2r_live_chat_session_token") !== null, { timeout: 10000 });
    const tokenDev1 = await cust1Page.evaluate(() => localStorage.getItem("p2r_live_chat_session_token"));
    const tokenDev2 = await cust2Page.evaluate(() => localStorage.getItem("p2r_live_chat_session_token"));
    const sameSessionToken = tokenDev1 && tokenDev2 && tokenDev1 === tokenDev2;
    console.log(`  Device 1 Token: ${tokenDev1}`);
    console.log(`  Device 2 Token: ${tokenDev2}`);
    console.log(`  Result: ${sameSessionToken ? "PASS (Identical Account-Bound Token)" : "FAIL"}`);
    results.push({ name: "Multi-device account -> same session token", status: sameSessionToken ? "PASS" : "FAIL" });

    // =====================================================================================
    // SCENARIO 1 & 9: Customer sends message -> A & B unread, HTTP + WS exactly 1 bubble
    // =====================================================================================
    console.log("\n[MATRIX 1 & 9] Customer sends -> A & B unread | HTTP + WS message -> exactly 1 bubble");
    const input1 = cust1Page.locator('input[placeholder="Tulis pesan ke Admin..."]');
    await input1.fill("Pesan Audit 1: Info jadwal pameran");
    await cust1Page.keyboard.press("Enter");
    await cust1Page.waitForSelector("text=Pesan Audit 1: Info jadwal pameran", { timeout: 8000 });

    // Check bubble count in customer device 1 and device 2
    const bubblesDev1 = await cust1Page.locator('text=Pesan Audit 1: Info jadwal pameran').count();
    await cust2Page.waitForSelector("text=Pesan Audit 1: Info jadwal pameran", { timeout: 8000 });
    const bubblesDev2 = await cust2Page.locator('text=Pesan Audit 1: Info jadwal pameran').count();
    const exactlyOneBubble = bubblesDev1 === 1 && bubblesDev2 === 1;
    console.log(`  Bubble count: Dev1 = ${bubblesDev1}, Dev2 = ${bubblesDev2}`);
    results.push({ name: "HTTP + WS message -> exactly 1 bubble", status: exactlyOneBubble ? "PASS" : "FAIL" });

    // Check Admin A and Admin B unread badge
    const cardA = adminAPage.locator('.group\\/card', { hasText: setupData.customerA.name });
    await cardA.locator("span.bg-emerald-500").waitFor({ state: "visible", timeout: 8000 });
    const countA = await cardA.locator("span.bg-emerald-500").innerText();

    const cardB = adminBPage.locator('.group\\/card', { hasText: setupData.customerA.name });
    await cardB.locator("span.bg-emerald-500").waitFor({ state: "visible", timeout: 8000 });
    const countB = await cardB.locator("span.bg-emerald-500").innerText();
    console.log(`  Admin A unread: ${countA}, Admin B unread: ${countB}`);
    const unreadInitial = countA === "1" && countB === "1";
    results.push({ name: "Customer sends -> A & B unread", status: unreadInitial ? "PASS" : "FAIL" });

    // =====================================================================================
    // SCENARIO 2: Admin A opens -> A & B unread -> 0 (Admin B realtime without reload!)
    // =====================================================================================
    console.log("\n[MATRIX 2/10] Admin A opens -> A & B unread -> 0 (Realtime Reverb Sync)");
    await cardA.click();
    await adminAPage.waitForSelector("text=Pesan Audit 1: Info jadwal pameran", { timeout: 8000 });
    await cardA.locator("span.bg-emerald-500").waitFor({ state: "detached", timeout: 8000 });
    console.log(`  Admin A badge visible: false`);

    // Admin B must receive ChatSessionRead and badge disappears without page reload
    await cardB.locator("span.bg-emerald-500").waitFor({ state: "detached", timeout: 8000 });
    console.log(`  Admin B badge visible: false`);
    results.push({ name: "Admin A opens -> A & B unread -> 0", status: "PASS" });

    // =====================================================================================
    // SCENARIO 3: Customer sends again -> A=0 jika viewing, B=1
    // =====================================================================================
    console.log("\n[MATRIX 3/10] Customer sends again -> A=0 jika viewing, B=1");
    await input1.fill("Pesan Audit 2: Apakah ada doorprize?");
    await cust1Page.keyboard.press("Enter");
    await cust1Page.waitForSelector("text=Pesan Audit 2: Apakah ada doorprize?", { timeout: 8000 });

    // Admin A is currently viewing this conversation -> unread must remain 0
    await adminAPage.waitForSelector("text=Pesan Audit 2: Apakah ada doorprize?", { timeout: 8000 });
    await adminAPage.waitForTimeout(500);
    const hasBadgeAViewing = await cardA.locator("span.bg-emerald-500").isVisible();
    console.log(`  Admin A badge (viewing conversation): ${hasBadgeAViewing ? "Visible" : "Hidden (0)"}`);

    // Admin B is not viewing this conversation -> unread must become 1
    await cardB.locator("span.bg-emerald-500").waitFor({ state: "visible", timeout: 8000 });
    const countBNew = await cardB.locator("span.bg-emerald-500").innerText();
    console.log(`  Admin B badge (other context): ${countBNew} (Expected: 1)`);
    const viewingPass = !hasBadgeAViewing && countBNew === "1";
    results.push({ name: "Customer sends again -> A=0 jika viewing, B=1", status: viewingPass ? "PASS" : "FAIL" });

    // =====================================================================================
    // SCENARIO 4: Admin B opens -> B=0
    // =====================================================================================
    console.log("\n[MATRIX 4/10] Admin B opens -> B=0");
    await cardB.click();
    await adminBPage.waitForSelector("text=Pesan Audit 2: Apakah ada doorprize?", { timeout: 8000 });
    await cardB.locator("span.bg-emerald-500").waitFor({ state: "detached", timeout: 8000 });
    const hasBadgeBAfterOpen = await cardB.locator("span.bg-emerald-500").isVisible();
    console.log(`  Admin B badge after open: ${hasBadgeBAfterOpen ? "Visible" : "Hidden (0)"}`);
    results.push({ name: "Admin B opens -> B=0", status: !hasBadgeBAfterOpen ? "PASS" : "FAIL" });

    // =====================================================================================
    // SCENARIO 5 & 6: Admin A refresh -> tetap 0 | Admin B refresh -> tetap 0
    // =====================================================================================
    console.log("\n[MATRIX 5 & 6] Admin A refresh -> tetap 0 | Admin B refresh -> tetap 0 (Backend Persistence)");
    await adminAPage.reload();
    await adminAPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });
    const cardAReload = adminAPage.locator('.group\\/card', { hasText: setupData.customerA.name });
    const hasBadgeAReload = await cardAReload.locator("span.bg-emerald-500").isVisible();
    console.log(`  Admin A unread badge after browser refresh: ${hasBadgeAReload ? "Visible" : "Hidden (0)"}`);
    results.push({ name: "Admin A refresh -> tetap 0", status: !hasBadgeAReload ? "PASS" : "FAIL" });

    await adminBPage.reload();
    await adminBPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });
    const cardBReload = adminBPage.locator('.group\\/card', { hasText: setupData.customerA.name });
    const hasBadgeBReload = await cardBReload.locator("span.bg-emerald-500").isVisible();
    console.log(`  Admin B unread badge after browser refresh: ${hasBadgeBReload ? "Visible" : "Hidden (0)"}`);
    results.push({ name: "Admin B refresh -> tetap 0", status: !hasBadgeBReload ? "PASS" : "FAIL" });

    // =====================================================================================
    // SCENARIO 7: Admin A closes -> B + Customer CLOSED realtime
    // =====================================================================================
    console.log("\n[MATRIX 7/10] Admin A closes -> B + Customer CLOSED realtime");
    await cardAReload.click();
    await adminAPage.waitForSelector("text=Pesan Audit 2: Apakah ada doorprize?", { timeout: 8000 });

    const closeBtn = adminAPage.locator('button:has-text("Tutup Sesi")');
    await closeBtn.click();
    await adminAPage.waitForSelector("text=Sesi ini telah ditutup. Buka kembali sesi untuk membalas.", { timeout: 8000 });
    console.log("  Admin A status: CLOSED");

    // Check Customer modal realtime transition
    await cust1Page.waitForSelector("text=Percakapan telah ditutup oleh Customer Service.", { timeout: 8000 });
    const startNewBtn1 = cust1Page.locator('button:has-text("Mulai Percakapan Baru")');
    await startNewBtn1.waitFor({ state: "visible", timeout: 5000 });
    console.log("  Customer Device 1 status: CLOSED (Banner + Mulai Percakapan Baru button visible)");

    // Check Customer Device 2 realtime transition
    await cust2Page.waitForSelector("text=Percakapan telah ditutup oleh Customer Service.", { timeout: 8000 });
    console.log("  Customer Device 2 status: CLOSED realtime");

    // Check Admin B status indicator
    await adminBPage.waitForSelector(`.group\\/card:has-text("${setupData.customerA.name}") span.bg-slate-500`, { timeout: 8000 });
    console.log("  Admin B session indicator: CLOSED (Gray status dot)");
    results.push({ name: "Admin A closes -> B + Customer CLOSED realtime", status: "PASS" });

    // =====================================================================================
    // SCENARIO 8: Customer starts new chat -> new ACTIVE session
    // =====================================================================================
    console.log("\n[MATRIX 8/10] Customer starts new chat -> new ACTIVE session");
    await startNewBtn1.click();
    await cust1Page.waitForSelector('input[placeholder="Tulis pesan ke Admin..."]', { timeout: 8000 });
    
    // Check new token on Customer
    const newToken = await cust1Page.evaluate(() => localStorage.getItem("p2r_live_chat_session_token"));
    const tokenIsNew = newToken && newToken !== tokenDev1;
    console.log(`  Previous Token: ${tokenDev1}`);
    console.log(`  New Token:      ${newToken}`);
    console.log(`  Token rotation: ${tokenIsNew ? "PASS (New session generated)" : "FAIL"}`);
    results.push({ name: "Customer starts new chat -> new ACTIVE session", status: tokenIsNew ? "PASS" : "FAIL" });

    console.log("\n==========================================================================================");
    console.log("=== FINAL MATRIX VERIFICATION RESULTS ===");
    console.log("==========================================================================================");
    console.table(results);

    const allPass = results.every((r) => r.status === "PASS");
    if (!allPass) {
      throw new Error("One or more matrix scenarios failed.");
    }
    console.log("\n✅ ALL 10 E2E MATRIX SCENARIOS PASSED 100%!");

  } catch (err) {
    console.error("\n❌ AUDIT MATRIX FAILED:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
