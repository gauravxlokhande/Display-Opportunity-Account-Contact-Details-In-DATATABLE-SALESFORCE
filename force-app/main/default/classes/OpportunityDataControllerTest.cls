@isTest
public class OpportunityDataControllerTest {

    @isTest
    static void testShowOpportunityFields() {
        Account acc = new Account();
        acc.Name='Gaurav Lokhande';
        acc.Phone ='9511767637';
        insert acc;
        
       
        Opportunity opp = new Opportunity();
        opp.Account_Name__c =acc.Name;
        opp.AccountId =acc.Id;
        opp.CloseDate =System.today();
        insert opp;
        
        Contact Con =new Contact();
        Con.AccountId =acc.Id;
        Con.Phone = acc.Phone;
        con.Email ='gaurav@gmail.com';
        con.FirstName ='Gaurav';
        con.LastName ='Lokhande';
        
       // Opportunity opp = new Opportunity();
        opp.Recent_Contact_Email__c =con.Email;
        opp.Recent_Contact_Name__c=con.FirstName+' '+con.LastName;
        opp.Recent_Contact_No__c =con.Phone;
        update opp;
        
        Test.startTest();
        List<Opportunity> opportunities = OpportunityDataController.ShowOpportunityFields();
        Test.stopTest();

        // Verify the results
        System.assertEquals(1, opportunities.size(), 'Only one Opportunity should be returned');
        Opportunity resultOpportunity = opportunities[0];
        System.assertEquals('gaurav@gmail.com', resultOpportunity.Recent_Contact_Email__c);
        System.assertEquals('Gaurav Lokhande', resultOpportunity.Recent_Contact_Name__c);
        System.assertEquals('9511767637', resultOpportunity.Recent_Contact_Name__c);
        System.assertEquals('Test Description', resultOpportunity.Description);
        System.assertEquals(Date.today(), resultOpportunity.CloseDate);
        System.assertEquals('Gaurav Lokhande', resultOpportunity.Account.Name);
        
    }
}