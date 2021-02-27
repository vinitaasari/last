import React, { useState, useEffect } from "react";

// import ChooseDateDialog from "./choose-date-dialog";
import AppWrapper from "../../components/app-wrapper";
import {
  useParams,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import * as dateFns from "date-fns";

import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { useAuth } from "../../contexts/auth-context";

import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";

import CourseDetailPurchaseView from "./CourseDetailPurchaseView";
import CourseJoinView from "./CourseJoinView";
import { CourseDetailsLoader } from "./loaders";
import SEO from "../../components/seo";

const CourseDetail = (props) => {
  const [activeTab, setActiveTab] = useState("");
  const [courseDetail, setCourseDetail] = useState({});
  const [allSlots, setAllSlots] = useState([]);
  const [slotsDeails, setSlotsDetails] = useState([]);
  const [selectAllSlots, setSelectAllSlots] = useState(false);
  const [cadenceDetails, setCadenceDetails] = useState([]);
  const [sessionsByCadence, setSessions] = useState([]);
  const [currentSelectedSlotOrCadence, setSlotOrCadence] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState("");
  const [activeCadence, setCadence] = useState(null);
  const [cad, setCad] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const { user } = useUser();
  const { setNoti } = useUser();

  const urlParams = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const { state } = location;
  const getCourseDetailsApi = useCallbackStatus();
  const getSlotsOrSessionsApi = useCallbackStatus();
  const getReviewsAPI = useCallbackStatus();
  const checkCanEnrollApiStatus = useCallbackStatus();
  const createOrderApiStatus = useCallbackStatus();
  const joinSessionApiStatus = useCallbackStatus();
  const getRecommendedCoursesApi = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();

  useEffect(() => {
    console.log(location.state)
    setStatus(location.state.status)
    if (location.state && location.state.details) {
      setActiveTab("curriculum");
    } else {
      setActiveTab("about");
    }
  }, [location]);

  const getRecommendedCourses = async (apiBody) => {
    try {
      const res = await getRecommendedCoursesApi.run(
        apiClient("POST", "course", "getrecommendcourse", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setRecommendedCourses(res.content.data);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    getRecommendedCourses({ page_size: 20, page_number: 1 });
    // eslint-disable-next-line
  }, [location]);

  const getSlotCourseDetail = async (apiBody) => {
    try {
      const res = await getCourseDetailsApi.run(
        apiClient("POST", "course", "getslotsbycourseid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setAllSlots(res.content.data);
      const slots = res.content.data.map((item) => {
        const start_d = dateFns.fromUnixTime(item.session_start_time);
        const end_d = dateFns.fromUnixTime(item.session_end_time);
        return {
          id: item.id,
          title: item.title,
          start_time_str: dateFns.format(start_d, "hh:mm a"),
          start_date_str: dateFns.format(start_d, "E, do MMM"),
          end_time_str: dateFns.format(end_d, "hh:mm a"),
          end_date_str: dateFns.format(end_d, "E, do MMM"),
          isSelected: false,
        };
      });
      console.log(slots);
      setSlotsDetails(slots);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const joinSession = async (apiBody, courseObj) => {
    try {
      const res = await joinSessionApiStatus.run(
        apiClient("POST", "zoom", "startmeeting", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: false,
        })
      );

      const {
        content: { data },
        code,
      } = res;

      if (code === 200) {
        const meetingUrl = "/join-meeting";
        history.push(meetingUrl, {
          meetingId: data.meeting_id,
          meetingPassword: data.password,
          meetingSignature: data.learner_signature,
          displayName: data.display_name,
          courseObj,
        });
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const getSessionsByCadence = async (apiBody) => {
    try {
      const res = await getSlotsOrSessionsApi.run(
        apiClient("POST", "course", "getsessionsbycadenceid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const sessions = res.content.data.map((item) => {
        const startDate = dateFns.fromUnixTime(item.session_start_time);
        const endDate = dateFns.fromUnixTime(item.session_end_time);

        return {
          ...item,
          startDate,
          endDate,
        };
      });
      setSessions(sessions);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const getStructuredCourseDetail = async (apiBody) => {
    try {
      const res = await getCourseDetailsApi.run(
        apiClient("POST", "course", "getcadencebycourseid", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      let cadence = res.content.data.map((item, index) => ({
        ...item,
        isSelected: index === 0 ? true : false,
        cadenceStartDateObj: dateFns.fromUnixTime(item.cadence_start_time),
        cadenceEndDateObj: dateFns.fromUnixTime(item.cadence_end_time),
      }));

      if (cadence.length != 0) {
        setCadenceDetails(cadence);
        setCadence(cadence[0].id);
        setCad(cadence[0]);
      }

      if (cadence.length >= 1) {
        getSessionsByCadence({
          cadence_id: cadence[0].id,
          // page_size: 20,
          // page_number: 1,
          learner_id: user.id,
        });
      }
    } catch (error) {
      // alert(error);
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const getCourseDetail = async (apiBody) => {
    try {
      const res = await getCourseDetailsApi.run(
        apiClient("POST", "course", "getcoursebyid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      if (res.content.data.course_type === course_types.slot) {
        const {
          content: {
            data: { course_start_time, course_end_time },
          },
        } = res;

        setCourseDetail(res.content.data);
        setActiveTab("about");
        getSlotCourseDetail({
          course_id: urlParams.id,
          page_number: 1,
          page_size: 500,
        });
      }

      if (res.content.data.course_type === course_types.structured) {
        setCourseDetail(res.content.data);
        setActiveTab("curriculum");
        getStructuredCourseDetail({ course_id: urlParams.id });
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    setNoti(Math.random());
    getCourseDetail({ id: urlParams.id });
    // eslint-disable-next-line
  }, [location]);

  const getAssignments = async (apiBody) => {
    try {
      const res = await createOrderApiStatus.run(
        apiClient("POST", "course_manage", "getassignmentbycoursecadenceid", {
          body: { ...apiBody },
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );
      console.log("my assignments", res.content.data);
      setAssignments(res.content.data);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    if (urlParams.type === course_types.structured_course && activeCadence && user.id) {
      getAssignments({ learner_id: user.id, course_cadence_id: activeCadence });
    }

    // eslint-disable-next-line
  }, [activeCadence, location]);

  const getReviewsByCourse = async (apiBody) => {
    try {
      const res = await getReviewsAPI.run(
        apiClient("POST", "rating", "getreviewsbycourseid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      console.log("res", res);

      const {
        content: { data },
      } = res;
      console.log(data);
      setCourseReviews(data);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      // notification.enqueueSnackbar(error.message, {
      //   variant: "error",
      //   autoHideDuration: 2000,
      // });
    }
  };

  useEffect(() => {
    getReviewsByCourse({
      course_id: urlParams.id,
      course_type: course_types[urlParams.type],
      page_size: 20,
      page_number: 1,
    });
    // eslint-disable-next-line
  }, [location]);

  const checkCanEnroll = async (apiBody, callback) => {
    try {
      const res = await checkCanEnrollApiStatus.run(
        apiClient("POST", "stripe", "preenrollmentcheck", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );

      if (res.content.data === true) {
        callback();
      } else {
        notification.enqueueSnackbar("Slot couldn't be selected", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
      setSlotOrCadence(null);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSelectAllSlotClick = (e) => {
    const isChecked = e.target.checked;
    const updated_slots = slotsDeails.map((item) => ({
      ...item,
      isSelected: isChecked,
    }));

    setSelectAllSlots(isChecked);
    setSlotsDetails(updated_slots);
  };

  const handleSelectSlotClick = async (id) => {
    if (user.authenticated === false) {
      history.push("/login", {
        from: match.url,
        ...state,
      });
      return;
    }
    if (
      user.authenticated === true &&
      user.is_mi_user &&
      !JSON.parse(window.localStorage.getItem("user_details"))
        .is_subscription_purchased
    ) {
      history.push("/subscription", {
        from: match.url,
        ...state,
      });
      return;
    }

    setSlotOrCadence(id);

    const slotObj = slotsDeails.find((item) => item.id === id);

    if (slotObj.isSelected) {
      const updatedSlots = slotsDeails.map((item) => {
        if (item.id === slotObj.id) {
          item.isSelected = false;
        }
        return item;
      });

      setSlotsDetails(updatedSlots);
      setSelectAllSlots(false);
      setSlotOrCadence(null);
      return;
    }

    const callback = () => {
      const updated_slots = slotsDeails.map((item) => {
        if (item.id === id) {
          item.isSelected = true;
        }
        return item;
      });
      setSlotsDetails(updated_slots);
    };

    checkCanEnroll(
      { learner_id: user.id, slot_course_session_ids: [id] },
      callback
    );
  };

  const handleSelectCadenceClick = (id) => {
    setSlotOrCadence(id);
    const callback = () => {
      const updated_cadence = cadenceDetails.map((item) => {
        if (item.id === id) {
          setCad(item);
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
        return item;
      });

      setCadenceDetails(updated_cadence);
      getSessionsByCadence({
        cadence_id: id,
        // page_size: 20,
        learner_id: user.id,
        // page_number: 1,
      });
    };
    checkCanEnroll(
      { learner_id: user.id, structured_course_cadence_ids: [id] },
      callback
    );
  };

  const createOrder = async (apiBody) => {
    try {
      const res = await createOrderApiStatus.run(
        apiClient("POST", "stripe", "createorder", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );

      history.push("/confirm-pay", {
        ...res.content.data,
        unit_amount: res.content.data.amount,
        nickname: courseDetail.title,
        description: courseDetail.tag_line,
        image: courseDetail.image_url,
        rating: courseDetail.course_rating,
        payment_type: "order",
      });
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const initiateEnrollment = async (apiBody) => {
    try {
      const res = await createOrderApiStatus.run(
        apiClient("POST", "subscription", "initiateenrollment", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );
      enrollmentForSubscribedUser(apiBody);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const enrollmentForSubscribedUser = async (apiBody) => {
    try {
      const res = await createOrderApiStatus.run(
        apiClient("POST", "subscription", "enrollmentforsubscribeduser", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );

      history.push("/home");
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleBuyClick = () => {
    if (user.authenticated === false) {
      history.push("/login", {
        from: match.url,
        ...state,
      });
      return;
    } else if (
      user.authenticated === true &&
      user.is_mi_user &&
      !JSON.parse(window.localStorage.getItem("user_details"))
        .is_subscription_purchased
    ) {
      history.push("/subscription", {
        from: match.url,
        ...state,
      });
      return;
    } else if (
      user.authenticated === true &&
      user.is_mi_user &&
      !JSON.parse(window.localStorage.getItem("user_details"))
        .is_subscription_purchased
    ) {
      history.push("/login", {
        from: match.url,
        ...state,
      });
      return;
    }
    // if (user.is_mi_user === 1) {
    //   history.push("/subscription");
    // }

    const selected_slots = slotsDeails
      .filter((item) => item.isSelected === true)
      .map((item) => item.id);

    const selected_cadence = cadenceDetails
      .filter((item) => item.isSelected === true)
      .map((item) => item.id);

    if (courseDetail.course_type === course_types.slot) {
      if (selected_slots.length === 0) {
        notification.enqueueSnackbar(
          "Please select at least one slot to purchase",
          {
            variant: "warning",
            autoHideDuration: 2000,
          }
        );
        return;
      } else {
        if (!user.is_mi_user) {
          createOrder({
            learner_id: user.id,
            // course_type: course_types.slot,
            slot_course_session_ids: selected_slots,
          });
        } else {
          initiateEnrollment({
            learner_id: user.id,
            // course_type: course_types.slot,
            slot_course_session_ids: selected_slots,
          });
        }
      }
    }

    if (courseDetail.course_type === course_types.structured) {
      if (selected_cadence.length === 0) {
        notification.enqueueSnackbar(
          "Please select at least one cadence to purchase",
          {
            variant: "warning",
            autoHideDuration: 2000,
          }
        );
        return;
      } else {
        if (!user.is_mi_user) {
          createOrder({
            learner_id: user.id,
            // course_type: course_types.structured,
            structured_course_cadence_ids: selected_cadence,
          });
        } else {
          initiateEnrollment({
            learner_id: user.id,
            // course_type: course_types.structured,
            structured_course_cadence_ids: selected_cadence,
          });
        }
      }
    }
  };

  if (getCourseDetailsApi.isPending) {
    return (
      <AppWrapper>
        <CourseDetailsLoader />
      </AppWrapper>
    );
  }

  if (location.state && location.state.details) {
    return (
      <AppWrapper>
        <SEO
          title={courseDetail.title}
          description={courseDetail.tag_line}
          keywords={`Midigiworld, ${courseDetail.skill_name || ""}, ${courseDetail.instructor_first_name || ""
            } ${courseDetail.instructor_last_name || ""}`}
        />
        <CourseJoinView
          conversationId={location.state.conversationId}
          courseDetail={courseDetail}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          activeCadence={activeCadence}
          cadenceDetails={cadenceDetails}
          status={status}
          handleSelectCadenceClick={handleSelectCadenceClick}
          handleBuyClick={handleBuyClick}
          createOrderApiStatus={createOrderApiStatus}
          slotsDeails={slotsDeails}
          selectAllSlots={selectAllSlots}
          handleSelectAllSlotClick={handleSelectAllSlotClick}
          handleSelectSlotClick={handleSelectSlotClick}
          currentSelectedSlotOrCadence={currentSelectedSlotOrCadence}
          checkCanEnrollApiStatus={checkCanEnrollApiStatus}
          sessions={sessionsByCadence}
          sessionsApi={getSlotsOrSessionsApi}
          joinSession={joinSession}
          courseReviews={courseReviews}
          assignments={assignments}
        />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <SEO
        title={courseDetail.title}
        description={courseDetail.tag_line}
        keywords={`Midigiworld, ${courseDetail.skill_name || ""}, ${courseDetail.instructor_first_name || ""
          } ${courseDetail.instructor_last_name || ""}`}
      />
      {/* <CourseJoinView
        courseDetail={courseDetail}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        cadenceDetails={cadenceDetails}
        status={status}
        handleSelectCadenceClick={handleSelectCadenceClick}
        handleBuyClick={handleBuyClick}
        createOrderApiStatus={createOrderApiStatus}
        slotsDeails={slotsDeails}
        selectAllSlots={selectAllSlots}
        handleSelectAllSlotClick={handleSelectAllSlotClick}
        handleSelectSlotClick={handleSelectSlotClick}
        currentSelectedSlotOrCadence={currentSelectedSlotOrCadence}
        checkCanEnrollApiStatus={checkCanEnrollApiStatus}
        sessions={sessionsByCadence}
        sessionsApi={getSlotsOrSessionsApi}
        joinSession={joinSession}
        courseReviews={courseReviews}
        assignments={assignments}
      /> */}
      <CourseDetailPurchaseView
        courseDetail={courseDetail}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        cadenceDetails={cadenceDetails}
        status={status}
        handleSelectCadenceClick={handleSelectCadenceClick}
        handleBuyClick={handleBuyClick}
        createOrderApiStatus={createOrderApiStatus}
        slotsDeails={slotsDeails}
        setSlotsDetails={setSlotsDetails}
        selectAllSlots={selectAllSlots}
        activeCadence={activeCadence}
        handleSelectAllSlotClick={handleSelectAllSlotClick}
        handleSelectSlotClick={handleSelectSlotClick}
        currentSelectedSlotOrCadence={currentSelectedSlotOrCadence}
        checkCanEnrollApiStatus={checkCanEnrollApiStatus}
        sessions={sessionsByCadence}
        sessionsApi={getSlotsOrSessionsApi}
        cad={cad}
        courseReviews={courseReviews}
        allSlots={allSlots}
        recommendedCourses={recommendedCourses}
      />
    </AppWrapper>
  );
};

export default CourseDetail;
