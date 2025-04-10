// app/routes/index.jsx

import { Link } from "@remix-run/react";

export default function Index() {
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    // Prevent default anchor behavior
    e.preventDefault();
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
 
     

      {/* Hero Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div  className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div  className="lg:col-span-6 mb-12 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-6">E-commerce made simple</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Effortlessly Upload Products to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Shopify and Amazon</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Upload once, sell everywhere. Our platform automatically formats and uploads your products to multiple marketplaces in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center px-8 py-3.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-lg transition duration-150 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                  Start For Free
                </Link>
                <a href="#demo" className="flex items-center justify-center px-8 py-3.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-medium text-lg transition duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-8 -left-6 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <img 
                  className="w-full rounded-2xl shadow-2xl" 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Dashboard preview" 
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 w-48">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium text-gray-700">Products Live</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">1,248</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Powerful Features for Sellers
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to streamline your product listings and grow your business
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simple Image Upload</h3>
              <p className="text-gray-600">Just upload your product image, and we'll handle the rest. No complex forms or technical knowledge required.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Formatting</h3>
              <p className="text-gray-600">Our AI automatically formats your product listings to meet Shopify and Amazon's specific requirements.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Integration</h3>
              <p className="text-gray-600">Seamless integration with Shopify and Amazon marketplaces, with more platforms coming soon.</p>
            </div>
          </div>

          <div className="mt-20">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                  <p className="text-gray-600 mb-6">Our 3-step process makes listing products faster than ever before.</p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Upload Image</h4>
                        <p className="mt-1 text-gray-600">Simply drag and drop your product images.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">AI Processing</h4>
                        <p className="mt-1 text-gray-600">Our system creates optimized listings.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Products Live</h4>
                        <p className="mt-1 text-gray-600">Products appear on all platforms instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img 
                    className="h-full w-full object-cover" 
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="App workflow" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Loved by E-commerce Sellers
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our customers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"This tool has saved me hours of work each week. I can focus on creating products instead of listing them. The automatic formatting is so accurate it's like having an employee do the work for me."</p>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/42.jpg" alt="Testimonial author" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">Baby Clothing Shop Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"The automatic formatting for different platforms is a game-changer. No more juggling multiple listing tools or learning different platform requirements. I've increased my product listings by 300% since using this tool."</p>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Testimonial author" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael Rodriguez</h4>
                  <p className="text-gray-600">E-commerce Entrepreneur</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"As someone selling on multiple platforms, this tool is a lifesaver. The time I save on product uploads lets me focus on marketing and growing my business. Customer service is outstanding too."</p>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Testimonial author" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jennifer Lee</h4>
                  <p className="text-gray-600">Handmade Accessories Shop</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Ready to streamline your product listings?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of sellers who are saving time and increasing sales with our platform.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-indigo-600 bg-white hover:bg-gray-100 font-medium text-lg transition duration-150 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
            Get Started For Free
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

 
    </div>
  );
}