class MetaData{
    public idAmountMap : Map<number, number>;
    public totalNumbers : number;
    public totalIncome : number;
    public totalExpense : number;
    public incomeNumbers : number;
    public expenseNumbers : number;

    totalIncomeDivElement : HTMLDivElement;
    totalAvgIncomeDivElement : HTMLDivElement;
    totalExpenseDivElement : HTMLDivElement;
    totalAvgExpenseDivElement : HTMLDivElement;

    constructor() {
        this.idAmountMap = new Map();
        this.totalNumbers = 0;
        this.totalIncome = 0;
        this.totalExpense = 0;
        this.incomeNumbers = 0;
        this.expenseNumbers = 0;

        this.totalIncomeDivElement  = document.getElementById
        ('total-income')! as HTMLDivElement ;
        this.totalAvgIncomeDivElement = document.getElementById
        ('avg-income')! as HTMLDivElement;
        this.totalExpenseDivElement = document.getElementById
        ('total-expense')! as HTMLDivElement;
        this.totalAvgExpenseDivElement = document.getElementById
        ('avg-expense')! as HTMLDivElement;

        this.totalIncomeDivElement.innerHTML = `Total income:
         ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income: 0`;
        this.totalExpenseDivElement.innerHTML = `Total expense:
         ${this.totalExpense}`;
        this.totalAvgExpenseDivElement.innerHTML = `Average expense: 0`;

    }

    ShowIncomeData() : void{
        this.totalIncomeDivElement.innerHTML = `Total income:
         ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income:
         ${(this.totalIncome  ===0 ? 0 : this.totalIncome/this.incomeNumbers)}`;
    }

    ShowExpenseData() : void {
        this.totalExpenseDivElement.innerHTML = `Total expense:
         ${this.totalExpense}`;
         this.totalAvgExpenseDivElement.innerHTML = `Average expense:
          ${(this.totalExpense===0 ? 0: this.totalExpense/this.expenseNumbers)}`;
    }

    AddIncome(amount: Number) {
        this.totalIncome += Number(amount);
        this.incomeNumbers++;
        meta_data.ShowIncomeData();        
    }

    AddExpense(amount: Number) {
        this.totalExpense += Number(amount);
        this.expenseNumbers++;
        meta_data.ShowExpenseData();
    }

    DeleteIncome(amount: Number | undefined) {
        if(amount === undefined)
            return;
        this.totalIncome -= Number(amount);
        this.incomeNumbers--; 
        meta_data.ShowIncomeData();
    }

    DeleteExpense(amount: Number | undefined) {
        if(amount === undefined)
            return;
        this.totalExpense -= Number(amount);
        this.expenseNumbers--;
        meta_data.ShowExpenseData();
    }
}

const meta_data = new MetaData();

class Transaction{
    public id : number;
    public transactionType: string;
    public description : string;
    public date: string;
    public amount : number;
    
    constructor(transactionType: string, date: string, 
        description: string, amount:number) {
        meta_data.idAmountMap.set(meta_data.totalNumbers, amount);
        this.id = meta_data.totalNumbers;
        this.transactionType = transactionType;
        this.date = date;
        this.description = description;
        this.amount = amount;
        meta_data.totalNumbers +=1;
    }
}

class ValidateData{
    Validate (val: string) {
    
        let rows = val.split('\n');
        let header = rows[0].split(',');

        const ui = new UI();

        if(header[0] !== 'I/E' || header[1] !== 'Date' || header[2] !=='Name'
         || header[3] !== 'Amount' ){
            console.log(header);
            ui.ShowAlert('Incorrect header of CSV', 'error');
            return false;
        }

        for(let i = 1; i< rows.length ;i++)
        {
            let data = rows[i].split(',');
            if(data[0 ]=== '' || data[1] === '' || data[2] === '' ||
             data[3] === '') {
                ui.ShowAlert("Data missing at line " + i, 'error');
                return false;
            }

            if(data[0] !== 'I' && data[0] !== 'E') {
                ui.ShowAlert('Incorrect data at line '+ i, 'error');
                return false;
            }

            if(isNaN(Number(data[3])) && Number(data[3])<0){
                ui.ShowAlert('Please enter valid amount', 'error')
                return false;
            }
        }
    return true;
    }
}

class UI {
    csvInputElement : HTMLInputElement;
    constructor(){
        this.csvInputElement = document.getElementById('data') as HTMLInputElement;
    }
    
    AddTransaction(transaction : Transaction) {
        const list = document.getElementById('transaction-list')! as HTMLElement;
        const newRow = document.createElement('tr');
        newRow.className = `${transaction.transactionType}`;
        newRow.innerHTML = `
            <td> ${transaction.transactionType} </td>
            <td> ${transaction.date} </td>
            <td> ${transaction.description} </td>
            <td> ${transaction.amount} </td>
            <td> <a href = '#' class = 'delete' id=${transaction.id} > Delete </a></td>` ;
        
        list.appendChild(newRow);
        if(transaction.transactionType === 'I'){
            meta_data.AddIncome(transaction.amount);
        }
        else if(transaction.transactionType === 'E') {
            meta_data.AddExpense(transaction.amount);
        }
    }
    
// Showing alert on the page
    ShowAlert(message: string, className : string) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
    
        div.appendChild(document.createTextNode(message));
        const container = document.getElementById('container');
    
        const form = document.getElementById('data-form');
        container!.insertBefore(div, form);
        
        setTimeout(function() {
            document.querySelector('.alert')!.remove();
        }, 3000);
    }
    
    DeleteData(target : EventTarget) {
        let targetButton = target as HTMLButtonElement;
        
        if(targetButton.className === 'delete' && targetButton.id !== undefined){
            if((target as HTMLButtonElement).parentElement!.parentElement!.className === 'I'){
                meta_data.DeleteIncome(meta_data.idAmountMap.get(Number(targetButton.id)));
            }
            else if(targetButton.parentElement!.parentElement!.className ==='E'){
                meta_data.DeleteExpense(meta_data.idAmountMap.get(Number(targetButton.id)));
            }

            targetButton.parentElement!.parentElement!.remove();
        }
    }

    //Clearing default fields
    ClearField() {
        this.csvInputElement.value = <string> '';
    }
}


class Sorting {
    constructor(){};
    Compare (param:string, x : Element , y : Element) : boolean {
        if((param === 'I/E' || param === 'Description') 
        && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            return true;
        }

        if(param === 'Date') {
            let date1 = x.innerHTML.split('/');
            let date2 = y.innerHTML.split('/');
            if( (date1[2].trim() + date1[1].trim() + date1[0].trim()) > (date2[2].trim() + date2[1].trim() + date2[0].trim()) )
                return true;
        }

        if(param === 'Amount' && Number(x.innerHTML) > Number(y.innerHTML)){
            return true;
        }
        return false;
    }

    SortTable(param: string, code: number): void{
        let sortParam : string =  (document.getElementById('sort-info') as HTMLInputElement).value;
        let table: HTMLTableElement = document.getElementById('data-table') as HTMLTableElement;
        let switching : boolean = true;
        let shouldSwitch: boolean = false;
        let i: number;
        let x,y;

    while(switching){
        let rows = table.rows;
        switching = false;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[code];
            y = rows[i + 1].getElementsByTagName("TD")[code];
            
            if (this.Compare(param, x , y)) {
                shouldSwitch = true;
                break;
            }
            }
            if (shouldSwitch) {
            rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            }
        }
    }
}

class Filter{
    public table: HTMLTableElement;
    public rows : HTMLCollectionOf<HTMLTableRowElement>;
    // public totalIncome : number;
    // public avgIncome : number;
    // public totalExpense : number;
    // public avgExpense : number;
    
    constructor(){
        this.table = document.getElementById('data-table') as HTMLTableElement;
        this.rows = this.table.rows;
        // this.totalExpense = 0;
        // this.totalIncome = 0;
        // this.avgExpense = 0;
        // this.avgIncome = 0;
    }

    ComputeData(IE: string, amount: number) {
        if(IE === 'I'){
            meta_data.totalIncome += amount;
            meta_data.incomeNumbers ++;
        }
        else if(IE === 'E'){
            meta_data.totalExpense += amount;
            meta_data.expenseNumbers ++;
        }
    }

    ShowAllData(){
        for (let i = 1; i < this.rows.length; i++){
            this.rows[i].style.display = '';
            let IE = String(this.rows[i].getElementsByTagName("TD")[0].innerHTML).trim();
            let amount = Number(this.rows[i].getElementsByTagName("TD")[3].innerHTML);
            this.ComputeData(IE,amount);
        }
    }

    ShowIEFilter(showIE: string){
        for (let i = 1; i < this.rows.length; i++){
            let IE = String(this.rows[i].getElementsByTagName("TD")[0].innerHTML).trim();
            let amount = Number(this.rows[i].getElementsByTagName("TD")[3].innerHTML);
            if(IE !== showIE){
                this.rows[i].style.display = 'none';
            }
            else {
                this.ComputeData(IE,amount);
            }
        }
    }

    ShowAmountFilter(sign: string, amount: number){
        if(sign === '<'){
            for (let i = 1; i < this.rows.length ; i++){
                let IE = String(this.rows[i].getElementsByTagName("TD")[0].innerHTML).trim();
                let cellAmount = Number(this.rows[i].getElementsByTagName("TD")[3].innerHTML);

                if(cellAmount >= amount){
                    this.rows[i].style.display = 'none';
                }
                else {
                    this.ComputeData(IE,cellAmount);
                }
            }
        }
        else if(sign === '>') {
            
            for (let i = 1; i < this.rows.length ; i++){
                let IE = String(this.rows[i].getElementsByTagName("TD")[0].innerHTML).trim();
                let cellAmount = Number(this.rows[i].getElementsByTagName("TD")[3].innerHTML);

                if(Number(this.rows[i].getElementsByTagName("TD")[3].innerHTML) <= amount){
                    this.rows[i].style.display = 'none';
                }
                else {
                    this.ComputeData(IE,cellAmount);
                }
            }
        }
    }

    FilterBy(param: string, param_code: number){
        
        meta_data.totalIncome = 0;
        meta_data.incomeNumbers = 0;
        meta_data.totalExpense = 0;
        meta_data.expenseNumbers = 0;
        
        if(param === 'None'){
            this.ShowAllData();
        }
        else if(param === 'OnlyIncome') {
             this.ShowIEFilter('I');
        } 
        else if(param === 'OnlyExpense') {
            this.ShowIEFilter('E');
        } 
        else if(param === 'LessThanThousand') {
            this.ShowAmountFilter('<', 1000);
        } 
        else if(param === 'LessThanLakh') {
            this.ShowAmountFilter('<', 100000);
        }
        else if(param === 'GreaterThanLakh') {
            this.ShowAmountFilter('>', 100000);
        }
        meta_data.ShowExpenseData();
        meta_data.ShowIncomeData();
    }
}

function EventListeners() :void {
    
    let dataInputElement = <HTMLInputElement> document.getElementById('data') as HTMLInputElement;

    // Submit event
    let doc : string = '';
        document.getElementById('data-form')!.addEventListener('submit', 
    function(e) {
        doc = <string> dataInputElement.value;
        
        const valid = new ValidateData();
        let isValid = valid.Validate(doc);
        const ui = new UI();
        if(!isValid){
            ui.ShowAlert('Please enter data again', 'error');
        }
        else{
            let rows = doc.split('\n');
            for(let i = 1; i< rows.length ;i++)
            {
                let data = rows[i].split(',');
                let transactionType:string = data[0];
                let date : string= data[1];
                let description :string= data[2];
                let amount : number=  Number(data[3]);

                const transaction = new Transaction(transactionType, date,
                        description, amount);
                
                ui.AddTransaction(transaction);
            }

            ui.ClearField();
            ui.ShowAlert('Data added', 'success');
        }
        e.preventDefault();
    });

    // To delete the data
    document.getElementById('transaction-list')!.addEventListener('click', function(e){
        const ui = new UI();

        ui.DeleteData(e.target!);
        ui.ShowAlert('Transaction deleted', 'success');
        e.preventDefault();
    });

    // To sort the data
    document.getElementById('sort-info')!.addEventListener('click', function(e){
        let param: string = (document.getElementById('sort-info')! as HTMLInputElement).value;
        let param_code : number;
        const sorting = new Sorting();

        if(param === 'I/E')
            param_code = 0;
        else if(param === 'Date')
            param_code = 1;
        else if(param === 'Description')
            param_code = 2;
        else if(param === 'Amount')
            param_code = 3;
        else 
            param_code = -1;
        
        
        sorting.SortTable(param, param_code);
        e.preventDefault();
    });


    // To filter the data
    document.getElementById('filter-info')!.addEventListener('click', function(e){
        let param: string = (document.getElementById('filter-info')! as HTMLInputElement).value;
        //console.log(param);
        let param_code: number;
        const filter = new Filter();
        
        filter.ShowAllData();
        if(param === 'OnlyIncome' || param === 'OnlyExpense' )
            param_code = 0;
        else if(param === 'LessThanThousand' || param === 'LessThanLakh' || param === 'GreaterThanLakh')
            param_code = 3;
        else
            param_code = -1;

        filter.FilterBy(param, param_code);

        e.preventDefault();
    
    });
}
EventListeners();
