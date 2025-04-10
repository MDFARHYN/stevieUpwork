from django.db import models
from uuid import uuid4  # Importing just the uuid4 function

def generate_uuid():
    return str(uuid4())  # Using uuid4() directly since we imported just that function

class Product(models.Model):
    product_name = models.CharField(max_length=250)
    product_image = models.ImageField(upload_to='product_images/')
    sku = models.CharField(max_length=100, unique=True, default=generate_uuid)
    csv_file = models.FileField(upload_to='product_csv_files/')
    # Add this new field for Amazon Excel files
    excel_file = models.FileField(upload_to='product_excel_files/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    
    is_active = models.BooleanField(default=True)
    label = models.CharField(max_length=100, default='')
