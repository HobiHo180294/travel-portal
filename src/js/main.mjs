import '@scss/style.scss';
import classToggler from './class-toggler.mjs';
// import {forwardSlide} from './sia/slider.js';

// Burger Elems
const burgerMenu = document.querySelector('.burger');
const navMenu = document.querySelector('.menu');
const closeMenu = document.querySelector('.menu__close');
const navMenuLinks = document.querySelectorAll('.menu__link');
// Burger Elems

// Burger Handler
document.addEventListener('click', (e) => {
  const withinMenu = e.composedPath().includes(navMenu);
  const withinBurger = e.composedPath().includes(burgerMenu);

  if (navMenu.classList.contains('_active') && !withinMenu && !withinBurger) {
    navMenu.classList.remove('_active');
    document.body.classList.remove('_lock-body');
  }
});

burgerMenu.addEventListener('click', (e) => {
  navMenu.classList.add('_active');
  document.body.classList.add('_lock-body');
});

closeMenu.addEventListener('click', (e) => {
  navMenu.classList.remove('_active');
  document.body.classList.remove('_lock-body');
});
// Burger Handler

// Closing burger menu by clicking on the links
navMenuLinks.forEach((link) =>
  link.addEventListener('click', (e) => {
    navMenu.classList.remove('_active');
    document.body.classList.remove('_lock-body');
  })
);
// Closing burger menu by clicking on the links
