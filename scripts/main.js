// show and hide menu

const menuTogglingElements = [];

const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const menuLinks = document.querySelectorAll('.menu a');

const toggleMenuOpenness = () => {
	document.body.classList.toggle('menu-opened');
}

menuButton.addEventListener('click', toggleMenuOpenness);
closeMenuButton.addEventListener('click', toggleMenuOpenness);
menuLinks.forEach((menuLink) => {
	menuLink.addEventListener('click', toggleMenuOpenness);
});


// fix mobile-browsers bugs: 100vh is not equal 100%-of-viewport

const fixVhUnits = () => {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', () => {
	fixVhUnits();
});
document.addEventListener('DOMContentLoaded', () => {
	fixVhUnits();
});


// show more

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('*[data-showmore="area"]').forEach(area => {
		const trigger = area.querySelector('*[data-showmore="trigger"]');
		const content = area.querySelector('*[data-showmore="content"]');
		if (trigger && content) {
			trigger.addEventListener('click', () => {
				trigger.style.display = 'none';
				content.classList.add('showed');
			});
		}
	});
});


// Telegram resources

const linkPrefix = '#go-tg-';

const tgResources = {
	'assistant': 'Benice_tools_bot',
	'support-channel': 'Benice_supp',
	'news-channel': 'Benice_tool',
};


// clicks on links

document.querySelectorAll('a[href^="' + linkPrefix + '"]').forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const href = link.getAttribute('href');
		const targetTgResource = href.substring(href.indexOf(linkPrefix) + linkPrefix.length);
		goTgResource(targetTgResource);
	});
});


// soft redirects by url params

document.addEventListener('DOMContentLoaded', () => {
	var url = new URL(location.href);
	var targetTgResource = url.searchParams.get('go-tg');
	if (targetTgResource) {
		document.querySelectorAll('a[href="' + linkPrefix + targetTgResource + '"]').forEach(link => link.classList.add('active'));
		goTgResource(targetTgResource);
	}
});


const goTgResource = (resourceName) => {
	
	let tgName;
	if (tgResources[resourceName]) {
		tgName = tgResources[resourceName];
	} else {
		tgName = resourceName;
	}
	
	if (tgName) {
		var protoUrl = "tg:\/\/resolve?domain=" + tgName;
		setTimeout(function() {
			window.location = protoUrl;
		}, 100);
	}
};


// analytics

document.querySelectorAll('*[data-goal]').forEach(node => {
	node.addEventListener('click', () => {
		const goalName = node.getAttribute('data-goal');
		yaCounter50524375.reachGoal(goalName);
	});
});