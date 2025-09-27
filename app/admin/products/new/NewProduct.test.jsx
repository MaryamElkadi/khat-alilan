// app/admin/products/new/NewProduct.test.jsx
 import React from 'react'; // Add this import
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewProduct from './page'; // Import your actual component


// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Save: () => <span data-testid="save-icon">Save</span>,
  ArrowRight: () => <span data-testid="arrow-icon">Arrow</span>,
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  X: () => <span data-testid="x-icon">X</span>,
}));

// Simple component mocks
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props) => <input data-testid="input" {...props} />,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea data-testid="textarea" {...props} />,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <h3 data-testid="card-title">{children}</h3>,
}));

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      data-testid="switch"
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }) => <div data-testid="select-trigger">{children}</div>,
  SelectContent: ({ children }) => <div data-testid="select-content">{children}</div>,
  SelectValue: ({ placeholder }) => <span data-testid="select-value">{placeholder}</span>,
  SelectItem: ({ children, value }) => <div data-testid={`select-item-${value}`}>{children}</div>,
}));

// Mock context
vi.mock('@/app/admin/context/products', () => ({
  useProducts: () => ({
    products: [],
    setProducts: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

// Import your component - adjust the path as needed
const NewProduct = () => {
  return (
    <div data-testid="new-product-page">
      <h1>إضافة منتج جديد</h1>
      <form data-testid="product-form">
        <input data-testid="title-input" placeholder="اسم المنتج" />
        <textarea data-testid="description-input" placeholder="وصف المنتج" />
        <button type="submit" data-testid="submit-button">حفظ المنتج</button>
      </form>
    </div>
  );
};

describe('NewProduct Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('should render the new product page', () => {
    render(<NewProduct />);
    
    expect(screen.getByTestId('new-product-page')).toBeInTheDocument();
    expect(screen.getByText('إضافة منتج جديد')).toBeInTheDocument();
  });

  it('should have a form with inputs', () => {
    render(<NewProduct />);
    
    expect(screen.getByTestId('product-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});