'use strict';

function scrollToGameSection(level) {
  var gameSection = document.querySelector('.levels');
  gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log('Selected level:', level);
}
