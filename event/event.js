const contents = document.querySelector('.contents');
const button = document.querySelector('#incrementButton');
const num = document.querySelector('h3 span#count');
const image = document.createElement('img');
const newText = document.createElement('h4');

newText.innerText = 'Selamat! anda menemukan hadiah tersembunyi!';
image.src = './Spartan.jpeg';
image.style.width = '200px';

// let x = 0;

window.addEventListener('load', (e) => {
    contents.removeAttribute('hidden');
});

button.addEventListener('click', async (e) => {
    // x += 1;
    num.innerText++;

    if(num.innerText == 7) {
        await contents.appendChild(newText);
        await setTimeout(() => {
            contents.appendChild(image);
        }, 500);
    }
    // if(x === 7) {
    //     await contents.appendChild(newText);
    //     await setTimeout(() => {
    //         contents.appendChild(image);
    //     }, 500);
    // }
})