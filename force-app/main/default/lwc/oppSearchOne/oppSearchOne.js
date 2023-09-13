import { LightningElement, track, wire } from 'lwc'; // Importing necessary Lightning Web Component modules.

import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields'; // Importing an Apex method to retrieve Opportunity data.
import searchOpportunities from '@salesforce/apex/OpportunitySearchController.searchOpportunities'; // Importing an Apex method for custom Opportunity search.
import maskString from '@salesforce/apex/OpportunitySearchController.maskString'; // Importing an Apex method to mask sensitive strings.

// Define data table columns
const columns = [
    { label: 'Opportunity Name', fieldName: 'Name' }, 
    { label: 'Opportunity Description', fieldName: 'Description' }, // Column for Opportunity Description
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }, // Column for Close Date (with date type)
    { label: 'Account Name', fieldName: 'Account_Name__c' }, // Column for Account Name
    { label: 'Recent Contact Name', fieldName: 'Recent_Contact_Name__c' }, // Column for Recent Contact Name
    { label: 'Recent Contact Email', fieldName: 'Recent_Contact_Email__c' }, // Column for Recent Contact Email
    { label: 'Recent Contact Number', fieldName: 'Recent_Contact_No__c' } // Column for Recent Contact Number
];

export default class OppSearchOne extends LightningElement {
    // Columns assignment
    columns = columns; // Assigning the columns defined above to the 'columns' property of this component.

    @track storetabledata; // Variable to store table data.

    error;

    @wire(ShowOpportunityFields)
    wiredResult(result) {
        if (result) {
            this.storetabledata = result; // Assigning data retrieved from the Apex method to 'storetabledata'.
        } else if (result.error) {
            this.storetabledata = undefined; // Handling any errors by setting 'storetabledata' to undefined.
        }
    }

    @track searchTerm = ''; // Variable to hold the search term entered by the user.
    @track opportunities = []; // Array to store the list of opportunities.

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value; // Updating 'searchTerm' with the value entered by the user.
        this.searchOpportunities(); // Initiating the search for opportunities.
    }

    searchOpportunities() {
        if (this.searchTerm.length < 3) { // Checking if the search term is less than 3 characters.
            this.opportunities = []; // If so, clearing the list of opportunities.
            return;
        }


    searchOpportunities({ searchKey: this.searchTerm })
    .then(result => {
        // Use a Set to store unique Opportunity Ids
        const uniqueOpportunityIds = new Set();

        // Filter the results to include only unique opportunities
        const uniqueOpportunities = result.filter(opp => {
            if (!uniqueOpportunityIds.has(opp.Id)) {
                uniqueOpportunityIds.add(opp.Id);
                return true;
            }
            return false;
        });

        // Create an array to store promises for masking Account Names
        const accountNamePromises = uniqueOpportunities.map(opp => {
            return maskString(opp.Account.Name)
                .then(maskedName => {
                    opp.Account.Name = maskedName; // Assign the masked name
                    return opp; // Return the modified opportunity
                })
                .catch(error => {
                    // Handle errors if necessary
                    console.error(error);
                    return opp;
                });
        });

        // Wait for all promises to resolve
        return Promise.all(accountNamePromises);
    })
    .then(uniqueOpportunities => {
        // Update opportunities with masked Account Names
        this.opportunities = uniqueOpportunities;
        this.error = undefined;
    })
    .catch(error => {
        this.error = error.message || 'An error occurred while searching opportunities.';
        this.opportunities = [];
    });

  //Gaurav
       
    }
}
