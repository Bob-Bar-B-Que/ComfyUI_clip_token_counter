// CLIP Text Encode — Token Counter + Copy Button
// Встанови у: ComfyUI/custom_nodes/clip_token_counter/web/clip_token_counter.js

import { app } from "../../scripts/app.js";

function estimateTokens(text) {
    if (!text || text.trim() === "") return 0;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    let tokens = 0;
    for (const word of words) {
        if (word.length <= 4) tokens += 1;
        else if (word.length <= 8) tokens += 2;
        else tokens += Math.ceil(word.length / 4);
    }
    return Math.max(tokens + 2, words.length + 2);
}

app.registerExtension({
    name: "ClipTokenCounter",

    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "CLIPTextEncode") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const result = onNodeCreated?.apply(this, arguments);
            const node = this;
            setTimeout(() => {
                setupUI(node);
            }, 150);
            return result;
        };
    },
});

function setupUI(node) {
    const widget = node.widgets?.find(w => w.type === "customtext" || w.name === "text");
    if (!widget || !widget.element) return;

    node._clipWidget = widget;
    const textarea = widget.element;
    const container = textarea.parentElement;
    if (!container) return;

    container.style.position = "relative";

    // --- Лічильник токенів ---
    const counter = document.createElement("div");
    counter.className = "clip-token-counter";
    Object.assign(counter.style, {
        position: "absolute",
        bottom: "6px",
        left: "8px",
        fontSize: "11px",
        fontFamily: "monospace",
        color: "rgba(255, 255, 255, 0.4)",
        pointerEvents: "none",
        userSelect: "none",
        lineHeight: "1",
        zIndex: "10",
    });
    counter.textContent = "Tokens: 0";
    container.appendChild(counter);

    // --- Кнопка копіювання ---
    const btn = document.createElement("button");
    btn.className = "clip-copy-btn";
    btn.title = "Copy text";
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;

    Object.assign(btn.style, {
        position: "absolute",
        bottom: "6px",
        right: "6px",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(30, 30, 40, 0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "5px",
        cursor: "pointer",
        color: "rgba(255,255,255,0.5)",
        padding: "0",
        transition: "all 0.15s ease",
        zIndex: "10",
        pointerEvents: "auto",
    });

    // Лейбл "Copy"
    const label = document.createElement("span");
    label.className = "clip-copy-label";
    Object.assign(label.style, {
        position: "absolute",
        bottom: "34px",
        right: "4px",
        background: "rgba(20, 20, 30, 0.9)",
        color: "rgba(255,255,255,0.85)",
        fontSize: "11px",
        fontFamily: "monospace",
        padding: "2px 7px",
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.12)",
        opacity: "0",
        transition: "opacity 0.15s ease",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: "11",
    });
    label.textContent = "Copy";

    container.appendChild(label);
    container.appendChild(btn);

    // --- Оновлення стану ---
    function update() {
        const text = textarea.value || "";
        const count = estimateTokens(text);
        const empty = text.trim() === "";

        counter.textContent = `Tokens: ${count}`;

        btn.style.opacity = empty ? "0.25" : "0.75";
        btn.style.cursor = empty ? "not-allowed" : "pointer";
        btn.disabled = empty;
    }

    textarea.addEventListener("input", update);
    update();

    // --- Ховер кнопки ---
    btn.addEventListener("mouseenter", () => {
        if (!btn.disabled) {
            btn.style.opacity = "1";
            btn.style.borderColor = "rgba(255,255,255,0.3)";
            btn.style.color = "rgba(255,255,255,0.9)";
        }
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.opacity = btn.disabled ? "0.25" : "0.75";
        btn.style.borderColor = "rgba(255,255,255,0.12)";
        btn.style.color = "rgba(255,255,255,0.5)";
    });

    // --- Копіювання ---
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btn.disabled) return;

        const selStart = textarea.selectionStart;
        const selEnd = textarea.selectionEnd;
        const full = textarea.value || "";
        const textToCopy = (selStart !== selEnd) ? full.substring(selStart, selEnd) : full;

        navigator.clipboard.writeText(textToCopy).then(() => {
            label.style.transition = "opacity 0.15s ease";
            label.style.opacity = "1";
            setTimeout(() => {
                label.style.transition = "opacity 1s ease";
                label.style.opacity = "0";
            }, 400);
        }).catch(() => {
            document.execCommand("copy");
        });
    });
}
