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
        this.idAmountMap = new Map<number, number>();
        this.totalNumbers = 0;
        this.totalIncome = 0;
        this.totalExpense = 0;
        this.incomeNumbers = 0;
        this.expenseNumbers = 0;

        this.totalIncomeDivElement  = document.getElementById('total-income')! as HTMLDivElement ;
        this.totalAvgIncomeDivElement = document.getElementById('avg-income')! as HTMLDivElement;
        this.totalExpenseDivElement = document.getElementById('total-expense')! as HTMLDivElement;
        this.totalAvgExpenseDivElement = document.getElementById('avg-expense')! as HTMLDivElement;

        this.totalIncomeDivElement.innerHTML = `Total income: ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income: 0`;
        this.totalExpenseDivElement.innerHTML = `Total expense: ${this.totalExpense}`;
        this.totalAvgExpenseDivElement.innerHTML = `Average expense: 0`;

    }

    ShowIncomeData() : void{
        this.totalIncomeDivElement.innerHTML = `Total income: ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income: ${(this.totalIncome  ===0 ? 0 : this.totalIncome/this.incomeNumbers)}`;
    }

    ShowExpenseData() : void {
        this.totalExpenseDivElement.innerHTML = `Total expense: ${this.totalExpense}`;
         this.totalAvgExpenseDivElement.innerHTML = `Average expense: ${(this.totalExpense===0 ? 0: this.totalExpense/this.expenseNumbers)}`;
    }

    AddIncome(amount) {
        this.totalIncome += Number(amount);
        this.incomeNumbers++;
        meta_data.ShowIncomeData();        
    }

    AddExpense(amount) {
        this.totalExpense += Number(amount);
        this.expenseNumbers++;
        meta_data.ShowExpenseData();
    }

    DeleteIncome(amount) {
        this.totalIncome -= Number(amount);
        this.incomeNumbers--; 
        meta_data.ShowIncomeData();
    }

    DeleteExpense(amount) {
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
    public amount : number;
    
    constructor(transactionType, description, amount) {
        meta_data.idAmountMap.set(meta_data.totalNumbers, amount);
        this.id = meta_data.totalNumbers;
        this.transactionType = transactionType;
        this.description = description;
        this.amount = amount;
        meta_data.totalNumbers +=1;
    }
}

class Validate_data{
    Validate (val: string) {
    
        let rows = String(val.split('\n'));
        let data = rows.split(',');
    
        if(data[0]==='' || data[1]==='' || data[2]==='') {
            return false;
        }
        if(data.length !== 3)
        {
            //alert("Please enter valid csv data");
            return false;
        }
    
        // console.log("val " +  typeof(val));
        // for(let i=0;i<val.length;i++)
        // {
        //     if(val[i].length != 1){
        //         alert("Please enter valid csv data");
        //         return false;
        //     }
        // }
    return true;
    }
}

class UI {

    csvInputElement : HTMLInputElement;
    constructor(){
        this.csvInputElement = document.getElementById('data') as HTMLInputElement;
    }
    

    AddTransaction(transaction : Transaction) {
        const list = document.getElementById('transaction-list');
        const newRow = document.createElement('tr');
        newRow.className = `${transaction.transactionType}`;
        
        newRow.innerHTML = `
            <td > ${transaction.transactionType} </td>
            <td> ${transaction.description} </td>
            <td> ${transaction.amount} </td>
            <td> <a href = '#' class = 'delete' id=${transaction.id} > Delete </a></td>` ;
        
        list.appendChild(newRow);
        if(transaction.transactionType === 'income'){
            meta_data.AddIncome(transaction.amount);
        }
        else {
            meta_data.AddExpense(transaction.amount);
        }
    }
    
    // Showing alert on the page
    ShowAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
    
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
    
        const form = document.querySelector('#data-form');
        container.insertBefore(div, form);
        
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    
    DeleteData(target) {
        if(target.className === 'delete'){
            if(target.parentElement.parentElement.className === 'income'){
                meta_data.DeleteIncome(meta_data.idAmountMap.get(Number(target.id)));
            }
            else if(target.parentElement.parentElement.className ==='expense'){
                meta_data.DeleteExpense(meta_data.idAmountMap.get(Number(target.id)));
            }

            target.parentElement.parentElement.remove();
        }
    }
    //Clearing default fields
    ClearField() {
        this.csvInputElement.value = <string> '';
    }
}

// Submit event

function EventListeners() {
    
    let dataInputElement = <HTMLInputElement> document.getElementById('data') as HTMLInputElement;

    let doc : string = '';
        document.getElementById('data-form').addEventListener('submit', 
    function(e) {
        doc = <string> dataInputElement.value;
        console.log(typeof(doc));
        const valid = new Validate_data();
        let isValid = true;
        
        // Not checking csv data for now
        //let isValid = valid.Validate(doc);

        const ui = new UI();
        if(!isValid){
            ui.ShowAlert('Please enter valid data', 'error');
        }
        else{
            
            let rows = doc.split(' ');

            for(let i = 1; i< rows.length ;i++)
            {
                let data = rows[i].split(',');
                let transactionType = data[0];
                let description = data[1];
                let amount = data[2];

                const transaction = new Transaction(transactionType,
                        description, amount);
                
                ui.AddTransaction(transaction);
            }

            ui.ClearField();
            ui.ShowAlert('Data added', 'success');
        }
        e.preventDefault();
    });

    // To delete the data
    document.getElementById('transaction-list').addEventListener('click', function(e){
        const ui = new UI();

        ui.DeleteData(e.target);
        ui.ShowAlert('Transaction deleted', 'success');
        e.preventDefault();
    });
}

EventListeners();