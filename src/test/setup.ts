import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
