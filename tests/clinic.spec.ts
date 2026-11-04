import { test, expect } from '@playwright/test';
import { loadPageImages } from './helpers/images';

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`bilingual layout and images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('h1')).toHaveText('ابتسامتك تبدأ من هنا');
    await expect(page.locator('.service-card')).toHaveCount(5);
    for (const id of [
      'about',
      'services',
      'gallery',
      'appointments',
      'contact',
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    }
    await loadPageImages(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('video')).toHaveCount(0);
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('h1')).toHaveText('Your Smile Starts Here');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width <= 1200) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page
        .locator('#navigation')
        .getByRole('link', { name: 'Services', exact: true })
        .click();
      await expect(
        page.getByRole('button', { name: 'Menu', exact: true }),
      ).toHaveAttribute('aria-expanded', 'false');
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: `test-results/english-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    if (width === 390 || width === 1440) {
      await page.locator('#services').scrollIntoViewIfNeeded();
      await page.locator('#services').screenshot({
        path: `test-results/services-en-${width}.png`,
        style: '.header,.skip-link { visibility: hidden !important; }',
      });
    }
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: `test-results/arabic-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `test-results/arabic-hero-${width}.png` });
    if (width === 390 || width === 1440) {
      await page.locator('#services').scrollIntoViewIfNeeded();
      await page.locator('#services').screenshot({
        path: `test-results/services-ar-${width}.png`,
        style: '.header,.skip-link { visibility: hidden !important; }',
      });
    }
  });
}

test('gallery and contact destinations', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page
    .getByRole('button', { name: 'View image: Clinic exterior', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute(
    'alt',
    'Treatment room',
  );
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute(
    'alt',
    'Clinic exterior',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open Google Maps', exact: true }).first(),
  ).toHaveAttribute('href', 'https://maps.app.goo.gl/jQykHEgEb8TA3NnAA');
  await expect(
    page.getByRole('link', { name: '+306998845915', exact: true }).first(),
  ).toHaveAttribute('href', 'tel:+306998845915');
});

for (const language of ['ar', 'en']) {
  test(`WhatsApp validation and message in ${language}`, async ({ page }) => {
    await page.addInitScript(
      (lang) => localStorage.setItem('clinic-language', lang),
      language,
    );
    await page.goto('./');
    await page.evaluate(() => {
      (window as unknown as { capturedUrl: string }).capturedUrl = '';
      window.open = (url) => {
        (window as unknown as { capturedUrl: string }).capturedUrl =
          String(url);
        return null;
      };
    });
    await page.locator('[name=name]').fill('Test Patient');
    await page.locator('[name=phone]').fill('123');
    await page.locator('[name=service]').selectOption('restorations');
    await page.locator('[name=date]').fill('2099-01-01');
    await page.locator('[name=time]').fill('10:00');
    await page.locator('[type=submit]').click();
    expect(
      await page.evaluate(
        () => (window as unknown as { capturedUrl: string }).capturedUrl,
      ),
    ).toBe('');
    await page.locator('[name=phone]').fill('+306998845915');
    await page.locator('[name=notes]').fill('Test & check');
    await page.locator('[type=submit]').click();
    const url = await page.evaluate(
      () => (window as unknown as { capturedUrl: string }).capturedUrl,
    );
    expect(url).toContain('https://wa.me/306998845915?text=');
    const message = new URL(url).searchParams.get('text');
    expect(message).toContain('Test Patient');
    expect(message).toContain('Test & check');
    expect(message).toContain(
      language === 'ar'
        ? 'تركيبات وتعويضات الأسنان'
        : 'Dental Prosthetics & Restorations',
    );
    expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(
      ['clinic-language', 'clinic-theme'],
    );
  });
}

test('service booking preselection and gallery focus restoration', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  const card = page.locator('.service-card').first();
  await card.getByRole('button', { name: 'Learn More' }).click();
  await card
    .getByRole('link', { name: 'Book This Service', exact: true })
    .click();
  await expect(page.locator('[name=service]')).toHaveValue('restorations');
  await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  await expect(page.locator('[name=service]')).toHaveValue('restorations');
  await expect(page.locator('[name=service] option:checked')).toHaveText(
    'تركيبات وتعويضات الأسنان',
  );
  await page.getByRole('button', { name: 'Switch to English' }).click();
  const photo = page.getByRole('button', {
    name: 'View image: Treatment room',
    exact: true,
  });
  await photo.click();
  await page.keyboard.press('Escape');
  await expect(photo).toBeFocused();
  await expect(page.locator('.service-card')).toHaveCount(5);
  await expect(page.locator('img[src$="doctor-original.jpg"]')).toHaveCount(1);
});
