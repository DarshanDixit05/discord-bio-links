// @ts-check

/**
 * Displays a message to the user.
 * The "fatal" type will remove the entire document and only display the error message.
 * 
 * @param {string} message
 * @param {"success"|"neutral"|"error"|"fatal"} type
 */
export function displayMessage(message, type) {
    if (type === "fatal") {
        document.body.innerHTML = `<div class="fatal">${message}</div>`;
    } else {
        const otherBoxes = document.getElementsByClassName("message");

        for (const otherBox of otherBoxes) {
            try { document.body.removeChild(otherBox); } catch (err) { console.error(err); }
        }

        const box = document.createElement("div");
        box.className = `message message-${type}`;
        box.innerText = message;

        setTimeout(function () { try { box.style.opacity = "0"; } catch (err) { console.error(err); } }, 8_000);

        document.body.appendChild(box);
    }
}