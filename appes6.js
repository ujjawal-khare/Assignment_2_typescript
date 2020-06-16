"use strict";
class MetaData {
    constructor() {
        this.idAmountMap = new Map();
        this.totalNumbers = 0;
        this.totalIncome = 0;
        this.totalExpense = 0;
        this.incomeNumbers = 0;
        this.expenseNumbers = 0;
        this.totalIncomeDivElement = document.getElementById('total-income');
        this.totalAvgIncomeDivElement = document.getElementById('avg-income');
        this.totalExpenseDivElement = document.getElementById('total-expense');
        this.totalAvgExpenseDivElement = document.getElementById('avg-expense');
        this.totalIncomeDivElement.innerHTML = `Total income: ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income: 0`;
        this.totalExpenseDivElement.innerHTML = `Total expense: ${this.totalExpense}`;
        this.totalAvgExpenseDivElement.innerHTML = `Average expense: 0`;
    }
    ShowIncomeData() {
        this.totalIncomeDivElement.innerHTML = `Total income: ${this.totalIncome}`;
        this.totalAvgIncomeDivElement.innerHTML = `Average income: ${(this.totalIncome === 0 ? 0 : this.totalIncome / this.incomeNumbers)}`;
    }
    ShowExpenseData() {
        this.totalExpenseDivElement.innerHTML = `Total expense: ${this.totalExpense}`;
        this.totalAvgExpenseDivElement.innerHTML = `Average expense: ${(this.totalExpense === 0 ? 0 : this.totalExpense / this.expenseNumbers)}`;
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
class Transaction {
    constructor(transactionType, date, description, amount) {
        meta_data.idAmountMap.set(meta_data.totalNumbers, amount);
        this.id = meta_data.totalNumbers;
        this.transactionType = transactionType;
        this.date = date;
        this.description = description;
        this.amount = amount;
        meta_data.totalNumbers += 1;
    }
}
class Validate_data {
    Validate(val) {
        let rows = val.split('\n');
        let header = rows[0].split(',');
        const ui = new UI();
        if (header[0] !== 'I/E' || header[1] !== 'Date' || header[2] !== 'Name' || header[3] !== 'Amount') {
            console.log(header);
            ui.ShowAlert('Incorrect header of CSV', 'error');
            return false;
        }
        if (rows.length == 1) {
        }
        for (let i = 1; i < rows.length; i++) {
            let data = rows[i].split(',');
            if (data[0] === '' || data[1] === '' || data[2] === '' || data[3] === '') {
                ui.ShowAlert("Data missing at line " + i, 'error');
                return false;
            }
            if (data[0] !== 'I' && data[0] !== 'E') {
                ui.ShowAlert('Incorrect data at line ' + i, 'error');
                return false;
            }
            if (isNaN(Number(data[3])) && Number(data[3]) < 0) {
                ui.ShowAlert('Please enter valid amount', 'error');
                return false;
            }
        }
        return true;
    }
}
class UI {
    constructor() {
        this.csvInputElement = document.getElementById('data');
    }
    AddTransaction(transaction) {
        const list = document.getElementById('transaction-list');
        const newRow = document.createElement('tr');
        newRow.className = `${transaction.transactionType}`;
        newRow.innerHTML = `
            <td> ${transaction.transactionType} </td>
            <td> ${transaction.date} </td>
            <td> ${transaction.description} </td>
            <td> ${transaction.amount} </td>
            <td> <a href = '#' class = 'delete' id=${transaction.id} > Delete </a></td>`;
        list.appendChild(newRow);
        if (transaction.transactionType === 'I') {
            meta_data.AddIncome(transaction.amount);
        }
        else if (transaction.transactionType === 'E') {
            meta_data.AddExpense(transaction.amount);
        }
    }
    // Showing alert on the page
    ShowAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.getElementById('container');
        const form = document.getElementById('data-form');
        container.insertBefore(div, form);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    DeleteData(target) {
        if (target.className === 'delete') {
            if (target.parentElement.parentElement.className === 'I') {
                meta_data.DeleteIncome(meta_data.idAmountMap.get(Number(target.id)));
            }
            else if (target.parentElement.parentElement.className === 'E') {
                meta_data.DeleteExpense(meta_data.idAmountMap.get(Number(target.id)));
            }
            target.parentElement.parentElement.remove();
        }
    }
    //Clearing default fields
    ClearField() {
        this.csvInputElement.value = '';
    }
}
function EventListeners() {
    let dataInputElement = document.getElementById('data');
    // Submit event
    let doc = '';
    document.getElementById('data-form').addEventListener('submit', function (e) {
        doc = dataInputElement.value;
        const valid = new Validate_data();
        // Not checking csv data for now
        let isValid = valid.Validate(doc);
        const ui = new UI();
        if (!isValid) {
            ui.ShowAlert('Please enter data again', 'error');
        }
        else {
            let rows = doc.split('\n');
            for (let i = 1; i < rows.length; i++) {
                let data = rows[i].split(',');
                let transactionType = data[0];
                let date = data[1];
                let description = data[2];
                let amount = Number(data[3]);
                const transaction = new Transaction(transactionType, date, description, amount);
                ui.AddTransaction(transaction);
            }
            ui.ClearField();
            ui.ShowAlert('Data added', 'success');
        }
        e.preventDefault();
    });
    // To delete the data
    document.getElementById('transaction-list').addEventListener('click', function (e) {
        const ui = new UI();
        ui.DeleteData(e.target);
        ui.ShowAlert('Transaction deleted', 'success');
        e.preventDefault();
    });
    // To sort the data
    // document.getElementById('sort-info')!.addEventListener('change', function(e){
    //     console.log((document.getElementById('sort-info')! as HTMLInputElement).value);
    //     let sortParam : string =  (document.getElementById('sort-info') as HTMLInputElement).value;
    //     let table: HTMLTableElement = document.getElementById('data-list');
    //     let switching = true;
    //     let shouldSwitch: boolean;
    //     let i: number;
    //     let x,y;
    //     while(switching){
    //         let rows = table.rows;
    //         switching = false;
    //         for (i = 1; i < (rows.length - 1); i++) {
    //             shouldSwitch = false;
    //             x = rows[i].getElementsByTagName("TD")[0];
    //             y = rows[i + 1].getElementsByTagName("TD")[0];
    //             console.log(x);
    //             if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
    //               shouldSwitch = true;
    //               break;
    //             }
    //           }
    //           if (shouldSwitch) {
    //             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    //             switching = true;
    //           }
    //     }
    // });
}
EventListeners();
