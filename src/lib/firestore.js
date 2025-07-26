import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
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

// Get products by category reference
export const getProductsByCategory = async (categoryRef) => {
  try {
    const q = query(productsCollection, where("category", "==", categoryRef), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error getting products by category:", error);
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

// Helper function to group products by category for static generation
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
      // Extract category ID from reference path
      const categoryId = product.category.split('/').pop();
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

// Contact Forms Collection Functions
export const contactFormsCollection = collection(db, "contactForms");

// Add contact form submission
export const addContactForm = async (formData) => {
  try {
    const docRef = await addDoc(contactFormsCollection, {
      ...formData,
      submittedAt: new Date(),
      status: 'new'
    });
    console.log("Contact form submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return null;
  }
};

// Catalogue Requests Collection Functions
export const catalogueRequestsCollection = collection(db, "catalogueRequests");

// Add catalogue request
export const addCatalogueRequest = async (requestData) => {
  try {
    const docRef = await addDoc(catalogueRequestsCollection, {
      ...requestData,
      requestedAt: new Date(),
      status: 'pending'
    });
    console.log("Catalogue request submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting catalogue request:", error);
    return null;
  }
};