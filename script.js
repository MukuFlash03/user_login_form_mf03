// https://www.javascripttutorial.net/javascript-dom/javascript-form-validation/
// https://www.javascripttutorial.net/javascript-dom/javascript-debounce/
// https://www.javascripttutorial.net/javascript-dom/javascript-event-delegation/

/*
Before validating the form, you can develop 
some reusable utility functions to check if:

-> A field is required.
-> The length of a field is between min and max.
-> The email is in a valid format.
-> The password is strong.
*/


const usernameEl = document.querySelector('#username');
const emailEl = document.querySelector('#email');
const passwordEl = document.querySelector('#password');
const confirmPasswordEl = document.querySelector('#confirm-password');

const form = document.querySelector('#signup');

// Functions to check input data validity

const checkUsername = ( () => {

    let valid = false;
    const min = 3, max = 25;
    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, 'Username cannot be blank.');
    }
    else if (!isBetweenLen(username.length, min, max)) {
        showError(usernameEl, `Username must be between ${min} and ${max} characters`);
    }
    else {
        showSuccess(usernameEl);
        valid = true;
    }

    return valid;
});


const checkEmail = ( () => {
    
    let valid = false;
    const email = emailEl.value.trim();

    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    }
    else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.');
    }
    else {
        showSuccess(emailEl);
        valid = true;
    }

    return valid;
});


const checkPassword = ( () => {
    
    let valid = false;
    const password = passwordEl.value.trim();

    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    }
    else if (!isPasswordSecure(password)) {
        showError(passwordEl, 'Password must have at least 8 characters that include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character (!@#$%^&*)');
    }
    else {
        showSuccess(passwordEl);
        valid = true;
    }

    return valid;
});


const checkConfirmPassword = ( () => {
    
    let valid = false;
    const confirmPassword = confirmPasswordEl.value.trim();
    const password = passwordEl.value.trim();

    if (!isRequired(confirmPassword)) {
        showError(confirmPasswordEl, 'Please enter the password again.');
    } 
    else if (password !== confirmPassword) {
        showError(confirmPasswordEl, 'Confirm password does not match.');
    } 
    else {
        showSuccess(confirmPasswordEl);
        valid = true;
    }

    return valid;
});

// check email validity using regex
const isEmailValid = ( (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
});


// check password strength with regex
/*
^	                The password starts
(?=.*[a-z])	        The password must contain at least one lowercase character
(?=.*[A-Z])	        The password must contain at least one uppercase character
(?=.*[0-9])	        The pasword must contain at least one number
(?=.*[!@#$%^&*])	The password must contain at least one special character.
(?=.{8,})	        The password must be eight characters or longer

*/

const isPasswordSecure = ( (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
});

// returns false if the input argument is empty
const isRequired = ( (value) => {
    return value === '' ? false : true;
});

// If using arrow function with {}, need to return value else not needed
// I hadn't returned the value earlier and hence the error in detecting valid username, email entries.
//const isRequired = value => value === '' ? false : true;
//const isBetween = (length, min, max) => length < min || length > max ? false : true;

// returns false if the length argument is not between the min and max argument:
const isBetweenLen = ( (length, min, max) => {
    return (length < min || length > max) ? false : true;
});

// highlights the border of the input field and displays 
// an error message if the input field is invalid:

const showError = (input, message) => {
    // get the form-field element's parent which is the div element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element's parent which is the div element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}


form.addEventListener('submit', (e) => {
    
    // prevent the form from submitting
    e.preventDefault();

    // validate forms
    let isUsernameValid = checkUsername(),
        isEmailValid = checkEmail(),
        isPasswordValid = checkPassword(),
        isConfirmPasswordValid = checkConfirmPassword();

    let isFormValid = isUsernameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        // Normal browser popup alert
       // alert('Registration successful!');

        // Sweet Alert popup message added on valid registration.
        swal("Welcome Aboard!", "You have registered successfully!", "success");
    }
    else {
        // Normal browser popup alert
        // alert('Invalid details! Please try again.');

        // Sweet Alert popup message added on invalid registration.
        swal("Oops!", "Invalid registration details. Please try again.", "error");
    }
});

const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'username':
            checkUsername();
            break;
        case 'email':
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;
        case 'confirm-password':
            checkConfirmPassword();
            break;
    }
}));