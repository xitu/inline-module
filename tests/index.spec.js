const timeout = 5000;
const fs = require('fs');
const path = require('path');

async function getDocCase(file) {
  const filePath = fs.realpathSync(path.join(__dirname, file));
  await page.goto(`file://${filePath}`, {waitUntil: 'domcontentloaded'});
}

describe('inline-module', () => {
  test(
    'importing inline module correctly',
    async () => {
      await getDocCase('./pages/simple.html');
      const value = await page.evaluate(() => window.fooValue);
      expect(value).toBe('bar');
    },
    timeout,
  );

  test('more tests...', () => {
    expect(1).toBe(1);
  });
});
