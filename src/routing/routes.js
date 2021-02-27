import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import ProtectedRoute from "./protected-route";
import Loader from "../components/loader";
import OtpVerification from "../screens/otp";
import ResetPassword from "../screens/resetPassword";
import ScrollToTop from "../components/scroll-to-top";
import { useAuth } from "../contexts/auth-context";
import { useUser } from "../contexts/user-context";
import ChatClient from "../module/chat/ChatClient";
import HomeScreen from "../screens/home/home-screen";

// import Components
const Login = lazy(() => import("../screens/signin/signin"));
const SignUp = lazy(() => import("../screens/signup/signup"));
const ForgotPassword = lazy(() =>
  import("../screens/forgot-password/forgot-password")
);
// const HomeScreen = lazy(() => import("../screens/home/home-screen"));
const AboutUs = lazy(() => import("../screens/about-us/about-us"));
const ContactUs = lazy(() => import("../screens/contact-us/contact-us"));
const Faq = lazy(() => import("../screens/faq/faq"));
const Profile = lazy(() => import("../screens/profile/profile"));
const RecommendedCourses = lazy(() =>
  import("../screens/explore/recommended-courses")
);
const CourseDetail = lazy(() => import("../screens/courses/course-detail"));
const Review = lazy(() => import("../screens/home/sessionRating"));

const TermsAndConditions = lazy(() =>
  import("../screens/terms-and-conditions/terms-and-conditions")
);
const PrivacyPolicy = lazy(() =>
  import("../screens/privacy-policy/privacy-policy")
);
const ReportAnIssue = lazy(() => import("../screens/report"));
const Subscription = lazy(() => import("../screens/subscription"));
const ConfirmAndPay = lazy(() => import("../screens/confirm-pay"));
const MyLearning = lazy(() => import("../screens/my-learning"));
const OrderHistory = lazy(() => import("../screens/order-history"));
const OrderView = lazy(() => import("../screens/order-history/view.js"));
const MySubscriptions = lazy(() => import("../screens/my-subscriptions"));
const Explore = lazy(() => import("../screens/explore"));
const JoinZoomMeeting = lazy(() => import("../screens/zoom"));
const CategoryDetail = lazy(() => import("../screens/explore/category-detail"));
const TrendingSkillDetail = lazy(() =>
  import("../screens/explore/trending-skills-detail")
);
const StartsInXDays = lazy(() => import("../screens/explore/starts-in-x-days"));
const UpcomingCourses = lazy(() => import("../screens/home/upcoming-courses"));
const InstructorProfile = lazy(() =>
  import("../screens/instructor/instructor-profile")
);

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  let isUserAuthenticated = false;

  if (user !== null && user.authenticated === true) {
    isUserAuthenticated = true;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isUserAuthenticated ? (
          <Redirect
            to={{
              pathname: "/home",
            }}
          />
        ) : (
            <div>
              <Component {...props} />
            </div>
          )
      }
    />
  );
};

// Router Component
function Router() {
  const { getUserDetails } = useAuth();
  const data = getUserDetails();
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <AuthRoute path="/login" component={Login} />
          <Route path="/register" component={SignUp} />
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/otpverification">
            <OtpVerification />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
          <Route path="/home">
            <HomeScreen />
          </Route>
          <Route path="/terms-and-conditions">
            <TermsAndConditions />
          </Route>
          <Route path="/report-an-issue">
            <ReportAnIssue />
          </Route>
          <Route path="/privacy-policy">
            <PrivacyPolicy />
          </Route>
          <Route path="/about-us">
            <AboutUs />
          </Route>
          <Route path="/contact-us">
            <ContactUs />
          </Route>
          <Route path="/faq">
            <Faq />
          </Route>
          <Route path="/starts-in-x-days">
            <StartsInXDays />
          </Route>
          <Route path="/recommended-courses">
            <RecommendedCourses />
          </Route>

          <ProtectedRoute path="/profile" component={Profile} />

          <Route path="/instructor/:id" component={InstructorProfile} />

          {/* </ProtectedRoute> */}
          {/* <ProtectedRoute path="/subscription">
            <Subscription />
          </ProtectedRoute> */}
          {/* <ProtectedRoute path="/confirm-pay">
            <ConfirmAndPay />
          </ProtectedRoute> */}
          <ProtectedRoute path="/my-learning">
            <MyLearning />
          </ProtectedRoute>
          <ProtectedRoute path="/messages">
            <ChatClient />
          </ProtectedRoute>
          {/* <DashboardRoute exact path="/messages" component={ChatClient} /> */}
          <ProtectedRoute path="/order-history">
            <OrderHistory />
          </ProtectedRoute>
          <ProtectedRoute path="/orders/view">
            <OrderView />
          </ProtectedRoute>
          <ProtectedRoute path="/my-subscriptions">
            <MySubscriptions />
          </ProtectedRoute>
          {/* <ProtectedRoute path="/subscription">
            <Subscription />
          </ProtectedRoute>
          <ProtectedRoute path="/confirm-pay">
            <ConfirmAndPay />
          </ProtectedRoute> */}
          <ProtectedRoute path="/join-meeting" component={JoinZoomMeeting} />
          <ProtectedRoute
            path="/upcoming-courses"
            component={UpcomingCourses}
          />
          <Route path="/course-detail/:type(structured|slot)/:id">
            <CourseDetail />
          </Route>
          <Route path="/review/:one/:two/:three/:four/:five/:six">
            <Review />
          </Route>
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/subscription" component={Subscription} />
          <Route exact path="/confirm-pay" component={ConfirmAndPay} />
          <Route exact path="/explore/:categoryId" component={CategoryDetail} />
          <Route exact path="/skill/:skillId" component={TrendingSkillDetail} />

          {/* <ProtectedRoute
            path="/recommended-courses"
            component={RecommendedCourses}
          /> */}
          {/* <ProtectedRoute path="/subscription">
            <Subscription />
          </ProtectedRoute> */}
          <Route>
            <h1>Error 404</h1>
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;
