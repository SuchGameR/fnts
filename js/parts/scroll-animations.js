document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const updateHeader = () => {
        if (!header || !hero) return;
        header.classList.toggle('is-expanded', window.scrollY > hero.offsetHeight * .72);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

    const motionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            motionObserver.unobserve(entry.target);
        });
    }, { threshold: 0.45 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => motionObserver.observe(el));
});
