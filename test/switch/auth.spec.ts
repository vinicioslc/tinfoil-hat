import { test, expect } from '../switch.setup';

test.describe('Authorization and authentication', () => {

  test('Block access with message', async ({ page }) => {
    const homePageResponse = await page.request.get(`/`);
    expect(homePageResponse.ok()).toBeFalsy();
    expect(homePageResponse.status()).toBe(401);
    const homePageData = await homePageResponse.text()
    expect(homePageData).toBe('No tricks and treats for you!!');


    const shopResponse = await page.request.get(`/shop.json`);
    expect(shopResponse.ok()).toBeFalsy();
    expect(shopResponse.status()).toBe(401);
    const shopPageData = await shopResponse.text()
    expect(shopPageData).toBe('No tricks and treats for you!!');
  });

  test('Allow access for authenticated switch', async ({ nxPage }) => {
    const homePageResponse = await nxPage.request.get(`/`);
    expect(homePageResponse.ok()).toBeTruthy();

    const shopResponse = await nxPage.request.get(`/shop.json`);
    expect(shopResponse.ok()).toBeTruthy();
    const shopPageData = await shopResponse.json()
    expect(shopPageData.success).toBe('The Server Works!!');
  });

})