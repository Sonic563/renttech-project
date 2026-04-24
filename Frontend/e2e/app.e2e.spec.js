const { test, expect } = require('@playwright/test');

const sampleAssets = [
  {
    id: 1,
    name: 'Dell Latitude 5420',
    description: 'Erős üzleti laptop projektmunkákhoz.',
    longDescription: 'Erős üzleti laptop projektmunkákhoz.',
    dailyPrice: 4500,
    availability: 'ELÉRHETŐ',
    category: { name: 'Laptopok' },
    imageUrl: 'https://example.com/laptop.jpg',
  },
  {
    id: 2,
    name: 'Canon E2E MATCH 250D',
    description: 'Kompakt kamera tartalomgyártáshoz.',
    longDescription: 'Kompakt kamera tartalomgyártáshoz.',
    dailyPrice: 6500,
    availability: 'ELÉRHETŐ',
    category: { name: 'Fényképezőgépek' },
    imageUrl: 'https://example.com/camera.jpg',
  },
  {
    id: 3,
    name: 'Canon E2E MATCH XA60',
    description: 'Profibb kamera videós munkákhoz.',
    longDescription: 'Profibb kamera videós munkákhoz.',
    dailyPrice: 9000,
    availability: 'ELÉRHETŐ',
    category: { name: 'Kamerák' },
    imageUrl: 'https://example.com/camera2.jpg',
  },
  {
    id: 4,
    name: 'Epson EB-X06',
    description: 'Tárgyalóba és előadásokhoz ideális projektor.',
    longDescription: 'Tárgyalóba és előadásokhoz ideális projektor.',
    dailyPrice: 8000,
    availability: 'NEM_ELÉRHETŐ',
    category: { name: 'Projektorok' },
    imageUrl: 'https://example.com/projector.jpg',
  },
  {
    id: 5,
    name: 'Lenovo ThinkPad T14',
    description: 'Megbízható üzleti laptop.',
    longDescription: 'Megbízható üzleti laptop.',
    dailyPrice: 5000,
    availability: 'ELÉRHETŐ',
    category: { name: 'Laptopok' },
    imageUrl: 'https://example.com/thinkpad.jpg',
  },
];

async function mockPublicApi(page) {
  await page.route('**/api/assets/featured', async (route) => {
    await route.fulfill({
      json: sampleAssets.filter((asset) => asset.availability === 'ELÉRHETŐ'),
    });
  });

  await page.route('**/api/assets', async (route) => {
    await route.fulfill({ json: sampleAssets });
  });

  await page.route('**/api/assets/*', async (route) => {
    const id = Number(route.request().url().split('/').pop());
    const asset = sampleAssets.find((item) => item.id === id);

    if (!asset) {
      await route.fulfill({ status: 404, json: { message: 'Not found' } });
      return;
    }

    await route.fulfill({ json: asset });
  });

  await page.route('**/api/bookings/device/*', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.route('**/api/bookings/availability/**', async (route) => {
    await route.fulfill({ json: { available: true } });
  });
}

async function seedAuth(page, user) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value.token);
    window.localStorage.setItem('currentUser', JSON.stringify(value.user));
  }, {
    token: 'fake-jwt-token',
    user,
  });
}

test.beforeEach(async ({ page }) => {
  await mockPublicApi(page);
});

test('homepage shows featured available devices from API', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /RenTech – Elektronikai kölcsönzés/i }),
  ).toBeVisible();

  await expect(page.getByText('Dell Latitude 5420')).toBeVisible();
  await expect(page.getByText('Canon E2E MATCH 250D')).toBeVisible();
  await expect(page.getByText('Canon E2E MATCH XA60')).toBeVisible();
  await expect(page.getByText('Epson EB-X06')).toHaveCount(0);
});

test('search from navbar navigates to device list and filters results', async ({ page }) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Keresés' });
  await searchBox.fill('E2E MATCH');

  await page.getByRole('button', { name: 'Keresés', exact: true }).click();

  await expect(page).toHaveURL(/\/devices\?search=E2E(\+|%20)MATCH/);
  await expect(page.getByText('Canon E2E MATCH 250D')).toBeVisible();
  await expect(page.getByText('Canon E2E MATCH XA60')).toBeVisible();
  await expect(page.getByText('Dell Latitude 5420')).toHaveCount(0);
  await expect(page.getByText('Lenovo ThinkPad T14')).toHaveCount(0);
});

test('protected user page redirects unauthenticated users to login and stores original path', async ({ page }) => {
  await page.goto('/profile');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Bejelentkezés' })).toBeVisible();

  const redirectPath = await page.evaluate(() =>
    window.sessionStorage.getItem('redirectAfterLogin'),
  );

  await expect(redirectPath).toBe('/profile');
});

test('login persists authenticated navbar state', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    const body = route.request().postDataJSON();

    expect(body).toEqual({
      email: 'teszt@rentech.hu',
      password: 'titok123',
    });

    await route.fulfill({
      json: {
        token: 'jwt-token',
        user: {
          id: 99,
          name: 'Teszt Elek',
          role: 'USER',
          email: 'teszt@rentech.hu',
        },
      },
    });
  });

  await page.goto('/login');
  await page.getByLabel('Email cím').fill('teszt@rentech.hu');
  await page.getByLabel('Jelszó').fill('titok123');
  await page.getByRole('button', { name: 'Bejelentkezés' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Üdv, Teszt Elek')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kijelentkezés' })).toBeVisible();

  const storedToken = await page.evaluate(() => window.localStorage.getItem('token'));
  await expect(storedToken).toBe('jwt-token');
});

test('admin route is blocked for normal user', async ({ page }) => {
  await seedAuth(page, {
    id: 100,
    name: 'Normál Felhasználó',
    role: 'USER',
    email: 'user@rentech.hu',
  });

  await page.goto('/admin');

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole('heading', { name: /RenTech – Elektronikai kölcsönzés/i }),
  ).toBeVisible();
  await expect(page.getByText('Admin Felület')).toHaveCount(0);
});

test('admin can open admin dashboard', async ({ page }) => {
  await seedAuth(page, {
    id: 1,
    name: 'Admin Anna',
    role: 'ADMIN',
    email: 'admin@rentech.hu',
  });

  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      json: [{ id: 1, fullName: 'Admin Anna', email: 'admin@rentech.hu' }],
    });
  });

  await page.route('**/api/bookings', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Admin Felület' })).toBeVisible();
  await expect(page.getByText('Üdv, Admin Anna!')).toBeVisible();
  await expect(page.getByRole('button', { name: /Eszközök/i })).toBeVisible();
});