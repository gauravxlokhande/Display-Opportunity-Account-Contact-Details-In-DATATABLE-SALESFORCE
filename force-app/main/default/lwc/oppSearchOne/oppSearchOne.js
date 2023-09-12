import { LightningElement, wire, track } from 'lwc';
import searchOpportunities from '@salesforce/apex/OpportunityController.searchOpportunities';

export default class OppSearchOne extends LightningElement {
    @track searchTerm = '';
    @track filteredOpportunities = [];

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    @wire(searchOpportunities, { searchTerm: '$searchTerm' })
    wiredOpportunities({ error, data }) {
        if (data) {
            this.filteredOpportunities = data;
        } else if (error) {
            // Handle error
        }
    }
}
