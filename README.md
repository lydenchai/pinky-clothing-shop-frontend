# PINKY Clothing Shop 👕

A modern, fully responsive e-commerce application built with Angular 18+ and integrated with a Node.js/Express/MySQL backend.

## ✨ Features

### 🔐 Authentication & User Management

- JWT-based authentication
- Login/Register with validation
- User profile management
- Protected routes with auth guards

### 🏠 Homepage

- Dynamic product display from backend
- Featured products showcase
- Category browsing
- Real-time product updates

### 👕 Product Management

- Grid layout with responsive design
- Backend-powered filtering (category, price, stock)
- Real-time search
- Product details with images

### 🛒 Shopping Cart

- Backend-synchronized cart
- Real-time quantity updates
- Persistent cart across sessions
- Stock validation

### � Checkout & Orders

- Complete checkout process
- Order creation and tracking
- Order history
- Status updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v18+)
- Backend server running (see backend README)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Update `src/environments/environment.ts` with your backend URL:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:3000/api",
   };
   ```

3. **Start development server**

   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200/`

## � Project Structure

```
src/app/
├── components/       # Reusable components (header, footer, product-card)
├── pages/           # Page components (home, products, cart, checkout, login)
├── services/        # API services (auth, product, cart, order)
├── models/          # TypeScript interfaces
├── interceptors/    # HTTP interceptors (auth token injection)
└── environments/    # Environment configurations
```

## 🔧 API Integration

### Services Overview

- **AuthService**: Login, register, profile management, JWT handling
- **ProductService**: Fetch products, filtering, search, categories
- **CartService**: Add/remove items, update quantities, sync with backend
- **OrderService**: Create orders, view history, track status

### Authentication Flow

1. Login/Register → Receive JWT token
2. Token stored in localStorage
3. Auth interceptor adds token to all requests
4. Backend validates token on protected routes

## 🎯 Key Features

### Real-time Cart Management

- Cart synced with backend on every operation
- Stock validation before adding items
- Persistent across sessions

### Advanced Product Filtering

```typescript
// Filter by category, price range, search query
productService.getAllProducts({
  category: "Shirts",
  minPrice: 20,
  maxPrice: 50,
  search: "cotton",
  inStock: true,
});
```

### Order Management

- Create orders from cart items
- Automatic stock reduction
- Cart cleared after checkout
- View order history with details

## 📱 Responsive Design

Fully responsive design with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- JWT authentication
- HTTP-only auth interceptor
- Input validation
- CORS protection
- XSS prevention

## 🛠️ Available Scripts

```bash
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

## 🌐 Backend Integration

Ensure the backend is running before starting the frontend:

```bash
# In backend directory
npm run dev
```

Demo credentials:

- Email: `pinky@example.com`
- Password: `password123`

## 📦 Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🐛 Troubleshooting

### Connection Issues

- Verify backend is running on port 3000
- Check `environment.ts` has correct API URL
- Ensure CORS is configured in backend

### Authentication Problems

- Clear localStorage and try again
- Check token in DevTools → Application → Local Storage
- Verify backend JWT configuration

## 📄 License

ISC

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
