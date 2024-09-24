const allNavigationButtons = document.querySelectorAll('button.keyboard-dropdown');
const allSubNavigationContainers = document.querySelectorAll('.subnavigation-container');
const allSubNavigationLinks = document.querySelectorAll('.subnavigation a');
const navigationLink = document.querySelector('ul.navigation li');
const header = document.querySelector('header');
const mediaQuery = window.matchMedia('(min-width: 800px)');
allSubNavigationLinks.forEach(link => link.setAttribute('tabindex', -1));

function displayNavigation(){
    header.classList.toggle('blur');
    const navigationLink = document.querySelectorAll('ul.navigation > li');
    staggerElements(navigationLink, 'staggered', 50)
}

function hideAllSubNav() {
    allNavigationButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    allSubNavigationLinks.forEach(link => link.setAttribute('tabindex', '-1'));
    allSubNavigationContainers.forEach(container => {
        container.classList.remove('show');
        container.setAttribute('aria-disabled', 'true');
    });
    
    // Sélectionner uniquement les éléments qui ont la classe 'staggered'
    const staggeredElements = document.querySelectorAll('.subnavigation li.staggered');
    staggerElements(staggeredElements, 'staggered', 50, 'remove');

    if (mediaQuery.matches) {
        header.classList.remove('blur');
    }
}

function displaySubNav(element) {

    hideAllSubNav();

    const subNavigationContainer = element.closest('li').querySelector('.subnavigation-container');

    if (subNavigationContainer) {
        const button = element.querySelector('.keyboard-dropdown') || element.nextElementSibling?.querySelector('.keyboard-dropdown');

        if (button) {
            button.setAttribute('aria-expanded', 'true');
        }

        subNavigationContainer.setAttribute('aria-disabled', 'false');
        const subNavLinks = subNavigationContainer.querySelectorAll('.subnavigation a');
        subNavLinks.forEach(link => {
            link.setAttribute('tabindex', '0')});
        subNavigationContainer.classList.add('show');

        // Cibler spécifiquement les éléments li dans ce sous-menu
        const elementsToStagger = subNavigationContainer.querySelectorAll('.subnavigation li');
        staggerElements(elementsToStagger, 'staggered', 50, 'add');

        if (mediaQuery.matches) {
            header.classList.add('blur');
        }
    }
}







function toggleSubNav(element) {
    const isExpanded = element.getAttribute('aria-expanded') === 'true';
    isExpanded ? hideAllSubNav() : displaySubNav(element.closest('li'));
}

window.addEventListener('scroll', () => {
    const openButton = document.querySelector('.keyboard-dropdown[aria-expanded="true"]');
    if (openButton) hideAllSubNav();
}, { passive: true });

document.addEventListener('mousemove', (event) => {
    const openButton = document.querySelector('.keyboard-dropdown[aria-expanded="true"]');
    if (openButton && isMouseOutsideNav(event)) hideAllSubNav();
});

function isMouseOutsideNav(event) {
    const navLevel02 = document.querySelector('.subnavigation-container');

    if (!navLevel02) return true; // Ensure elements exist

    const navLevel02Rect = navLevel02.getBoundingClientRect();

    return (
        event.clientY > navLevel02Rect.bottom // Below navLevel02
    );
}

function staggerElements(elements, className, delay, method) {
    const elementsArray = Array.from(elements);
    elementsArray.forEach((element, index) => {
        setTimeout(() => {
            if (element) {
                if (method === 'remove') {
                    element.classList.remove(className);
                } else if (method === 'add') {
                    element.classList.add(className);
                } else {
                    element.classList.toggle(className);
                }
            }
        }, index * delay);
    });
}

function findNextFocusableElementOutsideNav() {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex="0"]');
    
    for (const element of focusableElements) {
      if (!element.closest('nav')) {
        element.focus();
        break;
      }
    }
  }
  