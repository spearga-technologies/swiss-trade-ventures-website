import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp,
  limit,
  where
} from "firebase/firestore";
import { db } from "./firebase.js";

// Enhanced error handling wrapper for dynamic loading
const withErrorHandling = async (operation, fallbackData = [], timeoutMs = 10000) => {
  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      console.warn("Firestore operation timed out after", timeoutMs, "ms, using fallback data");
      resolve(fallbackData);
    }, timeoutMs);

    try {
      console.log("Attempting Firestore operation...");
      const result = await operation();
      clearTimeout(timeoutId);
      console.log("Firestore operation successful");
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Firestore operation error:", error.message);
      console.error("Error code:", error.code);
      
      // Return fallback data on any error
      console.warn("Using fallback data due to error");
      resolve(fallbackData);
    }
  });
};

// Categories Collection Functions
export const categoriesCollection = collection(db, "categories");

// Get all categories - Dynamic loading
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
    console.log("🔥 Fetching categories from Firestore...");
    const querySnapshot = await getDocs(query(categoriesCollection, orderBy("name"), limit(50)));
    const categories = [];
    
    if (querySnapshot.empty) {
      console.log("❌ No categories found in Firestore");
      return fallbackCategories;
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📂 Category data:", { id: doc.id, ...data });
      categories.push({ 
        id: doc.id, 
        name: data.name || 'Unnamed Category',
        description: data.description || 'No description available',
        image: data.image || fallbackCategories[0].image
      });
    });
    
    console.log(`✅ Successfully fetched ${categories.length} categories from Firestore`);
    return categories.length > 0 ? categories : fallbackCategories;
  }, fallbackCategories, 10000);
};

// Get category by ID - Dynamic loading
export const getCategoryById = async (categoryId) => {
  const fallbackCategory = {
    id: categoryId,
    name: "Demo Category",
    description: "Demo category description. This is a fallback category used when the requested category is not available.",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800"
  };

  return withErrorHandling(async () => {
    console.log("🔥 Fetching category by ID:", categoryId);
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("📂 Category found:", { id: docSnap.id, ...data });
      return { 
        id: docSnap.id, 
        name: data.name || fallbackCategory.name,
        description: data.description || fallbackCategory.description,
        image: data.image || fallbackCategory.image
      };
    } else {
      console.log("❌ Category not found, using fallback");
      return fallbackCategory;
    }
  }, fallbackCategory, 8000);
};

// Products Collection Functions
export const productsCollection = collection(db, "products");

// Get all products - Dynamic loading
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
    console.log("🔥 Fetching products from Firestore...");
    const querySnapshot = await getDocs(query(productsCollection, orderBy("name"), limit(100)));
    const products = [];
    
    if (querySnapshot.empty) {
      console.log("❌ No products found in Firestore");
      return fallbackProducts;
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📦 Product data:", { id: doc.id, ...data });
      
      // Handle categoryRef properly
      let categoryId = data.category || 'uncategorized';
      if (data.categoryRef && data.categoryRef.path) {
        categoryId = data.categoryRef.path.split('/').pop();
      }
      
      products.push({ 
        id: doc.id, 
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available',
        serialNumber: data.serialNumber || 'N/A',
        image: data.image || fallbackProducts[0].image,
        category: categoryId,
        categoryRef: data.categoryRef || null,
        variations: data.variations || []
      });
    });
    
    console.log(`✅ Successfully fetched ${products.length} products from Firestore`);
    return products.length > 0 ? products : fallbackProducts;
  }, fallbackProducts, 12000);
};

// Get single product by ID - Dynamic loading
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
    console.log("🔥 Fetching product by ID:", productId);
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("📦 Product found:", { id: docSnap.id, ...data });
      
      // Handle categoryRef properly
      let categoryId = data.category || fallbackProduct.category;
      if (data.categoryRef && data.categoryRef.path) {
        categoryId = data.categoryRef.path.split('/').pop();
      }
      
      return { 
        id: docSnap.id, 
        name: data.name || fallbackProduct.name,
        description: data.description || fallbackProduct.description,
        serialNumber: data.serialNumber || fallbackProduct.serialNumber,
        image: data.image || fallbackProduct.image,
        category: categoryId,
        variations: data.variations || []
      };
    } else {
      console.log("❌ Product not found, using fallback");
      return fallbackProduct;
    }
  }, fallbackProduct, 8000);
};

// Get products by category - Dynamic loading
export const getProductsByCategory = async (categoryId) => {
  return withErrorHandling(async () => {
    console.log("🔥 Fetching products for category:", categoryId);
    
    // Query products by categoryRef path
    const categoryPath = `categories/${categoryId}`;
    const q = query(
      productsCollection, 
      where("categoryRef", "==", doc(db, categoryPath)),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📦 Category product:", { id: doc.id, ...data });
      
      products.push({
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || 'No description available',
        serialNumber: data.serialNumber || 'N/A',
        image: data.image || '',
        category: categoryId,
        variations: data.variations || []
      });
    });
    
    console.log(`✅ Found ${products.length} products for category ${categoryId}`);
    return products;
  }, [], 10000);
};

// Group products by category for dynamic loading
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
    console.log("🔥 Dynamically fetching categories and products for grouping...");
    
    // Fetch both collections concurrently
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts()
    ]);
    
    console.log(`📊 Processing ${categories.length} categories and ${products.length} products`);
    
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
      
      console.log(`📦 Assigning product ${product.name} to category ${categoryId}`);
      
      if (categorizedProducts[categoryId]) {
        categorizedProducts[categoryId].products.push(product);
      } else {
        // Create category if it doesn't exist
        console.log(`📂 Creating new category: ${categoryId}`);
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
    
    console.log("✅ Successfully grouped products by category dynamically");
    return { categories, categorizedProducts };
  }, fallbackData, 15000);
};

// Leads Collection Functions
export const leadsCollection = collection(db, "leads");

// Add lead submission
export const addLead = async (leadData) => {
  return withErrorHandling(async () => {
    console.log("🔥 Adding lead to Firestore:", leadData);
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
    console.log("✅ Lead added successfully with ID:", docRef.id);
    return docRef.id;
  }, null, 8000);
};

// Client-side data fetching utilities
export const fetchCategoriesClient = async () => {
  try {
    console.log("🌐 Client-side: Fetching categories...");
    return await getAllCategories();
  } catch (error) {
    console.error("❌ Client-side category fetch error:", error);
    return [];
  }
};

export const fetchProductsClient = async () => {
  try {
    console.log("🌐 Client-side: Fetching products...");
    return await getAllProducts();
  } catch (error) {
    console.error("❌ Client-side product fetch error:", error);
    return [];
  }
};

export const fetchGroupedDataClient = async () => {
  try {
    console.log("🌐 Client-side: Fetching grouped data...");
    return await groupProductsByCategory();
  } catch (error) {
    console.error("❌ Client-side grouped data fetch error:", error);
    return { categories: [], categorizedProducts: {} };
  }
};