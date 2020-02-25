//BUDGET CONTROLLER - tracks all incomes/expenses and the budget itself
var budgetController = (function() {

	//a constructor is perfect for creating LOTS of objects (ie: expense and income input objects)
	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	};

	class Income {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	};

	//Data structure
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	//This public object helps push input values into the data structure above
	return {
		addItem: function(type, des, val) {
			var newItem, ID;


			if (data.allItems[type].length > 0) {
			   //ID = last ID + 1 // we determine the last id position by .length - 1 (because the index starts at 0, we must subtract by 1)
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1
			} else {
				ID = 0;
			}
			

			//create new item based on inc or exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income (ID, des, val);
			}

			//push it into our data structure
			data.allItems[type].push(newItem); 

			//return the new element
			return newItem;
		},

		testing: function(){
			console.log(data);
		}

	};


}) ();




//UI CONTROLLER
var UIController = (function(){

//this object stores all our querySelector strings in one place; that way if we change the name of one of the strings, it will reflect everywhere else
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		expensesContainer: '.expenses__list',
		incomeContainer: '.income__list'
	};


	return {
		//receive inputted values from +/-, add desc, and value fields. 
		getInput: function(){
			//the reason we put all 3 in the getInput object, is because we want to return all 3 together
			return {
				type: document.querySelector(DOMstrings.inputType).value,
			    description: document.querySelector(DOMstrings.inputDescription).value,
			    value: document.querySelector(DOMstrings.inputValue).value
		   };
		},

		//add each new item into the HTML/UI
		addListItem: function(obj, type) {
			var html, newHTML, element;

			//Create HTML string with placeholder text

			if (type === 'inc') {
			element = DOMstrings.incomeContainer;

             html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              } 

              else if (type === 'exp') {
              element = DOMstrings.expensesContainer;

             html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }

			//replace the placeholder text with the data we receive from object
			newHTML = html.replace('%id%', obj.id);
				//you have to do = newHTML because you're replacing a new string on top of the previously replaced string
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);

			//Insert the HTML to the DOM // 'beforeend' keyword allows your html to be inserted as a child of .income__list/.expense__list
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

		},

		clearFields: function(){
			var fields, fieldsArr;

			//this produces a list
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
 
 			//this tricks the slice method into thinking it's an array, which will return an array
 			fieldsArr = Array.prototype.slice.call(fields);

 			fieldsArr.forEach(function(current, index, array) {
 				current.value = "";

 			//set the focus back to the description
 			fieldsArr[0].focus();

 			});
		},

		//return your private DOMstrings so its exposes it to the public, so the other controller can access it
		getDOMstrings: function() {
			return DOMstrings;
		}
	}

}) ();







//GLOBAL APP CONTROLLER - this is the central place where you control what happens to each event, and then delegate these tasks to the other controllers
var controller = (function(budgetCtrl, UICtrl) {

	//initialize all the event listeners. These ALL need to be publically called, since they're private
	var setupEventListeners = function() {

		//call the DOMstrings from ui controller so you can access them here:
	        var DOM = UICtrl.getDOMstrings();

		//Add Field values button (green check mark)
			document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		/**You also want the controller/add__btn to work when we hit enter, instead of clicking it.
		This is called a key press event - we are applying it globally and not using querySelector
		because when you hit enter, it doesn't happen on any specific element, only the global document
		**/
			document.addEventListener('keypress', function(event){
			  //I found the keyCode property by console.logging event. Each key has a code.
			  //some older browsers don't use keyCode property, so 'which' works too
				if (event.keyCode === 13 || event.which === 13) {
					ctrlAddItem();
				}
			});
	};

	//we are creating this as part of DRY principle so we can write our code once, but use it in .add__btn and keypress fucntion
	var ctrlAddItem = function() {

		var input, newItem;
		// 1 get field input data
		input = UICtrl.getInput();

		//2 add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//3 add the new item to the UI
		UICtrl.addListItem(newItem, input.type);

		//4 clear the fields
		UICtrl.clearFields();

		// calc and update the budget
		updateBudget();
	};

	var updateBudget = function(){

		//5 calc the budget

		//6 return the budget

		// 7 display the budget
	};

	//public init function to publicize the setupEventListener private function. You need to return it in an object to make it public.
		return {
			init: function() {
				console.log('Application has started');
				setupEventListeners();
			}
		};

}) (budgetController, UIController);

//we invoke it on the outside of the private function
controller.init();