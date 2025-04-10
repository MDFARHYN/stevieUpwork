from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Product as ShopifyProduct
from .serializers import *

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_shopify_product(request):
    """
    Create a new Shopify product based on the uploaded image.
    
    This endpoint automatically:
    1. Takes the filename as the product name (formatted with spaces and capitalization)
    2. Adds "- Baby Boy Girl Clothes Bodysuit Funny Cute" to the product name
    3. Uses the CSV template and updates specific fields:
       - Handle: lowercase filename + "-baby-boy-girl-clothes-bodysuit-funny-cute"
       - Title: Capitalized filename + " - Baby Boy Girl Clothes Bodysuit Funny Cute"
       - Image Src: Updates with the 5 predefined image URLs
       - Image Position: Sets positions 1-5 for the respective images
    """
    print("Request data:", request.data)
    serializer = ShopifyProductCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        product = serializer.save()
        return Response(
            {
                'message': 'Shopify product created successfully',
                'product': ShopifyProductSerializer(product).data
            }, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_shopify_product_list(request):
    """
    Get a list of all Shopify products
    """
    products = ShopifyProduct.objects.filter(is_active=True).order_by('-created_at')
    serializer = ShopifyProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_shopify_product_detail(request, pk):
    """
    Get details of a specific Shopify product
    """
    try:
        product = ShopifyProduct.objects.get(pk=pk, is_active=True)
    except ShopifyProduct.DoesNotExist:
        return Response(
            {'error': 'Shopify product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
        
    serializer = ShopifyProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_shopify_product(request, pk):
    """
    Delete a Shopify product (soft delete by setting is_active=False)
    """
    try:
        product = ShopifyProduct.objects.get(pk=pk)
    except ShopifyProduct.DoesNotExist:
        return Response(
            {'error': 'Shopify product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
        
    # Soft delete
    product.is_active = False
    product.save()
    
    return Response(
        {'message': 'Shopify product deleted successfully'}, 
        status=status.HTTP_200_OK
    )




@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def amazon_product_create(request):
    """
    Create a new Amazon product with CSV generation
    """
    serializer = AmazonProductCreateSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save()
        return Response({
            'id': product.id,
            'product_name': product.product_name,
            'product_image': product.product_image.url if product.product_image else None,
            'csv_file': product.csv_file.url if product.csv_file else None,
            'message': 'Amazon product CSV created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def amazon_product_delete(request, pk):
    """
    Delete an Amazon product
    """
        
    try:
        product = ShopifyProduct.objects.get(pk=pk)
    except ShopifyProduct.DoesNotExist:
        return Response(
            {'error': 'Shopify product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
        
    # Soft delete
    product.is_active = False
    product.save()
    
    return Response(
        {'message': 'amazon product deleted successfully'}, 
        status=status.HTTP_200_OK
    )