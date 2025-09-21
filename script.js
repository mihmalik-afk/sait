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

    const productionCards = document.querySelectorAll('[data-list="productions"] .card');

    const applyFilter = (category) => {
        productionCards.forEach((card) => {
            const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
            const match = category === 'all' || categories.includes(category);
            card.toggleAttribute('hidden', !match);

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


    applyFilter('all');

    const modal = document.getElementById('details-modal');
    const modalTitle = modal?.querySelector('#modal-title');
    const modalDescription = modal?.querySelector('#modal-description');
    const modalTeam = modal?.querySelector('#modal-team');
    const modalDuration = modal?.querySelector('#modal-duration');
    const dismissors = modal?.querySelectorAll('[data-dismiss="modal"]');

    let activeTrigger = null;

    const openModal = (trigger) => {
        if (!modal || !modalTitle || !modalDescription || !modalTeam || !modalDuration) return;
        activeTrigger = trigger;

        modalTitle.textContent = trigger.dataset.title || 'Спектакль AmmA Production';
        modalDescription.textContent = trigger.dataset.description || '';
        modalTeam.textContent = trigger.dataset.team || '';
        modalDuration.textContent = trigger.dataset.duration || '';
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();

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
            event.preventDefault();

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


    dismissors?.forEach((element) => {
        element.addEventListener('click', closeModal);
    });

    const contactForm = document.getElementById('contact-form');
    const confirmation = document.getElementById('form-confirmation');

    if (contactForm instanceof HTMLFormElement && confirmation) {
        const nameField = contactForm.querySelector('#name');
        const emailField = contactForm.querySelector('#email');
        const messageField = contactForm.querySelector('#message');
        const nameError = contactForm.querySelector('#name-error');
        const emailError = contactForm.querySelector('#email-error');
        const messageError = contactForm.querySelector('#message-error');

        const setError = (field, errorNode, message) => {
            if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !(errorNode instanceof HTMLElement)) {
                return true;
            }

            if (message) {
                errorNode.textContent = message;
                field.setAttribute('aria-invalid', 'true');
                return false;
            }

            errorNode.textContent = '';
            field.removeAttribute('aria-invalid');
            return true;
        };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        const validateFields = () => {
            let isValid = true;
            isValid = setError(nameField, nameError, nameField && nameField.value.trim() ? '' : 'Укажите имя.') && isValid;

            if (emailField instanceof HTMLInputElement) {
                const value = emailField.value.trim();
                const message = value && emailPattern.test(value) ? '' : 'Введите корректный email.';
                isValid = setError(emailField, emailError, message) && isValid;
            }

            isValid = setError(messageField, messageError, messageField && messageField.value.trim() ? '' : 'Напишите сообщение.') && isValid;
            return isValid;
        };

        [nameField, emailField, messageField].forEach((field) => {
            field?.addEventListener('input', validateFields);
            field?.addEventListener('blur', validateFields);
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validateFields()) {
                confirmation.textContent = '';
                return;
            }

            contactForm.reset();
            [nameField, emailField, messageField].forEach((field) => field?.removeAttribute('aria-invalid'));
            confirmation.textContent = 'Спасибо! Мы получили сообщение и ответим в течение двух рабочих дней.';
            window.setTimeout(() => {
                confirmation.textContent = '';

            }, 6000);
        });
    }
});
