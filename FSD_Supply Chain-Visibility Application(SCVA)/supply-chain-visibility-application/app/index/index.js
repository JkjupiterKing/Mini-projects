import { includeHeader } from "../header/header.js";
includeHeader('../header/header.html');

function scrollCards(direction, containerClass) {
    const container = document.querySelector(containerClass);
    const scrollAmount = 300; // Adjust as needed

    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

document.getElementById('btnLeftContainer1').addEventListener('click', function () { scrollCards('left', '.container-1') });
document.getElementById('btnRightContainer1').addEventListener('click', function () { scrollCards('right', '.container-1') });
document.getElementById('btnLeftContainer2').addEventListener('click', function () { scrollCards('left', '.container-2') });
document.getElementById('btnRightContainer2').addEventListener('click', function () { scrollCards('right', '.container-2') });