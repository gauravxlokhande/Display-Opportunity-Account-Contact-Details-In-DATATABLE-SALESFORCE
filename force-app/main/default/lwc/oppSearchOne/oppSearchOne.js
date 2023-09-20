// oppSearchOne.js
import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields';

const columns = [
    { label: 'Opportunity Name', fieldName: 'Id', type: 'button', typeAttributes: { label: { fieldName: 'Name' }, name: 'viewOpportunity' } },
    { label: 'Opportunity Description', fieldName: 'Description' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Recent Contact Name', fieldName: 'Recent_Contact_Name__c' },
    { label: 'Recent Contact Email', fieldName: 'Recent_Contact_Email__c' },
    { label: 'Recent Contact Number', fieldName: 'Recent_Contact_No__c' }
];

export default class OppSearchOne extends NavigationMixin(LightningElement) {
    columns = columns;
    @track storetabledata;
    @track filteredData = [];
    error;
    @track searchTerm = '';

    @wire(ShowOpportunityFields)
    wiredResult(result) {
        if (result.data) {
            this.storetabledata = result.data.map(oppdata => ({
                ...oppdata,
                AccountName: oppdata.Account.Name
            }));
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
        if (!this.storetabledata || this.storetabledata.length === 0) {
            return;
        }

        this.filteredData = this.storetabledata.filter(item => {
            return (
                item.Name.toLowerCase().includes(this.searchTerm) ||
                item.AccountName.toLowerCase().includes(this.searchTerm) ||
                item.Recent_Contact_Name__c.toLowerCase().includes(this.searchTerm)
            );
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        if (actionName === 'viewOpportunity') {
            const row = event.detail.row;
            this.navigateToOpportunity(row.Id);
        }
    }

    navigateToOpportunity(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Opportunity',
                actionName: 'view',
            },
        });
    }
}
