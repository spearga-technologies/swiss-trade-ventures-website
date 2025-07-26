import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase.js";

// Categories Collection Functions
export const categoriesCollection = collection(db, "categories");

// Get all categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(query(categoriesCollection, orderBy("name")));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such category!");
      return null;
    }
  } catch (error) {
    console.error("Error getting category:", error);
    return null;
  }
};

// Products Collection Functions
export const productsCollection = collection(db, "products");

// Get all products
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(query(productsCollection, orderBy("name")));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// Get single product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

// Group products by category for static generation
export const groupProductsByCategory = async () => {
  try {
    const categories = await getAllCategories();
    const products = await getAllProducts();
    
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
      // Extract category ID from categoryRef path
      const categoryId = product.categoryRef?.path?.split('/').pop() || product.category;
      if (categorizedProducts[categoryId]) {
        categorizedProducts[categoryId].products.push(product);
      }
    });
    
    return { categories, categorizedProducts };
  } catch (error) {
    console.error("Error grouping products by category:", error);
    return { categories: [], categorizedProducts: {} };
  }
};

// Leads Collection Functions
export const leadsCollection = collection(db, "leads");

// Add lead submission
export const addLead = async (leadData) => {
  try {
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting lead:", error);
    return null;
  }
};