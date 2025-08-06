# 📦 Product Inventory Management Panel

A modern, responsive inventory management system built with React, TypeScript, and cutting-edge web technologies. This application allows users to view, manage, search, and filter product inventory with real-time updates and persistent storage.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.0-yellow)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-blue)

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v20 or higher)
- **pnpm** (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd inventory-assignment
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm preview          # Preview production build

# Build & Quality
pnpm build            # Create production build
pnpm type-check       # Run TypeScript type checking
pnpm type-check:watch # Watch mode for type checking
pnpm lint             # Run ESLint
pnpm check-all        # Run type checking and linting together
```

## 🎯 Features Implemented

### ✅ Core Requirements

#### **Inventory Table** (`/products`)

- **Data Source**: Fetches products from `https://dummyjson.com/products`
- **Table Columns**: Product Name, Category, Price, Stock, Status (In Stock/Out of Stock)
- **Search**: Debounced search by product name (500ms delay)
- **Filtering**: Multi-select category filtering with visual badges
- **Sorting**: Clickable column headers for Price, Stock, and Product Name
- **Pagination**: Navigate through products with page size controls

#### **Add Product Form** (`/products/new`)

- **Form Fields**: Product name, Category dropdown, Price, Stock, Description
- **Validation**: Comprehensive validation using `react-hook-form` + `zod`
- **State Management**: React Query mutations with optimistic updates
- **UX**: Loading states, success/error feedback with toast notifications

### 🏆 Bonus Features Implemented

- **✅ TanStack Router**: Complete routing solution with type-safe navigation
- **✅ LocalStorage Persistence**: New products and edits persist across sessions
- **✅ In-Place Stock Editing**: Click-to-edit stock quantities directly in the table
- **✅ Advanced State Management**: Sophisticated filtering and search state management

## 🏗️ Architecture & Technical Approach

### **Project Structure**

```
src/
├── components/          # Reusable UI components (shadcn/ui)
├── hooks/              # Custom React hooks for business logic
├── lib/                # Core utilities and services
│   ├── api/           # API layer and data fetching
│   ├── services/      # Business logic services
│   └── storage.ts     # LocalStorage abstraction
├── routes/            # File-based routing (TanStack Router)
│   ├── products/      # Product-related pages and components
│   └── __root.tsx     # Root layout component
└── types/             # TypeScript type definitions
```

### **Technology Stack**

#### **Core Technologies**

- **React 19.1** with Hooks for UI development
- **TypeScript 5.8** for type safety and developer experience
- **Vite 7.0** for fast development and building
- **TailwindCSS 4.1** for utility-first styling

#### **State Management & Data**

- **TanStack React Query** for server state management, caching, and mutations
- **TanStack Router** for type-safe routing with search params validation
- **LocalStorage** for client-side persistence of new products and edits

#### **Forms & Validation**

- **react-hook-form** for performant form handling
- **Zod** for runtime schema validation and TypeScript inference

#### **UI Components**

- **shadcn/ui** component library built on Radix UI primitives
- **Lucide React** for consistent iconography
- **Motion** for smooth animations and transitions

#### **Data Processing**

- **Client-side filtering/sorting** for responsive interactions
- **Debounced search** to minimize API calls
- **Optimistic updates** for immediate UI feedback

### **Key Architectural Decisions**

1. **Hybrid Data Strategy**: Combines API data with localStorage for new products and edits
2. **Custom Hooks Pattern**: Business logic encapsulated in focused, reusable hooks
3. **Type-Safe Routing**: URL state management with schema validation
4. **Error Boundaries**: Graceful error handling with user-friendly fallbacks

### **Performance Optimizations**

- **Debounced Search**: 500ms delay prevents excessive API calls
- **Client-side Processing**: Fast filtering/sorting without server round-trips
- **React Query Caching**: Intelligent data caching and background updates
- **Code Splitting**: Automatic route-based code splitting via TanStack Router

### **Architectural Decision: Client-Side Pagination**

**Why not server-side pagination?**

- Server pagination would exclude localStorage products from results
- Client-side approach ensures consistent UX across API + local data
- Unified filtering/sorting works across all product sources

## 🔄 Data Flow

1. **Initial Load**: Fetch products from DummyJSON API
2. **Local Integration**: Merge API data with localStorage products and edits
3. **Real-time Updates**: Apply filters, search, and sorting client-side
4. **Persistence**: Save new products and edits to localStorage
5. **Optimistic UI**: Immediate updates with background sync

## 🎨 Design Decisions

### **UI/UX Principles**

- **Mobile-First**: Responsive design that works on all screen sizes
- **Accessibility**: Keyboard navigation, screen reader support, focus management
- **Visual Hierarchy**: Clear information hierarchy with consistent spacing
- **Feedback Systems**: Loading states, success/error messages, visual confirmations

### **Form Design**

- **Progressive Enhancement**: Form works without JavaScript
- **Real-time Validation**: Immediate feedback on form errors
- **Smart Defaults**: Sensible default values and auto-focus
- **Error Recovery**: Clear error messages with actionable guidance

## ⚠️ Known Limitations & TODOs

### **Current Limitations**

1. **API Constraints**

   - DummyJSON API doesn't support real POST/PUT/DELETE operations
   - New products only exist in localStorage
   - No server-side validation or persistence

2. **Performance Considerations**
   - Large datasets (1000+ products) may impact client-side filtering performance
   - No virtualization for extremely long product lists
   - Memory usage grows with localStorage data

### **Future Enhancements (TODOs)**

#### **High Priority**

- [ ] **Real Backend Integration**: Replace localStorage with proper API endpoints
- [ ] **Bulk Operations**: Multi-select for bulk edit/delete operations

#### **Medium Priority**

- [ ] **Image Uploads**: Product image management with drag-and-drop

### **Technical Debt**

- [ ] Add unit tests for critical business logic
- [ ] Set up E2E testing with Playwright

## 📊 Time Investment

**Total Time**: ~3 hours
