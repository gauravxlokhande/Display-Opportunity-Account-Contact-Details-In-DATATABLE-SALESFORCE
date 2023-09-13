public with sharing class OpportunitySearchController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> searchOpportunities(String searchKey) {
        searchKey = '%' + searchKey + '%';
        
        // Query for Opportunities where StageName or Account.Name matches the searchKey
        List<Opportunity> opportunityResults = [SELECT Id, Name, StageName, Account.Name 
                                                FROM Opportunity 
                                                WHERE StageName LIKE :searchKey 
                                                    OR Account.Name LIKE :searchKey 
                                                LIMIT 10];

        // Query for Contacts where Name matches the searchKey
        List<Contact> contactResults = [SELECT Id, AccountId 
                                        FROM Contact 
                                        WHERE Name LIKE :searchKey 
                                        LIMIT 10];
        
        // Create a Set to store unique AccountIds from the contactResults
        Set<Id> accountIds = new Set<Id>();
        for (Contact contact : contactResults) {
            accountIds.add(contact.AccountId);
        }
        
        // Query for Opportunities associated with the unique AccountIds from the contactResults
        List<Opportunity> accountOpportunities = [SELECT Id, Name, StageName, Account.Name 
                                                  FROM Opportunity 
                                                  WHERE AccountId IN :accountIds];
        
        // Combine and return the results
        opportunityResults.addAll(accountOpportunities);
        return opportunityResults;
    }
    
     @AuraEnabled(cacheable=true)
     public static String maskString(String input) {
        if (String.isNotBlank(input) && input.length() > 3) {
            return input.substring(0, 3) + '***';
        }
        return input;
    }
}
