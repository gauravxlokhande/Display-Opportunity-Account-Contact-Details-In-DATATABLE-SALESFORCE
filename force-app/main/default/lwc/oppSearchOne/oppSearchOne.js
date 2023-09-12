import { LightningElement, track, wire } from 'lwc';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields';
 

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

      @track opportunityName = '';
    
    columns = columns;

    @track storetabledata; //all Table data controller.

    error; 
    @wire(ShowOpportunityFields) //get data from apex class method: ShowOpportunityFields.
    wiredResult(result) {
        if (result) {
            this.storetabledata = result;   //store data in: storedata Variable.
        } else if (result.error) {
            this.storetabledata = undefined;
        }
    }
    





 }


   

    // handleOpportunityNameChange(event) {
    //     this.opportunityName = event.target.value;
    // }

    // handleSearch() {
    //     // The search results are automatically updated by the wire service.
    // }

