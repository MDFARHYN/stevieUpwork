from django.urls import path
from . import views

urlpatterns = [
    path('shopify-products/', views.get_shopify_product_list, name='shopify-product-list'),
    path('shopify-products/create/', views.create_shopify_product, name='create-shopify-product'),
    path('amazon-products/create/', views.amazon_product_create, name='amazon_product_create'),
    path('amazon-products/<int:pk>/delete/', views.amazon_product_delete, name='amazon_product_delete'),
    path('shopify-products/<int:pk>/', views.get_shopify_product_detail, name='shopify-product-detail'),
    path('shopify-products/<int:pk>/delete/', views.delete_shopify_product, name='delete-shopify-product'),
]