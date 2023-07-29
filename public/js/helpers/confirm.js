// @ts-check

/**
 * Asks the user a confirmation before an action.
 * @param {string} message
 * @param {string} yesButtonText
 * @param {string} noButtonText
 * @param {() => any} ifYes 
 * @param {() => any} ifNo
 */
export function confirm(message, yesButtonText, noButtonText, ifYes, ifNo) {
    const dialog = document.createElement("dialog");
    dialog.className = "prompt";
    dialog.innerText = message;

    const form = document.createElement("form");
    form.method = "dialog";

    const yes = document.createElement("button");
    yes.innerText = yesButtonText;
    yes.disabled = true;

    const no = document.createElement("button");
    no.innerText = noButtonText;
    no.disabled = true;

    form.appendChild(yes);
    form.appendChild(no);

    dialog.appendChild(form);
    document.body.appendChild(dialog);
    dialog.showModal();

    yes.className = "confirm";
    no.className = "cancel";

    form.addEventListener("submit", (event) => event.preventDefault());

    setTimeout(function () {
        yes.addEventListener("click", async () => {
            await ifYes();
            try { dialog.remove(); } catch (err) { console.error(err); }
        });
        yes.disabled = false;
    }, 2_500);

    setTimeout(function () {
        no.addEventListener("click", async () => {
            await ifNo();
            try { dialog.remove(); } catch (err) { console.error(err); }
        });
        no.disabled = false;
    }, 2_500);
}