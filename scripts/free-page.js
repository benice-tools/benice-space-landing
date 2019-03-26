// swith page when requested uri = /#section-N

document.addEventListener("DOMContentLoaded", function() {
	const pageNumberFromUriRaw = window.location.hash.match(/^#section-(\d+)$/);
	if (pageNumberFromUriRaw && typeof pageNumberFromUriRaw[1] !== 'undefined') {
		const pageNumberFromUri = pageNumberFromUriRaw[1] - 1;
		selectActivePage(pageNumberFromUri);
	}
});


// switch page on scroll

const screenSlider = new fullpage('#fullpage', {
	onLeave: (origin, destination, direction) => {
		const scrolledToPageNumber = destination.index;
		selectActivePage(scrolledToPageNumber, screenSlider);
	}
});


// switch page on pager/menu link click

const anchorsOnPages = document.querySelectorAll('a[href*="#section-"]');
anchorsOnPages.forEach((anchor) => {
	anchor.addEventListener('click', () => {
		const newPageNumber = anchor.getAttribute('href').match(/\d+/g)[0]-1;
		selectActivePage(newPageNumber, pagerIndicator);
	});
});


// page switching mechanic

let currentPage = null;

const selectActivePage = (number, initiator) => {
	if (number == currentPage) return;
	currentPage = number;
	
	// move content
	if (initiator !== screenSlider) {
		screenSlider.moveTo(number + 1);
	}
	
	// move plantes
	if (setPlanetsLevel) {
		setPlanetsLevel(number);
	}
	
	// indicate on bottom circles
	pagerIndicator.indicateActivePage(number);
	
	// move sky closer/further
	sky.setDepth(number);
	
	// activate link in menu
	document.querySelectorAll('#menu-container a[href*="#section-"]').forEach((link) => {
		link.classList.remove('active');
	});
	document.querySelector(`#menu-container a[href*="#section-${number + 1}"]`).classList.add('active');
}


const pagerIndicator = {
	element: document.getElementById('pager'),
	indicateActivePage: (pageNumber) => {
		const pageElements = document.querySelectorAll('#pager li');
		for (let i = 0; i < pageElements.length; i++) {
			const li = pageElements[i];
			if (i == pageNumber) {
				li.classList.add('active');
			} else {
				li.classList.remove('active');
			}
		}
	}
};

const sky = {
	element: document.getElementById('far-layer'),
	setDepth: (number) => {
		const scaleFactor = 1 + number * 0.025;
		sky.element.style.transform = `scale(${scaleFactor})`;
	}
}





// watch video (run video player)

document.querySelectorAll('*[data-js="toggle-video"]').forEach(el => {
		el.addEventListener('click', () => {
		const videoscreen = document.getElementById('video-screen');
		videoscreen.classList.toggle('hide');
		document.getElementById('video').play();
	});
});