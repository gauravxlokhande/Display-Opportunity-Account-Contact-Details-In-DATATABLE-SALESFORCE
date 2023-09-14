import { LightningElement, track, wire } from 'lwc';
import ShowOpportunityFields from '@salesforce/apex/OpportunityDataController.ShowOpportunityFields';
import searchOpportunities from '@salesforce/apex/OpportunitySearchController.searchOpportunities';
import maskString from '@salesforce/apex/OpportunitySearchController.maskString';

export default class OppSearchOne extends LightningElement {
    @track opportunities = [];
    @track error;

    // Define columns with field names matching the results from searchOpportunities
    columns = [
        { label: 'Opportunity Name', fieldName: 'Name' },
        { label: 'Opportunity Description', fieldName: 'Description' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        { label: 'Account Name', fieldName: 'AccountName' }, // Adjust field name to match search results
        { label: 'Recent Contact Name', fieldName: 'RecentContactName' }, // Adjust field name
        { label: 'Recent Contact Email', fieldName: 'RecentContactEmail' }, // Adjust field name
        { label: 'Recent Contact Number', fieldName: 'RecentContactNumber' } // Adjust field name
    ];

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
            .then((result) => {
                // Use a Set to store unique Opportunity Ids
                const uniqueOpportunityIds = new Set();
                const uniqueOpportunities = [];

                // Filter out duplicates based on Opportunity Id
                result.forEach((opp) => {
                    if (!uniqueOpportunityIds.has(opp.Id)) {
                        uniqueOpportunityIds.add(opp.Id);
                        uniqueOpportunities.push(opp);
                    }
                });

                this.opportunities = uniqueOpportunities;
                this.error = undefined;
            })
            .catch((error) => {
                this.error =
                    error.message || 'An error occurred while searching opportunities.';
                this.opportunities = [];
            });
    }
}
