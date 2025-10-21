# Storefront API Documentation

## Overview

The Storefront API provides comprehensive e-commerce functionality for building modern online stores. It handles product management, shopping cart operations, checkout processes, inventory management, and customer experience features.

## Table of Contents

- [Product Management](#product-management)
- [Category Management](#category-management)
- [Shopping Cart](#shopping-cart)
- [Checkout & Payment](#checkout--payment)
- [Order Management](#order-management)
- [Inventory Management](#inventory-management)
- [Discounts & Promotions](#discounts--promotions)
- [Product Reviews](#product-reviews)
- [Wishlist Management](#wishlist-management)
- [Product Recommendations](#product-recommendations)
- [SEO Optimization](#seo-optimization)
- [Integration Patterns](#integration-patterns)

## Product Management

### Product Schema

```typescript
interface Product {
  name: string;                    // Product display name
  description: string;             // Detailed product description
  price: number;                   // Current selling price
  compareAtPrice?: number;         // Original price for discounts
  sku: string;                     // Stock Keeping Unit
  barcode?: string;                // Product barcode (EAN/UPC)
  weight?: number;                 // Product weight in grams
  inventory: number;               // Available stock quantity
  images: string[];                // Product image URLs
  variants?: ProductVariant[];     // Product variants (size, color, etc.)
  categories: string[];            // Category slugs
  tags: string[];                  // Product tags for filtering
  seo?: SEOData;                   // SEO metadata
}

interface ProductVariant {
  name: string;                    // Variant name (e.g., "Large, Blue")
  price: number;                   // Variant-specific price
  sku: string;                     // Variant SKU
  inventory: number;               // Variant stock quantity
}

interface SEOData {
  title?: string;                  // SEO title override
  description?: string;            // SEO description
  keywords?: string[];             // SEO keywords
}
```

### Create Product

**Endpoint:** `storefront.createProduct`
**Access:** Protected (Admin/Merchant)

```typescript
mutation createProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
    sku
  }
}
```

**Example Usage:**
```typescript
const newProduct = await api.storefront.createProduct.mutate({
  name: "Premium Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 299.99,
  compareAtPrice: 399.99,
  sku: "WH-001",
  barcode: "1234567890123",
  weight: 350,
  inventory: 100,
  images: [
    "https://cdn.example.com/headphones-1.jpg",
    "https://cdn.example.com/headphones-2.jpg"
  ],
  variants: [
    {
      name: "Black",
      price: 299.99,
      sku: "WH-001-BLK",
      inventory: 50
    },
    {
      name: "Silver",
      price: 299.99,
      sku: "WH-001-SLV",
      inventory: 30
    }
  ],
  categories: ["electronics", "audio"],
  tags: ["wireless", "noise-cancelling", "premium"],
  seo: {
    title: "Premium Wireless Headphones | Your Store",
    description: "Shop our premium wireless headphones with advanced noise cancellation technology",
    keywords: ["headphones", "wireless", "audio", "noise-cancelling"]
  }
});
```

### Update Product

**Endpoint:** `storefront.updateProduct`
**Access:** Protected (Admin/Merchant)

```typescript
mutation updateProduct($id: String!, $data: ProductUpdateInput!) {
  updateProduct(id: $id, data: $data) {
    success
  }
}
```

**Example Usage:**
```typescript
await api.storefront.updateProduct.mutate({
  id: "product-123",
  data: {
    price: 279.99,
    inventory: 85,
    images: [
      "https://cdn.example.com/headphones-1.jpg",
      "https://cdn.example.com/headphones-2.jpg",
      "https://cdn.example.com/headphones-3.jpg" // New image added
    ]
  }
});
```

### Delete Product

**Endpoint:** `storefront.deleteProduct`
**Access:** Protected (Admin/Merchant)

```typescript
mutation deleteProduct($id: String!) {
  deleteProduct(id: $id) {
    success
  }
}
```

### Get Product

**Endpoint:** `storefront.getProduct`
**Access:** Public

```typescript
query getProduct($id: String, $slug: String) {
  getProduct(id: $id, slug: $slug) {
    id
    name
    description
    price
    compareAtPrice
    sku
    inventory
    images
    variants {
      name
      price
      sku
      inventory
    }
    categories
    tags
    seo {
      title
      description
      keywords
    }
  }
}
```

**Example Usage:**
```typescript
// Get by ID
const product = await api.storefront.getProduct.query({
  id: "product-123"
});

// Get by slug
const productBySlug = await api.storefront.getProduct.query({
  slug: "premium-wireless-headphones"
});
```

### List Products

**Endpoint:** `storefront.listProducts`
**Access:** Public

```typescript
query listProducts($filters: ProductFilters!) {
  listProducts(filters: $filters) {
    products {
      id
      name
      price
      compareAtPrice
      images
      inventory
      categories
      tags
    }
    total
    pages
  }
}
```

**Filtering Options:**
```typescript
interface ProductFilters {
  category?: string;              // Filter by category slug
  tags?: string[];                // Filter by tags
  search?: string;                // Search in name/description
  minPrice?: number;              // Minimum price filter
  maxPrice?: number;              // Maximum price filter
  inStock?: boolean;              // Only in-stock products
  sortBy?: 'price' | 'name' | 'created' | 'popular';
  page?: number;                  // Pagination (default: 1)
  limit?: number;                 // Items per page (default: 20)
}
```

**Example Usage:**
```typescript
const products = await api.storefront.listProducts.query({
  category: "electronics",
  minPrice: 100,
  maxPrice: 500,
  inStock: true,
  sortBy: "price",
  page: 1,
  limit: 20
});
```

## Category Management

### Create Category

**Endpoint:** `storefront.createCategory`
**Access:** Protected (Admin/Merchant)

```typescript
mutation createCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    id
    name
    slug
    description
    parent
    image
    seo {
      title
      description
    }
  }
}
```

**Example Usage:**
```typescript
const category = await api.storefront.createCategory.mutate({
  name: "Audio Equipment",
  slug: "audio-equipment",
  description: "Professional and consumer audio equipment",
  parent: "electronics",
  image: "https://cdn.example.com/categories/audio.jpg",
  seo: {
    title: "Audio Equipment | Your Store",
    description: "Browse our selection of professional and consumer audio equipment"
  }
});
```

### Get Categories

**Endpoint:** `storefront.getCategories`
**Access:** Public

```typescript
query getCategories {
  getCategories {
    categories {
      id
      name
      slug
      description
      parent
      image
      seo {
        title
        description
      }
    }
  }
}
```

## Shopping Cart

### Get Cart

**Endpoint:** `storefront.getCart`
**Access:** Public

```typescript
query getCart($cartId: String) {
  getCart(cartId: $cartId) {
    id
    items {
      id
      productId
      variantId
      quantity
      price
      total
      product {
        name
        images
      }
    }
    subtotal
    tax
    shipping
    total
  }
}
```

### Add to Cart

**Endpoint:** `storefront.addToCart`
**Access:** Public

```typescript
mutation addToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    cartId
    success
  }
}
```

**Example Usage:**
```typescript
const result = await api.storefront.addToCart.mutate({
  cartId: "cart-123", // Optional, creates new cart if not provided
  productId: "product-456",
  variantId: "variant-789", // Optional for products with variants
  quantity: 2
});
```

### Update Cart Item

**Endpoint:** `storefront.updateCartItem`
**Access:** Public

```typescript
mutation updateCartItem($input: UpdateCartItemInput!) {
  updateCartItem(input: $input) {
    success
  }
}
```

### Remove from Cart

**Endpoint:** `storefront.removeFromCart`
**Access:** Public

```typescript
mutation removeFromCart($input: RemoveFromCartInput!) {
  removeFromCart(input: $input) {
    success
  }
}
```

### Apply Coupon

**Endpoint:** `storefront.applyCoupon`
**Access:** Public

```typescript
mutation applyCoupon($cartId: String!, $code: String!) {
  applyCoupon(cartId: $cartId, code: $code) {
    success
    discount
  }
}
```

**Example Usage:**
```typescript
const discount = await api.storefront.applyCoupon.mutate({
  cartId: "cart-123",
  code: "SUMMER20"
});
```

## Checkout & Payment

### Create Checkout

**Endpoint:** `storefront.createCheckout`
**Access:** Public

```typescript
mutation createCheckout($input: CheckoutInput!) {
  createCheckout(input: $input) {
    checkoutId
    checkoutUrl
  }
}
```

**Example Usage:**
```typescript
const checkout = await api.storefront.createCheckout.mutate({
  cartId: "cart-123",
  email: "customer@example.com",
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    country: "US",
    zip: "10001",
    phone: "+1-555-0123"
  },
  billingAddress: {
    sameAsShipping: true
  }
});
```

### Get Shipping Rates

**Endpoint:** `storefront.getShippingRates`
**Access:** Public

```typescript
query getShippingRates($checkoutId: String!) {
  getShippingRates(checkoutId: $checkoutId) {
    rates {
      id
      name
      price
      days
    }
  }
}
```

**Example Response:**
```typescript
{
  rates: [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 5.99,
      days: "5-7"
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 15.99,
      days: "2-3"
    }
  ]
}
```

### Process Payment

**Endpoint:** `storefront.processPayment`
**Access:** Public

```typescript
mutation processPayment($input: PaymentInput!) {
  processPayment(input: $input) {
    orderId
    orderNumber
    success
  }
}
```

**Payment Methods:**
- `card` - Credit/Debit Card
- `paypal` - PayPal
- `apple_pay` - Apple Pay
- `google_pay` - Google Pay

**Example Usage:**
```typescript
const payment = await api.storefront.processPayment.mutate({
  checkoutId: "checkout-123",
  paymentMethod: "card",
  shippingRateId: "express",
  paymentToken: "tok_1234567890", // From payment processor
  savePaymentMethod: false
});
```

## Order Management

### Create Order

**Endpoint:** `storefront.createOrder`
**Access:** Protected

```typescript
mutation createOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    orderId
    orderNumber
  }
}
```

### Get Order

**Endpoint:** `storefront.getOrder`
**Access:** Public (with verification)

```typescript
query getOrder($orderId: String, $orderNumber: String, $email: String) {
  getOrder(orderId: $orderId, orderNumber: $orderNumber, email: $email) {
    id
    orderNumber
    status
    items {
      productId
      variantId
      quantity
      price
      total
    }
    customer {
      email
      phone
    }
    shippingAddress
    billingAddress
    shippingMethod
    paymentMethod
    subtotal
    tax
    shipping
    total
    trackingNumber
    trackingUrl
    notes
  }
}
```

### List Orders

**Endpoint:** `storefront.listOrders`
**Access:** Protected

```typescript
query listOrders($filters: OrderFilters!) {
  listOrders(filters: $filters) {
    orders {
      id
      orderNumber
      status
      total
      createdAt
    }
    total
  }
}
```

**Order Status Types:**
- `pending` - Order received, awaiting processing
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `cancelled` - Order was cancelled

### Update Order Status

**Endpoint:** `storefront.updateOrderStatus`
**Access:** Protected (Admin/Merchant)

```typescript
mutation updateOrderStatus($input: UpdateOrderStatusInput!) {
  updateOrderStatus(input: $input) {
    success
  }
}
```

**Example Usage:**
```typescript
await api.storefront.updateOrderStatus.mutate({
  orderId: "order-123",
  status: "shipped",
  trackingNumber: "1Z999AA10123456784",
  trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=1Z999AA10123456784",
  notes: "Shipped via FedEx Express"
});
```

## Inventory Management

### Update Inventory

**Endpoint:** `storefront.updateInventory`
**Access:** Protected (Admin/Merchant)

```typescript
mutation updateInventory($input: InventoryUpdateInput!) {
  updateInventory(input: $input) {
    success
    newQuantity
  }
}
```

**Inventory Operations:**
- `set` - Set inventory to specific quantity
- `increment` - Add to current inventory
- `decrement` - Subtract from current inventory

**Example Usage:**
```typescript
// Set specific quantity
await api.storefront.updateInventory.mutate({
  productId: "product-123",
  quantity: 50,
  operation: "set"
});

// Add inventory
await api.storefront.updateInventory.mutate({
  productId: "product-123",
  variantId: "variant-456",
  quantity: 10,
  operation: "increment"
});

// Remove inventory (sale)
await api.storefront.updateInventory.mutate({
  productId: "product-123",
  quantity: 2,
  operation: "decrement"
});
```

## Discounts & Promotions

### Create Discount

**Endpoint:** `storefront.createDiscount`
**Access:** Protected (Admin/Merchant)

```typescript
mutation createDiscount($input: DiscountInput!) {
  createDiscount(input: $input) {
    id
    code
    type
    value
    // ... other fields
  }
}
```

**Discount Types:**
- `percentage` - Percentage discount (e.g., 20% off)
- `fixed` - Fixed amount discount (e.g., $10 off)
- `free_shipping` - Free shipping

**Example Usage:**
```typescript
const discount = await api.storefront.createDiscount.mutate({
  code: "SUMMER20",
  type: "percentage",
  value: 20,
  minPurchase: 100,
  usageLimit: 1000,
  perCustomerLimit: 1,
  startDate: new Date("2024-06-01"),
  endDate: new Date("2024-08-31"),
  applicableCategories: ["electronics", "audio"],
  applicableProducts: ["product-123", "product-456"]
});
```

## Product Reviews

### Create Review

**Endpoint:** `storefront.createReview`
**Access:** Protected

```typescript
mutation createReview($input: ReviewInput!) {
  createReview(input: $input) {
    id
    productId
    rating
    title
    comment
    images
  }
}
```

**Example Usage:**
```typescript
const review = await api.storefront.createReview.mutate({
  productId: "product-123",
  rating: 5,
  title: "Excellent Quality!",
  comment: "These headphones exceeded my expectations. Great sound quality and comfortable to wear.",
  images: [
    "https://cdn.example.com/reviews/user-image-1.jpg"
  ]
});
```

### Get Product Reviews

**Endpoint:** `storefront.getProductReviews`
**Access:** Public

```typescript
query getProductReviews($productId: String!, $page: Int, $limit: Int) {
  getProductReviews(productId: $productId, page: $page, limit: $limit) {
    reviews {
      id
      rating
      title
      comment
      images
      createdAt
      user {
        name
        avatar
      }
    }
    averageRating
    totalReviews
  }
}
```

## Wishlist Management

### Add to Wishlist

**Endpoint:** `storefront.addToWishlist`
**Access:** Protected

```typescript
mutation addToWishlist($productId: String!) {
  addToWishlist(productId: $productId) {
    success
  }
}
```

### Get Wishlist

**Endpoint:** `storefront.getWishlist`
**Access:** Protected

```typescript
query getWishlist {
  getWishlist {
    items {
      id
      product {
        id
        name
        price
        images
        inventory
      }
      addedAt
    }
  }
}
```

## Product Recommendations

### Get Recommendations

**Endpoint:** `storefront.getRecommendations`
**Access:** Public

```typescript
query getRecommendations($input: RecommendationInput!) {
  getRecommendations(input: $input) {
    products {
      id
      name
      price
      images
      rating
    }
  }
}
```

**Recommendation Types:**
- `similar` - Similar products based on attributes
- `frequently_bought` - Products frequently bought together
- `trending` - Currently trending products
- `personalized` - Personalized recommendations based on user history

**Example Usage:**
```typescript
// Similar products
const similar = await api.storefront.getRecommendations.query({
  productId: "product-123",
  type: "similar",
  limit: 8
});

// Personalized recommendations
const personalized = await api.storefront.getRecommendations.query({
  userId: "user-456",
  type: "personalized",
  limit: 10
});

// Trending products
const trending = await api.storefront.getRecommendations.query({
  type: "trending",
  limit: 12
});
```

## SEO Optimization

### Product SEO Fields

The Storefront API includes comprehensive SEO support for products:

```typescript
interface SEOData {
  title?: string;           // Custom meta title (max 60 chars)
  description?: string;     // Meta description (max 160 chars)
  keywords?: string[];      // SEO keywords
}
```

### SEO Best Practices

1. **Title Optimization:**
   ```typescript
   seo: {
     title: "Premium Wireless Headphones - Noise Cancelling | YourStore",
     description: "Experience superior sound quality with our premium wireless headphones. Advanced noise cancellation, 30-hour battery life, and comfortable design.",
     keywords: ["wireless headphones", "noise cancelling", "bluetooth audio", "premium headphones"]
   }
   ```

2. **URL Structure:**
   - Use category-based URLs: `/category/product-slug`
   - Keep URLs short and descriptive
   - Use hyphens instead of underscores

3. **Structured Data:**
   - Products include schema.org markup
   - Rich snippets for price, availability, and reviews
   - Breadcrumb navigation support

## Integration Patterns

### Frontend Integration

```typescript
// React example with tRPC
import { trpc } from '../utils/trpc';

function ProductList() {
  const { data, isLoading } = trpc.storefront.listProducts.useQuery({
    category: "electronics",
    page: 1,
    limit: 20
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Payment Gateway Integration

```typescript
// Stripe integration example
const handlePayment = async () => {
  // Create payment method
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement(CardElement),
  });

  if (error) return;

  // Process payment through API
  const result = await api.storefront.processPayment.mutate({
    checkoutId: checkout.id,
    paymentMethod: 'card',
    shippingRateId: selectedShippingRate,
    paymentToken: paymentMethod.id
  });

  if (result.success) {
    // Redirect to order confirmation
    router.push(`/orders/${result.orderId}`);
  }
};
```

### Inventory Synchronization

```typescript
// Real-time inventory updates
const updateInventoryAfterSale = async (items: CartItem[]) => {
  const updates = items.map(item => 
    api.storefront.updateInventory.mutate({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      operation: 'decrement'
    })
  );

  await Promise.all(updates);
};
```

### Email Integration

```typescript
// Order confirmation email
const sendOrderConfirmation = async (orderId: string) => {
  const order = await api.storefront.getOrder.query({
    orderId,
    email: customerEmail
  });

  await emailService.send({
    to: order.customer.email,
    template: 'order-confirmation',
    data: { order }
  });
};
```

## Error Handling

The API follows standard error handling patterns:

```typescript
try {
  const product = await api.storefront.getProduct.query({
    id: "product-123"
  });
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    // Product not found
  } else if (error.code === 'UNAUTHORIZED') {
    // Authentication required
  } else {
    // Other errors
  }
}
```

## Security Considerations

1. **Authentication:** Protected endpoints require valid authentication
2. **Authorization:** Role-based access control for admin functions
3. **Input Validation:** All inputs validated using Zod schemas
4. **Rate Limiting:** Implement rate limiting for public endpoints
5. **PCI Compliance:** Payment processing follows PCI DSS standards

## Performance Optimization

1. **Caching:** Product data cached for 5 minutes
2. **Pagination:** Large datasets use pagination
3. **Image Optimization:** Product images served via CDN
4. **Database Indexing:** Optimized queries with proper indexes
5. **Lazy Loading:** Product variants loaded on demand

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { storefrontRouter } from '../routers/storefront';

describe('Storefront Router', () => {
  it('should create product successfully', async () => {
    const result = await storefrontRouter.createProduct({
      input: {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        sku: 'TEST-001',
        inventory: 10,
        images: [],
        categories: [],
        tags: []
      }
    });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test Product');
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTRPCMsw } from 'trpc-msw';

describe('Storefront Integration', () => {
  beforeEach(() => {
    // Setup test data
  });

  it('should complete full checkout flow', async () => {
    // Add to cart
    await api.storefront.addToCart.mutate({
      productId: 'test-product',
      quantity: 1
    });

    // Create checkout
    const checkout = await api.storefront.createCheckout.mutate({
      cartId: 'test-cart',
      email: 'test@example.com',
      shippingAddress: testAddress,
      billingAddress: { sameAsShipping: true }
    });

    // Process payment
    const order = await api.storefront.processPayment.mutate({
      checkoutId: checkout.checkoutId,
      paymentMethod: 'card',
      shippingRateId: 'standard'
    });

    expect(order.success).toBe(true);
  });
});
```

## Migration Guide

### From v1 to v2

1. **Product Schema Changes:**
   - Added `variants` field for product variants
   - Enhanced SEO fields
   - New inventory tracking

2. **Checkout Flow Updates:**
   - Multi-step checkout process
   - Enhanced address validation
   - Support for multiple payment methods

3. **API Changes:**
   - Added recommendation endpoints
   - Enhanced discount system
   - Improved error handling

## Conclusion

The Storefront API provides a comprehensive foundation for building modern e-commerce applications. With proper integration and following the patterns outlined in this documentation, developers can create scalable, secure, and user-friendly online stores.

For additional support or questions, refer to the API source code or contact the development team.
