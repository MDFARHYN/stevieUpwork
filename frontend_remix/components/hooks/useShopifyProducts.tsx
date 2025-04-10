import { useState, useEffect, useCallback } from 'react';
import { authenticatedGet, authenticatedPost, authenticatedDelete } from '../axios';

interface ShopifyProduct {
  id: number;
  product_name: string;
  product_image: string;
  sku: string;
  csv_file: string;
  excel_file?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  label?: string;
}

interface UseShopifyProductsReturn {
  products: ShopifyProduct[];
  isLoading: boolean;
  error: string | null;
  uploadProduct: (file: File) => Promise<void>;
  uploading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
  refreshProducts: () => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deletingId: number | null;
  deleteError: string | null;
}

export function useShopifyProducts(): UseShopifyProductsReturn {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authenticatedGet('shopify-products/');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load your products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const uploadProduct = async (file: File) => {
    if (!file) {
      setUploadError('Please select an image file');
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('product_image', file);
      
      await authenticatedPost('shopify-products/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadSuccess(true);
      
      // Refresh product list
      await fetchProducts();
      
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading product:', err);
      setUploadError(err.response?.data?.error || 'Failed to upload product. Please try again.');
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setDeletingId(id);
    setDeleteError(null);
    
    try {
      await authenticatedDelete(`shopify-products/${id}/delete/`);
      
      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== id));
    } catch (err: any) {
      console.error('Error deleting Shopify product:', err);
      setDeleteError(err.response?.data?.error || 'Failed to delete product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const refreshProducts = fetchProducts;

  return {
    products,
    isLoading,
    error,
    uploadProduct,
    uploading,
    uploadError,
    uploadSuccess,
    refreshProducts,
    deleteProduct,
    deletingId,
    deleteError
  };
}