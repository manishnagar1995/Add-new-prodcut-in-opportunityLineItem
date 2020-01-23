/* eslint-disable no-unreachable */
/* eslint-disable no-eval */
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
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import showallprod from '@salesforce/apex/Add_OpportunityLientItem.retriveallProducts';
import deleteprod from '@salesforce/apex/Add_OpportunityLientItem.deletProducts';
import { refreshApex } from '@salesforce/apex';
const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];
const link = "/lightning/r/";
const link2= "/related/OpportunityLineItem/view";
//"{! 'Shipping-Details-StageId-' + (counter + 1)}"
export default class Add_OpportunityLineItem extends NavigationMixin(LightningElement) {
    @api recordId;
    tempShowProd;
    @track openModal=false;
    @track number ;
    @track LinkRelted = this.recordId;
    @track objectapiname;
    @track error;
    @track editopenModal;
    @track prodName;
    @track pbentry;
    @track showdprod = [];
    @track areDetailsVisible;
   
    
   // @track showlis =[];
   
    @track columns = [
        { label: 'Product', fieldName: 'nameUrl',type: 'url', typeAttributes: {label: { fieldName: 'product_type__c' }}, },
         {label: 'QUANTITY',fieldName: 'Quantity', type: 'number',cellAttributes: { alignment: 'left' }},
         {label: 'SALES PRICE',fieldName: 'UnitPrice', type: 'currency',cellAttributes: { alignment: 'left' }},  
         {label: 'DATE',fieldName: 'ServiceDate', type: 'Date'}, 
         {type: 'action',typeAttributes: { rowActions: actions }, }, 
        ];
     
        @wire(showallprod, {oppId:'$recordId'})
        getoliItem(result) {
            this.tempShowProd = result;
       if(result.data) {
           if(result.data.oliCount >= 0){
              let nameUrl;
             
             if( result.data.oliCount  > 0){
                this.areDetailsVisible = true;
               }
               else{
                this.areDetailsVisible = false;
                console.log('testvisible=====>',this.areDetailsVisible);
             }
             if(result.data.oliCount <= 6 ){
                  this.number  ='Prodcuts ('+ result.data.oliCount +')'; 
             }else{
                this.number  ='Prodcuts ('+ 6 +'+)'; 
             }this.showdprod = result.data.oliItem.map(row => { 
                 nameUrl =`/${row.Id}`;
                 return {...row , nameUrl}
             })
           }
           else{
            this.areDetailsVisible = false;
            console.log('testvisible=====>',this.areDetailsVisible);
           }
         }
        if(result.error) {
            this.error = error;
            this.showdprod = [];
        }
    }
 
    handleClick(){
        this.openModal=true;
      
    }
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
    
        switch (actionName) {
            case 'edit':
                this.editrecord(row);
                break;
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    editrecord(row){
        this.editopenModal=true;
        const id = row;
        this.recordIdoli = id.Id;
       }

    deleteRow(row) {
        const id = row;
    
        deleteprod({ oliId : id.Id })   
        .then(result => {
            // eslint-disable-next-line no-console
            console.log('result ====> ' + result);
                 // showing success message
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Product Deleted successfully',
                    variant: 'success'
                }),);
                eval("$A.get('e.force:refreshView').fire();");
                return refreshApex(this.tempShowProd); 
                
            })
            .catch(error => {
                window.console.log('Error ====> '+error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!', 
                    message: error.message, 
                    variant: 'error'
                }),);
            });
     }

   

    handleSubmit(event){
        const fields = event.detail.fields;
      //  let oppid =this.recordId;
        // console.log('test234565========',oppid)
        fields.OpportunityId = this.recordId;
        event.preventDefault();
        searchImperativeContactList({ prodNames : fields.product_type__c,oppids: this.recordId })
        .then(result => {
            this.pbentry = result.Id; 
            fields.PricebookEntryId =this.pbentry;
            this.template.querySelector('lightning-record-edit-form').submit(fields);  
            this.openModal=false;
            console.log('temp==========',this.tempShowProd);
           return refreshApex(this.tempShowProd);
        })
        .catch(error => {
            this.error = error;
            this.pbentry = undefined;
        });
    }

   handleError(){
    this.openModal=true;
    }

    handleOnSuccess(){
        const showSuccess = new ShowToastEvent({
            title: 'Success!!',
            message: 'Product added successfully',
            variant: 'success'
        });
        this.dispatchEvent(showSuccess);
        eval("$A.get('e.force:refreshView').fire();");
        return refreshApex(this.tempShowProd);
    }

    closeModal(){
        this.openModal=false;
    }


handleSubmit1(event){
    const fields = event.detail.fields;
    fields.id = this.recordIdoli;
    this.template.querySelector('lightning-record-edit-form').submit(fields); 
    this.editopenModal=false;
    return refreshApex(this.tempShowProd);
}
handleOnSuccess1(){
    const showSuccess = new ShowToastEvent({
        title: 'Success!!',
        message: 'Product updated successfully',
        variant: 'success'
    });
    this.dispatchEvent(showSuccess);
    eval("$A.get('e.force:refreshView').fire();");
    return refreshApex(this.tempShowProd);
}


    

}