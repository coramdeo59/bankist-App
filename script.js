'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Melkamu Elias',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Besufkad Ayele',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Niftalem Mule',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Clinton Beyene ',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////
///////////////////////////////////////////////
// LECTURES;

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMoveme nt(account1.movements);
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.defaultPrevented;
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// calcDisplayBalance(account2.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (acc) {
  acc.forEach(
    user =>
      (user.userName = user.owner
        .toLocaleLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
// const user = 'Steven Thomas Williams';

createUserName(accounts);
// console.log(accounts);

// console.log(
//   movements.reduce(function (mov, acc) {
//     return acc + mov;
//   })
// );
// const DATA = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = function (age) {
//   const humanAge = age.map(function (age) {
//     if (age <= 2) {
//       return (age = 2 * age);
//     } else {
//       return (age = 16 + age * 4);
//     }
//   });
//   const adults = humanAge.filter(value => value >= 18);
//   const DogAVG = adults.reduce((acc, curr) => acc + curr, 0) / adults.length;
//   console.log(DogAVG);
// };
// const value = calcAverageHumanAge(DATA);
// console.log(value);
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('Login');
    labelWelcome.textContent = `welcome back! ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }

  //Display balance
  updateUI(currentAccount);
  //Diplay movements
});
const updateUI = function (acc) {
  displayMovement(acc.movements);

  // Display summary
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(acc => acc >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    // console.log('working');
  }
  inputLoanAmount.value = '';
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(btnTransfer);

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    amount >= 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    console.log(receiverAcc, amount);
    // currentAccount.movements.push(amount);
    // console.log('transfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = '';
  }
  //
  updateUI(currentAccount);
});
// console.log(account1.movements);
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // const userAccount = accounts.find(
  //   acc => acc.userName === inputLoginUsername.value
  // );
  // const userPin = accounts.find(acc => acc.userName === inputClosePin.value);
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    inputCloseUsername.value = inputClosePin.value = '';
    // console.log(index);
    accounts.splice(index, 1);
  }
  containerApp.style.opacity = 0;
});
