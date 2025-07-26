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

// Enhanced error handling wrapper with timeout
const withErrorHandling = async (operation, fallbackData = [], timeoutMs = 8000) => {
  return new Promise(async (resolve) => {
    // Set up timeout
    const timeoutId = setTimeout(() => {
      console.warn("Firestore operation timed out, using fallback data");
      resolve(fallbackData);
    }, timeoutMs);

    try {
      const result = await operation();
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Firestore operation error:", error.message);
      
      // Always return fallback data on any error
      console.warn("Using fallback data due to error:", error.code || 'unknown');
      resolve(fallbackData);
    }
  });
};

// Categories Collection Functions
export const categoriesCollection = collection(db, "categories");

// Get all categories with enhanced fallback
export const getAllCategories = async () => {
  const fallbackCategories = [
    {
      id: "demo-category",
      name: "Demo Category",
      description: "Demo category for testing purposes. This is a fallback category used when Firestore is unavailable.",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return withErrorHandling(async () => {
    console.log("Fetching categories from Firestore...");
    const querySnapshot = await getDocs(query(categoriesCollection, orderBy("name"), limit(50)));
    const categories = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({ 
        id: doc.id, 
        name: data.name || 'Unnamed Category',
        description: data.description || 'No description available',
        image: data.image || fallbackCategories[0].image
      });
    });
    console.log(`Successfully fetched ${categories.length} categories from Firestore`);
    return categories.length > 0 ? categories : fallbackCategories;
  }, fallbackCategories);
};

// Get category by ID with enhanced fallback
export const getCategoryById = async (categoryId) => {
  const fallbackCategory = {
    id: categoryId,
    name: "Demo Category",
    description: "Demo category description. This is a fallback category used when the requested category is not available.",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
  };

  return withErrorHandling(async () => {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        name: data.name || fallbackCategory.name,
        description: data.description || fallbackCategory.description,
        image: data.image || fallbackCategory.image
      };
    } else {
      console.log("Category not found, using fallback");
      return fallbackCategory;
    }
  }, fallbackCategory);
};

// Products Collection Functions
export const productsCollection = collection(db, "products");

// Get all products with enhanced fallback
export const getAllProducts = async () => {
  const fallbackProducts = [
    {
      id: "demo-product",
      name: "Demo Product",
      description: "Demo product for testing purposes. This is a fallback product used when Firestore is unavailable.",
      serialNumber: "DEMO001",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "demo-category",
      categoryRef: { path: "categories/demo-category" },
      variations: [
        {
          name: "Standard Version",
          attributes: [
            { title: "Size", value: "Medium" },
            { title: "Color", value: "White" },
            { title: "Material", value: "Premium" }
          ]
        }
      ]
    }
  ];

  return withErrorHandling(async () => {
    console.log("Fetching products from Firestore...");
    const querySnapshot = await getDocs(query(productsCollection, orderBy("name"), limit(100)));
    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: doc.id, 
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available',
        serialNumber: data.serialNumber || 'N/A',
        image: data.image || fallbackProducts[0].image,
        category: data.category || 'uncategorized',
        categoryRef: data.categoryRef || null,
        variations: data.variations || []
      });
    });
    console.log(`Successfully fetched ${products.length} products from Firestore`);
    return products.length > 0 ? products : fallbackProducts;
  }, fallbackProducts);
};

// Get single product by ID with enhanced fallback
export const getProductById = async (productId) => {
  const fallbackProduct = {
    id: productId,
    name: "Demo Product",
    description: "Demo product description. This is a fallback product used when the requested product is not available.",
    serialNumber: "DEMO001",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "demo-category",
    variations: []
  };

  return withErrorHandling(async () => {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        name: data.name || fallbackProduct.name,
        description: data.description || fallbackProduct.description,
        serialNumber: data.serialNumber || fallbackProduct.serialNumber,
        image: data.image || fallbackProduct.image,
        category: data.category || fallbackProduct.category,
        variations: data.variations || []
      };
    } else {
      console.log("Product not found, using fallback");
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
        description: "Demo category for testing purposes. This fallback data is used when Firestore is unavailable.",
        image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    categorizedProducts: {
      "demo-category": {
        category: {
          id: "demo-category",
          name: "Demo Category",
          description: "Demo category for testing purposes. This fallback data is used when Firestore is unavailable.",
          image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        products: [
          {
            id: "demo-product",
            name: "Demo Product",
            description: "Demo product for testing purposes. This fallback data is used when Firestore is unavailable.",
            serialNumber: "DEMO001",
            image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
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
        ]
      }
    }
  };

  return withErrorHandling(async () => {
    console.log("Fetching categories and products...");
    
    // Use Promise.allSettled to handle partial failures
    const [categoriesResult, productsResult] = await Promise.allSettled([
      getAllCategories(),
      getAllProducts()
    ]);
    
    const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : fallbackData.categories;
    const products = productsResult.status === 'fulfilled' ? productsResult.value : fallbackData.categorizedProducts["demo-category"].products;
    
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
  }, fallbackData, 10000); // Longer timeout for this complex operation
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
  }, null, 5000);
};