import { formatSecondsInMinutes } from "./helpers/formatSecondsInMinutes.js";

const lang = {
    fr: 1,
    us: 1,
};

const texts = {
    backToMainPage: {
        us: function () {
            return `Back to main page`;
        },
        fr: function () {
            return `Retour à la page d'accueil`;
        }
    },

    confirm: {
        us: function () {
            return `Confirm`;
        },
        fr: function () {
            return `Confirmer`;
        }
    },

    cancel: {
        us: function () {
            return `Cancel`;
        },
        fr: function () {
            return `Annuler`;
        }
    },

    deleteConfirmation: {
        us: function () {
            return `Are you sure you want to delete your account? This action is irreversible and will permanently delete all your data.`;
        },
        fr: function () {
            return `Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible et supprimera toutes vos données de manière permanente.`;
        }
    },

    logoutConfirmation: {
        us: function () {
            return `Are you sure you want to log out? Your bio pages will be unavailable until you log in again!`;
        },
        fr: function () {
            return `Êtes-vous sûrs de vouloir vous déconnecter? Vos pages seront indisponibles jusqu'à votre prochaine connexion!`;
        }
    },

    unexpectedError: {
        us: function (code, message) {
            return `An unexpected error occured. Please try again.\nError code: ${code} | Error message: ${message}`;
        },
        fr: function (code, message) {
            return `une erreur inattendue s'est produite. Veuillez réessayer.\nCode erreur: ${code} | Message d'erreur: ${message}`;
        }
    },

    tooManyRequests: {
        us: function (retryAfterSeconds) {
            if (retryAfterSeconds > 0) return `You are making too many requests. Wait ${formatSecondsInMinutes(retryAfterSeconds)} before reloading the page and trying again.`;
            if (retryAfterSeconds <= 0) return `You may reload the page now.`;
            return `You are making too many requests. Reload the page and try again.`;
        },
        fr: function (retryAfterSeconds) {
            if (retryAfterSeconds > 0) return `Vous effectuez trop de requêtes. Attendez ${formatSecondsInMinutes(retryAfterSeconds)} minute(s) avant de recharger la page et réessayer.`
            if (retryAfterSeconds <= 0) return `Vous pouvez rechargez la page maintenant.`;
            return `Vous effectuez trop de requêtes. Rechargez la page et réessayez.`;
        }
    },

    currentLanguage: {
        us: function (countryCode) {
            let lang = "Unknown";

            if (countryCode === "fr") lang = "French";
            if (countryCode === "us") lang = "English";

            return `Current language: ${lang}`;
        },
        fr: function (countryCode) {
            let lang = "Unknown";

            if (countryCode === "fr") lang = "Français";
            if (countryCode === "us") lang = "Anglais";

            return `Langue actuelle : ${lang}`;
        }
    },

    enablePreview: {
        us: function () {
            return `Enable preview`
        },
        fr: function () {
            return `Activer l'aperçu`
        }
    },

    disablePreview: {
        us: function () {
            return `Disable preview`
        },
        fr: function () {
            return `Désactiver l'aperçu`
        }
    },

    disableRawView: {
        us: function () {
            return `See formatted text`
        },
        fr: function () {
            return `Voir le texte formatté`
        }
    },

    enableRawView: {
        us: function () {
            return `View raw text`
        },
        fr: function () {
            return `Voir le texte brut`
        }
    },

    noTextWasEnteredInBioInput: {
        us: function () {
            return "Please enter some text.";
        },
        fr: function () {
            return "Veuillez entrer du texte.";
        }
    },

    unauthorizedAction: {
        us: function () {
            return "You are not allowed to perform this action.";
        },
        fr: function () {
            return "Vous n'êtes pas autorisé à effectuer cette action.";
        }
    },

    biographyModified: {
        us: function () {
            return "Your biography was successfully modified!";
        },
        fr: function () {
            return "Votre biographie a bien été modifiée!";
        }
    },

    mainPageDocumentTitle: {
        us: function (username) {
            return `${username}'s bio page`
        },
        fr: function (username) {
            return `Page de ${username}`;
        }
    },

    welcomeBack: {
        us: function (username) {
            return `Welcome back, ${username} !`
        },
        fr: function (username) {
            return `Bienvenue, ${username} !`;
        }
    },

    discordLoggedIn: {
        us: function () {
            return "Logged in through Discord.";
        },
        fr: function () {
            return "Connecté(e) grâce à Discord.";
        }
    },

    sessionLoggedIn: {
        us: function () {
            return "Logged in with a session token.";
        },
        fr: function () {
            return "Connecté(e) grâce à un token de session.";
        }
    },

    alteredOauth2State: {
        us: function () {
            return "The OAuth2 state was altered; the request likely was tampered by a CSRF attack. Try again."
        },
        fr: function () {
            return "L'état OAuth2 a été altéré; la requête a probablement été interceptée par une attaque CSRF. Veuillez réessayer.";
        }
    },

    invalidCodeForAccessTokenExchange: {
        us: function () {
            return "The provided code is invalid.";
        },
        fr: function () {
            return "Le code donné est invalide.";
        }
    },

    expiredSession: {
        us: function () {
            return "Your session expired. Please log in again."
        },
        fr: function () {
            return "Votre session a expiré. Veuillez vous reconnecter.";
        }
    },

    notADiscordId: {
        us: function () {
            return `The specified value does not seem like a valid Discord ID.`;
        },
        fr: function (id) {
            return `La valeur spécifiée ne ressemble pas à un identifiant Discord valide.`;
        }
    },

    invalidRequest: {
        us: function () {
            return "This request was made with malformed HTTP headers or a malformed body."
        },
        fr: function () {
            return "La requête a été effectuée avec des en-têtes HTTP malformés ou un corps malformé.";
        }
    },

    unknownInternalUser: {
        us: function () {
            return "The specified user does not exist.";
        },
        fr: function () {
            return "L'utilisateur spécifié n'existe pas.";
        }
    },

    invalidRefreshToken: {
        us: function () {
            return "The specified user deauthorized this application, so their data cannot be retrieved.";
        },
        fr: function () {
            return "L'utilisateur spécifié s'est déconnecté de cette application, donc leur données ne peuvent être récupérées.";
        }
    },

    userBiographyDisplay: {
        us: function (username) {
            return `You are viewing ${username}'s biography.`;
        },
        fr: function (username) {
            return `Vous lisez la biographie de ${username}.`;
        }
    }
};

/**
 * 
 * @param {string} code
 * @returns {keyof typeof lang}
 */
export function getSupportedLanguageFor(code) {
    if (lang[code] === 1) return code;
    return "us";
}

/**
 * 
 * @param {keyof typeof lang} lang 
 * @param {keyof typeof texts} textId
 * @param {any[]} args
 */
export function getTextForLanguage(lang, textId, args = []) {
    try {
        const text = texts[textId][lang](...args);
        return text;
    } catch (err) {
        return texts[textId].us(...args);
    }
}