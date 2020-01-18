public with sharing class Add_OpportunityLientItem {
    
    @AuraEnabled
    public static PricebookEntry insertOLI(String prodNames ,string oppids) {
      System.debug('test=============='+prodNames);
      System.debug('oppids=============='+oppids);
      
      String prod =prodNames;
      List<PricebookEntry> pbidlist = [Select id,Product2Id,Pricebook2Id from PricebookEntry where Pricebook2id ='01s0o000009DDhIAAW' and Product2.Name =:prod limit 1];
      System.debug('test=============='+pbidlist[0].Pricebook2Id);
     opportunity opp =new opportunity();
      opp.id = oppids;
      opp.Pricebook2Id = pbidlist[0].Pricebook2Id;
      update opp;
      System.debug('opp=============='+opp);
        if( pbidlist.size() > 0 ) {
                System.debug('test=============='+pbidlist);
                return pbidlist.get( 0 );
               //return pbidlist;  
        } 
        else {
            return null;
        } 
    }
}
