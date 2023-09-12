import { LightningElement, track, wire } from 'lwc';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields';
 


const columns = [
    { label: 'Opportunity Name', fieldName: 'Name' },
    { label: 'Opportunity Description', fieldName: 'Description' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Account Name', fieldName: 'Account_Name__c' },
    { label: 'Recent Contact Name', fieldName: 'Recent_Contact_Name__c' },
    { label: 'Recent Contact Email', fieldName: 'Recent_Contact_Email__c' },
    { label: 'Recent Contact Number', fieldName: 'Recent_Contact_No__c' }
];

export default class OppSearchOne extends LightningElement {
    @track opportunityName = '';
    error;
     columns = columns;

    @track storedata;
    
    @wire(ShowOpportunityFields)
    wiredResult(result) {
        if (result) {
            this.storedata = result;
        } else if (result.error) {
            this.storedata = undefined;
        }
    }


   

    // handleOpportunityNameChange(event) {
    //     this.opportunityName = event.target.value;
    // }

    // handleSearch() {
    //     // The search results are automatically updated by the wire service.
    // }
}
