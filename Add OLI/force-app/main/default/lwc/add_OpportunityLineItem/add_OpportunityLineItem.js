/* eslint-disable eqeqeq */
/* eslint-disable no-debugger */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import { LightningElement,track,api,wire } from 'lwc';
import searchImperativeContactList from '@salesforce/apex/Add_OpportunityLientItem.insertOLI';

export default class Add_OpportunityLineItem extends LightningElement {
    @track openModal=false;
    @track objectapiname;
    @api recordId;
    @track error;
    @track prodName;
    @track pbentry;
  
    handleClick(){
        this.openModal=true;
        console.log('Test========',   this.openModal);
    }

    handleSubmit(event){
       // debugger;
        
    
          const fields = event.detail.fields;
          let oppid =this.recordId;
          fields.OpportunityId = oppid;
          //let pbentry;
          event.preventDefault();
        console.log('prodName=====',fields.product_type__c);
        console.log('Oppportunity_id=====',oppid);
        searchImperativeContactList({ prodNames : fields.product_type__c,oppids: oppid })
        .then(result => {
            console.log('result == ', JSON.stringify(result));
            this.pbentry = result.Id;
            console.log('id23=======',this.pbentry); 
            fields.PricebookEntryId =this.pbentry;
            
            console.log('isnert======',JSON.stringify(fields));
            
            this.template.querySelector('lightning-record-edit-form').submit(fields);  
            this.openModal=false;

        })
        .catch(error => {
            this.error = error;
            this.pbentry = undefined;
        });
}

    closeModal(){
        this.openModal=false;
    }

}