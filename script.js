function filterWorks(category) {
    const works = document.querySelectorAll('.work');

    works.forEach(work => {
        if (category === 'all') {
            work.style.display = 'block';
        } else if (work.classList.contains(category)) {
            work.style.display = 'block';
        } else {
            work.style.display = 'none';
        }
    });
}

// Képek nagyítása
document.querySelectorAll('.photo').forEach(photo => {
    photo.addEventListener('click', function() {
        const overlay = document.createElement('div');

        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.95)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = 'white';
        overlay.style.fontSize = '22px';
        overlay.style.zIndex = '9999';
        overlay.style.cursor = 'pointer';
        overlay.innerText = 'Ide kerül majd a referenciafotó';

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function() {
            overlay.remove();
        });
    });
}