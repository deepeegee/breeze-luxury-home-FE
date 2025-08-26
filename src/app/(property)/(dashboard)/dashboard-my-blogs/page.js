import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import Footer from '@/components/property/dashboard/Footer';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import FilterHeader from '@/components/property/dashboard/dashboard-my-blogs/FilterHeader';
import BlogDataTable from '@/components/property/dashboard/dashboard-my-blogs/BlogDataTable';

export const metadata = { title: 'Dashboard Blogs' };

export default function DashboardMyBlogs() {
  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    <h2>My Blogs</h2>
                    <p className="text">All your posts at a glance.</p>
                  </div>
                </div>
                <div className="col-xxl-9">
                  <FilterHeader />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <BlogDataTable />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
