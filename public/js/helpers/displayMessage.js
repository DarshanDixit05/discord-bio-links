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
        document.body.innerHTML = `<div style="padding: 0.8rem; background-color: white; color: black; font-size: 1.5rem; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${message}</div>`;
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