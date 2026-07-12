document.addEventListener('DOMContentLoaded', () => {
    const stage = document.querySelector('.showcase-stage');
    if (!stage) return;

    const cards = [...stage.querySelectorAll('.showcase-card')];

    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('is-visible');
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.15 });
    cards.forEach((c, i) => {
        c.style.transitionDelay = (i * 80) + 'ms';
        obs.observe(c);
    });
});
