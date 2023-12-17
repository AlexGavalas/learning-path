const COPIED_ATTRIBUTES = [
    'border',
    'boxSizing',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'padding',
    'textDecoration',
    'textIndent',
    'textTransform',
    'whiteSpace',
    'wordSpacing',
    'wordWrap',
] as const satisfies Readonly<(keyof CSSStyleDeclaration)[]>;

const parseValue = (v: string): number =>
    v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0;

type State = {
    value: string;
};

class RichTextarea extends HTMLElement {
    readonly textareaElement: HTMLTextAreaElement;
    readonly mirrorElement: HTMLDivElement;
    readonly previewElement: HTMLDivElement;
    readonly toolbarElement: HTMLDivElement;
    resiseObserver: ResizeObserver | null = null;
    readonly history: State[] = [];
    historyIndex = -1;

    readonly controlHandlers = [
        {
            selector: '#bold',
            getHandle: () => this.makeBold,
        },
        {
            selector: '#italic',
            getHandle: () => this.makeItalic,
        },
        {
            selector: '#heading1',
            getHandle: () => this.makeHeading1,
        },
        {
            selector: '#heading2',
            getHandle: () => this.makeHeading2,
        },
    ];

    readonly keydownHandlers = [
        {
            matcher: (e: KeyboardEvent) => e.metaKey && e.key === 'z',
            getHandle: () => this.undo,
        },
        {
            matcher: (e: KeyboardEvent) => e.metaKey && e.key === 'b',
            getHandle: () => this.makeBold,
        },
        {
            matcher: (e: KeyboardEvent) => e.metaKey && e.key === 'i',
            getHandle: () => this.makeItalic,
        },
    ];

    constructor() {
        super();

        const textareaElement = document.querySelector('textarea');
        const mirrorElement = document.querySelector('#mirror');
        const previewElement = document.querySelector('#preview');
        const toolbarElement = document.querySelector('#toolbar');

        if (
            !(textareaElement instanceof HTMLTextAreaElement) ||
            !(mirrorElement instanceof HTMLDivElement) ||
            !(previewElement instanceof HTMLDivElement) ||
            !(toolbarElement instanceof HTMLDivElement)
        ) {
            throw new Error('Some element was not found or is not valid');
        }

        this.textareaElement = textareaElement;
        this.mirrorElement = mirrorElement;
        this.previewElement = previewElement;
        this.toolbarElement = toolbarElement;
    }

    connectedCallback(): void {
        const textareaStyles = window.getComputedStyle(this.textareaElement);

        COPIED_ATTRIBUTES.forEach((property) => {
            this.mirrorElement.style[property] = textareaStyles[property];
        });

        this.resiseObserver = new ResizeObserver(() => {
            const borderWidth = parseValue(
                window.getComputedStyle(this.textareaElement).borderWidth,
            );

            const updatedWidth =
                this.textareaElement.clientWidth + 2 * borderWidth;

            const updatedHeight =
                this.textareaElement.clientHeight + 2 * borderWidth;

            this.mirrorElement.style.width = `${updatedWidth}px`;
            this.mirrorElement.style.height = `${updatedHeight}px`;
        });

        this.resiseObserver.observe(this.textareaElement);

        this.mirrorContent();

        this.textareaElement.addEventListener('input', () => {
            this.mirrorContent();
            this.preview();
        });

        this.textareaElement.addEventListener('keydown', (e) => {
            const handler = this.keydownHandlers.find(({ matcher }) =>
                matcher(e),
            );

            if (handler !== undefined) {
                e.preventDefault();
                const handle = handler.getHandle();
                handle();
            }
        });

        this.textareaElement.addEventListener('scroll', () => {
            this.mirrorElement.scrollTop = this.textareaElement.scrollTop;
        });

        this.controlHandlers.forEach(({ selector, getHandle }) => {
            this.querySelector(selector)?.addEventListener(
                'click',
                getHandle(),
            );
        });

        // Toolbar events
        document.addEventListener('selectionchange', () => {
            const selectionLength =
                window.getSelection()?.toString()?.length ?? 0;

            if (selectionLength === 0) {
                this.hideToolbar();
            }
        });

        this.textareaElement.addEventListener('mouseup', () => {
            const textarea = this.textareaElement;
            const mirroredEle = this.mirrorElement;
            const toolbarEle = this.toolbarElement;

            const cursorPos = textarea.selectionStart;
            const endSelection = textarea.selectionEnd;

            if (cursorPos === endSelection) {
                return;
            }

            const textBeforeCursor = textarea.value.substring(0, cursorPos);
            const textAfterCursor = textarea.value.substring(cursorPos);

            const pre = document.createTextNode(textBeforeCursor);
            const post = document.createTextNode(textAfterCursor);
            const caretEle = document.createElement('span');

            caretEle.innerHTML = '&nbsp;';
            mirroredEle.innerHTML = '';
            mirroredEle.append(pre, caretEle, post);

            const rect = caretEle.getBoundingClientRect();
            const toolbarRect = toolbarEle.getBoundingClientRect();
            const left = (textarea.clientWidth - toolbarRect.width) / 2;
            const top = rect.top + textarea.scrollTop - toolbarRect.height - 8;
            toolbarEle.style.transform = `translate(${left}px, ${top}px)`;

            this.showToolbar();
        });
    }

    undo = (): void => {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const previousState = this.history[this.historyIndex];

            this.textareaElement.value = previousState.value;
            this.mirrorContent({ logAction: false });
            this.preview();
        }
    };

    mirrorContent = ({
        logAction = true,
    }: { logAction?: boolean } = {}): void => {
        const value = this.textareaElement.value;
        this.mirrorElement.textContent = value;

        if (logAction) {
            this.history.push({ value });
            this.historyIndex = this.history.length - 1;
        }
    };

    hideToolbar = (): void => {
        this.toolbarElement.style.opacity = '0';
        this.toolbarElement.style.visibility = 'hidden';
    };

    showToolbar = (): void => {
        this.toolbarElement.style.opacity = '1';
        this.toolbarElement.style.visibility = 'visible';
    };

    preview = (): void => {
        const previewMarkup = this.mirrorElement.innerHTML
            .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
            .replace(/__(.*?)__/g, '<span class="italic">$1</span>')
            .replace(/##(.*)$/gm, '<h2>$1</h2>')
            .replace(/#(.*)$/gm, '<h1>$1</h1>')
            .replace(/^([^\n]*)[\n]/gm, '<p>$1</p>');

        this.previewElement.innerHTML = previewMarkup;
    };

    wrapWith = ({
        decoration = '',
        prefix = '',
    }: {
        decoration?: '**' | '__' | '';
        prefix?: '#' | '##' | '';
    }): void => {
        const start = this.textareaElement.selectionStart;
        const end = this.textareaElement.selectionEnd;
        const currentValue = this.textareaElement.value;

        this.textareaElement.setRangeText(
            `${prefix}${decoration}${currentValue.slice(
                start,
                end,
            )}${decoration}`,
            start,
            end,
            'end',
        );
    };

    afterActionEffect = (): void => {
        this.textareaElement.focus();
        this.mirrorContent();
        this.preview();
    };

    makeBold = (): void => {
        this.wrapWith({ decoration: '**' });
        this.afterActionEffect();
    };

    makeItalic = (): void => {
        this.wrapWith({ decoration: '__' });
        this.afterActionEffect();
    };

    makeHeading1 = (): void => {
        this.wrapWith({ prefix: '#' });
        this.afterActionEffect();
    };

    makeHeading2 = (): void => {
        this.wrapWith({ prefix: '##' });
        this.afterActionEffect();
    };

    disconnectedCallback(): void {
        this.resiseObserver?.disconnect();

        this.controlHandlers.forEach(({ selector, getHandle }) => {
            this.querySelector(selector)?.removeEventListener(
                'click',
                getHandle(),
            );
        });
    }
}

customElements.define('rich-textarea', RichTextarea);
