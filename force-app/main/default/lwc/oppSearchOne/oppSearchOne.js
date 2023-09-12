import { LightningElement, track, wire } from 'lwc';
//import searchOpportunitiesAndContacts from '@salesforce/apex/OpportunityContactSearchController.searchOpportunitiesAndContacts';
 


const columns = [
    { label: 'Opportunity Name', fieldName: 'OpportunityName' },
    { label: 'Opportunity Description', fieldName: 'OpportunityDescription' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Recent Contact Name', fieldName: 'RecentContactName' },
    { label: 'Recent Contact Email', fieldName: 'RecentContactEmail' },
    { label: 'Recent Contact Number', fieldName: 'RecentContactNumber' }
];

export default class OppSearchOne extends LightningElement {
    @track opportunityName = '';
    //@wire(searchOpportunitiesAndContacts, { opportunityName: '$opportunityName' }) searchResults;
    columns = columns;

    handleOpportunityNameChange(event) {
        this.opportunityName = event.target.value;
    }

    handleSearch() {
        // The search results are automatically updated by the wire service.
    }
}
