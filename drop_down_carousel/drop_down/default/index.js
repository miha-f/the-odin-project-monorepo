document.querySelectorAll('.dropdown').forEach(drop => {
    const btn = drop.querySelector('.drop-down');
    const menu = drop.querySelector('.menu');

    const closeMenu = () => {
        btn.classList.remove('open');
        menu.classList.remove('show');
    };

    // NOTE(miha): Toggle dropdown
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('show');

        // NOTE(miha): Close other dropdowns, if any open
        document.querySelectorAll('.menu.show').forEach(m => {
            console.log("closin other");
            m.classList.remove('show');
            m.parentElement.querySelector('.drop-down').classList.remove('open');
        });

        if (!isOpen) {
            btn.classList.add('open');
            menu.classList.add('show');
        }
    });

    // NOTE(miha): Close dropdown when item/link clicked
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // NOTE(miha): Close dropdown when we click outside/anywhere
    window.addEventListener('click', (e) => {
        if (!drop.contains(e.target)) {
            closeMenu();
        }
    });
});
