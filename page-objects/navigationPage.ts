import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NavigationPage extends HelperBase {

    // constructor waits for the page ficture passed from the test inside of the Navigation page
    // in order to use the same page instance during the test run. We assign this instance of the page
    // ficture into the local field of Navigation Page. We use this page instance inside of method 
    constructor(page: Page){
        super(page)
    }

    async formLayoutPage() {              
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        await this.waitForNumberOfSeconds(2)
    }
    
    async datePickerPage() {              
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click()
    }   

    async smartTablePage() {              
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }    

    async toastrPage() {              
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage() {       
        await this.selectGroupMenuItem('Modal & Overlays')    
        await this.page.getByText('Tooltip').click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == 'false') await groupMenuItem.click()
    }
}