import { test, expect } from '@playwright/test';

test('navigation hover draws one indicator without a second text underline', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const link = page.locator('#navigation a[href="#about"]');
  await link.hover();
  await expect(link).toHaveCSS('text-decoration-line', 'none');
  expect(
    await link.evaluate((el) => getComputedStyle(el, '::after').content),
  ).toBe('none');
  expect(await link.evaluate((el) => getComputedStyle(el).boxShadow)).toContain(
    '84, 177, 225',
  );
  await link.focus();
  expect(
    await link.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none');
  await page
    .locator('.header')
    .screenshot({ path: 'test-results/navigation-hover.png' });
});

test('one contact navigation item leads to a compact combined contact and booking section', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await expect(page.locator('#navigation a')).toHaveCount(5);
  await expect(page.locator('#navigation a[href="#contact"]')).toHaveCount(1);
  await expect(page.locator('#navigation a[href="#appointments"]')).toHaveCount(
    0,
  );
  await expect(page.locator('#contact form')).toHaveCount(1);
  await expect(page.locator('#contact .contact-information')).toContainText(
    '+306998845915',
  );
  await expect(
    page.locator(
      '#contact a[href="https://maps.app.goo.gl/jQykHEgEb8TA3NnAA"]',
    ),
  ).toHaveCount(1);
  await page.locator('#navigation a[href="#contact"]').click();
  await expect(page.locator('#contact')).toBeInViewport();
  const contact = await page.locator('#contact').boundingBox();
  expect(contact!.height).toBeLessThan(950);
  await page.locator('.header-book').click();
  await expect(page.locator('#appointments')).toBeInViewport();
  await page.locator('#contact').screenshot({
    path: 'test-results/combined-contact-1440.png',
    style: '.header { visibility:hidden !important; }',
  });
});
