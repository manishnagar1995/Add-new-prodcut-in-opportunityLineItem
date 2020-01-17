public with sharing class Add_OpportunityLientItem {
    public Add_OpportunityLientItem() {

    }
     @AuraEnabled(cacheable=true)
    public static String insertOLI(String recordId,String prodName) {
      //  String key = '%' + searchKey + '%';
      //Select id,Product2.Name,Pricebook2Id,Pricebook2.Name   from PricebookEntry where Pricebook2.Name ='Acxiom Book'
       // return [SELECT Id, Name, Title, Phone, Email, Picture__c FROM Contact WHERE Name LIKE :key AND Picture__c != null LIMIT 10];
    }

}
