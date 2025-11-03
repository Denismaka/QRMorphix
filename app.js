const resultat = document.querySelector(".resultat-qr");
const btn = document.querySelector("form button");
const input = document.querySelector("form input");
const info = document.querySelector(".info");
const qr = document.querySelector(".resultat-qr img");
const darkModeToggle = document.querySelector("#darkModeToggle");
const downloadBtn = document.querySelector("#downloadBtn");
const html = document.documentElement;

// Fontion pour télcharger le QR code
const downloadQRCode = async () => {
    try {
        const response = await fetch(qr.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "qrcode.svg";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        showError("Erreur lors du téléchargement du QR code");
    }
};

// Gestion du mode sombre
const isDarkMode = () => localStorage.getItem("darkMode") === "true";
const enableDarkMode = () => {
    html.classList.add("dark");
    localStorage.setItem("darkMode", "true");
};
const disableDarkMode = () => {
    html.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
};

// Initialiser le mode sombre selon la prférence systme
if (
    isDarkMode() ||
    (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    enableDarkMode();
}

// Gérer le bouton de basculement du mode sombre
darkModeToggle.addEventListener("click", () => {
    if (isDarkMode()) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Fonction pour réinitialiser l'interface
const resetUI = () => {
    resultat.classList.add("hidden");
    if (isDarkMode()) {
        btn.classList.remove("bg-accent-500", "hover:bg-accent-600");
        btn.classList.add("bg-primary-600", "hover:bg-primary-500");
    } else {
        btn.classList.remove("bg-accent-500", "hover:bg-accent-600");
        btn.classList.add("bg-primary-500", "hover:bg-primary-600");
    }
    btn.innerText = "Générer un QR code";
    info.classList.add("hidden");
};

// Foncton pour afficher une erreur
const showError = (message) => {
    info.classList.remove("hidden");
    info.innerText = message;
    resultat.classList.add("hidden");
};

// Fonction pr afficher le succès
const showSuccess = () => {
    resultat.classList.remove("hidden");
    btn.innerText = "QR Code généré !";
    if (isDarkMode()) {
        btn.classList.remove("bg-primary-600", "hover:bg-primary-500");
        btn.classList.add("bg-accent-600", "hover:bg-accent-500");
    } else {
        btn.classList.remove("bg-primary-500", "hover:bg-primary-600");
        btn.classList.add("bg-accent-500", "hover:bg-accent-600");
    }
    info.classList.add("hidden");
};

btn.addEventListener("click", () => {
    let qrValue = input.value;

    if (!qrValue) {
        showError("Veuillez indiquer un URL valide");
        return;
    }

    try {
        new URL(qrValue); // Vérifie si l'URL est vld
    } catch (e) {
        showError("L'URL saisie n'est pas valide");
        return;
    }

    // Réinitialise ls gestionnaires d'événements précédent
    qr.removeEventListener("load", showSuccess);
    qr.removeEventListener("error", () =>
        showError(
            "Erreur lors de la génération du QR code. Veuillez réessayer."
        )
    );

    // Ajoute les noveaux gestionaires d'événements
    qr.addEventListener("load", showSuccess);
    qr.addEventListener("error", () =>
        showError(
            "Erreur lors de la génération du QR code. Veuillez réessayer."
        )
    );

    // Génère le QR code
    qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        qrValue
    )}&format=svg`;
});

input.addEventListener("keyup", () => {
    if (!input.value) {
        resetUI();
    }
});

// Gestinaire d'événement pour le téléchargement
downloadBtn.addEventListener("click", downloadQRCode);
