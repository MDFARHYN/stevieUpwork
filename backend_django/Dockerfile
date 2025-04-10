# Use an official Python runtime as the base image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django project
COPY . .

# Collect static files (if needed)
RUN python manage.py collectstatic --noinput

# Expose the port your Django app will run on
EXPOSE 8001

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]

