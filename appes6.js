var MetaData = /** @class */ (function () {
    function MetaData() {
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
        this.totalIncomeDivElement.innerHTML = "Total income: " + this.totalIncome;
        this.totalAvgIncomeDivElement.innerHTML = "Average income: 0";
        this.totalExpenseDivElement.innerHTML = "Total expense: " + this.totalExpense;
        this.totalAvgExpenseDivElement.innerHTML = "Average expense: 0";
    }
    MetaData.prototype.ShowIncomeData = function () {
        this.totalIncomeDivElement.innerHTML = "Total income: " + this.totalIncome;
        this.totalAvgIncomeDivElement.innerHTML = "Average income: " + (this.totalIncome === 0 ? 0 : this.totalIncome / this.incomeNumbers);
    };
    MetaData.prototype.ShowExpenseData = function () {
        this.totalExpenseDivElement.innerHTML = "Total expense: " + this.totalExpense;
        this.totalAvgExpenseDivElement.innerHTML = "Average expense: " + (this.totalExpense === 0 ? 0 : this.totalExpense / this.expenseNumbers);
    };
    MetaData.prototype.AddIncome = function (amount) {
        this.totalIncome += Number(amount);
        this.incomeNumbers++;
        meta_data.ShowIncomeData();
    };
    MetaData.prototype.AddExpense = function (amount) {
        this.totalExpense += Number(amount);
        this.expenseNumbers++;
        meta_data.ShowExpenseData();
    };
    MetaData.prototype.DeleteIncome = function (amount) {
        this.totalIncome -= Number(amount);
        this.incomeNumbers--;
        meta_data.ShowIncomeData();
    };
    MetaData.prototype.DeleteExpense = function (amount) {
        this.totalExpense -= Number(amount);
        this.expenseNumbers--;
        meta_data.ShowExpenseData();
    };
    return MetaData;
}());
var meta_data = new MetaData();
var Transaction = /** @class */ (function () {
    function Transaction(transactionType, description, amount) {
        meta_data.idAmountMap.set(meta_data.totalNumbers, amount);
        this.id = meta_data.totalNumbers;
        this.transactionType = transactionType;
        this.description = description;
        this.amount = amount;
        meta_data.totalNumbers += 1;
    }
    return Transaction;
}());
var Validate_data = /** @class */ (function () {
    function Validate_data() {
    }
    Validate_data.prototype.Validate = function (val) {
        var rows = String(val.split('\n'));
        var data = rows.split(',');
        if (data[0] === '' || data[1] === '' || data[2] === '') {
            return false;
        }
        if (data.length !== 3) {
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
    };
    return Validate_data;
}());
var UI = /** @class */ (function () {
    function UI() {
        this.csvInputElement = document.getElementById('data');
    }
    UI.prototype.AddTransaction = function (transaction) {
        var list = document.getElementById('transaction-list');
        var newRow = document.createElement('tr');
        newRow.className = "" + transaction.transactionType;
        newRow.innerHTML = "\n            <td > " + transaction.transactionType + " </td>\n            <td> " + transaction.description + " </td>\n            <td> " + transaction.amount + " </td>\n            <td> <a href = '#' class = 'delete' id=" + transaction.id + " > Delete </a></td>";
        list.appendChild(newRow);
        if (transaction.transactionType === 'income') {
            meta_data.AddIncome(transaction.amount);
        }
        else {
            meta_data.AddExpense(transaction.amount);
        }
    };
    // Showing alert on the page
    UI.prototype.ShowAlert = function (message, className) {
        var div = document.createElement('div');
        div.className = "alert " + className;
        div.appendChild(document.createTextNode(message));
        var container = document.querySelector('.container');
        var form = document.querySelector('#data-form');
        container.insertBefore(div, form);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    };
    UI.prototype.DeleteData = function (target) {
        if (target.className === 'delete') {
            if (target.parentElement.parentElement.className === 'income') {
                meta_data.DeleteIncome(meta_data.idAmountMap.get(Number(target.id)));
            }
            else if (target.parentElement.parentElement.className === 'expense') {
                meta_data.DeleteExpense(meta_data.idAmountMap.get(Number(target.id)));
            }
            target.parentElement.parentElement.remove();
        }
    };
    //Clearing default fields
    UI.prototype.ClearField = function () {
        this.csvInputElement.value = '';
    };
    return UI;
}());
// Submit event
function EventListeners() {
    var dataInputElement = document.getElementById('data');
    var doc = '';
    document.getElementById('data-form').addEventListener('submit', function (e) {
        doc = dataInputElement.value;
        console.log(typeof (doc));
        var valid = new Validate_data();
        var isValid = true;
        // Not checking csv data for now
        //let isValid = valid.Validate(doc);
        var ui = new UI();
        if (!isValid) {
            ui.ShowAlert('Please enter valid data', 'error');
        }
        else {
            var rows = doc.split(' ');
            for (var i = 1; i < rows.length; i++) {
                var data = rows[i].split(',');
                var transactionType = data[0];
                var description = data[1];
                var amount = data[2];
                var transaction = new Transaction(transactionType, description, amount);
                ui.AddTransaction(transaction);
            }
            ui.ClearField();
            ui.ShowAlert('Data added', 'success');
        }
        e.preventDefault();
    });
    // To delete the data
    document.getElementById('transaction-list').addEventListener('click', function (e) {
        var ui = new UI();
        ui.DeleteData(e.target);
        ui.ShowAlert('Transaction deleted', 'success');
        e.preventDefault();
    });
}
EventListeners();
