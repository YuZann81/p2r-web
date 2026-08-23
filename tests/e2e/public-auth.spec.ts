import { test, expect } from "@playwright/test";

test.describe("1. Public Visitor & Guest Navigation Flow", () => {
  test("Homepage loads successfully as a public guest", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    // Verify no unexpected redirect to login
    expect(page.url()).not.toContain("/login");
  });

  test("Merchandise catalog is accessible publicly", async ({ page }) => {
    await page.goto("/merchandise");
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain("/merchandise");
  });

  test("Karya showcase directory is accessible publicly", async ({ page }) => {
    await page.goto("/karya");
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain("/karya");
  });

  test("Games directory is accessible publicly", async ({ page }) => {
    await page.goto("/games");
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain("/games");
  });

  test("Leaderboard is accessible publicly", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain("/leaderboard");
  });

  test("Feeds stream is accessible publicly", async ({ page }) => {
    await page.goto("/feeds");
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain("/feeds");
  });
});

test.describe("2. Guest Checkout Accessibility", () => {
  test("Checkout page is accessible directly to guests without admin redirect", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("body")).toBeVisible();

    // Verify checkout page URL is maintained (no redirect to admin login)
    expect(page.url()).toContain("/checkout");
    expect(page.url()).not.toContain("/panel");
  });
});

test.describe("3. Customer Authentication Pages UI", () => {
  test("Customer Login page renders cleanly with form controls", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();

    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
  });

  test("Customer Register page renders cleanly with registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("body")).toBeVisible();

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
  });

  test("Invalid customer credentials display informative validation error", async ({ page }) => {
    await page.goto("/login");
    
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill("invalid.visitor@example.com");
    await passwordInput.fill("WrongPassword123!");
    await submitBtn.click();

    // Verify error feedback appears without application crash
    await expect(
      page.locator('div[role="alert"]').or(page.locator('text=/tidak valid|Invalid|gagal|salah|gangguan/i'))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("4. Authenticated Customer Workflow (Env Dependent)", () => {
  test("Customer Login & Session Persistence", async ({ page }, testInfo) => {
    const customerEmail = process.env.P2R_CUSTOMER_EMAIL;
    const customerPassword = process.env.P2R_CUSTOMER_PASSWORD;

    if (!customerEmail || !customerPassword) {
      testInfo.skip(true, "Skipping customer login test: P2R_CUSTOMER_EMAIL / P2R_CUSTOMER_PASSWORD not provided.");
      return;
    }

    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"], #email').fill(customerEmail);
    await page.locator('input[type="password"], input[name="password"], #password').fill(customerPassword);
    await page.locator('button[type="submit"]').click();

    // Verify redirect away from login
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });
    expect(page.url()).not.toContain("/login");
  });
});

test.describe("5. Role & Domain Isolation Security", () => {
  test("Public Web does not leak admin control panel routes or tokens", async ({ page }) => {
    await page.goto("/");

    // Assert that no admin authorization headers or tokens are leaked in DOM
    const htmlContent = await page.content();
    expect(htmlContent).not.toContain("p2r_admin_token");
    expect(htmlContent).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
