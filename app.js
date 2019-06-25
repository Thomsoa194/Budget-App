// Budget Controller
 var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = p-1;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome) {
     if(totalIncome > 0) {
      this.percentage = Math.round((this.value / this.totalIncome) * 100); // Now we have an integer percentage value. We used Math's method round to achieve this      
     } else {
      this.percentage = -1;
     }  
     };
    Expense.prototype.getPercentage = function() {
     return this.percentage;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
        var data = {
            allItems: {
                inc: [],
                exp: []
            },
            totals: {
                inc: 0,
                exp: 0
            },
            budget: 0,
            percentage: -1,
        };
    var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(current) {
         sum = sum + current.value;
       });
      data.totals[type] = sum;
    };
    return {
     addItem: function(type, des, val) {
      var newItem, ID;
      //Create new ID
      if(data.allItems[type].length > 0) {
       ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
       ID = 0;
      }
      // ID = [0,1,2,3,4,5] next ID is 6
      // ID = [0,1,4,5,6,7,8] next ID is 9
      //Create new item based on either inc or exp
      if(type === 'exp') {
       newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
       newItem = new Income(ID, des, val);
      }
      //Push new item into a data structure
      data.allItems[type].push(newItem);
      //Return new item so the other function can have direct access to it.
      return newItem;
     },
     
     deleteItem: function(type, id) {
      var ids, index;
        ids = data.allItems[type].map(function(current) {
        return current.id; // After execution we end up with an array with our expeneses and income's id numbers. We're using a callback function
       });
      index = ids.indexOf(id);
      // Now we have the index of the element, we delete it using the splice method
      if(index !== -1) { // Here we use a boolean statement to make sure our number exists. If it returns -1, it doesn't exist in an array. 
       data.allItems[type].splice(index, 1); // Here the splice method takes two arguments. The index of the element we want to delete and the number of elements we want to delete
      } // Now we simply need to call our new deleteItem method in the Controller
     }, 
     
     calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate budet: income minus expenses
      data.budget = data.totals.inc - data.totals.exp;
      
      // Calcualte percentage of income that we spent
      if(data.totals.inc > 0) {
       data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
       data.percentage = -1;
      }
      
      //
     },
     calculatePercentages: function() {
      data.allItems.exp.forEach(function(current){
       current.calculatePercentage();
       });
      },
      getPercentages: function() {
       var allPercentages = data.allItems.exp.map(function(current){
        return current.getPercentage();
        });
       return allPercentages; // This returns an array with each element's percentage of total income
      },
     getBudget: function() {
       return {
         budget: data.budget,
         totalIncome: data.totals.inc,
         totalExpenses: data.totals.exp,
         percentage: data.percentage
       };
     },
     testing: function() {
      console.log(data);
     }
    };
    
    })();
 
 
 
 
 
 
 
 
 
 
 
 // UI Controller
 var UIController = (function() {
    var DOMStrings = {
        
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
        
    };
    return {
        getInput: function() {
            return {
            type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
         // Create HTML string with placeholder text
         var html, newHtml, element;
         if (type === 'inc') {
         element = DOMStrings.incomeContainer;
         html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          
         } else if (type === 'exp') {
         element = DOMStrings.expensesContainer;
         html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
         // Replace placeholder text with some actual data
         newHtml = html.replace('%id%', obj.id);
         newHtml = newHtml.replace('%description%', obj.description);
         newHtml = newHtml.replace('%value%', obj.value);
         // Insert HTML into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID) {// The argument we pass we pass will be the itemID from the Controller. Eg, income-0 or income-1
          var el = document.getElementById(selectorID);
          el.parentNode.removeChild(el);
        },
        clearFields: function() {
         var fields, fieldsArray;
         
         fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); // QuerySelectorAll returns a list which unfortunately doesn't have an arrays methods
         
         fieldsArray = Array.prototype.slice.call(fields); // This will trick the slice methods into thinking we're giving it an array.
         fieldsArray.forEach(function(current) {
          current.value = "";
          });
         fieldsArray[0].focus();
        },
        
        displayBudget: function(obj) {
         document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
         document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
         document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;
         
         if(obj.percentage > 0) {
         document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
         document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        }
        },

  
        getDOMStrings: function() {
            return DOMStrings;
            }
        };
    })();
 
 
 
 
 
 
 
 
 
 
 // Global App Controller
 var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function() {
        
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 
    
    document.addEventListener('keypress', function(event) {
       if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
        }
    });
    
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    var updateBudget = function() {
     // Calculate the budget
      budgetController.calculateBudget();
     // Return the budget
      var budget = budgetCtrl.getBudget();
     // Display the budget
     UICtrl.displayBudget(budget);
     

    };
     updatePercentages = function() {
       // 1. Calculate percentages
       budgetController.calculatePercentages();
       // 2. Read percentages from the budget controller
       var percentages = budgetController.getPercentages();
      // 3. Update the user interface with the new percentages
      console.log(percentages);
     };
    var ctrlAddItem = function() {
        var input, newItem;
        // Input Data
        input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)  {
           // Add item to budget controller
           newItem = budgetController.addItem(input.type, input.description, input.value);
           //Add the new item to our user UI
           UICtrl.addListItem(newItem, input.type);
           // Clear fields
           UICtrl.clearFields();
           // Calculate and update budget
           updateBudget();
           // Calculate and update the percentages
           updatePercentages();
        }

   

    };
    var ctrlDeleteItem = function(event) {
     var itemID, splitID, type, ID;
     itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
     if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]); // The second element The parseInt converts a string into a number(integer)
      
      // 1. Delete item from data structure
      budgetController.deleteItem(type, ID);
      
      // 2. Delete item from the user interface
      UICtrl.deleteListItem(itemID);
      
      
      // 3. Update budget and show the new budget
      updateBudget();
      // 4. Calculate and update the percentages
      updatePercentages();
     }
    };
    
    return {
        init: function() {
        console.log('Application is running');
         UICtrl.displayBudget({
         budget: 0,
         totalIncome: 0,
         totalExpenses: 0,
         percentage: -1});
         setupEventListeners();
        }
    };

    })(budgetController, UIController);
 
 controller.init();