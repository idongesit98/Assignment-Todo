const loginBtn = document.getElementById('login-btn')
const modal = document.getElementById('login-modal')
const closeModal = document.getElementById('close-modal');

loginBtn.addEventListener('click', () => {
    modal.style.display = 'flex'
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
});

window.addEventListener('click',(e) => {
    if(e.target === modal){
        modal.style.display = 'none';
    }
})