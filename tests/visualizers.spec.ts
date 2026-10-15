
import { test, expect, type Page, type Locator } from "@playwright/test";

const visualizers = [
  { name: "Stack", route: "/visualizers/stack" },
  { name: "Queue", route: "/visualizers/queue" },
  { name: "Linked List", route: "/visualizers/linked-list" },
  { name: "Binary Search Tree", route: "/visualizers/binary-tree" },
  { name: "Graph", route: "/visualizers/graph" },
  { name: "Heap / Priority Queue", route: "/visualizers/priorityQheap" },
];

/**
 * Find a visible button by its accessible name.
 *
 * Do not anchor the regular expression: "+ Push", "Play Animation",
 * and "Add Vertex" should all be allowed to match.
 */
async function findButton(page: Page, name: RegExp): Promise<Locator> {
  const button = page.getByRole("button", { name }).filter({ visible: true }).first();

  await expect(
    button,
    `Could not find a visible button matching ${name}`
  ).toBeVisible();

  return button;
}

async function clickButton(page: Page, name: RegExp): Promise<void> {
  const button = await findButton(page, name);
  await expect(button).toBeEnabled();
  await button.click();
}

/**
 * Locate the main value input.
 *
 * Prefer the placeholder used by the Stack visualizer, then try other
 * common placeholders and accessible labels, and finally a visible input.
 */
async function findValueInput(page: Page): Promise<Locator> {
  const candidates: Locator[] = [
    page.getByPlaceholder(/enter value/i).first(),
    page.getByPlaceholder(/value|number|vertex|node|element/i).first(),
    page.getByLabel(/value|number|vertex|node|element/i).first(),
    page.locator(
      'input:visible:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])'
    ).first(),
    page.locator("textarea:visible").first(),
  ];

  for (const candidate of candidates) {
    if (await candidate.count() > 0) {
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }
  }

  throw new Error(
    "No visible value input found. Inspect the visualizer's input placeholder or accessible label."
  );
}

async function fillValue(page: Page, value: string): Promise<void> {
  const input = await findValueInput(page);
  await input.fill(value);
}

async function preparePlayback(
  page: Page,
  visualizer: (typeof visualizers)[number]
): Promise<void> {
  await page.goto(visualizer.route);

  switch (visualizer.name) {
    case "Stack":
      await fillValue(page, "42");
      await clickButton(page, /push/i);
      break;

    case "Queue":
      await fillValue(page, "42");
      await clickButton(page, /enqueue/i);
      break;

    case "Linked List":
      await fillValue(page, "42");
      await clickButton(page, /insert/i);
      break;

    case "Binary Search Tree":
      await fillValue(page, "42");
      await clickButton(page, /insert/i);
      break;

    case "Graph":
      await fillValue(page, "A");
      await clickButton(page, /add vertex|add node|create vertex/i);
      break;

    case "Heap / Priority Queue":
      await fillValue(page, "42");
      await clickButton(page, /insert/i);
      break;
  }
}

async function expectValueVisible(
  page: Page,
  value: string
): Promise<void> {
  await expect(
    page.getByText(value, { exact: true }).first()
  ).toBeVisible();
}

async function expectValueAbsent(
  page: Page,
  value: string
): Promise<void> {
  await expect(
    page.getByText(value, { exact: true })
  ).toHaveCount(0);
}

async function expectValueAbsentInRepresentation(
    page: Page,
    representationHeading: string,
    value: string
  ): Promise<void> {
    const representation = page
      .getByText(representationHeading, { exact: true })
      .locator("xpath=../..");
  
    await expect(
      representation.getByText(value, { exact: true }),
      `${value} should no longer appear in ${representationHeading}`
    ).toHaveCount(0);
  }
  

async function expectRouteLoads(
  page: Page,
  route: string
): Promise<void> {
  const response = await page.goto(route);

  expect(
    response?.status(),
    `Unexpected response status for ${route}`
  ).toBe(200);

  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toBeEmpty();
}

async function expectNoPageErrors(
  page: Page,
  action: () => Promise<void>
): Promise<void> {
  const errors: string[] = [];
  const onPageError = (error: Error) => errors.push(error.message);

  page.on("pageerror", onPageError);

  try {
    await action();
  } finally {
    page.off("pageerror", onPageError);
  }

  expect(errors, "Unexpected uncaught browser errors").toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));

  expect(
    dimensions.page,
    `Page width ${dimensions.page}px exceeds viewport width ${dimensions.viewport}px`
  ).toBeLessThanOrEqual(dimensions.viewport);
}

/**
 * Shared controls are allowed to have accessible names such as
 * "Play animation", "Pause animation", "+ Undo", or "Redo".
 */
async function expectPlaybackControls(page: Page): Promise<void> {
  await expect(await findButton(page, /play/i)).toBeVisible();
  await expect(await findButton(page, /pause/i)).toBeVisible();
}

async function expectUndoRedoControls(page: Page): Promise<void> {
  await expect(await findButton(page, /undo/i)).toBeVisible();
  await expect(await findButton(page, /redo/i)).toBeVisible();
}

// ------------------------------------------------------
// 1. ROUTES, RUNTIME ERRORS, RESPONSIVE LAYOUT
// ------------------------------------------------------

test.describe("All visualizer routes", () => {
  for (const visualizer of visualizers) {
    test(`${visualizer.name}: page loads successfully`, async ({ page }) => {
      await expectRouteLoads(page, visualizer.route);
    });

    test(`${visualizer.name}: no uncaught JavaScript errors on load`, async ({
      page,
    }) => {
      await expectNoPageErrors(page, async () => {
        await expectRouteLoads(page, visualizer.route);
      });
    });

    for (const viewport of [
      { name: "mobile", width: 390, height: 844 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1440, height: 900 },
    ]) {
      test(
        `${visualizer.name}: no horizontal overflow at ${viewport.name} width`,
        async ({ page }) => {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });

          await expectRouteLoads(page, visualizer.route);
          await expectNoHorizontalOverflow(page);
        }
      );
    }

    test(`${visualizer.name}: refresh keeps the page usable`, async ({
      page,
    }) => {
      await page.goto(visualizer.route);
      await page.reload();

      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }
});

// ------------------------------------------------------
// 2. STACK
// ------------------------------------------------------

test.describe("Stack visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/stack");
  });

  test("push adds a value", async ({ page }) => {
    await fillValue(page, "42");
    await clickButton(page, /push/i);

    await expectValueVisible(page, "42");
  });

  test("multiple pushes preserve both values", async ({ page }) => {
    await fillValue(page, "10");
    await clickButton(page, /push/i);

    await fillValue(page, "20");
    await clickButton(page, /push/i);

    await expectValueVisible(page, "10");
    await expectValueVisible(page, "20");
  });
  async function expectValueVisibleInRepresentation(
    page: Page,
    representationHeading: string,
    value: string
  ): Promise<void> {
    const representation = page
      .getByText(representationHeading, { exact: true })
      .locator("xpath=../..");
  
    await expect(
      representation.getByText(value, { exact: true }).first(),
      `${value} should appear in ${representationHeading}`
    ).toBeVisible();
  }

  test("pop removes the top value", async ({ page }) => {
    const firstValue = "9010";
    const topValue = "9020";
  
    await fillValue(page, firstValue);
    await clickButton(page, /push/i);
  
    await fillValue(page, topValue);
    await clickButton(page, /push/i);
  
    // Confirm the value was added before removing it.
    await expectValueVisibleInRepresentation(
      page,
      "Array Representation",
      topValue
    );
  
    await clickButton(page, /pop/i);
  
    // The popped value should no longer be in the stack.
    await expectValueAbsentInRepresentation(
      page,
      "Array Representation",
      topValue
    );
  
    // The earlier pushed value should remain.
    await expectValueVisibleInRepresentation(
      page,
      "Array Representation",
      firstValue
    );
  });
  

  test("peek does not remove the top value", async ({ page }) => {
    await fillValue(page, "15");
    await clickButton(page, /push/i);

    await clickButton(page, /peek/i);

    await expectValueVisible(page, "15");
  });

  test("search control is available", async ({ page }) => {
    await expect(await findButton(page, /search/i)).toBeVisible();
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 3. QUEUE
// ------------------------------------------------------

test.describe("Queue visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/queue");
  });

  test("enqueue adds a value", async ({ page }) => {
    await fillValue(page, "42");
    await clickButton(page, /enqueue/i);

    await expectValueVisible(page, "42");
  });

  test("multiple enqueues preserve both values", async ({ page }) => {
    await fillValue(page, "10");
    await clickButton(page, /enqueue/i);

    await fillValue(page, "20");
    await clickButton(page, /enqueue/i);

    await expectValueVisible(page, "10");
    await expectValueVisible(page, "20");
  });

  test("dequeue removes the front value", async ({ page }) => {
    await fillValue(page, "10");
    await clickButton(page, /enqueue/i);
  
    await fillValue(page, "20");
    await clickButton(page, /enqueue/i);
  
    await clickButton(page, /dequeue/i);
  
    // Check the actual queue representation, not operation history.
    await expectValueAbsentInRepresentation(
      page,
      "Queue Representation",
      "10"
    );
  
    await expectValueVisible(page, "20");
  });

  test("peek does not remove the front value", async ({ page }) => {
    await fillValue(page, "25");
    await clickButton(page, /enqueue/i);

    await clickButton(page, /peek/i);

    await expectValueVisible(page, "25");
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 4. LINKED LIST
// ------------------------------------------------------

test.describe("Linked List visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/linked-list");
  });

  test("insertion control is available", async ({ page }) => {
    await expect(
      await findButton(page, /insert/i)
    ).toBeVisible();
  });

  test("inserting a value displays it", async ({ page }) => {
    await fillValue(page, "42");
    await clickButton(page, /insert/i);

    await expectValueVisible(page, "42");
  });

  test("search and delete controls are available", async ({ page }) => {
    await expect(await findButton(page, /search/i)).toBeVisible();
    await expect(await findButton(page, /delete|remove/i)).toBeVisible();
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 5. BINARY SEARCH TREE
// ------------------------------------------------------

test.describe("Binary Search Tree visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/binary-tree");
  });

  test("insertion control is available", async ({ page }) => {
    await expect(await findButton(page, /insert/i)).toBeVisible();
  });

  test("inserting a value displays it", async ({ page }) => {
    await fillValue(page, "50");
    await clickButton(page, /insert/i);

    await expectValueVisible(page, "50");
  });

  test("search and delete controls are available", async ({ page }) => {
    await expect(await findButton(page, /search/i)).toBeVisible();
    await expect(await findButton(page, /delete|remove/i)).toBeVisible();
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 6. GRAPH
// ------------------------------------------------------

test.describe("Graph visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/graph");
  });

  test("vertex creation control is available", async ({ page }) => {
    await expect(
      await findButton(page, /add vertex|add node|create vertex|add.*vertex/i)
    ).toBeVisible();
  });

  test("search control is available", async ({ page }) => {
    await expect(await findButton(page, /search/i)).toBeVisible();
  });

  test("BFS and DFS controls are available", async ({ page }) => {
    await expect(
      await findButton(page, /\bbfs\b|breadth.first.search/i)
    ).toBeVisible();

    await expect(
      await findButton(page, /\bdfs\b|depth.first.search/i)
    ).toBeVisible();
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 7. HEAP / PRIORITY QUEUE
// ------------------------------------------------------

test.describe("Heap / Priority Queue visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/visualizers/priorityQheap");
  });

  test("insertion control is available", async ({ page }) => {
    await expect(await findButton(page, /insert/i)).toBeVisible();
  });

  test("inserting a value displays it", async ({ page }) => {
    await fillValue(page, "42");
    await clickButton(page, /insert/i);

    await expectValueVisible(page, "42");
  });

  test("minimum retrieval and deletion controls are available", async ({
    page,
  }) => {
    await expect(
      await findButton(page, /get min|find min|minimum|peek/i)
    ).toBeVisible();

    await expect(
      await findButton(page, /delete min|extract min|remove min/i)
    ).toBeVisible();
  });

  test("search control is available", async ({ page }) => {
    await expect(await findButton(page, /search/i)).toBeVisible();
  });

  test("undo and redo controls are available", async ({ page }) => {
    await expectUndoRedoControls(page);
  });
});

// ------------------------------------------------------
// 8. PLAYBACK CONTROLS
// ------------------------------------------------------

test.describe("Animation and playback controls", () => {
    for (const visualizer of visualizers) {
      test(`${visualizer.name}: playback controls are visible`, async ({
        page,
      }) => {
        await page.goto(visualizer.route);
        await expectPlaybackControls(page);
      });
  
      test(`${visualizer.name}: Play can be activated without a browser exception`,
  async ({ page }) => {
    test.skip(
      visualizer.name === "Graph",
      "Graph playback test is disabled for now."
    );

    const errors: string[] = [];
    const onPageError = (error: Error) => errors.push(error.message);
  
        page.on("pageerror", onPageError);
  
        try {
          await page.goto(visualizer.route);
  
          // Add data so that playback has something to animate.
          switch (visualizer.name) {
            case "Stack":
              await fillValue(page, "42");
              await clickButton(page, /push/i);
              break;
  
            case "Queue":
              await fillValue(page, "42");
              await clickButton(page, /enqueue/i);
              break;
  
            case "Linked List":
              await fillValue(page, "42");
              await clickButton(page, /insert/i);
              break;
  
            case "Binary Search Tree":
              await fillValue(page, "42");
              await clickButton(page, /insert/i);
              break;
  
            case "Graph":
              await fillValue(page, "42");
              await clickButton(
                page,
                /add vertex|add node|create vertex/i
              );
              break;
  
            case "Heap / Priority Queue":
              await fillValue(page, "42");
              await clickButton(page, /insert/i);
              break;
          }
  
          const play = await findButton(page, /play/i);
  
          await expect(
            play,
            `${visualizer.name}: Play should be enabled after adding data`
          ).toBeEnabled();
  
          await play.click();
  
          await expect(page.locator("body")).toBeVisible();
  
          // Pause only if the control is visible and enabled.
          const pause = page.getByRole("button", { name: /pause/i }).first();
  
          if (
            (await pause.isVisible().catch(() => false)) &&
            (await pause.isEnabled().catch(() => false))
          ) {
            await pause.click();
          }
        } finally {
          page.off("pageerror", onPageError);
        }
  
        expect(
          errors,
          `${visualizer.name}: playback caused an uncaught browser error`
        ).toEqual([]);
      });
    }
  
    test("Queue: playback can be started and paused after enqueue", async ({
      page,
    }) => {
      await page.goto("/visualizers/queue");
  
      await fillValue(page, "10");
      await clickButton(page, /enqueue/i);
  
      const play = await findButton(page, /play/i);
      await expect(play).toBeEnabled();
      await play.click();
  
      const pause = page.getByRole("button", { name: /pause/i }).first();
  
      if (
        (await pause.isVisible().catch(() => false)) &&
        (await pause.isEnabled().catch(() => false))
      ) {
        await pause.click();
      }
  
      await expectValueVisible(page, "10");
    });
  });
  
  // ------------------------------------------------------
  // 9. BASIC ACCESSIBILITY
  // ------------------------------------------------------
  
  test.describe("Shared UI checks", () => {
    for (const visualizer of visualizers) {
      test(`${visualizer.name}: visible buttons have accessible names`, async ({
        page,
      }) => {
        await page.goto(visualizer.route);
  
        const buttons = page.getByRole("button");
        const count = await buttons.count();
  
        for (let index = 0; index < count; index++) {
          const button = buttons.nth(index);
  
          if (!(await button.isVisible().catch(() => false))) {
            continue;
          }
  
          const ariaLabel = await button.getAttribute("aria-label");
          const text = (await button.innerText().catch(() => "")).trim();
          const title = await button.getAttribute("title");
  
          expect(
            ariaLabel?.trim() || text || title,
            `Visible button ${index + 1} on ${visualizer.name} has no accessible name`
          ).toBeTruthy();
        }
      });
  
      test(`${visualizer.name}: refresh leaves the route rendered`, async ({
        page,
      }) => {
        await page.goto(visualizer.route);
        await page.reload();
  
        await expect(page.locator("body")).toBeVisible();
        await expect(page.locator("body")).not.toBeEmpty();
      });
    }
  });
  