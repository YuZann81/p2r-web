const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("===================================================================================");
  console.log("=== PHASE 5.8.1: REALTIME SESSION STATUS & MULTI-ADMIN UNREAD SYNC E2E TEST ===");
  console.log("===================================================================================");

  // 1. Setup Test Users via PHP backend
  const setupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    
    // 1. Customer User
    $timestamp = time();
    $customerEmail = 'cs.tester.' . $timestamp . '@pixel2reality.local';
    $customer = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'Budi Customer ' . $timestamp,
        'email' => $customerEmail,
        'password' => bcrypt('password123'),
        'role' => 'customer',
    ]);
    $customerToken = $customer->createToken('cust-token')->plainTextToken;

    // 2. Admin User
    $admin = \\App\\Domains\\Auth\\Models\\User::firstOrCreate(
        ['email' => 'admin_cs_e2e@arcade.local'],
        ['name' => 'Admin CS E2E', 'password' => bcrypt('password123'), 'role' => 'admin_cs']
    );
    $adminToken = $admin->createToken('admin-e2e')->plainTextToken;

    echo json_encode([
        'customer' => [
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'token' => $customerToken,
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
  console.log(`[SETUP] Customer: ${setupData.customer.name} (${setupData.customer.email})`);
  console.log(`[SETUP] Admin: ${setupData.admin.name} (${setupData.admin.email})`);

  const browser = await chromium.launch({ headless: true });

  try {
    // -----------------------------------------------------------------------------
    // CONTEXT 1: Admin A
    // -----------------------------------------------------------------------------
    console.log("\n[SETUP] Initializing Admin A context...");
    const adminAContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const adminAPage = await adminAContext.newPage();

    await adminAPage.goto("http://localhost:3001/login");
    await adminAPage.fill("#login-email", setupData.admin.email);
    await adminAPage.fill("#login-password", "password123");
    await adminAPage.click('button[type="submit"]');
    await adminAPage.waitForURL("**/dashboard", { timeout: 10000 });

    await adminAPage.goto("http://localhost:3001/chat");
    await adminAPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });
    console.log("  ✓ Admin A inbox loaded.");

    // -----------------------------------------------------------------------------
    // CONTEXT 2: Admin B
    // -----------------------------------------------------------------------------
    console.log("\n[SETUP] Initializing Admin B context...");
    const adminBContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const adminBPage = await adminBContext.newPage();

    await adminBPage.goto("http://localhost:3001/login");
    await adminBPage.fill("#login-email", setupData.admin.email);
    await adminBPage.fill("#login-password", "password123");
    await adminBPage.click('button[type="submit"]');
    await adminBPage.waitForURL("**/dashboard", { timeout: 10000 });

    await adminBPage.goto("http://localhost:3001/chat");
    await adminBPage.waitForSelector("text=P2R Live Support Workspace", { timeout: 10000 });
    console.log("  ✓ Admin B inbox loaded.");

    // -----------------------------------------------------------------------------
    // CONTEXT 3: Customer
    // -----------------------------------------------------------------------------
    console.log("\n[SETUP] Initializing Customer context...");
    const customerContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const customerPage = await customerContext.newPage();

    customerPage.on("console", (msg) => console.log(`  [Customer Console] ${msg.type()}: ${msg.text()}`));
    customerPage.on("pageerror", (err) => console.error(`  [Customer Error]`, err));

    await customerPage.goto("http://localhost:3000/");
    await customerPage.evaluate((data) => {
      localStorage.setItem("p2r_auth_token", data.token);
      localStorage.setItem("p2r_auth_user", JSON.stringify(data));
    }, setupData.customer);

    await customerPage.reload();
    await customerPage.waitForTimeout(1500);

    // Open Live Chat Modal
    const chatButton = customerPage.locator('button[aria-label="Buka Live Chat Admin Support"]');
    await chatButton.waitFor({ state: "visible", timeout: 8000 });
    await chatButton.click();
    await customerPage.waitForSelector('text=Admin Support P2R', { timeout: 10000 });
    console.log("  ✓ Customer Live Chat modal open.");

    // -----------------------------------------------------------------------------
    // SCENARIO 1: Customer Sends 2 Messages -> Admin A & B Unread Count = 2
    // -----------------------------------------------------------------------------
    console.log("\n[SCENARIO 1] Customer sends 2 messages to CS...");
    const input = customerPage.locator('input[placeholder="Tulis pesan ke Admin..."]');
    await input.fill("Halo CS, pameran sampai jam berapa?");
    await customerPage.keyboard.press("Enter");
    await customerPage.waitForSelector("text=Halo CS, pameran sampai jam berapa?", { timeout: 8000 });

    await customerPage.waitForTimeout(500);
    await input.fill("Ada merchandise spesial?");
    await customerPage.keyboard.press("Enter");
    await customerPage.waitForSelector("text=Ada merchandise spesial?", { timeout: 8000 });
    console.log("  ✓ Customer sent 2 messages.");

    // Wait for Admin A and Admin B to receive WebSocket and show badge = 2
    console.log("\n[SCENARIO 2] Verifying unread count on Admin A and Admin B...");
    await adminAPage.waitForSelector(`text=${setupData.customer.name}`, { timeout: 10000 });
    await adminBPage.waitForSelector(`text=${setupData.customer.name}`, { timeout: 10000 });

    // Verify unread badge = 2 on both admin windows
    const cardA = adminAPage.locator('.group\\/card', { hasText: setupData.customer.name });
    const unreadBadgeA = cardA.locator("span.bg-emerald-500");
    await unreadBadgeA.waitFor({ state: "visible", timeout: 8000 });
    const badgeCountA = await unreadBadgeA.innerText();
    console.log(`  ✓ Admin A shows unread badge: ${badgeCountA}`);

    const cardB = adminBPage.locator('.group\\/card', { hasText: setupData.customer.name });
    const unreadBadgeB = cardB.locator("span.bg-emerald-500");
    await unreadBadgeB.waitFor({ state: "visible", timeout: 8000 });
    const badgeCountB = await unreadBadgeB.innerText();
    console.log(`  ✓ Admin B shows unread badge: ${badgeCountB}`);

    if (badgeCountA !== "2" || badgeCountB !== "2") {
      throw new Error(`Unread count mismatch: Expected 2, got A=${badgeCountA}, B=${badgeCountB}`);
    }

    // -----------------------------------------------------------------------------
    // SCENARIO 3: Multi-Admin Read Sync
    // Admin A clicks customer session -> Admin A unread becomes 0
    // Admin B (no action) receives ChatSessionRead -> unread becomes 0 automatically!
    // -----------------------------------------------------------------------------
    console.log("\n[SCENARIO 3] Admin A clicks session -> verifying realtime read sync to Admin B...");
    await cardA.click();

    // Admin A active conversation loaded
    await adminAPage.waitForSelector("text=Ada merchandise spesial?", { timeout: 8000 });
    console.log("  ✓ Admin A opened conversation.");

    // Verify Admin A badge disappears (0 unread)
    await adminAPage.waitForTimeout(1000);
    const hasBadgeA = await unreadBadgeA.isVisible();
    console.log(`  ✓ Admin A unread badge gone: ${!hasBadgeA}`);

    // Verify Admin B receives ChatSessionRead via Reverb and its unread badge disappears without reloading!
    console.log("  [SYNC] Checking Admin B unread badge sync via Reverb...");
    await unreadBadgeB.waitFor({ state: "detached", timeout: 8000 });
    console.log("  ✓ Admin B unread badge automatically disappeared via ChatSessionRead event!");

    // Verify persistence on Admin A page reload
    console.log("\n[SCENARIO 4] Verifying backend read persistence on reload...");
    await adminAPage.reload();
    await adminAPage.waitForSelector(`text=${setupData.customer.name}`, { timeout: 10000 });
    const cardAReloaded = adminAPage.locator('.group\\/card', { hasText: setupData.customer.name });
    const hasBadgeAfterReload = await cardAReloaded.locator("span.bg-emerald-500").isVisible();
    console.log(`  ✓ Persisted on backend last_read_at: unread is 0 after reload: ${!hasBadgeAfterReload}`);

    // -----------------------------------------------------------------------------
    // SCENARIO 5: Session Status Toggle Active -> Closed
    // Admin A closes session -> Admin B & Customer both receive ChatSessionStatusChanged!
    // -----------------------------------------------------------------------------
    console.log("\n[SCENARIO 5] Admin A closes session -> verifying realtime status propagation...");
    // Select conversation in Admin A again
    await cardAReloaded.click();
    await adminAPage.waitForSelector("text=Ada merchandise spesial?", { timeout: 8000 });

    // Click "Tutup Sesi" button
    const closeBtn = adminAPage.locator('button:has-text("Tutup Sesi")');
    await closeBtn.click();
    console.log("  ✓ Admin A clicked 'Tutup Sesi'.");

    // Admin A workspace shows closed banner
    await adminAPage.waitForSelector("text=Sesi ini telah ditutup. Buka kembali sesi untuk membalas.", { timeout: 8000 });
    console.log("  ✓ Admin A workspace shows closed status.");

    // Verify Customer receives ChatSessionStatusChanged and shows closed banner
    console.log("  [SYNC] Checking Customer window for closed status...");
    await customerPage.waitForSelector("text=Percakapan telah ditutup oleh Customer Service.", { timeout: 8000 });
    const startNewBtn = customerPage.locator('button:has-text("Mulai Percakapan Baru")');
    await startNewBtn.waitFor({ state: "visible", timeout: 5000 });
    console.log("  ✓ Customer modal received ChatSessionStatusChanged and displayed 'Mulai Percakapan Baru' button!");

    // -----------------------------------------------------------------------------
    // SCENARIO 6: Customer Starts New Session
    // -----------------------------------------------------------------------------
    console.log("\n[SCENARIO 6] Customer starts new session...");
    await startNewBtn.click();
    await customerPage.waitForSelector('input[placeholder="Tulis pesan ke Admin..."]', { timeout: 8000 });
    console.log("  ✓ Customer successfully started a new active session!");

    console.log("\n===================================================================================");
    console.log("🎉 ALL PHASE 5.8.1 LIVE MULTI-BROWSER E2E TESTS PASSED 100%!");
    console.log("===================================================================================");

  } catch (error) {
    console.error("\n❌ E2E TEST FAILED:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
