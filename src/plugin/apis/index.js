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

  listMenu: 'menu/get-all-menu',
  getMenu: 'menu/get-menu-details/',
  deleteMenu: 'menu/delete-menu/',
  createMenu: 'menu/create-menu',
  updateMenu: 'menu/update-menu/',
}

export default requests
