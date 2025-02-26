# Restaurant Menu

The Restaurant Menu Platform is a web application built with Vue 3 that allows authenticated users to view menus, restaurants, and order food (only add in cart). The platform supports role-based access, where restaurant owners can create and manage menus, food items, etc., and customers can view and select menu items.

## Features

### **Restaurant Owner**

- **User Authentication**:  Register and login to access the platform.
- **Create and Manage Categories**:  Define food item categories
- **Create and Manage Food Items**:  Add individual food items under specific categories.
- **Create and Manage Combos**:  Group multiple food items into combos for special offers.
- **Activate or Inactivate Items and Combos**:  Control availability by marking items and combos as active or inactive.
- **Set Today's Special Combo**:  Highlight a special combo for the day to attract customers.
- **View and Manage Menus**:  Create, update, and delete restaurant menus using predefined categories and items.
- **Dashboard Overview**:  View a list of menus with an intuitive interface, displaying an empty state when no menus exist.

### **Customer**

- **View Restaurants**:  Browse available restaurants and explore their menus.
- **View Specific Restaurant Menus**:  Check the restaurant’s menu, including available combos and food items.
- **Select Combo and Food Items**:  Choose from a variety of food items and combos.
- **Add to Cart**:  Select food items and add them to the cart (ordering functionality not included yet).
- **View Order Summary in Cart**:  Get a detailed summary of selected items along with their total price.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Tech Stack

- **Frontend:** Vue 3, Vite, Tailwind CSS
- **State Management:** Pinia
- **Validation:** vee-validate, yup
- **Infinite Loader:** vue-infinite-scroll
- **Notifications:** vue-toast-notification, vue-sweetalert2
- **API Calls:** axios

## GitHub Repository

- See [GitHub](https://github.com/jaimipatel-Al/Restaurant-Menu)
- See [Link](https://jaimipatel-al.github.io/Restaurant-Menu/)