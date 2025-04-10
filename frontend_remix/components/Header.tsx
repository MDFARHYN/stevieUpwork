// app/components/Header.tsx
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
 
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function for smooth scrolling (only on homepage)
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    
    // Only run on home page
    if (location.pathname !== '/') {
      // Navigate to home and then to the section
      window.location.href = `/#${elementId}`;
      return;
    }
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle logout
 
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              ProductSync
            </Link>
          </div>
          
          {/* Hamburger icon for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            {/*<a 
              href="#features" 
              onClick={(e) => scrollToSection(e, 'features')} 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => scrollToSection(e, 'testimonials')} 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
            >
              Testimonials
            </a>*/}
          
             <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                Login
              </Link>
              {/*
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Get Started
              </Link>*/}
             </>
              {/*
            <>
              <Link 
                to="/my-account" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                My Account
              </Link>
              <button
               
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition duration-150"
              >
                Logout
              </button>
            </>*/}
       
          </nav>
        </div>
        
        {/* Simplified Mobile Menu - only essential buttons */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-3 border-t border-gray-200">
               
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>

                  {/*
                  <Link 
                    to="/register" 
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>*/}
                </>
             
             {/*   <>
                  <Link 
                    to="/my-account" 
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button 
                  
                    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
                */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}