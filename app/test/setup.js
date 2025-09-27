// app/test/setup.js
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock window.URL.createObjectURL for file previews
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock console.error to reduce test noise
console.error = vi.fn();

// Global test utilities
global.testUtils = {
  createMockFile: (name = 'test.png', type = 'image/png') => {
    return new File(['test content'], name, { type });
  }
};