// Budget Controller
 var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
            }
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
        expensesContainer: '.expenses__list'
    };
    return {
        getInput: function() {
            return {
            type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        
        addListItem: function(obj, type) {
         // Create HTML string with placeholder text
         var html, newHtml, element;
         if (type === 'inc') {
         element = DOMStrings.incomeContainer;
         html = '<div class="item clearfix" id="income-&id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          
         } else if (type === 'exp') {
         element = DOMStrings.expensesContainer;
         html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
         // Replace placeholder text with some actual data
         newHtml = html.replace('%id%', obj.id);
         newHtml = newHtml.replace('%description%', obj.description);
         newHtml = newHtml.replace('%value%', obj.value);
         // Insert HTML into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function() {
         var fields, fieldsArray;
         
         fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); // QuerySelectorAll returns a list which unfortunately doesn't have an arrays methods
         
         fieldsArray = Array.prototype.slice.call(fields); // This will trick the slice methods into thinking we're giving it an array.
         fieldsArray.forEach(function(current, index, array) {
          current.value = "";
          });
         fieldsArray[0].focus();
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
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        // Input Data
        input = UICtrl.getInput();
        console.log(input);
        // Add item to budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //Add the new item to our user UI
        UICtrl.addListItem(newItem, input.type);
        // Clear fields
        UICtrl.clearFields();
        // Add new item to User interface
        // Calculate the budget
        // Display the budget
    };
    return {
        init: function() {
        console.log('Application is running');
         setupEventListeners();
        }
    };

    })(budgetController, UIController);
 
 controller.init();