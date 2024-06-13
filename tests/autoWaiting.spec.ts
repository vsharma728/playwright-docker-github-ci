import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher'
import {test, expect} from '@playwright/test'
import { skip } from 'rxjs/operators'

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) //add 2 seconds to default timeout 
})

test('Auto Waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    //const text = await successButton.textContent()    
    
    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('Alternative Waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element
    //await page.waitForSelector('.bg-success')

    //___ wait for paritcular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // ___wait for the network calls to be completed  (not recommended)
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('Timeouts', async({page}) => {
    //test.setTimeout(10000)

    //increase the test time by 3 times
    test.slow()

    const successButton = page.locator('.bg-success')
    await successButton.click()

})