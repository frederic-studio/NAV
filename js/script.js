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










const inputColor = document.getElementById('color');
const textColor = document.getElementById('textColor');
const luminosityInput = document.getElementById('numberColor');
let percentSpan;

let currentHSL = [0, 100, 50];

// Regex pour validation
const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/;
const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

function validateAndProcessColor(input) {
    input = input.trim();

    if (hexRegex.test(input)) {
        currentHSL = hexToHsl(input);
        return ensureHexPrefix(input);
    } else if (rgbRegex.test(input)) {
        currentHSL = rgbToHsl(input);
        return ensureHexPrefix(rgbToHex(input));
    } else if (rgbaRegex.test(input)) {
        currentHSL = rgbToHsl(input);
        return ensureHexPrefix(rgbaToHex(input));
    } else if (hslRegex.test(input)) {
        currentHSL = extractHSL(input);
        return ensureHexPrefix(hslToHex(input));
    } else {
        return null;
    }
}

function ensureHexPrefix(hex) {
    return hex.charAt(0) !== '#' ? '#' + hex : hex;
}

function updateColorInputs(hexColor) {
    inputColor.value = hexColor;
    textColor.value = hexColor;
    updateLuminosityInput();
}

function updateLuminosityInput() {
    luminosityInput.value = currentHSL[2];
    if (percentSpan) {
        percentSpan.textContent = '%';
    }
}

textColor.addEventListener('input', (event) => {
    const value = event.target.value;
    const processedColor = validateAndProcessColor(value);
    
    if (processedColor) {
        updateColorInputs(processedColor);
    } else {
        console.log("Invalid color format");
    }
});

luminosityInput.addEventListener('input', (event) => {
    const luminosity = event.target.value;
    currentHSL[2] = parseInt(luminosity);

    const hslString = `hsl(${currentHSL[0]}, ${currentHSL[1]}%, ${currentHSL[2]}%)`;
    const hexColor = ensureHexPrefix(hslToHex(hslString));

    updateColorInputs(hexColor);
});

inputColor.addEventListener('input', (event) => {
    const hexColor = ensureHexPrefix(event.target.value);
    currentHSL = hexToHsl(hexColor);
    updateColorInputs(hexColor);
});

// Conversion functions
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbaToHex(rgba) {
    const [r, g, b] = rgba.match(/\d+/g).map(Number);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb);
}

function rgbToHsl(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const rRatio = r / 255, gRatio = g / 255, bRatio = b / 255;

    const max = Math.max(rRatio, gRatio, bRatio);
    const min = Math.min(rRatio, gRatio, bRatio);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rRatio: h = (gRatio - bRatio) / d + (gRatio < bRatio ? 6 : 0); break;
            case gRatio: h = (bRatio - rRatio) / d + 2; break;
            case bRatio: h = (rRatio - gRatio) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(hsl) {
    const [h, s, l] = hsl.match(/\d+/g).map(Number);
    const hDecimal = h / 360;
    const sDecimal = s / 100;
    const lDecimal = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = lDecimal; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
        const p = 2 * lDecimal - q;
        r = hue2rgb(p, q, hDecimal + 1/3);
        g = hue2rgb(p, q, hDecimal);
        b = hue2rgb(p, q, hDecimal - 1/3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractHSL(hsl) {
    return hsl.match(/\d+/g).map(Number);
}

// Function to update all UI elements
function updateAllInputs(hexColor) {
    currentHSL = hexToHsl(hexColor);
    updateColorInputs(ensureHexPrefix(hexColor));
}

// Initialize UI on page load
window.addEventListener('load', () => {
    const initialColor = ensureHexPrefix(inputColor.value);
    updateAllInputs(initialColor);
    
    // Add % sign next to luminosity input
    percentSpan = document.createElement('span');
    percentSpan.textContent = '%';
    luminosityInput.parentNode.insertBefore(percentSpan, luminosityInput.nextSibling);
});