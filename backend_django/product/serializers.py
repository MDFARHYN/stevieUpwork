from rest_framework import serializers
from .models import Product as ShopifyProduct
import os
import csv
import io
import uuid
from django.conf import settings
from django.core.files.base import ContentFile
import pandas as pd

class ShopifyProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopifyProduct
        fields = '__all__'
        read_only_fields = ('product_name','label','sku', 'csv_file')
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.product_image:
            representation['product_image'] = instance.product_image.url
        if instance.csv_file:
            representation['csv_file'] = instance.csv_file.url
        return representation


class ShopifyProductCreateSerializer(serializers.ModelSerializer):
    product_image = serializers.ImageField(required=True)
    
    class Meta:
        model = ShopifyProduct
        fields = ('product_image',)
    
    def create(self, validated_data):
        image = validated_data.get('product_image')
        
        # Get the image filename without extension
        filename = os.path.splitext(image.name)[0]
        
        # Generate a unique UUID for this file (using full UUID)
        unique_id = str(uuid.uuid4())
        
        # Add UUID to filename to make it unique
        unique_filename = f"{filename}_{unique_id}"
        
        # Format the product name by capitalizing each word
        formatted_name = ' '.join(word.capitalize() for word in filename.replace('_', ' ').replace('-', ' ').split())
        
        # Add the custom text
        product_name = f"{formatted_name} - Baby Boy Girl Clothes Bodysuit Funny Cute"
        
        # Create the product instance without csv_file first
        product = ShopifyProduct(
            product_name=product_name,
            product_image=image,
            label = "shopify",
        )
        

        # Save to get the image URL
        product.save()
    

        # Now generate CSV with the product image URL included
        csv_content = self.generate_csv_from_template(filename.lower(), product.product_image.url)
        
        # Create the CSV file with UUID for uniqueness
        csv_file_name = f"{filename.lower()}_{unique_id}.csv"
        
        # First, delete any existing CSV file if it exists
        if product.csv_file:
            try:
                storage = product.csv_file.storage
                if storage.exists(product.csv_file.name):
                    storage.delete(product.csv_file.name)
            except Exception as e:
                # Log the error but continue
                print(f"Error deleting existing file: {e}")
        
        # Create the in-memory CSV file
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        for row in csv_content:
            csv_writer.writerow(row)
        
        # Create a ContentFile
        csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'), name=csv_file_name)
        
        # Update the product with the CSV
        product.csv_file = csv_file
        product.save()
        
        return product
    
    def generate_csv_from_template(self, base_filename, image_url):
        """
        Copy the existing CSV template and modify specific values
        """
        # Path to your CSV template file
        template_csv_path = os.path.join(settings.BASE_DIR, 'templates', 'Shopify Output Flat File TEMPLATE.csv')
        
        # Create handle value with the specified format - remove all spaces
        base_filename_no_spaces = base_filename.replace(' ', '')
        handle = f"{base_filename_no_spaces}-baby-boy-girl-clothes-bodysuit-funny-cute"
        
        # Format the title
        formatted_title = ' '.join(word.capitalize() for word in base_filename.replace('_', ' ').replace('-', ' ').split())
        title = f"{formatted_title} - Baby Boy Girl Clothes Bodysuit Funny Cute"
        
        # Predefined static image URLs (for positions 2-6)
        static_image_urls = [
            "https://cdn.shopify.com/s/files/1/0545/2018/5017/files/26363115-65e5-4936-b422-aca4c5535ae1-copy.jpg?v=1741427541",
            "https://cdn.shopify.com/s/files/1/0545/2018/5017/files/a050c7dc-d0d5-4798-acdd-64b5da3cc70c-copy.jpg?v=1741427541",
            "https://cdn.shopify.com/s/files/1/0545/2018/5017/files/7159a2aa-6595-4f28-8c53-9fe803487504-copy.jpg?v=1741427541",
            "https://cdn.shopify.com/s/files/1/0545/2018/5017/files/700cea5a-034d-4520-99ee-218911d7e905-copy.jpg?v=1741427541"
        ]
        
        # Read the template CSV
        try:
            with open(template_csv_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                csv_data = list(reader)
        except FileNotFoundError:
            # Raise validation error if template file is missing
            raise serializers.ValidationError("CSV template file is missing. Please ensure 'Shopify Output Flat File TEMPLATE.csv' exists in the templates directory.")
        
        # Get the header row to find column indices
        headers = csv_data[0]
        handle_index = headers.index("Handle") if "Handle" in headers else 0
        title_index = headers.index("Title") if "Title" in headers else 1
        image_src_index = headers.index("Image Src") if "Image Src" in headers else 28
        image_position_index = headers.index("Image Position") if "Image Position" in headers else 29
        
        # Make sure there are at least 6 data rows (excluding header)
        while len(csv_data) < 7:
            csv_data.append([""] * len(headers))
        
        # Update all rows with handle value (rows 2-7 in spreadsheet, indices 1-6 in array)
        for i in range(1, 7):
            # Ensure each row has enough columns
            while len(csv_data[i]) < len(headers):
                csv_data[i].append("")
            
            # Update the handle in all rows
            csv_data[i][handle_index] = handle
        
        # Only set title for the first row (row 2 in spreadsheet, index 1 in array)
        csv_data[1][title_index] = title
        # Clear title from other rows if they had any value
        for i in range(2, 7):
            csv_data[i][title_index] = ""
        
        # Set the first image URL to the Django-generated URL
        csv_data[1][image_src_index] = image_url
        csv_data[1][image_position_index] = "1"
        
        # Update the static image URLs for rows 3-6 (indices 2-5)
        for i in range(2, 6):
            if i-2 < len(static_image_urls):
                csv_data[i][image_src_index] = static_image_urls[i-2]
                csv_data[i][image_position_index] = str(i)
        
        return csv_data





class AmazonProductSerializer(serializers.ModelSerializer):
    """Serializer for retrieving Amazon product details"""
    class Meta:
        model = ShopifyProduct
        fields = '__all__'
        read_only_fields = ('product_name','label','sku', 'csv_file')
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.product_image:
            representation['product_image'] = instance.product_image.url
        if instance.csv_file:
            representation['csv_file'] = instance.csv_file.url
        return representation


class AmazonProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Amazon products with CSV generation"""
    product_image = serializers.ImageField(required=True)
    
    class Meta:
        model = ShopifyProduct
        fields = ('product_image',)
    
    def create(self, validated_data):
        image = validated_data.get('product_image')
        
        # Get the image filename without extension (this is the base user text)
        filename = os.path.splitext(image.name)[0]
        user_text = filename.lower()  # Use the filename as the user text
        
        # Generate a unique UUID for this file
        unique_id = str(uuid.uuid4())
        
        # Format the product name by capitalizing each word
        formatted_name = ' '.join(word.capitalize() for word in filename.replace('_', ' ').replace('-', ' ').split())
        
        # Add the custom text
        product_name = f"{formatted_name} - Baby Boy Girl Clothes Bodysuit Funny"
        
        # Create the product instance without csv_file first
        product = ShopifyProduct(
            product_name=product_name,
            product_image=image,
            label = "amazon",
        )
        
        # Save to get the image URL
        product.save()
        
        # Now generate CSV with the product image URL included
        df = self.create_product_dataframe(user_text)
        
        # Replace "main_image" with the actual image URL
        df['main_image_url'] = df['main_image_url'].replace("main_image", product.product_image.url)
        
        # Create the CSV file with UUID for uniqueness
        csv_file_name = f"{filename.lower()}_{unique_id}.csv"
        
        # First, delete any existing CSV file if it exists
        if product.csv_file:
            try:
                storage = product.csv_file.storage
                if storage.exists(product.csv_file.name):
                    storage.delete(product.csv_file.name)
            except Exception as e:
                # Log the error but continue
                print(f"Error deleting existing file: {e}")
        
        # Create the in-memory CSV file
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        
        # Create a ContentFile
        csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'), name=csv_file_name)
        
        # Update the product with the CSV
        product.csv_file = csv_file
        product.save()
        
        return product
    
    def create_product_dataframe(self, user_text):
        """
        Creates a product dataframe with formatted columns based on user text.
        
        Parameters:
        user_text (str): The base text for product SKUs (e.g., "littlecupcake")
        
        Returns:
        pd.DataFrame: DataFrame with product variants
        """
        # Format the user text
        user_text_capital = user_text.upper()
        user_text_title = user_text.title()  # First letter capitalized
        
        # Define the variants
        variants = [
            "Newborn White Short Sleeve",
            "Newborn White Long Sleeve",
            "Newborn Natural Short Sleeve",
            "0-3M White Short Sleeve",
            "0-3M White Long Sleeve",
            "0-3M Pink Short Sleeve",
            "0-3M Blue Short Sleeve",
            "3-6M White Short Sleeve",
            "3-6M White Long Sleeve",
            "3-6M Blue Short Sleeve",
            "3-6M Pink Short Sleeve",
            "6M Natural Short Sleeve",
            "6-9M White Short Sleeve",
            "6-9M White Long Sleeve",
            "6-9M Pink Short Sleeve",
            "6-9M Blue Short Sleeve",
            "12M White Short Sleeve",
            "12M White Long Sleeve",
            "12M Natural Short Sleeve",
            "12M Pink Short Sleeve",
            "12M Blue Short Sleeve",
            "18M White Short Sleeve",
            "18M White Long Sleeve",
            "18M Natural Short Sleeve",
            "24M White Short Sleeve",
            "24M White Long Sleeve",
            "24M Natural Short Sleeve"
        ]
        
        # Create lists for each column
        item_sku = [f"{user_text_title}-Parent"]
        item_name = [f"{user_text_capital} - Baby Boy Girl Clothes Bodysuit Funny"]
        parent_child = ["Parent"]
        parent_sku = [""]
        main_image_url = ["main_image"]
        
        # Add entries for each variant
        for variant in variants:
            # Remove spaces for item_sku
            variant_no_space = ''.join(variant.split())
            item_sku.append(f"{user_text_title}-{variant_no_space}")
            item_name.append(f"{user_text_capital} - Baby Boy Girl Clothes Bodysuit Funny")
            parent_child.append("Child")
            parent_sku.append(f"{user_text_title}-Parent")
            main_image_url.append("main_image")
        
        # Create the DataFrame
        df = pd.DataFrame({
            'item_sku': item_sku,
            'item_name': item_name,
            'parent_child': parent_child,
            'parent_sku': parent_sku,
            'main_image_url': main_image_url
        })
        
        return df