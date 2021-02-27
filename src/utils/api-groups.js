// api domain
export const apiDomain = "https://apis.midigiworld.com/";

// api basepath
let apiBasePathObj;

/** DEV */
const devAPIBasePaths = {
  course_management:"course_management",
  learner: "learner",
  course_setting: "course_setting",
  course_manage: "course_management",
  instructor: "instructor",
  learner_instructor: "learner_instructor",
  admin_configuration: "admin_configuration",
  common: "common_module",
  cms: "content_management",
  stripe: "stripe_payment",
  subscription: "subscription",
  course: "course",
  rating: "rating_review",
  zoom: "zoom",
};

/** Test */
const testAPIBasePaths = { ...devAPIBasePaths };

/** Prod */
const prodAPIBasePaths = { ...devAPIBasePaths };

// load the appropriate base paths
switch (process.env.REACT_APP_ENVIRONMENT_TYPE) {
  case "dev":
    apiBasePathObj = devAPIBasePaths;
    break;
  case "test":
    apiBasePathObj = testAPIBasePaths;
    break;
  case "prod":
    apiBasePathObj = prodAPIBasePaths;
    break;
  default:
    apiBasePathObj = devAPIBasePaths;
}

// export it
export const apiBasePath = apiBasePathObj;
