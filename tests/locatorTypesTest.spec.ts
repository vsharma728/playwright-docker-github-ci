import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher'
import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    //by Tag name
    page.locator('input').first().click()

    //by ID (#)
    await page.locator('#inputEmail1').click()

    //by Class value (.)
    page.locator('.shape-rectangle')

    //by Attribute ([])
    page.locator('[placeholder="Email"]')

    //by entire Class value (full)
    page.locator('[input-full-width size-medium status-basic shape-rectangle nb-transition]')

    //combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by Xpath (NOT RECOMMENDED, as per playwright guidelines from their site)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

// best practice: always work with User Facing Locators to test apps from end-users perspective
// attributes visible to end-users on the app instead of other backend dom values like ID, class etc.
test('User Facing Locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    //await page.getByTitle('IoT Dashboard').click()

    // we added (data-testid="SignIn") in the html code before using it
    await page.getByTestId('SignIn').click()
})

test('Locating Child Elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    //not preferred because it is not user faced and index may change unknowingly
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating Parent Elements', async({page}) => {
    //first target the parent and then filter by Text to pinpoint
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    
    //first target the parent and then filter by locator to pinpoint
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    //benefit of using filter is one can chain it to pinpoint target element
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
    .getByRole('textbox', {name: "Email"}).click()

    //not recommended
    //await page.locator(':text-is("Using the Grid)').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await basicForm.getByRole('textbox', {name: "Email"}).fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting Values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')
    
    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertion Types', async({page}) => {
    
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // general assertion
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    // soft assertion - not preferred!
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})