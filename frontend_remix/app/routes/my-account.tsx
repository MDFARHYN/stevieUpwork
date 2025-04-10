import React, { useState } from 'react';
import { useShopifyProducts } from '../../components/hooks/useShopifyProducts';
import { useAmazonProducts } from '../../components/hooks/useAmazonProducts';
import { Link } from '@remix-run/react';

const base_domain = "https://backendstevie.farhyn.com";

export default function AccountPage() {
  // Shopify products hooks
  const { 
    products: shopifyProductsAll, 
    isLoading: shopifyLoading, 
    error: shopifyError, 
    uploadProduct: uploadShopifyProduct, 
    uploading: shopifyUploading, 
    uploadError: shopifyUploadError, 
    uploadSuccess: shopifyUploadSuccess,
    refreshProducts: refreshShopifyProducts,
    deleteProduct: deleteShopifyProduct,
    deletingId: shopifyDeletingId,
    deleteError: shopifyDeleteError
  } = useShopifyProducts();
  
  // Amazon products hooks
  const {
    products: amazonProductsAll,
    isLoading: amazonLoading,
    error: amazonError,
    uploadProduct: uploadAmazonProduct,
    uploading: amazonUploading,
    uploadError: amazonUploadError,
    uploadSuccess: amazonUploadSuccess,
    deleteProduct: deleteAmazonProduct,
    deletingId: amazonDeletingId,
    deleteError: amazonDeleteError
  } = useAmazonProducts();
  
  // Filter products based on their label
  const shopifyProducts = shopifyProductsAll.filter(product => product.label !== 'amazon');
  const amazonProducts = amazonProductsAll.filter(product => product.label === 'amazon');
  
  // State for managing the upload forms
  const [activeTab, setActiveTab] = useState('shopify'); // 'shopify' or 'amazon'
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadFile) return;
    
    if (activeTab === 'shopify') {
      await uploadShopifyProduct(uploadFile);
      
      if (!shopifyUploadError) {
        setShowUploadForm(false);
        setUploadFile(null);
      }
    } else {
      await uploadAmazonProduct(uploadFile);
      
      if (!amazonUploadError) {
        setShowUploadForm(false);
        setUploadFile(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to ensure URLs have the correct base domain
  const getFullUrl = (url) => {
    // If the URL is already absolute (starts with http), return it as is
    if (url.startsWith('http')) {
      return url;
    }
    // If it's a relative URL (starts with /), append it to the base domain
    if (url.startsWith('/')) {
      return `${base_domain}${url}`;
    }
    // Otherwise, append with a slash
    return `${base_domain}/${url}`;
  };

  // Function to get a clean filename by removing UUID
  const getCleanFilename = (filename) => {
    // Extract just the filename from the full path if needed
    const baseName = filename.split('/').pop() || filename;
    
    // Remove UUID pattern (8-4-4-4-12 hex digits)
    const uuidPattern = /(_|\-)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const cleanName = baseName.replace(uuidPattern, '');
    
    return cleanName;
  };

  // Function to download files with cleaned names
  const downloadWithCleanName = async (url, originalFilename) => {
    try {
      const cleanFilename = getCleanFilename(originalFilename);
      
      // Fetch the file
      const response = await fetch(getFullUrl(url));
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback to direct download if the Blob approach fails
      window.open(getFullUrl(url), '_blank');
    }
  };

  if (shopifyLoading || amazonLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setActiveTab('shopify');
                setShowUploadForm(!showUploadForm);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-md 
                ${showUploadForm && activeTab === 'shopify' 
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {showUploadForm && activeTab === 'shopify' ? 'Cancel Upload' : 'Upload Shopify Product'}
            </button>
            <button 
              onClick={() => {
                setActiveTab('amazon');
                setShowUploadForm(!showUploadForm);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-md 
                ${showUploadForm && activeTab === 'amazon' 
                  ? 'bg-yellow-700 text-white'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}
            >
              {showUploadForm && activeTab === 'amazon' ? 'Cancel Upload' : 'Upload Amazon Product'}
            </button>
          </div>
        </div>
        
        {/* Success Messages */}
        {shopifyUploadSuccess && activeTab === 'shopify' && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">Shopify product uploaded successfully! CSV file has been generated.</span>
          </div>
        )}
        
        {amazonUploadSuccess && activeTab === 'amazon' && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">Amazon product uploaded successfully! CSV file has been generated.</span>
          </div>
        )}
        
        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white shadow-md rounded-lg mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload {activeTab === 'shopify' ? 'Shopify' : 'Amazon'} Product
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-image">
                  Product Image
                </label>
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={activeTab === 'shopify' ? shopifyUploading : amazonUploading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  The product name will be generated from the image filename.
                </p>
              </div>
              
              {/* Display appropriate error message */}
              {(activeTab === 'shopify' ? shopifyUploadError : amazonUploadError) && (
                <div className="mb-4 text-red-500 text-sm">
                  {activeTab === 'shopify' ? shopifyUploadError : amazonUploadError}
                </div>
              )}
              
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                    ${activeTab === 'shopify' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
                  disabled={(activeTab === 'shopify' ? shopifyUploading : amazonUploading) || !uploadFile}
                >
                  {(activeTab === 'shopify' ? shopifyUploading : amazonUploading) 
                    ? 'Uploading...' 
                    : `Upload ${activeTab === 'shopify' ? 'Shopify' : 'Amazon'} Product`}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Product Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('shopify')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'shopify'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Shopify Products ({shopifyProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('amazon')}
              className={`py-2 px-4 font-medium ${
                activeTab === 'amazon'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Amazon Products ({amazonProducts.length})
            </button>
          </div>
        </div>
        
        {/* Shopify Products List */}
        {activeTab === 'shopify' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                My Shopify Products ({shopifyProducts.length})
              </h2>
            </div>
            
            {shopifyError && (
              <div className="p-4 bg-red-100 text-red-700 border-b border-gray-200">
                <p>{shopifyError}</p>
                <button 
                  onClick={() => refreshShopifyProducts()} 
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!shopifyError && shopifyProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>You haven't uploaded any Shopify products yet.</p>
                <button 
                  onClick={() => {
                    setActiveTab('shopify');
                    setShowUploadForm(true);
                  }} 
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload Shopify Product
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {shopifyProducts.map((product) => (
                  <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 mr-4">
                        <img 
                          src={getFullUrl(product.product_image)} 
                          alt={product.product_name}
                          className="h-16 w-16 object-cover rounded-md" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {product.product_name}
                          </p>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Shopify
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Created: {formatDate(product.created_at)}
                        </p>
                        <div className="mt-2 flex space-x-4">
                          <button 
                            onClick={() => downloadWithCleanName(
                              product.csv_file,
                              product.csv_file.split('/').pop() || ''
                            )}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Download CSV
                          </button>
                          {product.excel_file && (
                            <button 
                              onClick={() => downloadWithCleanName(
                                product.excel_file || '',
                                product.excel_file?.split('/').pop() || ''
                              )}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                              </svg>
                              Download Excel
                            </button>
                          )}
                          <button 
                            onClick={() => deleteShopifyProduct(product.id)}
                            disabled={shopifyDeletingId === product.id}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            {shopifyDeletingId === product.id ? (
                              'Deleting...'
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            {shopifyDeleteError && (
              <div className="p-4 bg-red-100 text-red-700 border-t border-gray-200">
                <p>{shopifyDeleteError}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Amazon Products List */}
        {activeTab === 'amazon' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                My Amazon Products ({amazonProducts.length})
              </h2>
            </div>
            
            {amazonError && (
              <div className="p-4 bg-red-100 text-red-700 border-b border-gray-200">
                <p>{amazonError}</p>
                <button 
                  onClick={() => refreshShopifyProducts()} 
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!amazonError && amazonProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>You haven't uploaded any Amazon products yet.</p>
                <button 
                  onClick={() => {
                    setActiveTab('amazon');
                    setShowUploadForm(true);
                  }} 
                  className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Upload Amazon Product
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {amazonProducts.map((product) => (
                  <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 mr-4">
                        <img 
                          src={getFullUrl(product.product_image)} 
                          alt={product.product_name}
                          className="h-16 w-16 object-cover rounded-md" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {product.product_name}
                          </p>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Amazon
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Created: {formatDate(product.created_at)}
                        </p>
                        <div className="mt-2 flex space-x-4">
                          <button 
                            onClick={() => downloadWithCleanName(
                              product.csv_file,
                              product.csv_file.split('/').pop() || ''
                            )}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Download CSV
                          </button>
                          {product.excel_file && (
                            <button 
                              onClick={() => downloadWithCleanName(
                                product.excel_file || '',
                                product.excel_file?.split('/').pop() || ''
                              )}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                              </svg>
                              Download Excel
                            </button>
                          )}
                          <button 
                            onClick={() => deleteAmazonProduct(product.id)}
                            disabled={amazonDeletingId === product.id}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            {amazonDeletingId === product.id ? (
                              'Deleting...'
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {amazonDeleteError && (
              <div className="p-4 bg-red-100 text-red-700 border-t border-gray-200">
                <p>{amazonDeleteError}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}