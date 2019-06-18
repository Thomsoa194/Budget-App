// Budget Controller
 var budgetController = (function() {
    
    
    })();
 // UI Controller
 var UIController = (function() {
    return {
        getInput: function() {
            return {
            type: document.querySelector('.add__type').value, // Will be either inc or exp
            description: document.querySelector('.add__description').value,
            value: document.querySelector('.add__value').value
            };
        }
        };
    })();
 // Global App Controller
 var controller = (function(budgetCtrl, UICtrl){
    
    var ctrlAddItem = function() {
        
        // Input Data
        var input = UICtrl.getInput();
        console.log(input);
        // Add item to budget controller]//Add the new item to our user UI
        // Add new item to User interface
        // Calculate the budget
        // Display the budget
    };
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem); 
    
    document.addEventListener('keypress', function(event) {
       if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
        }
    });
    })(budgetController, UIController);