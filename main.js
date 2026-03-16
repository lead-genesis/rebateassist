/* ======================================================
   ENERGYSELECT — Interactions & Animations V2
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- SCROLL ANIMATIONS ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('is-visible'), parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // ---- NAV ----
    const nav = document.getElementById('nav');
    const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- MOBILE NAV ----
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('is-open');
            const spans = burger.querySelectorAll('span');
            spans[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
            spans[1].style.opacity = open ? '0' : '';
            spans[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }));
    }

    // ---- HERO COUNTER ----
    const counterEl = document.getElementById('savingsCounter');
    const savingsBar = document.getElementById('savingsBar');
    if (counterEl) {
        let done = false;
        new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !done) {
                done = true;
                animateValue(counterEl, 0, 2847, 1800);
                if (savingsBar) setTimeout(() => savingsBar.style.width = '78%', 300);
            }
        }, { threshold: 0.3 }).observe(counterEl);
    }

    // ---- STAT COUNTERS ----
    document.querySelectorAll('[data-count]').forEach(el => {
        new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                animateValue(el, 0, parseInt(el.dataset.count), 2000);
                e.target._obs.unobserve(el);
            }
        }, { threshold: 0.3 }).observe(el);
        el._obs = el._obs; // store ref
    });

    // shared counter animation
    function animateValue(el, start, end, duration) {
        let t0 = null;
        (function step(ts) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * (end - start) + start).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
        })(performance.now());
    }

    // fix observer ref for stat counters
    document.querySelectorAll('[data-count]').forEach(el => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                animateValue(el, 0, parseInt(el.dataset.count), 2000);
                obs.unobserve(el);
            }
        }, { threshold: 0.3 });
        obs.observe(el);
    });

    // ---- FAQ ----
    document.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.parentElement.querySelector('.faq__answer');
            const open = btn.getAttribute('aria-expanded') === 'true';

            // close all
            document.querySelectorAll('.faq__question').forEach(b => {
                if (b !== btn) {
                    b.setAttribute('aria-expanded', 'false');
                    b.parentElement.querySelector('.faq__answer').style.maxHeight = '0';
                }
            });

            btn.setAttribute('aria-expanded', open ? 'false' : 'true');
            answer.style.maxHeight = open ? '0' : answer.scrollHeight + 'px';
        });
    });

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ---- FORM ----
    const form = document.getElementById('calculatorForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Calculating...';
            btn.disabled = true;
            btn.style.opacity = '.7';
            setTimeout(() => {
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Quote Request Sent!';
                btn.style.background = 'var(--green)';
                setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.opacity = ''; btn.style.background = ''; form.reset(); }, 2500);
            }, 1800);
        });
    }

    // spinner
    const s = document.createElement('style');
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}';
    document.head.appendChild(s);
});
