const DEBOUNCE_DELAY = 300;
const INTEREST_RATE = 2.2;

// Notification settings
export const notiflixOptions = {
	width: '340px',
	fontFamily: 'Montserrat',
	fontSize: '16px',
	position: 'right-top',
	timeout: 2000,
	cssAnimationStyle: 'from-right',
};

// Links to items
const refs = {
	form: document.querySelector('.form'),
	creditAmountInput: document.getElementById('creditAmount'),
	daysAmountInput: document.getElementById('daysAmount'),
	dailyRepaymentOutput: document.getElementById('dailyRepayment'),
	totalRepaymentOutput: document.getElementById('totalRepayment'),
	errorCreditMessage: document.getElementById('credit-error'),
	errorDaysMessage: document.getElementById('days-error'),
};

refs.form.lastElementChild.disabled = true;

refs.form.addEventListener('input', _.debounce(creditCalculation, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSubmitBtnClick);

function creditCalculation() {
	const credit = Number(refs.creditAmountInput.value);
	const days = Number(refs.daysAmountInput.value);

	const isCreditValid = validateCreditInput(credit);
	const isDaysValid = validateDaysInput(days);

	if (!isCreditValid || !isDaysValid) {
		refs.dailyRepaymentOutput.value = '';
		refs.totalRepaymentOutput.value = '';
		refs.form.lastElementChild.disabled = true;

		return;
	}

	const dailyRepayment = (credit + credit * (INTEREST_RATE / 100) * days) / days;
	const totalRepayment = dailyRepayment * days;

	refs.form.lastElementChild.disabled = false;
	refs.dailyRepaymentOutput.value = dailyRepayment.toFixed(2);
	refs.totalRepaymentOutput.value = totalRepayment.toFixed(2);
}

function validateCreditInput(credit) {
	if (!credit || credit === 0) {
		refs.creditAmountInput.previousElementSibling.value = 1000;
		refs.errorCreditMessage.textContent = 'Введіть суму кредиту.';

		return false;
	} else if (credit < 1000 || credit > 50000) {
		refs.creditAmountInput.previousElementSibling.value = 1000;
		refs.errorCreditMessage.textContent =
			'Сума кредиту має бути в межах від 1 000 грн до 50 000 грн.';

		return false;
	}

	refs.errorCreditMessage.textContent = '';
	return true;
}

function validateDaysInput(days) {
	if (!days || days === 0) {
		refs.daysAmountInput.previousElementSibling.value = 7;
		refs.errorDaysMessage.textContent = 'Введіть період погашення.';

		return false;
	} else if (days < 7 || days > 60) {
		refs.daysAmountInput.previousElementSibling.value = 7;
		refs.errorDaysMessage.textContent = 'Період погашення має бути в межах від 7 до 60 днів.';

		return false;
	}

	refs.errorDaysMessage.textContent = '';
	return true;
}

function onSubmitBtnClick(e) {
	e.preventDefault();

	Notiflix.Notify.Success('Запит на оформлення кредиту відправлено.', notiflixOptions);

	refs.form.lastElementChild.disabled = true;

	this.reset();
}
