const langs = [
	'en',
	'ru'
];

const getDefaultLanguage = () => {
	return langs[0];
}

const langTitles = {
	'en': 'ENG',
	'ru': 'RUS',
};


const setLanguage = (lang) => {
	
	if (langs.indexOf(lang) == -1) {
		const defaultLanguage = getDefaultLanguage();
		console.warn(`Tryed to set unknown language "${lang}", used default "${defaultLanguage}"`);
		lang = defaultLanguage;
	}
	
	document.querySelectorAll('*[data-lang]').forEach(el => el.style.display = 'none');
	document.querySelectorAll(`*[data-lang="${lang}"]`).forEach(el => el.style.display = '');

	document.querySelectorAll('*[data-langswitch]').forEach(el => el.classList.remove('active'));
	document.querySelectorAll(`*[data-langswitch="${lang}"]`).forEach(el => el.classList.add('active'));
	
	const langTitle = langTitles[lang] ? langTitles[lang] : lang;
	document.querySelectorAll('.current-lang').forEach(el => el.innerHTML = langTitle);
};

const getPreviouslySelectedLanguage = () => {
	return Cookies.get('selected-language');
};

const getUrlForcedLanguage = () => {
	const url = new URL(location.href);
	const urlForcedLanguage = url.searchParams.get('lang');
	return urlForcedLanguage;
};



const selectLanguage = (lang) => {
	Cookies.set('selected-language', lang);
	setLanguage(lang);
};

document.addEventListener('DOMContentLoaded', () => {
	
	const selectedLanguage = getPreviouslySelectedLanguage();
	const urlForcedLanguage = getUrlForcedLanguage();
	
	if (selectedLanguage) {
		setLanguage(selectedLanguage);
	} else if (urlForcedLanguage) {
		selectLanguage(urlForcedLanguage);
	} else {
		setLanguage(getDefaultLanguage());
	}
	
	
	// clicks on lang title
	
	document.querySelectorAll('*[data-langswitch]').forEach(el => {
		el.addEventListener('click', () => {
			const lang = el.getAttribute('data-langswitch');
			selectLanguage(lang);
		});
	});
	
});