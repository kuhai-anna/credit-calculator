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
};

refs.form.lastElementChild.disabled = true;

refs.form.addEventListener('input', _.debounce(creditCalculation, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSubmitBtnClick);

function creditCalculation(e) {
	const credit = Number(refs.creditAmountInput.value);
	const days = Number(refs.daysAmountInput.value);
	let dailyRepayment;
	let totalRepayment;

	if (credit === 0 || credit < 1000 || credit > 50000) {
		refs.creditAmountInput.previousElementSibling.value = 1000;
		refs.dailyRepaymentOutput.value = '';
		refs.totalRepaymentOutput.value = '';
		refs.form.lastElementChild.disabled = true;

		Notiflix.Notify.Failure(
			'Сума кредиту має бути в межах від 1 000 грн до 50 000 грн.',
			notiflixOptions
		);
	} else if (days === 0 || days < 7 || days > 60) {
		refs.daysAmountInput.previousElementSibling.value = 7;
		refs.dailyRepaymentOutput.value = '';
		refs.totalRepaymentOutput.value = '';
		refs.form.lastElementChild.disabled = true;

		Notiflix.Notify.Failure('Період погашення має бути в межах від 7 до 60 днів.', notiflixOptions);
	} else {
		dailyRepayment = (credit + credit * (INTEREST_RATE / 100) * days) / days;
		totalRepayment = dailyRepayment * days;

		refs.form.lastElementChild.disabled = false;
		refs.dailyRepaymentOutput.value = dailyRepayment.toFixed(2);
		refs.totalRepaymentOutput.value = totalRepayment.toFixed(2);
	}
}

function onSubmitBtnClick(e) {
	e.preventDefault();

	Notiflix.Notify.Success('Запит на оформлення кредиту відправлено.', notiflixOptions);

	refs.form.lastElementChild.disabled = true;

	this.reset();
}
