from backend_django.wsgi import get_wsgi_application
from vercel_python_wsgi import make_wsgi_handler

application = get_wsgi_application()
handler = make_wsgi_handler(application)