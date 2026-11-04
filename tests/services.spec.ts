import { test, expect } from '@playwright/test';

const expected = {
  ar: [
    [
      'تركيبات وتعويضات الأسنان',
      [
        'تيجان الأسنان',
        'جسور الأسنان',
        'تيجان الزيركون',
        'بدلات الأسنان المتحركة الجزئية',
        'بدلات الأسنان المتحركة الكاملة',
      ],
    ],
    [
      'تجميل الأسنان',
      ['تبييض الأسنان بالليزر', 'فينير إيماكس', 'الحشوات التجميلية'],
    ],
    ['طب أسنان الأطفال', ['معالجة أسنان الأطفال', 'تقويم الأطفال']],
    ['علاج الأسنان والعصب', ['مداواة لبية (علاج العصب)']],
    ['خلع الأسنان', ['قلع الأسنان']],
  ],
  en: [
    [
      'Dental Prosthetics & Restorations',
      [
        'Dental crowns',
        'Dental bridges',
        'Zirconia crowns',
        'Partial removable dentures',
        'Complete removable dentures',
      ],
    ],
    [
      'Cosmetic Dentistry',
      ['Laser teeth whitening', 'E.max veneers', 'Cosmetic fillings'],
    ],
    [
      'Pediatric Dentistry',
      ['Children’s dental treatment', 'Children’s orthodontics'],
    ],
    [
      'Dental & Root Canal Treatment',
      ['Endodontic treatment (root canal treatment)'],
    ],
    ['Tooth Extraction', ['Tooth extraction']],
  ],
} as const;

for (const language of ['ar', 'en'] as const) {
  test(`five service cards, accessible details and booking in ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (lang) => localStorage.setItem('clinic-language', lang),
      language,
    );
    await page.goto('./');
    const section = page.locator('#services');
    const cards = section.locator('article');
    await expect(cards).toHaveCount(5);
    await expect(section.locator('.service-filters')).toHaveCount(0);
    const bookingIndices = [
      'restorations',
      'cosmetic',
      'pediatric',
      'root-canal',
      'extraction',
    ];
    for (let i = 0; i < 5; i++) {
      const card = cards.nth(i);
      await expect(card.getByRole('heading')).toHaveText(
        expected[language][i][0],
      );
      const image = card.locator('img');
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(
        await image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
      await expect(image).toHaveAttribute('alt', /.+/);
      const button = card.getByRole('button');
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(card.getByRole('link')).toHaveCount(0);
      const previousHash = new URL(page.url()).hash;
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(card.getByRole('region')).toBeVisible();
      await expect(card.locator('li')).toHaveText([
        ...expected[language][i][1],
      ]);
      expect(new URL(page.url()).hash).toBe(previousHash);
      await button.press('Space');
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(card.getByRole('region')).toHaveCount(0);
      await button.click();
      await card.getByRole('link').click();
      await expect(page.locator('[name=service]')).toHaveValue(
        bookingIndices[i],
      );
      expect(new URL(page.url()).hash).toBe('#appointments');
    }
    await section.screenshot({
      path: `test-results/services-expanded-${language}.png`,
    });
  });
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`service card layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    const cards = page.locator('#services article');
    const boxes = await cards.evaluateAll((elements) =>
      elements.map((el) => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
    expect(
      Math.max(...boxes.map((b) => b.width)) -
        Math.min(...boxes.map((b) => b.width)),
    ).toBeLessThan(1);
    // Natural card heights follow the copy; all images keep a consistent size.
    const imageHeights = await cards
      .locator('img')
      .evaluateAll((images) =>
        images.map((image) => image.getBoundingClientRect().height),
      );
    expect(Math.max(...imageHeights) - Math.min(...imageHeights)).toBeLessThan(
      1,
    );
    if (width === 1440) {
      expect(boxes[0].y).toBe(boxes[2].y);
      expect(boxes[3].y).toBe(boxes[4].y);
      expect(boxes[3].y).toBeGreaterThan(boxes[0].y);
      expect(
        Math.abs((boxes[3].x + boxes[3].width + boxes[4].x) / 2 - width / 2),
      ).toBeLessThan(1);
    } else if (width >= 768) {
      expect(boxes[0].y).toBe(boxes[1].y);
      expect(boxes[2].y).toBe(boxes[3].y);
    } else {
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
