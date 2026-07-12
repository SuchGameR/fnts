const toggle = document.getElementById('theme-toggle');
const toggleIcon = document.querySelector('.theme-area label i');

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
toggle.checked = savedTheme === 'dark';
toggleIcon.className = savedTheme === 'dark' ? 'bx bxs-sun' : 'bx bxs-moon';

toggle.addEventListener("change", function () {
    const theme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleIcon.className = this.checked ? 'bx bxs-sun' : 'bx bxs-moon';
});
