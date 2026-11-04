import { expect, type Page } from '@playwright/test';

export async function loadPageImages(page: Page) {
  // Tall tablet grids can leave lazy images outside the browser's preload area.
  for (const image of await page.locator('img[loading="lazy"]').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete', true);
  }

  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((elements) =>
          (elements as HTMLImageElement[])
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.getAttribute('src')),
        ),
    )
    .toEqual([]);
}
