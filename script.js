
const categories = [
    { folder: "furdoszoba", name: "Fürdőszoba" },
    { folder: "terasz", name: "Terasz" },
    { folder: "padlo", name: "Padló" },
    { folder: "egyeb", name: "Egyéb" }
];

const gallery = document.getElementById("gallery");

// Képek betöltése a GitHub mappáiból
async function loadGallery() {
    gallery.innerHTML = "<p>Képek betöltése...</p>";

    try {
        const allImages = [];

        for (const category of categories) {
            const apiUrl =
                `https://api.github.com/repos/loxysize/referenciak/contents/${category.folder}?ref=main`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Nem sikerült betölteni ezt a mappát: ${category.folder}`);
            }

            const files = await response.json();

            const images = files.filter(file =>
                /\.(webp|jpg|jpeg|png)$/i.test(file.name)
            );

            images.forEach(file => {
                allImages.push({
                    name: file.name,
                    folder: category.folder,
                    categoryName: category.name,
                    url: file.download_url
                });
            });
        }

        gallery.innerHTML = "";

        if (allImages.length === 0) {
            gallery.innerHTML = "<p>Nem találhatók képek.</p>";
            return;
        }

        allImages.forEach((image, index) => {
            const article = document.createElement("article");
            article.className = `work ${image.folder}`;

            const photo = document.createElement("div");
            photo.className = "photo";

            const img = document.createElement("img");
            img.src = image.url;
            img.alt = `${image.categoryName} referencia ${index + 1}`;
            img.loading = "lazy";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";
            img.style.cursor = "pointer";

            photo.appendChild(img);

            const title = document.createElement("h3");
            title.textContent = image.categoryName + " burkolás";

            const description = document.createElement("p");
            description.textContent = image.categoryName;

            article.appendChild(photo);
            article.appendChild(title);
            article.appendChild(description);

            gallery.appendChild(article);

            // Nagyítás kattintásra
            img.addEventListener("click", () => {
                openImage(image.url, img.alt);
            });
        });

    } catch (error) {
        console.error(error);
        gallery.innerHTML =
            "<p>Hiba történt a képek betöltésekor. Próbáld újra később.</p>";
    }
}

// Kategóriaszűrés
function filterWorks(category) {
    document.querySelectorAll(".work").forEach(work => {
        work.style.display =
            category === "all" || work.classList.contains(category)
                ? ""
                : "none";
    });
}

// Teljes képernyős nagyítás
function openImage(url, alt) {
    const overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.96)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";
    overlay.style.cursor = "zoom-out";
    overlay.style.padding = "20px";
    overlay.style.boxSizing = "border-box";

    const img = document.createElement("img");
    img.src = url;
    img.alt = alt;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
        overlay.remove();
    });

    document.addEventListener("keydown", function closeOnEscape(event) {
        if (event.key === "Escape") {
            overlay.remove();
            document.removeEventListener("keydown", closeOnEscape);
        }
    });
}

// Galéria indítása
loadGallery();
