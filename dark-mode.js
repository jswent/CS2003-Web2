"use strict";

function darkMode() {
  let element = document.body;
  element.className = "dark-mode";
  persistTheme("dark");
}

function lightMode() {
  let element = document.body;
  element.className = "light-mode";
  persistTheme("light");
}

function systemMode() {
  let element = document.body;
  element.className = "";
}

function persistTheme(theme) {
  localStorage.setItem("theme", theme);
}

function checkPersistentTheme() {
  let curr_theme = localStorage.getItem("theme");
  curr_theme && console.log("Persistent theme detected: " + curr_theme);
  if (curr_theme == "dark") {
    darkMode();
  }
  else if (curr_theme == "light") {
    lightMode();
  }
}

function toggleTheme() {
  let body = document.body;
  let body_class = body.className;

  if (body_class == "light-mode") {
    darkMode();
  }
  else if (body_class == "dark-mode") {
    lightMode();
  }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    lightMode();
  }
  else {
    darkMode();
  }
}

checkPersistentTheme();
