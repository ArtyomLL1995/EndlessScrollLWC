import { LightningElement, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
import getContacts from '@salesforce/apex/endlessScrollHandler.getNextContacts'

export default class EndlessScroll extends NavigationMixin(LightningElement) {
    // array to hold the ids of the currently displayed contacts on the page so not to retrieve the same contacts again
    currentDisplayedContactsIds = []
    // contacts displayed on the page
    contacts = []

    scrollSwitcher = true

    @wire(getContacts) wiredContacts ({error, data}) {
        if (data) {
            data.forEach(contact => {
                this.currentDisplayedContactsIds.push(contact.Id)
            });
            this.contacts = data
        }
    }

    connectedCallback() {
        window.addEventListener('scroll', this.handleScroll.bind(this))
    }

    handleScroll() {
        const page = document.documentElement
        // if 'true' means we have scrolled to the bottom of the page
        if (Math.ceil(page.scrollHeight - page.scrollTop) === page.clientHeight && this.scrollSwitcher) {
            window.removeEventListener('scroll')
            this.scrollSwitcher = false
            // fake delay, maybe should remove it
            setTimeout(() => {
                this.showNextContacts()
            }, 500)
        } 
    }

    showNextContacts() {
        getContacts({selectedContactIds: this.currentDisplayedContactsIds})
        .then(result => {
            result.forEach(contact => {
                this.currentDisplayedContactsIds.push(contact.Id)
            })
            this.contacts = [...this.contacts, ...result]
            this.scrollSwitcher = true
            window.addEventListener('scroll', this.handleScroll.bind(this))
        })
    }

    navigateToContact(event) {
        const index = event.currentTarget.dataset.index
        const contactId = this.contacts[index].Id
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'Contact',
                recordId: contactId,
                actionName: 'view'
            },
        });
    }
}