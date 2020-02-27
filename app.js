//BUDGET CONTROLLER - tracks all incomes/expenses and the budget itself
var budgetController = (function() {

	//a constructor is perfect for creating LOTS of objects (ie: expense and income input objects)
	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
			this.percentage = -1; // when something is undefined, we used -1
		}
	};

	//this function calculate the percentage of expenses over your income
	Expense.prototype.calcPercentage = function(totalIncome) {

		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
		
	};

	//This function return the percentage amount
	Expense.prototype.getPercentage = function () {
		return this.percentage;
	};


	class Income {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	};

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach(function(current) {
			sum = sum + current.value;
		});
		data.totals[type] = sum;
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
		},
		budget: 0,
		percentage: -1
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

		deleteItem: function(type, id) {
			var ids, index;

			//.map is like forEach but it returns a new array. This goes thru each item in either exp/inc and returns every id in an array
			var ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			//This returns the specific index of the id in the parameter.
			index = ids.indexOf(id);

			//now delete this index of the id from the array. You check the index against -1 in case the item isn't found in the array. Remove it only if the index actually exists
			if (index !== -1) {
				//splice removes elements: splice (which index to start removing elements, how many to remove);
				data.allItems[type].splice(index, 1)
			}
		},

		calculateBudget: function() {
			//calc total income + expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calc budget: inc - expense
			data.budget = data.totals.inc - data.totals.exp;

			//calc the % of income that we spent
			if (data.totals.inc > 0) {
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
			data.percentage = -1;
			};
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
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
		incomeContainer: '.income__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'

	};


	return {
		//receive inputted values from +/-, add desc, and value fields. 
		getInput: function(){
			//the reason we put all 3 in the getInput object, is because we want to return all 3 together
			return {
				type: document.querySelector(DOMstrings.inputType).value,
			    description: document.querySelector(DOMstrings.inputDescription).value,
			    //parseFloat converts string numbers to an float integer
			    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
		   };
		},

		//add each new item into the HTML/UI
		addListItem: function(obj, type) {
			var html, newHTML, element;

			//Create HTML string with placeholder text

			if (type === 'inc') {
			element = DOMstrings.incomeContainer;

             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              } 

              else if (type === 'exp') {
              element = DOMstrings.expensesContainer;

             html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
		
		if (obj.percentage > 0) {
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
		} else {
			document.querySelector(DOMstrings.percentageLabel).textContent = '---';
		};


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


		//Event delegation: we found that .container is the parent element that covers both all income and expense classes
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        };




	var updateBudget = function(){

		//5 calc the budget
		budgetCtrl.calculateBudget();

		//6 return the budget
      	var budget = budgetCtrl.getBudget();

		// 7 display the budget
		UICtrl.displayBudget(budget);

	};

	//we are creating this as part of DRY principle so we can write our code once, but use it in .add__btn and keypress fucntion
	var ctrlAddItem = function() {

		var input, newItem;
		// 1 get field input data
		input = UICtrl.getInput();

		//** test 2-4 to see if the user input any data into the fields. If not, then alert that the fields can't be empty
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

				//2 add the item to the budget controller
				newItem = budgetCtrl.addItem(input.type, input.description, input.value);

				//3 add the new item to the UI
				UICtrl.addListItem(newItem, input.type);

				//4 clear the fields
				UICtrl.clearFields();

				// calc and update the budget
				updateBudget();
		} else {
			alert('You must provide a description and a numerical value over 0')
		}
	};

//Event delegation - event.target takes the target html of the event. The 4 .parentNodes takes the parent of that element, 4 nothces up so we can delegate it. This is called traversing
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		//split the type ID: "inc-1"
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1 delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			//2 delete the item from the UI

			//3 update and show the new budget
		}
	};


	//public init function to publicize the setupEventListener private function. You need to return it in an object to make it public.
		return {
			init: function() {
				console.log('Application has started');
				UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
				});
				setupEventListeners();
			}
		};

}) (budgetController, UIController);

//we invoke it on the outside of the private function
controller.init();