export const USER_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  USER_MESSAGES:"User profile Detatis get successfully",
  LOGIN_SUCCESS: 'Login successfully',
  AUTH_ERROR: 'Invalid credentials',
  NOT_FOUND: 'User not found',
  UPDATE_SUCCESS: 'User updated successfully',
  DELETE_SUCCESS: 'User deleted successfully',
};

export const PRODUCT_MESSAGES = {
  CREATE_SUCCESS: 'Product created successfully',
  UPDATE_SUCCESS: 'Product updated successfully',
  DELETE_SUCCESS: (name: string) => `Product ${name} deleted successfully`,
  NOT_FOUND: (id: string) => `Product with ID ${id} not found`,
  CREATE_ERROR: 'Failed to create product',
  UPDATE_ERROR: 'Failed to update product',
};

export const IMAGE_UPLOAD_PATH = './uploads/products';
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'applicaton/msexcel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
