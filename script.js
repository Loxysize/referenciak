
const gallery = document.getElementById("gallery");

const categories = [
    { folder: "furdoszoba", name: "Fürdőszobák" },
    { folder: "terasz", name: "Teraszok" },
    { folder: "padlo", name: "Padlóburkolások" },
    { folder: "egyeb", name: "Egyéb munkák" }
];

let allImages = [];
let activeImages = [];
let currentIndex = 0;

// Képek betöltése az images.json fájlból
async function loadGallery() {
    gallery.innerHTML = '<p class="loading">Képek betöltése...</p>';

    try {
        const response = await fetch("./images.json");

        if (!response.ok) {
            throw new Error(`Képlista betöltési hiba: ${response.status}`);
        }

        const files = await response.json();

        allImages = files.map(file => ({
            name: file.name,
            folder: file.folder,
            categoryName: file.categoryName,
            url: `./${file.folder}/${encodeURIComponent(file.name)}`
        }));

        renderGallery("all");

    } catch (error) {
        console.error(error);
        gallery.innerHTML =
            '<p class="loading">Nem sikerült betölteni a képlistát. Ellenőrizd az images.json fájlt.</p>';
    }
}

// Galéria megjelenítése
function renderGallery(selectedCategory) {
    gallery.innerHTML = "";

    const selectedCategories = selectedCategory === "all"
        ? categories
        : categories.filter(category => category.folder === selectedCategory);

    activeImages = [];

    selectedCategories.forEach(category => {
        const images = allImages.filter(image =>
            image.folder === category.folder
        );

        if (images.length === 0) return;

        const section = document.createElement("section");
        section.className = "category-section";

        const heading = document.createElement("h2");
        heading.textContent = category.name;

        const grid = document.createElement("div");
        grid.className = "photo-grid";

        section.appendChild(heading);
        section.appendChild(grid);

        images.forEach(image => {
            const article = document.createElement("article");
            article.className = "work";

            const photo = document.createElement("div");
            photo.className = "photo";

            const img = document.createElement("img");
            img.src = image.url;
            img.alt = image.categoryName;
            img.loading = "lazy";

            img.onerror = () => {
                console.error("Nem sikerült betölteni a képet:", image.url);
                photo.style.display = "none";
            };

            photo.appendChild(img);
            article.appendChild(photo);
            grid.appendChild(article);

            photo.addEventListener("click", () => {
                const index = activeImages.findIndex(item =>
                    item.url === image.url
                );
                openImage(index);
            });

            activeImages.push(image);
        });

        gallery.appendChild(section);
    });

    if (gallery.innerHTML === "") {
        gallery.innerHTML =
            '<p class="loading">Ebben a kategóriában még nincs kép.</p>';
    }
}

// Kategóriaszűrés
function filterWorks(category, button) {
    document.querySelectorAll(".filters button").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    renderGallery(category);
}

// Nagyított kép megnyitása
function openImage(index) {
    if (index < 0 || index >= activeImages.length) return;

    currentIndex = index;

    let overlay = document.getElementById("lightbox");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "lightbox";

        overlay.innerHTML = `
            <button class="lightbox-close" aria-label="Bezárás">×</button>
            <button class="lightbox-prev" aria-label="Előző kép">‹</button>
            <img class="lightbox-image" alt="">
            <button class="lightbox-next" aria-label="Következő kép">›</button>
            <div class="lightbox-counter"></div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector(".lightbox-close")
            .addEventListener("click", closeImage);

        overlay.querySelector(".lightbox-prev")
            .addEventListener("click", previousImage);

        overlay.querySelector(".lightbox-next")
            .addEventListener("click", nextImage);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) closeImage();
        });

        document.addEventListener("keydown", handleKeyboard);

        let touchStartX = 0;

        overlay.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        overlay.addEventListener("touchend", event => {
            const touchEndX = event.changedTouches[0].screenX;
            const difference = touchEndX - touchStartX;

            if (Math.abs(difference) > 50) {
                difference < 0 ? nextImage() : previousImage();
            }
        }, { passive: true });
    }

    overlay.style.display = "flex";
    updateLightbox();
}

// Nagyított kép frissítése
function updateLightbox() {
    const overlay = document.getElementById("lightbox");
    const image = activeImages[currentIndex];

    if (!overlay || !image) return;

    const img = overlay.querySelector(".lightbox-image");
    img.src = image.url;
    img.alt = image.categoryName;

    overlay.querySelector(".lightbox-counter").textContent =
        `${currentIndex + 1} / ${activeImages.length}`;

    overlay.querySelector(".lightbox-prev").style.visibility =
        activeImages.length > 1 ? "visible" : "hidden";

    overlay.querySelector(".lightbox-next").style.visibility =
        activeImages.length > 1 ? "visible" : "hidden";
}

// Előző kép
function previousImage() {
    if (activeImages.length < 2) return;

    currentIndex =
        (currentIndex - 1 + activeImages.length) % activeImages.length;

    updateLightbox();
}

// Következő kép
function nextImage() {
    if (activeImages.length < 2) return;

    currentIndex =
        (currentIndex + 1) % activeImages.length;

    updateLightbox();
}

// Nagyított kép bezárása
function closeImage() {
    const overlay = document.getElementById("lightbox");
    if (overlay) overlay.style.display = "none";
}

// Billentyűzetes vezérlés
function handleKeyboard(event) {
    const overlay = document.getElementById("lightbox");

    if (!overlay || overlay.style.display !== "flex") return;

    if (event.key === "Escape") closeImage();
    if (event.key === "ArrowLeft") previousImage();
    if (event.key === "ArrowRight") nextImage();
}

// Galéria indítása
loadGallery();
