// CLIP Text Encode + Note — Token Counter + Copy + Paste + Trash
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

function clearWithUndo(textarea) {
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("delete");
    if (!ok) {
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

function pasteWithUndo(textarea, clipText) {
    const cur = textarea.value || "";
    const sep = cur.trim() === "" ? "" : "\n\n";
    textarea.focus();
    textarea.setSelectionRange(cur.length, cur.length);
    const ok = document.execCommand("insertText", false, sep + clipText);
    if (!ok) {
        textarea.value = cur + sep + clipText;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

function makeBtn(svg, title, className) {
    const btn = document.createElement("button");
    btn.className = className;
    btn.title = title;
    btn.innerHTML = svg;
    Object.assign(btn.style, {
        position: "absolute",
        bottom: "6px",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(30,30,40,0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "5px",
        cursor: "pointer",
        color: "rgba(255,255,255,0.5)",
        padding: "0",
        transition: "all 0.15s ease",
        zIndex: "10",
        pointerEvents: "auto",
    });
    btn.addEventListener("mouseenter", () => {
        if (!btn.disabled) {
            btn.style.opacity = "1";
            btn.style.borderColor = "rgba(255,255,255,0.3)";
            btn.style.color = "#fff";
        }
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.opacity = btn.disabled ? "0.2" : "0.75";
        btn.style.borderColor = "rgba(255,255,255,0.12)";
        btn.style.color = "rgba(255,255,255,0.5)";
    });
    return btn;
}

function setupUI(node) {
    const widget = node.widgets?.find(w => w.type === "customtext" || w.name === "text");
    if (!widget || !widget.element) return;

    node._clipWidget = widget;
    const textarea = widget.element;
    const container = textarea.parentElement;
    if (!container) return;
    if (container.querySelector(".ctc-copy-btn")) return;

    container.style.position = "relative";

    // Лічильник токенів
    const counter = document.createElement("div");
    Object.assign(counter.style, {
        position: "absolute",
        bottom: "9px",
        left: "8px",
        fontSize: "11px",
        fontFamily: "monospace",
        color: "rgba(255,255,255,0.4)",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: "10",
    });
    counter.textContent = "Tokens: 0";
    container.appendChild(counter);

    // Toast
    const toast = document.createElement("span");
    Object.assign(toast.style, {
        position: "absolute",
        bottom: "36px",
        right: "6px",
        background: "rgba(15,15,25,0.92)",
        color: "rgba(255,255,255,0.85)",
        fontSize: "11px",
        fontFamily: "monospace",
        padding: "2px 8px",
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: "0",
        transition: "opacity 0.15s ease",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: "11",
    });
    container.appendChild(toast);

    function showToast(text) {
        toast.textContent = text;
        toast.style.transition = "opacity 0.15s ease";
        toast.style.opacity = "1";
        setTimeout(() => {
            toast.style.transition = "opacity 1s ease";
            toast.style.opacity = "0";
        }, 400);
    }

    // Copy (крайня права)
    const btnCopy = makeBtn(
        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        "Copy", "ctc-copy-btn"
    );
    btnCopy.style.right = "6px";
    container.appendChild(btnCopy);

    // Paste (динамічно між Trash і Copy)
    const btnPaste = makeBtn(
        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`,
        "Paste", "ctc-paste-btn"
    );
    container.appendChild(btnPaste);

    // Trash (по центру)
    const btnTrash = makeBtn(
        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
        "Clear (Ctrl+Z to undo)", "ctc-trash-btn"
    );
    container.appendChild(btnTrash);

    // Динамічне позиціонування кнопок
    function repositionButtons() {
        const w = container.offsetWidth;
        const btnW = 24;
        const margin = 6;

        // Trash — по центру
        const trashLeft = Math.floor(w / 2 - btnW / 2);
        btnTrash.style.left = trashLeft + "px";
        btnTrash.style.right = "auto";

        // Copy — крайня права (незмінна)
        const copyLeft = w - btnW - margin;

        // Paste — посередині між правим краєм Trash і лівим краєм Copy
        const trashRight = trashLeft + btnW;
        const pasteLeft = Math.floor((trashRight + copyLeft) / 2 - btnW / 2);
        btnPaste.style.left = pasteLeft + "px";
        btnPaste.style.right = "auto";
    }

    // Запускаємо одразу і при ресайзі
    setTimeout(repositionButtons, 10);
    const ro = new ResizeObserver(repositionButtons);
    ro.observe(container);

    function update() {
        const text = textarea.value || "";
        const empty = text.trim() === "";
        counter.textContent = `Tokens: ${estimateTokens(text)}`;

        btnCopy.disabled = empty;
        btnCopy.style.opacity = empty ? "0.2" : "0.75";
        btnCopy.style.cursor = empty ? "not-allowed" : "pointer";

        btnTrash.disabled = empty;
        btnTrash.style.opacity = empty ? "0.2" : "0.75";
        btnTrash.style.cursor = empty ? "not-allowed" : "pointer";

        btnPaste.style.opacity = "0.75";
        btnPaste.style.cursor = "pointer";
    }

    textarea.addEventListener("input", update);
    update();

    btnCopy.addEventListener("click", e => {
        e.stopPropagation();
        if (btnCopy.disabled) return;
        const s = textarea.selectionStart, en = textarea.selectionEnd;
        const t = s !== en ? textarea.value.substring(s, en) : textarea.value;
        navigator.clipboard.writeText(t).then(() => showToast("Copy"));
    });

    btnPaste.addEventListener("click", async e => {
        e.stopPropagation();
        try {
            const clipText = await navigator.clipboard.readText();
            if (!clipText) return;
            pasteWithUndo(textarea, clipText);
            setTimeout(() => {
                if (node._clipWidget) node._clipWidget.value = textarea.value;
                update();
            }, 10);
            showToast("Paste");
        } catch {
            showToast("No access");
        }
    });

    btnTrash.addEventListener("click", e => {
        e.stopPropagation();
        if (btnTrash.disabled) return;
        clearWithUndo(textarea);
        setTimeout(() => {
            if (node._clipWidget) node._clipWidget.value = textarea.value;
            update();
        }, 10);
        showToast("Cleared");
    });
}

function patchNodeType(nodeTypeName) {
    const nodeType = LiteGraph.registered_node_types[nodeTypeName];
    if (!nodeType) return;
    const onNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
        const result = onNodeCreated?.apply(this, arguments);
        setTimeout(() => setupUI(this), 150);
        return result;
    };
}

app.registerExtension({
    name: "ClipTokenCounter",

    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "CLIPTextEncode") return;
        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const result = onNodeCreated?.apply(this, arguments);
            setTimeout(() => setupUI(this), 150);
            return result;
        };
    },

    async setup() {
        setTimeout(() => patchNodeType("Note"), 500);
    },
});
