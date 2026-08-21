# Food Delivery Application with Golang (High Performance)

A production-oriented food delivery platform designed to connect customers, restaurant owners, delivery drivers, and system administrators.

The application allows customers to discover restaurants, browse menus, place orders, make payments, and track deliveries. Restaurant owners can manage their restaurants, menus, and orders, while delivery drivers can manage assigned deliveries and update order statuses.

---

## Table of Contents

* [Overview](#overview)
* [Core Features](#core-features)
* [System Workflow](#system-workflow)
* [Functional Requirements](#functional-requirements)
* [Non-Functional Requirements](#non-functional-requirements)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Database Design](#database-design)
* [Database Relationships](#database-relationships)
* [Order Lifecycle](#order-lifecycle)
* [Transactions and Data Consistency](#transactions-and-data-consistency)
* [Payment Architecture](#payment-architecture)
* [Caching Strategy](#caching-strategy)
* [Security](#security)
* [Scalability](#scalability)
* [Docker](#docker)
* [CI/CD](#cicd)
* [Deployment](#deployment)
* [Testing Strategy](#testing-strategy)
* [Future Improvements](#future-improvements)

---

# Overview

The Food Delivery Application is a multi-role platform composed of four main actors:

* Customer
* Restaurant Owner
* Delivery Driver
* System Administrator

The system is designed around the complete food ordering lifecycle:

```text
Restaurant Discovery
        |
        v
Menu Selection
        |
        v
Cart
        |
        v
Order Creation
        |
        v
Payment
        |
        v
Restaurant Processing
        |
        v
Driver Assignment
        |
        v
Food Pickup
        |
        v
Food Delivery
        |
        v
Order Completion
```

The project focuses on production-oriented backend engineering concepts such as database transactions, concurrency, caching, authentication, authorization, payment processing, scalability, and deployment.

---

# Core Features

## Customer

Customers can:

* Register and authenticate
* Verify their email address
* Reset their password
* Manage their profile
* Browse restaurants
* Search restaurants
* Filter restaurants
* View restaurant menus
* Search menu items
* Filter menu items
* Add items to the cart
* Update cart quantities
* Remove items from the cart
* Place orders
* Select a payment method
* Pay using Stripe
* Pay using PayPal
* Pay using Cash on Delivery
* Receive order status notifications
* Track order progress

---

## Restaurant Owner

Restaurant owners can:

* Register and authenticate
* Verify their email address
* Reset their password
* Manage their profile
* Create multiple restaurants
* Update restaurants
* Delete restaurants
* Manage restaurant information
* Create categories
* Update categories
* Delete categories
* Create menu items
* Update menu items
* Delete menu items
* Manage menu item availability
* Manage stock
* Receive incoming orders
* Accept orders
* Reject orders
* Update order progress
* Notify customers
* Assign orders to available delivery drivers

---

## System Administrator

Administrators can:

* Manage customers
* Manage restaurant owners
* Manage restaurants
* Manage delivery drivers
* Manage orders
* Manage payments
* Monitor the overall platform
* Manage system-level resources and operations

---

## Delivery Driver

Delivery drivers can:

* Register and authenticate
* Verify their email address
* Reset their password
* Manage their profile
* Set their availability status
* Become active or inactive
* Receive delivery assignments
* Accept delivery assignments
* View restaurant pickup information
* View customer delivery information
* Update delivery status
* Confirm completed deliveries
* Handle Cash on Delivery orders

---

# System Workflow

The primary order workflow is:

```text
Customer
   |
   v
Register / Login
   |
   v
Browse Restaurants
   |
   v
Select Restaurant
   |
   v
Browse Menu
   |
   v
Add Items to Cart
   |
   v
Place Order
   |
   +-----------------------+
   |                       |
   v                       v
Online Payment        Cash on Delivery
   |                       |
   +-----------+-----------+
               |
               v
       Restaurant Receives Order
               |
               v
        Accept / Reject Order
               |
               v
         Prepare the Order
               |
               v
       Assign Available Driver
               |
               v
          Driver Accepts
               |
               v
           Food Pickup
               |
               v
          Food Delivery
               |
               v
        Order Completed
```

---

# Functional Requirements

## Customer

| Requirement          | Description                         |
| -------------------- | ----------------------------------- |
| Authentication       | Registration, login and logout      |
| Email Verification   | Verify customer email               |
| Password Reset       | Reset forgotten passwords           |
| Restaurant Discovery | Browse restaurants                  |
| Restaurant Search    | Search restaurants                  |
| Restaurant Filtering | Filter restaurants                  |
| Menu                 | Browse restaurant menu              |
| Menu Search          | Search menu items                   |
| Menu Filtering       | Filter menu items                   |
| Cart                 | Add, update and remove items        |
| Orders               | Create and track orders             |
| Payments             | Stripe, PayPal and Cash on Delivery |
| Notifications        | Receive order updates               |

---

## Restaurant Owner

| Requirement           | Description                                 |
| --------------------- | ------------------------------------------- |
| Authentication        | Registration and login                      |
| Restaurant Management | Create, read, update and delete restaurants |
| Category Management   | Create, read, update and delete categories  |
| Menu Management       | Create, read, update and delete menu items  |
| Stock Management      | Manage menu item stock                      |
| Availability          | Enable or disable menu items                |
| Order Management      | Accept, reject and process orders           |
| Notifications         | Notify customers and drivers                |
| Driver Assignment     | Assign orders to available drivers          |

---

## System Administrator

| Requirement           | Description               |
| --------------------- | ------------------------- |
| User Management       | Manage all platform users |
| Restaurant Management | Manage all restaurants    |
| Order Management      | Manage all orders         |
| Payment Management    | Manage payment records    |

---

## Delivery Driver

| Requirement       | Description                    |
| ----------------- | ------------------------------ |
| Authentication    | Registration and login         |
| Availability      | Active/inactive status         |
| Assignment        | Receive delivery assignments   |
| Pickup            | View restaurant pickup address |
| Delivery          | View customer delivery address |
| Status Management | Update delivery status         |
| Payment           | Handle Cash on Delivery        |

---

# Non-Functional Requirements

## Availability

The system should be available 24/7 with minimal downtime.

## Security

Authentication, authorization, payment processing, and sensitive data must be protected against common security threats.

## Consistency

Critical operations must maintain data consistency, especially:

* Orders
* Order items
* Stock
* Payments
* Deliveries

## Scalability

The architecture should support increasing numbers of:

* Customers
* Restaurants
* Menu items
* Orders
* Drivers
* Concurrent requests

## Maintainability

The system should follow clear architectural boundaries and maintain a modular, testable, and understandable codebase.

## Performance

The system should minimize latency through:

* Database indexing
* Query optimization
* Redis caching
* Connection pooling
* Efficient API design
* Nginx
* Horizontal scaling when required

---

# Technology Stack

| Layer            | Technology       |
| ---------------- | ---------------- |
| Frontend         | Next.js          |
| Language         | TypeScript       |
| Backend          | Go               |
| Database         | PostgreSQL       |
| Cache            | Redis            |
| Reverse Proxy    | Nginx            |
| Containerization | Docker           |
| CI/CD            | GitHub Actions   |
| Cloud Provider   | DigitalOcean     |
| Online Payments  | Stripe, PayPal   |
| Offline Payments | Cash on Delivery |

---

# System Architecture

The initial architecture follows a modular backend approach.

```text
                         Client
                           |
                           v
                    +--------------+
                    |   Next.js    |
                    |  TypeScript  |
                    +------+-------+
                           |
                           v
                    +--------------+
                    |    Nginx     |
                    | Reverse Proxy|
                    +------+-------+
                           |
                           v
                    +--------------+
                    |   Go API     |
                    |   Backend    |
                    +------+-------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
      +--------------+             +--------------+
      |  PostgreSQL  |             |    Redis     |
      |   Database   |             |    Cache     |
      +--------------+             +--------------+
             |
             v
      +--------------+
      |   Payment    |
      |  Providers   |
      +--------------+
```

The backend is responsible for enforcing business rules, validating requests, managing transactions, and communicating with external payment providers.

---

# Database Design

## Users

```text
users
--------------------------------
id
name
phone
address
email
role
is_verified
password
created_at
updated_at
```

Roles:

```text
customer
owner
driver
admin
```

A future version can replace the role enum with dedicated role tables:

```text
users
roles
user_roles
```

This provides greater flexibility if users can have multiple roles.

---

## Restaurants

```text
restaurants
--------------------------------
id
title
description
owner_id
status
is_open
phone
address
longitude
latitude
created_at
updated_at
```

Relationship:

```text
Owner 1 -------- M Restaurants
```

One restaurant owner can manage multiple restaurants.

---

## Categories

```text
categories
--------------------------------
id
title
description
restaurant_id
created_at
updated_at
```

Relationship:

```text
Restaurant 1 -------- M Categories
```

---

## Menu Items

```text
menu_items
--------------------------------
id
title
description
status
price
image
category_id
stock
availability
created_at
updated_at
```

Relationship:

```text
Category 1 -------- M Menu Items
```

---

## Carts

```text
carts
--------------------------------
id
user_id
created_at
total_amount
updated_at
```

Relationship:

```text
User 1 -------- 1 Cart
```

---

## Cart Items

```text
cart_items
--------------------------------
id
cart_id
menu_item_id
quantity
amount
subtotal
created_at
updated_at
```

Relationship:

```text
Cart 1 -------- M Cart Items
```

---

## Orders

```text
orders
--------------------------------
id
order_code
user_id
cart_id
status
address
delivery_fee
total_amount
created_at
updated_at
```

Possible order statuses:

```text
PENDING
ACCEPTED
REJECTED
PREPARING
READY
ASSIGNED
PICKED_UP
DELIVERED
CANCELLED
```

---

## Order Items

```text
order_items
--------------------------------
id
order_id
menu_item_id
unit_price
subtotal
created_at
updated_at
```

The order item stores `unit_price` independently from the current menu item price.

This is important because menu prices can change after an order has been created.

For example:

```text
Current Menu Price: $15
Order Price:        $12
```

The historical order must continue to show `$12`.

---

## Payments

```text
payments
--------------------------------
id
order_id
user_id
transaction_id
status
amount
payment_method
paid_at
created_at
updated_at
```

Payment methods:

```text
STRIPE
PAYPAL
CASH
```

Payment statuses:

```text
PENDING
PAID
FAILED
REFUNDED
```

---

## Deliveries

```text
deliveries
--------------------------------
id
driver_id
order_id
status
pickup_address
delivery_address
pickup_at
delivered_at
created_at
updated_at
```

---

## Drivers

```text
drivers
--------------------------------
id
user_id
is_active
vehicle_type
longitude
latitude
created_at
updated_at
```

---

# Database Relationships

The main relationships are:

```text
User
 |
 +---- Restaurant Owner
 |          |
 |          +---- Restaurants
 |                   |
 |                   +---- Categories
 |                          |
 |                          +---- Menu Items
 |
 +---- Cart
       |
       +---- Cart Items
              |
              v
            Order
              |
              +---- Order Items
              |
              +---- Payment
              |
              +---- Delivery
                       |
                       +---- Driver
```

---

# Order Lifecycle

An order moves through several states.

```text
PENDING
   |
   +----> REJECTED
   |
   v
ACCEPTED
   |
   v
PREPARING
   |
   v
READY
   |
   v
ASSIGNED
   |
   v
PICKED_UP
   |
   v
DELIVERED
```

An order may also be cancelled depending on the business rules.

---

# Transactions and Data Consistency

Order creation is a critical operation and should be handled inside a PostgreSQL transaction.

A simplified flow:

```text
BEGIN TRANSACTION

1. Validate cart
2. Validate menu items
3. Validate stock
4. Create order
5. Create order items
6. Decrease stock
7. Create payment record
8. Clear cart

COMMIT
```

If any operation fails:

```text
ROLLBACK
```

Example:

```text
BEGIN
   |
   +-- Create Order
   |
   +-- Create Order Items
   |
   +-- Update Stock
   |
   +-- Create Payment
   |
   +-- COMMIT
```

If stock validation fails:

```text
BEGIN
   |
   +-- Create Order
   |
   +-- Create Order Items
   |
   +-- Update Stock ---- FAILED
   |
   +-- ROLLBACK
```

This prevents the database from entering an inconsistent state.

---

# Concurrency and Stock Management

Stock management introduces a concurrency problem.

For example, if only one item remains:

```text
Stock = 1
```

Two customers may attempt to purchase it simultaneously.

The backend must prevent both transactions from successfully purchasing the same item.

PostgreSQL row-level locking can be used for critical stock operations.

Conceptually:

```text
BEGIN

SELECT stock
FROM menu_items
WHERE id = ?
FOR UPDATE;

Validate stock

UPDATE menu_items
SET stock = stock - quantity
WHERE id = ?;

COMMIT
```

This ensures that concurrent transactions cannot incorrectly consume the same stock.

---

# Payment Architecture

Online payment flow:

```text
Customer
   |
   v
Create Order
   |
   v
Create Payment
   |
   v
Payment Provider
   |
   +-------- SUCCESS --------> PAID
   |
   +--------- FAILED --------> FAILED
```

Payment confirmation should not depend only on the frontend.

The backend should validate payment status through the payment provider and process secure webhooks where supported.

For Cash on Delivery:

```text
Customer
   |
   v
Create Order
   |
   v
Payment Method = CASH
   |
   v
Restaurant Accepts
   |
   v
Driver Delivers
   |
   v
Cash Collected
```

---

# Caching Strategy

Redis can be used for frequently accessed data that does not require immediate database consistency.

Potential cache candidates:

```text
restaurants
restaurant details
restaurant categories
restaurant menus
popular menu items
```

Example:

```text
Client
   |
   v
Go API
   |
   v
Redis
   |
   +---- Cache HIT ------> Response
   |
   +---- Cache MISS
             |
             v
         PostgreSQL
             |
             v
           Redis
             |
             v
          Response
```

Critical operations such as stock management and payment state should rely on the database as the source of truth.

---

# Security

The application should implement the following security practices:

* Password hashing
* Secure authentication
* Role-based authorization
* Input validation
* Request validation
* SQL injection prevention
* Rate limiting
* HTTPS
* Secure HTTP headers
* Secure cookie configuration where applicable
* Payment webhook verification
* Environment-based secrets
* Proper error handling
* Audit logging for sensitive operations

The backend must never trust sensitive values supplied by the client.

For example, the client should not be allowed to determine the final order price.

The backend should calculate:

```text
subtotal
+ delivery fee
+ applicable discounts
= total
```

using trusted server-side data.

---

# Scalability

The initial implementation should prioritize correctness, database optimization, and clean architecture before introducing unnecessary distributed complexity.

A future horizontally-scaled architecture could look like:

```text
                         Internet
                            |
                            v
                         Nginx
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
           Go API         Go API        Go API
              |             |             |
              +-------------+-------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
             PostgreSQL             Redis
```

Potential scaling strategies include:

* Database indexing
* Connection pooling
* Horizontal API scaling
* Read replicas
* Redis caching
* CDN for static assets
* Object storage for images
* Background workers
* Message queues
* Database partitioning when justified
* Advanced search infrastructure

---

# Docker

The application can be containerized using Docker.

A possible local development environment:

```text
Docker
 |
 +-- Next.js
 |
 +-- Go API
 |
 +-- PostgreSQL
 |
 +-- Redis
 |
 +-- Nginx
```

Docker provides consistent development, testing, and production environments.

---

# CI/CD

GitHub Actions can automate the development and deployment pipeline.

```text
Developer
    |
    v
Git Push
    |
    v
GitHub
    |
    v
GitHub Actions
    |
    +-- Tests
    |
    +-- Lint
    |
    +-- Build
    |
    +-- Docker Image
    |
    +-- Deployment
    |
    v
DigitalOcean
```

The pipeline should prevent deployment when tests or required checks fail.

---

# Deployment

The application can be deployed on DigitalOcean.

Example production architecture:

```text
                         Internet
                            |
                            v
                         Nginx
                            |
                    +-------+-------+
                    |               |
                    v               v
                 Next.js          Go API
                                    |
                           +--------+--------+
                           |                 |
                           v                 v
                       PostgreSQL          Redis
```

Production secrets should be stored securely and never committed to source control.

Example environment variables:

```text
DATABASE_URL=
REDIS_URL=
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
JWT_SECRET=
```

---

# Testing Strategy

## Unit Tests

Unit tests should cover isolated business logic such as:

* Order calculations
* Delivery fee calculations
* Stock validation
* Payment state transitions
* Order state transitions

## Integration Tests

Integration tests should validate communication between:

```text
Go API
 |
 +-- PostgreSQL
 |
 +-- Redis
 |
 +-- Payment Providers
```

## End-to-End Tests

The complete customer workflow should be tested:

```text
Register
   |
Login
   |
Browse Restaurant
   |
Select Menu
   |
Add to Cart
   |
Place Order
   |
Payment
   |
Restaurant Accepts
   |
Driver Assigned
   |
Pickup
   |
Delivery
   |
Order Completed
```

---

# Engineering Principles

The project should follow established software engineering principles:

* Separation of concerns
* SOLID principles
* DRY
* Single responsibility
* Clear domain boundaries
* Database normalization
* Proper indexing
* Explicit transaction boundaries
* Idempotency for critical operations
* Server-side validation
* Secure-by-default design
* Observability
* Structured logging
* Testability

---

# Future Improvements

Potential future features include:

* Real-time order tracking
* Driver GPS tracking
* WebSocket communication
* Push notifications
* SMS notifications
* WhatsApp notifications
* Restaurant ratings
* Customer reviews
* Favorites
* Coupons and promotions
* Scheduled orders
* Delivery zones
* Dynamic delivery pricing
* Refund management
* Analytics dashboard
* Restaurant analytics
* Driver analytics
* Background job processing
* Message queues
* Advanced search
* Event-driven architecture

Microservices can be considered later if the scale and organizational requirements justify the additional operational complexity.

---

# Project Goals

This project is designed not only to implement a food delivery application, but also to demonstrate practical backend and system design concepts.

The main engineering areas are:

```text
Database Design
        |
Transactions
        |
Concurrency
        |
Authentication
        |
Authorization
        |
Payment Processing
        |
Caching
        |
Performance
        |
Scalability
        |
Docker
        |
CI/CD
        |
Cloud Deployment
```

The final system should provide a solid foundation for understanding how a real-world transactional application can be designed, implemented, tested, and deployed in a production environment.
