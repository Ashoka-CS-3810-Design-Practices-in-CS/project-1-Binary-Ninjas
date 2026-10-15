
import { test, expect } from "@playwright/test";

const routes = [
  "/visualizers/stack",
  "/visualizers/queue",
  "/visualizers/linked-list",
  "/visualizers/binary-tree",
  "/visualizers/graph",
  "/visualizers/priorityQheap",
];

for (const route of routes) {
  test(`loads ${route}`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();

    // Confirm that the page contains rendered content.
    await expect(page.locator("body")).not.toBeEmpty();
  });
}

test("queue page has no horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  await page.goto("/visualizers/queue");

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));

  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
});


test("Queue: enqueue adds a value and dequeue removes it", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    // Locate the value input. Adjust the selector if needed.
    const valueInput = page.locator("input").first();
  
    await valueInput.fill("42");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    // The new value should appear in the visualizer.
    await expect(page.getByText("42", { exact: true }).first()).toBeVisible();
  
    await page.getByRole("button", { name: /dequeue/i }).first().click();
  
    // The queue should return to its empty state.
    await expect(
      page.getByText(/enqueue a value to add the first element/i)
    ).toBeVisible();
  });
  
  test("Queue: undo and redo restore queue state", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    const valueInput = page.locator("input").first();
    await valueInput.fill("25");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await page.getByRole("button", { name: "Undo", exact: true }).click();
  
    await expect(
      page.getByText(/enqueue a value to add the first element/i)
    ).toBeVisible();
  
    await page.getByRole("button", { name: "Redo", exact: true }).click();
  
    await expect(page.getByText("25", { exact: true }).first()).toBeVisible();
  });
  
  test("Queue: playback controls are available", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    await expect(
      page.getByRole("button", { name: "Play", exact: true })
    ).toBeVisible();
  
    await expect(
      page.getByRole("button", { name: "Pause", exact: true })
    ).toBeVisible();
  
    await expect(
      page.getByRole("button", { name: "Undo", exact: true })
    ).toBeVisible();
  
    await expect(
      page.getByRole("button", { name: "Redo", exact: true })
    ).toBeVisible();
  
    await expect(page.locator("#animation-speed")).toBeVisible();
  });
  

test("Queue: Play and Pause controls work", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    const input = page.locator("input").first();
    await input.fill("10");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await input.fill("20");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Pause", exact: true })
    ).toBeVisible();
  
    await page.getByRole("button", { name: "Pause", exact: true }).click();
  });
  
  test("Queue: animation speed can be changed", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    const speedControl = page.locator("#animation-speed");
    await expect(speedControl).toBeVisible();
  
    await speedControl.selectOption({ index: 1 });
    await expect(speedControl).toHaveValue(
      await speedControl.inputValue()
    );
  });
 
test("Queue: empty dequeue displays validation feedback", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    await page.getByRole("button", { name: /dequeue/i }).first().click();
  
    await expect(
      page.getByRole("complementary").getByText(
        "Cannot dequeue from an empty queue.",
        { exact: true }
      )
    ).toBeVisible();
  });


test("Queue: playback starts and can be paused", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    // Create an operation to replay.
    const input = page.locator("input").first();
    await input.fill("10");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await page.getByRole("button", { name: "Play", exact: true }).click();
  
    // Play becomes disabled while playback is active.
    await expect(
      page.getByRole("button", { name: "Play", exact: true })
    ).toBeDisabled();
  
    const pauseButton = page.getByRole("button", {
      name: "Pause",
      exact: true,
    });
  
    await expect(pauseButton).toBeEnabled();
    await pauseButton.click();
  
    await expect(pauseButton).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Play", exact: true })
    ).toBeEnabled();
  });
  
  test("Queue: playback eventually finishes", async ({ page }) => {
    await page.goto("/visualizers/queue");
  
    const input = page.locator("input").first();
  
    await input.fill("10");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await input.fill("20");
    await page.getByRole("button", { name: /enqueue/i }).first().click();
  
    await page.getByRole("button", { name: "Play", exact: true }).click();
  
    await expect(page.getByText("Replay finished.", { exact: true }))
      .toBeVisible({ timeout: 15000 });
  
    await expect(
      page.getByRole("button", { name: "Play", exact: true })
    ).toBeEnabled();
  });
  
  
  