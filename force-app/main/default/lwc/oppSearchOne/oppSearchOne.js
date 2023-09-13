import { LightningElement, wire } from 'lwc';
import searchOpportunities from '@salesforce/apex/OpportunitySearchController.searchOpportunities';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields'; 

const columns = [
    { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
    { label: 'Opportunity Description', fieldName: 'Description', type: 'text' },
    { label: 'Opportunity Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Associated Account Name', fieldName: 'AccountId', type: 'text' },
    { label: 'Most Recent Contact Name', fieldName: 'Recent_Contact_Name__c', type: 'text' },
    { label: 'Most Recent Contact Email', fieldName: 'Recent_Contact_Email__c', type: 'email' },
    { label: 'Most Recent Contact Number', fieldName: 'Recent_Contact_No__c', type: 'phone' }
];

export default class OpportunitySearch extends LightningElement {


    columns = columns;
    data = [];
    error;


     @wire(ShowOpportunityFields)
    wiredResult(result) {
        if (result) {
            this.data = result; // Assigning data retrieved from the Apex method to 'storetabledata'.
        } else if (result.error) {
            this.data = undefined; // Handling any errors by setting 'storetabledata' to undefined.
        }
    }




    handleSearchTermChange(event) {
        const searchTerm = event.target.value;
        this.searchOpportunities(searchTerm);
    }

    searchOpportunities(searchTerm) {
        searchOpportunities({ searchKey: searchTerm })
            .then(result => {
                // Mask sensitive information
                this.data = result.map(item => ({
                    ...item,
                    Recent_Contact_Email__c: this.maskEmail(item.Recent_Contact_Email__c),
                    Recent_Contact_No__c: this.maskPhoneNumber(item.Recent_Contact_No__c)
                }));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.message || 'An error occurred while searching opportunities.';
                this.data = [];
            });
    }

    maskEmail(email) {
        // Mask email with the first three characters visible
        if (email) {
            const atIndex = email.indexOf('@');
            if (atIndex >= 3) {
                const maskedPart = email.substring(0, atIndex - 3) + '***';
                return maskedPart + email.substring(atIndex);
            }
        }
        return email;
    }

    maskPhoneNumber(phoneNumber) {
        // Mask phone number with the first three digits visible
        if (phoneNumber && phoneNumber.length >= 3) {
            return '***' + phoneNumber.substring(3);
        }
        return phoneNumber;
    }
}
