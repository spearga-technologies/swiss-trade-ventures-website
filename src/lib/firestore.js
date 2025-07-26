import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { db } from "./firebase.js";

// Enhanced error handling wrapper
const withErrorHandling = async (operation, fallbackData = []) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Firestore operation error:", error);
    
    // Return fallback data for static generation
    if (error.code === 'unavailable' || error.message.includes('No connection')) {
      console.warn("Using fallback data due to connection issues");
      return fallbackData;
    }
    
    throw error;
  }
};

// Categories Collection Functions
export const categoriesCollection = collection(db, "categories");

// Get all categories with fallback
export const getAllCategories = async () => {
  const fallbackCategories = [
    {
      id: "demo-category",
      name: "Demo Category",
      description: "Demo category for testing",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return withErrorHandling(async () => {
    const querySnapshot = await getDocs(query(categoriesCollection, orderBy("name"), limit(50)));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories.length > 0 ? categories : fallbackCategories;
  }, fallbackCategories);
};

// Get category by ID with fallback
export const getCategoryById = async (categoryId) => {
  const fallbackCategory = {
    id: categoryId,
    name: "Demo Category",
    description: "Demo category description",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
  };

  return withErrorHandling(async () => {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such category, using fallback");
      return fallbackCategory;
    }
  }, fallbackCategory);
};

// Products Collection Functions
export const productsCollection = collection(db, "products");

// Get all products with fallback
export const getAllProducts = async () => {
  const fallbackProducts = [
    {
      id: "demo-product",
      name: "Demo Product",
      description: "Demo product for testing purposes",
      serialNumber: "DEMO001",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "demo-category",
      categoryRef: { path: "categories/demo-category" },
      variations: [
        {
          name: "Standard Version",
          attributes: [
            { title: "Size", value: "Medium" },
            { title: "Color", value: "White" }
          ]
        }
      ]
    }
  ];

  return withErrorHandling(async () => {
    const querySnapshot = await getDocs(query(productsCollection, orderBy("name"), limit(100)));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products.length > 0 ? products : fallbackProducts;
  }, fallbackProducts);
};

// Get single product by ID with fallback
export const getProductById = async (productId) => {
  const fallbackProduct = {
    id: productId,
    name: "Demo Product",
    description: "Demo product description",
    serialNumber: "DEMO001",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "demo-category",
    variations: []
  };

  return withErrorHandling(async () => {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product, using fallback");
      return fallbackProduct;
    }
  }, fallbackProduct);
};

// Group products by category for static generation with enhanced error handling
export const groupProductsByCategory = async () => {
  const fallbackData = {
    categories: [
      {
        id: "demo-category",
        name: "Demo Category",
        description: "Demo category for testing",
        image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    categorizedProducts: {
      "demo-category": {
        category: {
          id: "demo-category",
          name: "Demo Category",
          description: "Demo category for testing",
          image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        products: [
          {
            id: "demo-product",
            name: "Demo Product",
            description: "Demo product for testing purposes",
            serialNumber: "DEMO001",
            image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
            variations: []
          }
        ]
      }
    }
  };

  return withErrorHandling(async () => {
    console.log("Fetching categories and products...");
    
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts()
    ]);
    
    console.log(`Fetched ${categories.length} categories and ${products.length} products`);
    
    const categorizedProducts = {};
    
    // Initialize categories
    categories.forEach(category => {
      categorizedProducts[category.id] = {
        category: category,
        products: []
      };
    });
    
    // Group products by category
    products.forEach(product => {
      // Extract category ID from categoryRef path or use direct category field
      let categoryId = product.category;
      
      if (product.categoryRef && product.categoryRef.path) {
        categoryId = product.categoryRef.path.split('/').pop();
      }
      
      if (categorizedProducts[categoryId]) {
        categorizedProducts[categoryId].products.push(product);
      } else {
        // Create category if it doesn't exist
        categorizedProducts[categoryId] = {
          category: {
            id: categoryId,
            name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
            description: `Products in ${categoryId} category`,
            image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
          },
          products: [product]
        };
      }
    });
    
    return { categories, categorizedProducts };
  }, fallbackData);
};

// Leads Collection Functions
export const leadsCollection = collection(db, "leads");

// Add lead submission with enhanced error handling
export const addLead = async (leadData) => {
  return withErrorHandling(async () => {
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
    return docRef.id;
  }, null);
};