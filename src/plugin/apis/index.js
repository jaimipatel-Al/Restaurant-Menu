const requests = {
  signUp: 'auth/sign-up',
  login: 'auth/login',

  listCategory: 'categories/list-categories',
  getCategory: 'categories/get-category/',
  deleteCategory: 'categories/delete/',
  createCategory: 'categories/create-category',
  updateCategory: 'categories/update-category/',

  listItem: 'subcategories/get-all-subcategories',
  getItem: 'subcategories/get-details-subcategories/',
  deleteItem: 'subcategories/delete-subcategories/',
  createItem: 'subcategories/create-subcategories',
  updateItem: 'subcategories/update-subcategories/',
  toggleItemAvailability: 'subcategories/toggle-subcategory-status/',

  listCombo: 'menu/get-all-menu',
  getCombo: 'menu/get-menu-details/',
  deleteCombo: 'menu/delete-menu/',
  createCombo: 'menu/create-menu',
  updateCombo: 'menu/update-menu/',
  toggleComboAvailability: 'menu/toggle-menu-status/',
  selectToday: 'menu/select-today/',

  restaurantList: 'auth/owners',

  customerMenu: `customer/menu/`,
  customerItems: `customer/items/`,
}

export default requests
