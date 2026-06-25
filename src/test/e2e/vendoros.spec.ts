import { expect, test } from "@playwright/test";

test("simulated client journey blocks and records work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Command Center" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meridian Applied Robotics, Inc." })).toBeVisible();

  await page.getByRole("button", { name: "Projects" }).click();
  await expect(page.getByText("Logo, executive bios, IR contacts, transfer agent", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Advance/ }).click();
  await expect(page.getByRole("status")).toContainText("Gate blocked");

  await page.getByRole("button", { name: /Complete · Logo/ }).click();
  await page.getByRole("button", { name: /Complete · DNS/ }).click();
  await page.getByRole("button", { name: /Advance/ }).click();
  await expect(page.getByRole("status")).toContainText("Project advanced");

  await page.getByRole("button", { name: "Requests" }).click();
  await page.getByLabel("Request description").fill("Market open emergency outage on investor website");
  await page.getByRole("button", { name: /Classify/ }).click();
  await expect(page.getByText("Emergency issue · Emergency")).toBeVisible();
});

test("mobile command center has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
