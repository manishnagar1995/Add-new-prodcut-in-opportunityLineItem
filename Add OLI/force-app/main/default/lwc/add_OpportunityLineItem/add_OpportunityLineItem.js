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

export default class Add_OpportunityLineItem extends NavigationMixin(LightningElement) {
    @track openModal=false;
    @track objectapiname;
    @api recordId;
    @track error;
    @track prodName;
    @track pbentry;
    @track showdprod = [];
    @track areDetailsVisible;
   // @track showlis =[];
 //  const link = '/lightning/r/'+ recordId +'/related/OpportunityLineItem/view';
    @track columns = [
        {
            label: 'Product',
            fieldName: 'nameUrl',
            type: 'url',
            typeAttributes: {label: { fieldName: 'Name' }},
            sortable: true
        },
         {label: 'QUANTITY',fieldName: 'Quantity', type: 'number',cellAttributes: { alignment: 'left' }},
         {label: 'SALES PRICE',fieldName: 'UnitPrice', type: 'currency',cellAttributes: { alignment: 'left' }},  
         {label: 'DATE',fieldName: 'ServiceDate', type: 'Date'}, 
         {type: 'action',typeAttributes: { rowActions: actions }, }, 
        ];
     
        @wire(showallprod, {oppId:'$recordId'})
        getoliItem(result) {
        const { data, error } = result;
        if(data) {
            this.areDetailsVisible = true;
            let nameUrl;
            console.log('data==========',JSON.stringify(data));
            this.showdprod = data.map(row => { 
                console.log('row=========='+JSON.stringify(row));
                nameUrl =`/${row.Id}`;
                console.log('32434=========='+nameUrl);
                console.log('map======',{...row , nameUrl});
                return {...row , nameUrl}
            })
            console.log('showlist===',this.showdprod);
            this.error = null;
        }
        if(error) {
            this.error = error;
            this.showdprod = [];
        }
    }

  
   /* @wire(showallprod, {oppId:'$recordId'})
    getoliItem(result) {
       // this.showdprod = showdprod;
      console.log('test1233============',result);
       this.showlis = result.data;
     //  console.log('qqwq============',JSON.stringify(result.data));
       //console.log('qwere============',this.showlis.length);
       
        if (result) {
            
            this.areDetailsVisible = true;
            this.showdprod = this.showlis;
           // console.log('datashow================', this.searchData );
        } else if (result.error) {
            this.error = result.error;
        }
    }
    handleClick(){
        this.openModal=true;
       // console.log('Test========',   this.openModal);
    }*/
    setDefaults(){

    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        console.log('actionnaME======',actionName);
        const row = event.detail.row;
        console.log('actionnrow======',JSON.stringify(row));
        switch (actionName) {
            case 'edit':
                console.log('this.editrecord(row);===',row);
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
        console.log('row_id============',JSON.stringify(row));
        const { id } = row;
        console.log('id', this.findRowIndexById(id))
        const index = this.findRowIndexById(id);
        console.log('row_idesit============',index);
    }
    deleteRow(row) {
        const id = row;
        console.log('row_iddete============', id.Id);
        deleteprod({ oliId : id.Id });
       // const { id } = row;
       // const index = this.findRowIndexById(id);
       // console.log('row_id============',index);
       /* if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }*/
    }

    /*7findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }*/

    handleSubmit(event){
        const fields = event.detail.fields;
        let oppid =this.recordId;
        //fields.OpportunityId = oppid;
        fields.OpportunityId = this.recordId;
        event.preventDefault();
        searchImperativeContactList({ prodNames : fields.product_type__c,oppids: this.recordId })
        .then(result => {
         //   console.log('result == ', JSON.stringify(result));
            this.pbentry = result.Id; 
            fields.PricebookEntryId =this.pbentry;
            this.template.querySelector('lightning-record-edit-form').submit(fields);  
            this.openModal=false;
            return refreshApex(this.showdprod);
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
            message: 'This is Success message.',
            variant: 'Success',
        });
        this.dispatchEvent(showSuccess);
      //  this.openModal=false;
    }

    closeModal(){
        this.openModal=false;
    }

    

}