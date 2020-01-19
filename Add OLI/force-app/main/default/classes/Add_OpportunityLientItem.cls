public with sharing class Add_OpportunityLientItem {
    
    @AuraEnabled
    public static PricebookEntry insertOLI(String prodNames ,string oppids) {
      System.debug('test=============='+prodNames);
      System.debug('oppids=============='+oppids);
      String prod = prodNames;
      String opid = oppids;
      List<Opportunity> opplist =[select id,Pricebook2Id from opportunity where id =: opid Limit 1];
      
      List<PricebookEntry> pbidlist = [Select id,Product2Id,Pricebook2Id from PricebookEntry where Pricebook2id ='01s0o000009DDhIAAW' and Product2.Name =:prod limit 1];
      System.debug('test=============='+pbidlist[0].Pricebook2Id);

        if(pbidlist.size() > 0 && pbidlist[0].Pricebook2Id == null ){
                opportunity opp =new opportunity();
                opp.id = oppids;
                opp.Pricebook2Id = pbidlist[0].Pricebook2Id;
                update opp;
                System.debug('opp=============='+opp);
            }
            

        if( pbidlist.size() > 0 ) {
                System.debug('test=============='+pbidlist);
                return pbidlist.get( 0 );
                //return pbidlist;  
            } 
        else{
              return null;
            } 
    }
    @AuraEnabled
    public static void  deletProducts(String oliId) {
         System.debug('oliIdasdf============'+oliId);
        if(oliId != null){
            OpportunityLineItem oli =new OpportunityLineItem();
            oli.id =oliId;
            System.debug('oliId============'+oliId);
            delete oli;
        }
    }
     @AuraEnabled(Cacheable = true)
    public static List<OpportunityLineItem>  retriveallProducts(String oppId) {
        List<OpportunityLineItem> oliItem = [SELECT Id,Name,Product2.Name,Quantity,UnitPrice,ServiceDate, OpportunityId FROM OpportunityLineItem where OpportunityId=:oppId ORDER BY createdDate DESC LIMIT 6];
        system.debug('OliItem========== '+oliItem);
         return oliItem; 
    }
    
}
