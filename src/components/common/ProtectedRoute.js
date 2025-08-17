"use client";

import { useAuth } from '@/lib/useAuth';
import Spinner from '@/components/common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="pt60 pb90 bgc-white">
        <div className="container">
          <div className="col-lg-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
              <Spinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will trigger the redirect in useAuth
  }

  return children;
};

export default ProtectedRoute; 