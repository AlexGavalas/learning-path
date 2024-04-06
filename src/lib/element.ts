type HTMLElementTag = keyof HTMLElementTagNameMap;

type CreateElementProps<T extends HTMLElementTag> = {
    type: T;
    attributes?: Partial<HTMLElementTagNameMap[T]>;
    className?: string;
};

export const createElement = <T extends HTMLElementTag>({
    attributes = {},
    className = '',
    type,
}: CreateElementProps<T>): HTMLElementTagNameMap[T] => {
    const element = document.createElement(type);

    if (className.length > 0) {
        element.classList.add(...className.split(/\s+/u));
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value as string);
    });

    return element;
};

type UpdateAttributesProps<T extends HTMLElementTag> = {
    element: HTMLElementTagNameMap[T];
    attributes: Partial<HTMLElementTagNameMap[T]>;
};

export const updateAttributes = <T extends HTMLElementTag>({
    element,
    attributes,
}: UpdateAttributesProps<T>): void => {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value as string);
    });
};

export const composeElements = (...elements: HTMLElement[]): void => {
    elements.reduce((parent, child) => {
        parent.appendChild(child);
        return child;
    });
};
