/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import insertOlI from '@salesforce/apex/Add_OpportunityLientItem.insertOLI';

export default class Add_OpportunityLineItem extends LightningElement {
    @track openModal=false;
   // @track objectapiname;
    @api recordId;
    @track prodName;

    handleClick(){
        this.openModal=true;
        console.log('Test========',   this.openModal);
    }

    handleSubmit(event){
        event.preventDefault();
         // this.prodName =event.detail.fields;
          const fields = event.detail.fields;
        console.log('prodName=====',fields.product_type__c);
        console.log('prodName=====',fields);
        console.log('Oppportunity_id=====',this.recordId);
       insertOlI({prodName:'$prodName'});

     /* //event.preventDefault();
        this.validForm = true;
        // check for validations and set validForm
        if (this.validForm) {
            //this.template.querySelector('lightning-record-edit-form').submit();
           // this.openModal=false;
        } else {
            this.showToast();
        }*/
        
    }

    closeModal(){
        this.openModal=false;
    }

}