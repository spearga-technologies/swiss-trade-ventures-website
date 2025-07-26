import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "./firebase.js";

// Products Collection Functions
export const productsCollection = collection(db, "products");

// Get all products
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
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

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(productsCollection, where("category", "==", category));
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

// Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Product added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date()
    });
    console.log("Product updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
    console.log("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

// Categories Collection Functions
export const categoriesCollection = collection(db, "categories");

// Get all categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(categoriesCollection);
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