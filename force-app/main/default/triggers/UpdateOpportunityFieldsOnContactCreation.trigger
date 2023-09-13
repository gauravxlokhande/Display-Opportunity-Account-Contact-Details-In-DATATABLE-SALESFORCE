trigger UpdateOpportunityFieldsOnContactCreation on Contact (after insert , after update) {
    List<Opportunity> opportunitiesToUpdate = new List<Opportunity>();

    Map<Id, Contact> accountToContactMap = new Map<Id, Contact>();

    // Collect Account Ids associated with the new Contacts
    Set<Id> accountIds = new Set<Id>();
    for (Contact newContact : Trigger.new) {
        if (newContact.AccountId != null) {
            accountIds.add(newContact.AccountId);
            accountToContactMap.put(newContact.AccountId, newContact);
        }
    }

    // Query Opportunities related to the affected Accounts
    for (Opportunity opp : [SELECT Id, AccountId, Account.Name,Recent_Contact_Name__c, Recent_Contact_No__c, Recent_Contact_Email__c
                            FROM Opportunity
                            WHERE AccountId IN :accountIds]) {
        if (accountToContactMap.containsKey(opp.AccountId)) {
            Contact recentContact = accountToContactMap.get(opp.AccountId);
            opp.Account_Name__c = opp.Account.Name;
            opp.Recent_Contact_Name__c = recentContact.FirstName +' '+recentContact.LastName;
            opp.Recent_Contact_No__c = recentContact.Phone;
            opp.Recent_Contact_Email__c = recentContact.Email;
            opportunitiesToUpdate.add(opp);
        }
    }

    // Update the Opportunities with the new information
    if (!opportunitiesToUpdate.isEmpty()) {
        update opportunitiesToUpdate;
    }
}

