# API Integration Documentation

This directory contains the client-side integration with our Django REST API endpoints that connect to Supabase. The implementation follows a service-based architecture to provide a clean separation of concerns.

## Architecture

The API integration is structured as follows:

```
api/
├── config.js          # API configuration (endpoints, headers, etc.)
├── authService.js     # Authentication API calls
├── dataService.js     # Data operations API calls  
├── storageService.js  # Storage operations API calls
└── index.js           # Export all services
```

## Usage

### Authentication

For authentication operations, use the `useAuth` hook which is already set up in `contexts/AuthContext.js`:

```jsx
import { useAuth } from '../hooks';

function MyComponent() {
  const { user, signIn, signOut, loading, error } = useAuth();
  
  const handleLogin = async () => {
    try {
      await signIn('user@example.com', 'password');
      console.log('Logged in successfully!');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
  
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Data Operations

For data operations (CRUD), use the `useData` hook:

```jsx
import { useData } from '../hooks';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { fetchData, insertData, deleteData, loading, error } = useData();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchData('products');
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, [fetchData]);
  
  const handleAddProduct = async (productData) => {
    try {
      const response = await insertData('products', productData);
      if (response.success) {
        setProducts([...products, response.data]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteData('products', 'id', productId);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {/* Add product form */}
    </div>
  );
}
```

### File Storage

For file operations, use the `useStorage` hook:

```jsx
import { useStorage } from '../hooks';

function FileUploader() {
  const [files, setFiles] = useState([]);
  const { uploadFile, listFiles, deleteFile, loading, error } = useStorage();
  
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const response = await listFiles('my-bucket');
        if (response.success) {
          setFiles(response.data);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };
    
    loadFiles();
  }, [listFiles]);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const response = await uploadFile('my-bucket', file.name, file, file.type);
      if (response.success) {
        setFiles([...files, response]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      <input type="file" onChange={handleFileUpload} />
      
      <ul>
        {files.map(file => (
          <li key={file.path}>
            {file.path}
            <button onClick={() => deleteFile('my-bucket', file.path)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Direct Service Usage

If you need to use the services directly without hooks, you can import them directly:

```js
import { authService, dataService, storageService } from '../api';

// Example: Sign in a user
const signInUser = async (email, password) => {
  try {
    const response = await authService.signIn(email, password);
    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};
```

## Configuration

The API configuration is defined in `config.js`. If you need to change the API base URL or default headers, you can do so there:

```js
// Example for development environment
const API_BASE_URL = 'http://localhost:8000/api';

// Example for production environment
// const API_BASE_URL = 'https://api.yourdomain.com/api';
```

For deployment to different environments, use environment variables:

```js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

## Error Handling

All services include built-in error handling that:

1. Logs errors to the console
2. Throws errors so they can be caught and handled by components
3. Includes error information from the server when available

For components, always wrap API calls in try/catch blocks and handle errors appropriately:

```js
try {
  await dataService.insertData('products', productData);
} catch (error) {
  console.error('Error:', error.message);
  // Handle the error appropriately (show message, etc.)
}
``` 