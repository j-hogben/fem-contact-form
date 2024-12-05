const contactForm = document.querySelector('#contactForm');
const successMessage = document.querySelector('#modal');

// SHOW MODAL FUNCTION
const showSuccessMessage = (successModal) => {
  successModal.classList.add('modal-active');
};

// REMOVE MODAL FUNCTION
const removeSuccessMessage = (successModal) => {
  successModal.classList.remove('modal-active');
};

// SELECT FIRST RADIO BUTTON WHEN TABBING TO RADIO GROUP
const radioGroups = Array.from(contactForm.querySelectorAll('.radio-group'));
radioGroups.forEach((radioGroup) => {
  const firstRadioButton = radioGroup.querySelector('input[type="radio"]');
  firstRadioButton.addEventListener('focus', () => {
    firstRadioButton.checked = true;
  });
});

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ FORM VALIDATION ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const validateForm = (formSelector) => {
  let errorTotal = 0;

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ VALIDATION OPTIONS FOR EACH INPUT/TEXTAREA
  const validationOptions = [
    {
      attribute: 'required',
      isValid: (input) => {
        if (input.type === 'checkbox') {
          return input.checked;
        } else if (input.type === 'radio') {
          const radioGroup = document.getElementsByName(input.name);
          return Array.from(radioGroup).some((radio) => radio.checked);
        } else {
          return input.value.trim() !== '';
        }
      },
      errorMessage: (input) => {
        if (input.name === 'contactConsent') {
          return 'To submit this form, please consent to being contacted';
        } else if (input.name === 'queryType') {
          return 'Please select a query type';
        } else {
          return 'This field is required';
        }
      },
    },
    {
      attribute: 'pattern',
      isValid: (input) => {
        const regex = new RegExp(input.pattern);
        return regex.test(input.value);
      },
      errorMessage: (input) => {
        return input.type === 'email'
          ? 'Please enter a valid email address'
          : 'Please enter a valid input';
      },
    },
  ];

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ FORM FUNCTIONS
  const validateSingleFormGroup = (formGroup) => {
    const label = formGroup.querySelector('label');
    const input = formGroup.querySelector('input, textarea');
    const errorContainer = formGroup.querySelector('.error-container');

    let formGroupError = false;

    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        formGroup.classList.add('error');
        errorContainer.textContent = option.errorMessage(input, label);
        formGroupError = true;
        errorTotal++;
      }
    }
    if (formGroupError === false) {
      formGroup.classList.remove('error');
      errorContainer.textContent = '';
    }
  };

  const validateAllFormGroups = (formToValidate) => {
    const formGroups = Array.from(formToValidate.querySelectorAll('.form-group'));

    formGroups.forEach((formGroup) => {
      validateSingleFormGroup(formGroup);
    });
  };

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ RUN VALIDATION
  validateAllFormGroups(formSelector);
  return errorTotal === 0;
};

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ EXECUTIONS ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
contactForm.setAttribute('novalidate', '');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm(contactForm)
    ? showSuccessMessage(successMessage)
    : removeSuccessMessage(successMessage);
});
