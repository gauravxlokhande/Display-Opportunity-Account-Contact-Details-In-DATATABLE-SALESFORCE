import { LightningElement, track, wire } from 'lwc';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields';
import searchOpportunities from '@salesforce/apex/OpportunitySearchController.searchOpportunities';
import maskString from '@salesforce/apex/OpportunitySearchController.maskString';


//data table columns Label and field assignment from apex class method:ShowOpportunityFields.
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

    @track storetabledata; //all Table data controller.

    error; 
    @wire(ShowOpportunityFields) //get data from apex class method: ShowOpportunityFields.
    wiredResult(result) {
        if (result) {
            this.storetabledata = result;   //store data in: storedata Variable.
        } else if (result.error) {
            this.storetabledata = undefined;  //if error then undefined
        }
    }



    @track searchTerm = '';
    @track opportunities = [];
    @track error;

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.searchOpportunities();
    }

    searchOpportunities() {
        if (this.searchTerm.length < 3) {
            this.opportunities = [];
            return;
        }

        searchOpportunities({ searchKey: this.searchTerm })
            .then(result => {
                // Mask sensitive information
                this.opportunities = result.map(opp => ({
                    ...opp,
                    Account: {
                        ...opp.Account,
                        Name: maskString(opp.Account.Name)
                    }
                }));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.message || 'An error occurred while searching opportunities.';
                this.opportunities = [];
            });
    }


 }


   
