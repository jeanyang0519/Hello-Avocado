import './css/home.scss'
import '../lib/volume'

const button = document.getElementById('clickme')
button.onclick = handdleClick;

function handdleClick() {
    remove()
    update(button.dataset.California)
} 

const button2 = document.getElementById('clickme-2')
// button2.onclick = handdleClick2;
// debugger
// function handdleClick2() {
//     // debugger
//     remove()
//     update(button2.dataset.Chile)

button2.addEventListener('click', () => update('Chile'))
// }

