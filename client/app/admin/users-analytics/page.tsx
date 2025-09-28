"use client";

import Headings from "@/app/utils/Heading";
import UserAnalytics from "../../components/Admin/Analytics/UserAnalytics";
import AdminProtected from "@/app/hooks/adminProtected";
import AdminSidebar from "../../components/Admin/sideBar/AdminSideBar";
import DashboardHero from "@/app/components/Admin/DashboardHero";

const Page = () => {
      
  return (
    <div>
      <AdminProtected>
        <Headings
          title="ELearning Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux,AI/ML"
        />
        <div className="flex min-h-screen">
          <div className="custom-4xl:w-1/6 w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero isDashboard={true}  />
            <UserAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;