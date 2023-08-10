
import rawTest, { FullConfig, Page, chromium, expect } from '@playwright/test'
import path from 'path'

export default async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const browser = await chromium.launch()
  const guestPage = await browser.newPage()
  if (baseURL) {
    await guestPage.goto(baseURL, {
      waitUntil: 'networkidle'
    })
  }
  // necessário para realizar os testes de autenticação

  await browser.close()
}

const test = rawTest.extend<{ nxPage: Page }>({
  nxPage: async ({ browser }, use) => {

    const username = process.env.AUTH_USERS?.split(',')[0].split(':')[0] ?? 'admin'
    const password = process.env.AUTH_USERS?.split(',')[0].split(':')[1] ?? '123'
    const context = await browser.newContext({
      httpCredentials: {
        username: username,
        password: password
      }
    })
    const page = await context.newPage()
    await page.goto('', {

    });
    await page.waitForLoadState('domcontentloaded')

    await use(page)
  }
})

export { expect, test, chromium }
