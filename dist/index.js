document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.home_navbar');
    if (!navbar)
        return;
    const lastScore = localStorage.getItem('lastScore') || '0';
    navbar.textContent = `Playzzz QUIZ APPLICATION | Last Score: ${lastScore}`;
});
export {};
//# sourceMappingURL=index.js.map