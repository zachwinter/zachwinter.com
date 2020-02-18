const i = document.querySelector('i:last-of-type')
const ul = document.querySelector('ul')

i.addEventListener('animationend', () => {
  ul.classList.add('visible')
})