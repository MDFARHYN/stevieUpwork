import { useState, useEffect, useCallback } from 'react';
import { authenticatedGet, authenticatedPost, authenticatedDelete } from '../axios';

interface AmazonProduct {
  id: number;
  product_name: string;
  product_image: string;
  sku: string;
  csv_file: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface UseAmazonProductsReturn {
  products: AmazonProduct[];
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

export function useAmazonProducts(): UseAmazonProductsReturn {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
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
      // Since there's no specific API endpoint for listing Amazon products in your URLs,
      // we'll check with your backend team if there should be one. For now, we'll use what's available:
      const data = await authenticatedGet('shopify-products/');
      
      // Filter for Amazon products - you might need to adjust this based on your data structure
      // For example, if there's a field that distinguishes Amazon products from Shopify ones
      setProducts(data);
    } catch (err) {
      console.error('Error fetching Amazon products:', err);
      setError('Failed to load your Amazon products. Please try again later.');
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
      
      await authenticatedPost('amazon-products/create/', formData, {
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
      console.error('Error uploading Amazon product:', err);
      setUploadError(err.response?.data?.error || 'Failed to upload Amazon product. Please try again.');
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setDeletingId(id);
    setDeleteError(null);
    
    try {
      await authenticatedDelete(`amazon-products/${id}/delete/`);
      
      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== id));
    } catch (err: any) {
      console.error('Error deleting Amazon product:', err);
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