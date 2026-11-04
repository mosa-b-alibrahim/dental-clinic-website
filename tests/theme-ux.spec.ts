import { test, expect } from '@playwright/test';
import { loadPageImages } from './helpers/images';

test('theme follows system, respects explicit choice and persists after reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  const theme = page.getByRole('combobox', { name: 'مظهر الموقع' });
  await expect(theme).toHaveValue('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await theme.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(theme).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await theme.selectOption('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await theme.selectOption('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(theme).toHaveValue('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Website theme' }),
  ).toHaveValue('system');
});

test('theme resolves before React loads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('clinic-theme', 'dark'));
  await page.route('**/src/main.tsx', (route) => route.abort());
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(11, 20, 36)');
});

test('theme and language remain usable when localStorage is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage unavailable');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });
  await page.goto('./');
  await page
    .getByRole('combobox', { name: 'مظهر الموقع' })
    .selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Website theme' }),
  ).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const language of ['ar', 'en']) {
  test(`localized required-field validation and five booking groups in ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (lang) => localStorage.setItem('clinic-language', lang),
      language,
    );
    await page.goto('./');
    await page.locator('[type=submit]').click();
    await expect(page.locator('[name=name]')).toBeFocused();
    await expect(page.locator('.field-error')).toHaveCount(5);
    const error = page.locator('#error-name');
    await expect(error).toHaveText(
      language === 'ar'
        ? 'يرجى إدخال الاسم الكامل.'
        : 'Please enter your full name.',
    );
    await expect(page.locator('[name=service] option')).toHaveCount(6);
    await page.locator('[name=name]').fill('Test Patient');
    await page.locator('[name=phone]').fill('+306998845915');
    await page.locator('[name=service]').selectOption('pediatric');
    await page.locator('[name=date]').fill('2000-01-01');
    await page.locator('[name=time]').fill('08:00');
    await page.locator('[type=submit]').click();
    await expect(page.locator('#error-date')).toBeVisible();
    await expect(page.locator('#error-time')).toBeVisible();
    await expect(page.locator('[name=date]')).toBeFocused();
    await page.locator('[name=date]').fill('2099-01-01');
    await page.locator('[name=time]').fill('10:00');
    await page.locator('[name=phone]').fill('++306998845915');
    await page.locator('[type=submit]').click();
    await expect(page.locator('#error-phone')).toBeVisible();
    await expect(page.locator('[name=phone]')).toBeFocused();
    await expect(page.locator('[name=notes]')).not.toHaveAttribute('required');
    await expect(page.locator('#about')).toContainText(
      language === 'ar'
        ? 'خريج جامعة حلب'
        : 'Graduate of the University of Aleppo',
    );
    await expect(page.locator('img[src$="clinic-exterior.jpg"]')).toHaveCount(
      2,
    ); // Gallery thumbnail and its viewer only.
    await expect(page.locator('#contact img')).toHaveCount(0);
    await expect(
      page.locator('.floating-whatsapp,.mobile-actions'),
    ).toHaveCount(0);
  });
}

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    for (const language of ['ar', 'en'] as const) {
      test(`${language} ${theme} layout and visual QA at ${width}px`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(
          ({ theme, language }) => {
            localStorage.setItem('clinic-theme', theme);
            localStorage.setItem('clinic-language', language);
          },
          { theme, language },
        );
        await page.goto('./');
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('html')).toHaveAttribute(
          'dir',
          language === 'ar' ? 'rtl' : 'ltr',
        );
        const themeControl = page.getByRole('combobox', {
          name: language === 'ar' ? 'مظهر الموقع' : 'Website theme',
        });
        await expect(themeControl).toBeVisible();
        await themeControl.focus();
        expect(
          await themeControl.evaluate(
            (el) => getComputedStyle(el).outlineStyle,
          ),
        ).not.toBe('none');
        if (width <= 1200) {
          const menu = page.getByRole('button', {
            name: language === 'ar' ? 'القائمة' : 'Menu',
            exact: true,
          });
          await menu.click();
          await expect(page.locator('#navigation')).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(menu).toHaveAttribute('aria-expanded', 'false');
        }
        for (const id of [
          'home',
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
        const duplicateIds = await page.evaluate(() => {
          const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
          return ids.filter((id, i) => ids.indexOf(id) !== i);
        });
        expect(duplicateIds).toEqual([]);
        expect(
          await page
            .locator('img')
            .evaluateAll((images) =>
              images.every(
                (image) => getComputedStyle(image).filter === 'none',
              ),
            ),
        ).toBe(true);
        await expect(page.locator('#home .hero-photo')).toHaveAttribute(
          'src',
          '/dental-clinic-website/images/doctor-original.jpg',
        );
        const smile = await page.locator('.hero-smile').boundingBox();
        const doctor = await page.locator('.hero-doctor').boundingBox();
        expect(smile && doctor && smile.y + smile.height <= doctor.y).toBe(
          true,
        );
        await expect(page.locator('#contact #appointments form')).toHaveCount(
          1,
        );
        expect(
          await page.locator('a[href^="#"]').evaluateAll((links) =>
            links.every((link) => {
              const target = link.getAttribute('href')?.slice(1);
              return target && document.getElementById(target);
            }),
          ),
        ).toBe(true);
        if (width === 390 || width === 1440) {
          await page
            .locator('#services article')
            .first()
            .getByRole('button')
            .click();
          await page.evaluate(() => {
            if (document.activeElement instanceof HTMLElement)
              document.activeElement.blur();
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
          await page.screenshot({
            path: `test-results/ux-${language}-${theme}-${width}.png`,
            fullPage: true,
          });
          await page.locator('.header').screenshot({
            path: `test-results/ux-${language}-${theme}-${width}-header.png`,
          });
          const cleanCapture =
            '.header,.skip-link { visibility:hidden !important; }';
          for (const id of [
            'home',
            'about',
            'services',
            'gallery',
            'appointments',
            'contact',
          ]) {
            await page.locator(`#${id}`).screenshot({
              path: `test-results/ux-${language}-${theme}-${width}-${id}.png`,
              style: cleanCapture,
            });
          }
          await page.locator('footer').screenshot({
            path: `test-results/ux-${language}-${theme}-${width}-footer.png`,
            style: cleanCapture,
          });
          const photo = page.locator('.gallery-card').first();
          await photo.click();
          await expect(page.getByRole('dialog')).toBeVisible();
          await page.getByRole('dialog').screenshot({
            path: `test-results/ux-${language}-${theme}-${width}-viewer.png`,
          });
          await page.keyboard.press('Escape');
          await expect(photo).toBeFocused();
        }
        if (width === 768) {
          await page.locator('#home').screenshot({
            path: `test-results/ux-${language}-${theme}-768-home.png`,
            style: '.header { visibility:hidden !important; }',
          });
        }
        expect(errors).toEqual([]);
      });
    }
  }
}
