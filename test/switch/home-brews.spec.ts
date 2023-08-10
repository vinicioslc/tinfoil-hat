import { test, expect } from '../switch.setup';
test.describe('Roms and homebrews listing', () => {

  test('Listing roms and folders correctly', async ({ nxPage }) => {
    const response = await nxPage.request.get(`/shop.json`);
    expect(response.ok()).toBeTruthy();
    const shopJsonResponse = await response.json();
    expect(shopJsonResponse).toMatchObject(
      {
        "files": [
          {
            "url": "../Double%20Dragon%20Gaiden%20Rise%20of%20the%20Dragons%20%5BNSZ%5D%2FDouble%20Dragon%20Gaiden%20Rise%20of%20the%20Dragons%20%5B010010401BC1A000%5D%5Bv0%5D%20%280.39%20GB%29.nsz",
            "size": 5
          },
          {
            "url": "../Double%20Dragon%20Gaiden%20Rise%20of%20the%20Dragons%20%5BNSZ%5D%2FDouble%20Dragon%20Gaiden%20Rise%20of%20the%20Dragons%20%5B010010401BC1A800%5D%5Bv65536%5D%20%280.11%20GB%29.nsz",
            "size": 5
          }
        ],
        "directories": [
          "../Double%20Dragon%20Gaiden%20Rise%20of%20the%20Dragons%20%5BNSZ%5D"
        ],
        "success": "The Server Works!!"
      })

    // Expect a title "to contain" a substring.
  });

})