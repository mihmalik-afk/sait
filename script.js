document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('#site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navToggle.setAttribute('aria-label', expanded ? 'Открыть меню' : 'Закрыть меню');
            siteNav.classList.toggle('open');
        });

        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Открыть меню');
                siteNav.classList.remove('open');
            });
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productionCards = document.querySelectorAll('[data-list="productions"] .production-card');

    const applyFilter = (category) => {
        productionCards.forEach((card) => {
            const match = category === 'all' || card.dataset.category === category;
            card.hidden = !match;
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.filter || 'all';
            applyFilter(category);
        });
    });

    const modal = document.getElementById('details-modal');
    const modalTitle = modal?.querySelector('#modal-title');
    const modalDescription = modal?.querySelector('.modal-description');
    const modalTeam = modal?.querySelector('.modal-team');
    const modalDuration = modal?.querySelector('.modal-duration');
    const closeButtons = modal?.querySelectorAll('[data-dismiss="modal"]');
    let activeTrigger = null;

    const openModal = (trigger) => {
        if (!modal || !modalTitle || !modalDescription || !modalTeam || !modalDuration) return;
        activeTrigger = trigger;

        modalTitle.textContent = trigger.dataset.title || 'Спектакль AmmA Production';

        modalDescription.textContent = trigger.dataset.description || '';
        modalTeam.textContent = trigger.dataset.team ? `Творческая команда: ${trigger.dataset.team}` : '';
        modalDuration.textContent = trigger.dataset.duration ? `Продолжительность: ${trigger.dataset.duration}` : '';
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const focusable = modal.querySelector('.modal-close');
        if (focusable) {
            focusable.focus();
        }
    };

    const closeModal = () => {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.removeProperty('overflow');
        if (activeTrigger) {
            activeTrigger.focus();
            activeTrigger = null;
        }
    };

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.matches('.details-btn')) {
            openModal(target);
        }

        if (target.dataset.dismiss === 'modal') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && !modal.hidden) {
            closeModal();
        }
    });

    closeButtons?.forEach((btn) => {
        btn.addEventListener('click', closeModal);
    });

    const contactForm = document.querySelector('.contact-form form, .contact-form');
    if (contactForm instanceof HTMLFormElement) {
        const note = contactForm.querySelector('.form-note');
        const success = document.createElement('p');
        success.className = 'form-success';
        success.textContent = 'Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.';
        success.hidden = true;
        if (note) {
            note.insertAdjacentElement('beforebegin', success);
        } else {
            contactForm.append(success);
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            contactForm.reset();
            success.hidden = false;
            if (typeof success.focus === 'function') {
                success.focus();
            }
            window.setTimeout(() => {
                success.hidden = true;
            }, 6000);
        });
    }
});
