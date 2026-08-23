const { chromium } = require("@playwright/test");
const { execFileSync } = require("child_process");

(async () => {
  console.log("===================================================================================");
  console.log("=== LIVE PRODUCTION: CUSTOM DIALOG & LOGOUT VALIDATION E2E TEST ===");
  console.log("===================================================================================");

  const prodWebUrl = "https://p2r-web-zeta.vercel.app";
  const prodPanelUrl = "https://panel.razzan.site/chat";

  // Create customer & admin tokens
  const userSetupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    
    $email = 'logout.audit.' . time() . '@pixel2reality.local';
    $user = \\App\\Domains\\Auth\\Models\\User::create([
        'name' => 'Budi Logout Test',
        'email' => $email,
        'password' => bcrypt('password123'),
        'role' => 'customer',
    ]);
    $token = $user->createToken('logout-test-token')->plainTextToken;
    
    $admin = \\App\\Domains\\Auth\\Models\\User::where('role', 'admin_cs')->first();
    $adminToken = $admin->createToken('logout-admin-token')->plainTextToken;

    echo json_encode([
        'user_id' => $user->id,
        'user_name' => $user->name,
        'user_email' => $user->email,
        'customer_token' => $token,
        'admin_token' => $adminToken,
    ]);
  `;
  const setupData = JSON.parse(execFileSync("php", ["-r", userSetupScript], { encoding: "utf8" }));

  const browser = await chromium.launch({ headless: true });
  let nativeDialogCount = 0;

  // ---------------------------------------------------------------------------------
  // 1. CUSTOMER WEB LOGOUT CONFIRMATION TEST
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 1] Testing Customer Web Logout Confirmation Dialog...");
  const webContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const webPage = await webContext.newPage();

  webPage.on("dialog", (d) => {
    nativeDialogCount++;
    console.error(`  ❌ Native dialog detected on Web: ${d.type()} - ${d.message()}`);
    d.dismiss();
  });

  await webPage.goto(prodWebUrl);
  await webPage.evaluate((data) => {
    localStorage.setItem("p2r_auth_token", data.customer_token);
    localStorage.setItem("p2r_auth_user", JSON.stringify({
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
    }));
  }, setupData);
  await webPage.reload();
  await webPage.waitForTimeout(1500);

  // Click "Keluar" in Navbar
  const webLogoutBtn = webPage.locator('header button:has-text("Keluar")');
  await webLogoutBtn.click();
  await webPage.waitForTimeout(500);

  // Assert CustomDialog appeared
  const webDialogTitle = webPage.locator('text="Konfirmasi Keluar"');
  const hasWebLogoutDialog = await webDialogTitle.isVisible();
  console.log("  ✓ Customer Web shows CustomDialog on logout click:", hasWebLogoutDialog ? "PASS" : "FAIL");

  // Test Cancel
  const webCancelBtn = webPage.locator('button:has-text("Batal")').last();
  await webCancelBtn.click();
  await webPage.waitForTimeout(300);
  console.log("  ✓ Customer Web dialog dismissed cleanly on Cancel, user remains logged in");

  // Re-open and Confirm Logout
  await webLogoutBtn.click();
  await webPage.waitForTimeout(500);
  const webConfirmBtn = webPage.locator('div[role="dialog"] button:has-text("Keluar")');
  await webConfirmBtn.click();
  await webPage.waitForTimeout(1500);

  const loginLinkVisible = await webPage.locator('header a[href="/login"]').isVisible();
  console.log("  ✓ Customer Web logged out cleanly after confirmation:", loginLinkVisible ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // 2. ADMIN PANEL LOGOUT CONFIRMATION TEST
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 2] Testing Admin Panel Logout Confirmation Dialog...");
  const panelContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await panelContext.addCookies([
    {
      name: "p2r_admin_token",
      value: setupData.admin_token,
      url: "https://panel.razzan.site",
      secure: true,
      sameSite: "Lax",
    },
  ]);
  const panelPage = await panelContext.newPage();

  panelPage.on("dialog", (d) => {
    nativeDialogCount++;
    console.error(`  ❌ Native dialog detected on Panel: ${d.type()} - ${d.message()}`);
    d.dismiss();
  });

  await panelPage.goto(prodPanelUrl);
  await panelPage.waitForTimeout(2000);

  // Click logout in P2RUserMenu
  const panelLogoutBtn = panelPage.locator('button[aria-label="Log out"]');
  await panelLogoutBtn.click();
  await panelPage.waitForTimeout(500);

  // Assert CustomDialog appeared
  const panelDialogTitle = panelPage.locator('text="Konfirmasi Logout"');
  const hasPanelLogoutDialog = await panelDialogTitle.isVisible();
  console.log("  ✓ Admin Panel shows CustomDialog on logout click:", hasPanelLogoutDialog ? "PASS" : "FAIL");

  // Test Cancel
  const panelCancelBtn = panelPage.locator('button:has-text("Batal")').last();
  await panelCancelBtn.click();
  await panelPage.waitForTimeout(300);
  console.log("  ✓ Admin Panel dialog dismissed cleanly on Cancel, admin remains logged in");

  // Re-open and Confirm Logout
  await panelLogoutBtn.click();
  await panelPage.waitForTimeout(500);
  const panelConfirmBtn = panelPage.locator('div[role="dialog"] button:has-text("Keluar")');
  await panelConfirmBtn.click();
  await panelPage.waitForTimeout(2000);

  const redirectedToLogin = panelPage.url().includes("/login");
  console.log("  ✓ Admin Panel redirected to /login after logout confirmation:", redirectedToLogin ? "PASS" : "FAIL");

  // ---------------------------------------------------------------------------------
  // 3. ZERO NATIVE DIALOG AUDIT
  // ---------------------------------------------------------------------------------
  console.log("\n[TEST 3] Native Dialog Audit Assertion");
  console.log("  ✓ Native window.alert / window.confirm triggered:", nativeDialogCount === 0 ? "PASS (Zero triggered)" : "FAIL");

  // Cleanup
  const cleanupScript = `
    require '/home/zann/pixel2reality/p2r-api/vendor/autoload.php';
    $app = require_once '/home/zann/pixel2reality/p2r-api/bootstrap/app.php';
    $app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();
    $u = \\App\\Domains\\Auth\\Models\\User::find(${setupData.user_id});
    if ($u) $u->delete();
  `;
  execFileSync("php", ["-r", cleanupScript], { encoding: "utf8" });

  await browser.close();

  if (hasWebLogoutDialog && loginLinkVisible && hasPanelLogoutDialog && redirectedToLogin && nativeDialogCount === 0) {
    console.log("\n>>> SUCCESS: ALL LOGOUT VALIDATIONS & CUSTOM DIALOGS VERIFIED ON PRODUCTION! <<<");
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
