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
    columns = columns;
    @track storetabledata;
    @track filteredData = [];
    error;
    @track searchTerm = '';

    @wire(ShowOpportunityFields)
    wiredResult(result) {
        if (result) {
            this.storetabledata = result;
            this.filterData();
            this.error = undefined;
        } else if (result.error) {
            this.storetabledata = undefined;
            this.filteredData = [];
            this.error = result.error;
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterData();
    }

    filterData() {
        if (!this.storetabledata || !this.storetabledata.data) {
            return;
        }

        this.filteredData = this.storetabledata.data.filter(item => {
            return (
                item.Name.toLowerCase().includes(this.searchTerm) ||
                item.Account_Name__c.toLowerCase().includes(this.searchTerm) ||
                item.Recent_Contact_Name__c.toLowerCase().includes(this.searchTerm)
            );
        });
    }
}
