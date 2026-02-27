import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/AdminDashboard.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=96bc1465"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=96bc1465"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"];
import api from "/src/utils/api.js";
import { useNavigate } from "/node_modules/.vite/deps/react-router-dom.js?v=96bc1465";
import { toast } from "/node_modules/.vite/deps/react-hot-toast.js?v=96bc1465";
import { Plus, Edit, Trash, ChevronDown, ChevronUp, Video, Bell, Send, Timer, Hammer, BookOpen, Settings, Users, Ticket, CreditCard } from "/node_modules/.vite/deps/lucide-react.js?v=96bc1465";
const AdminDashboard = () => {
  _s();
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    thumbnail: "",
    videoUrl: "",
    introVideos: [],
    sections: []
  });
  const newCourseFormRef = useRef(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    recipient: "all",
    relatedCourses: []
  });
  const [users, setUsers] = useState([]);
  const [manualEnrollEmail, setManualEnrollEmail] = useState("");
  const [manualEnrollCourse, setManualEnrollCourse] = useState("");
  const [bunnyConfig, setBunnyConfig] = useState({ apiKey: "", libraryId: "", collectionId: "" });
  const [bunnyVideos, setBunnyVideos] = useState([]);
  const [loadingBunny, setLoadingBunny] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    maxUses: "",
    validUntil: ""
  });
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [maintRes, annRes] = await Promise.all(
          [
            api.get("/settings/maintenance"),
            api.get("/settings/announcement")
          ]
        );
        setMaintenanceMode(maintRes.data?.value === true);
        setGlobalAnnouncement(annRes.data?.value || "");
      } catch (error) {
        console.error("Failed to fetch settings");
      }
    };
    fetchSettings();
  }, []);
  const toggleMaintenanceMode = async () => {
    try {
      const newValue = !maintenanceMode;
      await api.post("/settings", { key: "maintenance", value: newValue });
      setMaintenanceMode(newValue);
      toast.success(`Maintenance Mode ${newValue ? "Enabled" : "Disabled"}`);
    } catch (error) {
      toast.error("Failed to update maintenance mode");
    }
  };
  const handleUpdateAnnouncement = async () => {
    try {
      await api.post("/settings", { key: "announcement", value: globalAnnouncement });
      toast.success("Global announcement updated directly!");
    } catch (error) {
      toast.error("Failed to update announcement");
    }
  };
  const fetchBunnyVideos = async (e) => {
    e.preventDefault();
    setLoadingBunny(true);
    try {
      const { data } = await api.post("/bunny/videos", bunnyConfig);
      setBunnyVideos(data.items || []);
      toast.success(`Fetched ${data.items?.length || 0} videos`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch videos. Check credentials.");
    } finally {
      setLoadingBunny(false);
    }
  };
  const [expandedSections, setExpandedSections] = useState({});
  const toggleSection = (index) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const addSection = () => {
    setCurrentCourse((prev) => ({
      ...prev,
      sections: [...prev.sections, { group: "", title: "New Section", lectures: [] }]
    }));
  };
  const updateSectionTitle = (index, title) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], title };
      return { ...prev, sections: newSections };
    });
  };
  const updateSectionGroup = (index, group) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], group };
      return { ...prev, sections: newSections };
    });
  };
  const removeSection = (index) => {
    if (!window.confirm("Remove this section?")) return;
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      newSections.splice(index, 1);
      return { ...prev, sections: newSections };
    });
  };
  const addLecture = (sectionIndex) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      targetSection.lectures = [...targetSection.lectures, { title: "New Lecture", videoUrl: "", duration: "", freePreview: false, notes: [] }];
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const updateLecture = (sectionIndex, lectureIndex, field, value) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      const targetLecture = { ...targetSection.lectures[lectureIndex], [field]: value };
      const newLectures = [...targetSection.lectures];
      newLectures[lectureIndex] = targetLecture;
      targetSection.lectures = newLectures;
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const removeLecture = (sectionIndex, lectureIndex) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      const newLectures = [...targetSection.lectures];
      newLectures.splice(lectureIndex, 1);
      targetSection.lectures = newLectures;
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const addNote = (sectionIndex, lectureIndex) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      const newLectures = [...targetSection.lectures];
      const targetLecture = { ...newLectures[lectureIndex] };
      targetLecture.notes = [...targetLecture.notes || [], { title: "New Note", url: "" }];
      newLectures[lectureIndex] = targetLecture;
      targetSection.lectures = newLectures;
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const updateNote = (sectionIndex, lectureIndex, noteIndex, field, value) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      const newLectures = [...targetSection.lectures];
      const targetLecture = { ...newLectures[lectureIndex] };
      const newNotes = [...targetLecture.notes || []];
      newNotes[noteIndex] = { ...newNotes[noteIndex], [field]: value };
      targetLecture.notes = newNotes;
      newLectures[lectureIndex] = targetLecture;
      targetSection.lectures = newLectures;
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const removeNote = (sectionIndex, lectureIndex, noteIndex) => {
    setCurrentCourse((prev) => {
      const newSections = [...prev.sections];
      const targetSection = { ...newSections[sectionIndex] };
      const newLectures = [...targetSection.lectures];
      const targetLecture = { ...newLectures[lectureIndex] };
      const newNotes = [...targetLecture.notes || []];
      newNotes.splice(noteIndex, 1);
      targetLecture.notes = newNotes;
      newLectures[lectureIndex] = targetLecture;
      targetSection.lectures = newLectures;
      newSections[sectionIndex] = targetSection;
      return { ...prev, sections: newSections };
    });
  };
  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };
  const fetchAllNotifications = async () => {
    try {
      const { data } = await api.get("/notifications/all");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };
  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    }
  };
  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/payment/all");
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };
  useEffect(() => {
    fetchCourses();
    fetchAllNotifications();
    fetchUsers();
    fetchCoupons();
    fetchPayments();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = { ...currentCourse };
      if (courseData.originalPrice) {
        courseData.originalPrice = Number(courseData.originalPrice);
      } else {
        courseData.originalPrice = null;
      }
      if (isEditing) {
        await api.put(`/courses/${currentCourse._id}`, courseData);
        toast.success("Course updated");
      } else {
        await api.post("/courses", courseData);
        toast.success("Course created");
      }
      setIsEditing(false);
      setCurrentCourse({ title: "", description: "", price: "", originalPrice: "", thumbnail: "", videoUrl: "", introVideos: [], sections: [] });
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };
  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notifications", newNotification);
      toast.success("Notification Sent");
      setNewNotification({ title: "", message: "", type: "info", recipient: "all", relatedCourses: [] });
      fetchAllNotifications();
    } catch (error) {
      toast.error("Failed to send notification");
    }
  };
  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      toast.success("Notification deleted");
      fetchAllNotifications();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };
  const handleClearAllNotifications = async () => {
    if (!window.confirm("Delete ALL notifications?")) return;
    try {
      await api.delete("/notifications/all");
      toast.success("All notifications cleared");
      fetchAllNotifications();
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };
  const handleManualEnroll = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/enroll-manual", { email: manualEnrollEmail, courseId: manualEnrollCourse });
      toast.success("Enrolled successfully");
      setManualEnrollEmail("");
      setManualEnrollCourse("");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };
  const handleForceLogout = async (uid) => {
    if (!window.confirm("Are you sure you want to log out this user from all their devices?")) return;
    try {
      const { data } = await api.post(`/users/${uid}/force-logout`);
      toast.success(data.message || "User logged out");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to force logout");
    }
  };
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post("/coupons", newCoupon);
      toast.success("Coupon created successfully");
      setNewCoupon({ code: "", discountPercentage: "", maxUses: "", validUntil: "" });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };
  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };
  const handleToggleCoupon = async (id) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      toast.success("Coupon status updated");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update coupon status");
    }
  };
  const handleRefund = async (id) => {
    if (!window.confirm("Are you sure you want to refund this payment? This will revoke the user's access to the course.")) return;
    const toastId = toast.loading("Processing refund via Razorpay...");
    try {
      const { data } = await api.post(`/payment/refund/${id}`);
      toast.success(data.message || "Refund successful", { id: toastId });
      fetchPayments();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process refund", { id: toastId });
    }
  };
  const handleUploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const toastId = toast.loading("Uploading thumbnail...");
    try {
      const { data } = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const serverUrl = `http://${window.location.hostname}:5000`;
      setCurrentCourse({ ...currentCourse, thumbnail: `${serverUrl}${data}` });
      toast.success("Thumbnail uploaded!", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload thumbnail", { id: toastId });
    }
  };
  const formatDuration = (seconds) => {
    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    if (hours > 0) {
      return `${hours}hr ${minutes > 0 ? minutes + "mins" : ""}`.trim();
    }
    return `${minutes}mins`;
  };
  const fetchLectureDetails = async (sectionIndex, lectureIndex, videoUrl) => {
    if (!videoUrl) return;
    let videoId = "";
    let libId = bunnyConfig.libraryId;
    const regex = /(?:play|embed)\/(\d+)\/([a-zA-Z0-9-]+)/;
    const match = videoUrl.match(regex);
    if (match) {
      libId = match[1];
      videoId = match[2];
    }
    if (videoUrl.includes(".m3u8")) {
      const toastId2 = toast.loading("Parsing m3u8 duration...");
      try {
        const { data } = await api.post("/settings/m3u8-duration", { url: videoUrl });
        if (data.length) {
          const formattedDuration = formatDuration(data.length);
          updateLecture(sectionIndex, lectureIndex, "duration", formattedDuration);
          toast.success("Duration auto-fetched!", { id: toastId2 });
        } else {
          toast.error("Could not determine duration from m3u8", { id: toastId2 });
        }
      } catch (error) {
        console.error("m3u8 parse error", error);
        toast.error("Failed to parse m3u8 file", { id: toastId2 });
      }
      return;
    }
    if (videoUrl.includes("drive.google.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return;
    }
    if (!videoId || !libId || !bunnyConfig.apiKey) {
      toast.error('Cannot auto-fetch. Ensure URL is valid and API Key is set in "Video Library" tab.');
      return;
    }
    const toastId = toast.loading("Fetching video details...");
    try {
      const { data } = await api.post("/bunny/video-details", {
        apiKey: bunnyConfig.apiKey,
        libraryId: libId,
        videoId
      });
      setCurrentCourse((prev) => {
        const newSections = [...prev.sections];
        const targetSection = { ...newSections[sectionIndex] };
        const newLectures = [...targetSection.lectures];
        const targetLecture = { ...newLectures[lectureIndex] };
        targetLecture.duration = formatDuration(data.length);
        newLectures[lectureIndex] = targetLecture;
        targetSection.lectures = newLectures;
        newSections[sectionIndex] = targetSection;
        return { ...prev, sections: newSections };
      });
      toast.success("Duration updated!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch details", { id: toastId });
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { paddingBottom: "4rem" }, children: /* @__PURE__ */ jsxDEV("div", { className: "container", style: { paddingTop: "2rem" }, children: [
    /* @__PURE__ */ jsxDEV("h1", { style: { fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", paddingBottom: "1rem" }, children: "Admin Dashboard" }, void 0, false, {
      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
      lineNumber: 530,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "profile-layout", style: { display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem" }, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "glass-panel", style: { borderRadius: "16px", padding: "1rem", height: "fit-content" }, children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("courses"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "courses" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "courses" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "courses" ? 600 : 400,
              marginBottom: "0.5rem",
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsxDEV(BookOpen, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 550,
                columnNumber: 29
              }, this),
              " Course Management"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 539,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("notifications"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "notifications" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "notifications" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "notifications" ? 600 : 400,
              marginBottom: "0.5rem",
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsxDEV(Bell, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 563,
                columnNumber: 29
              }, this),
              " Notification Center"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 552,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("videos"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "videos" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "videos" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "videos" ? 600 : 400,
              marginBottom: "0.5rem",
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsxDEV(Video, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 576,
                columnNumber: 29
              }, this),
              " Video Library"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 565,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("settings"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "settings" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "settings" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "settings" ? 600 : 400,
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsxDEV(Settings, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 589,
                columnNumber: 29
              }, this),
              " Settings"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 578,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("students"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "students" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "students" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "students" ? 600 : 400,
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: "0.5rem"
            },
            children: [
              /* @__PURE__ */ jsxDEV(Users, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 603,
                columnNumber: 29
              }, this),
              " Student Management"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 591,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("coupons"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "coupons" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "coupons" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "coupons" ? 600 : 400,
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: "0.5rem"
            },
            children: [
              /* @__PURE__ */ jsxDEV(Ticket, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 617,
                columnNumber: 29
              }, this),
              " Coupons"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 605,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("transactions"),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: activeTab === "transactions" ? "rgba(139, 92, 246, 0.1)" : "transparent",
              color: activeTab === "transactions" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: activeTab === "transactions" ? 600 : 400,
              transition: "0.2s",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsxDEV(CreditCard, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 630,
                columnNumber: 29
              }, this),
              " Transactions & Refunds"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 619,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
        lineNumber: 538,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { minWidth: 0 }, children: [
        activeTab === "courses" && /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }, children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }, children: [
              /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "600" }, children: "Your Courses" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 644,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => {
                    setIsEditing(false);
                    setCurrentCourse({ title: "", description: "", price: "", originalPrice: "", thumbnail: "", videoUrl: "", introVideos: [], sections: [] });
                    setExpandedSections({});
                    if (newCourseFormRef.current) {
                      setTimeout(() => {
                        newCourseFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                        const firstInput = newCourseFormRef.current.querySelector("input");
                        if (firstInput) firstInput.focus();
                      }, 100);
                    }
                  },
                  style: { background: "#00b894", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" },
                  children: [
                    /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 661,
                      columnNumber: 45
                    }, this),
                    " New"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 645,
                  columnNumber: 41
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 643,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: courses.map(
              (course) => /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", border: "1px solid var(--border)" }, children: [
                /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: course.thumbnail ? course.thumbnail.startsWith("http://localhost") ? course.thumbnail.replace("localhost", window.location.hostname) : course.thumbnail.startsWith("http") ? course.thumbnail : `http://${window.location.hostname}:5000${course.thumbnail}` : "https://via.placeholder.com/150",
                    alt: course.title,
                    style: { width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.8rem" },
                    onError: (e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 667,
                    columnNumber: 49
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("h3", { style: { margin: "0 0 0.5rem 0", fontWeight: "bold" }, children: course.title }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 673,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("p", { style: { margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-muted)" }, children: [
                  course.description.substring(0, 60),
                  "..."
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 674,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" }, children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => {
                        setIsEditing(true);
                        setCurrentCourse(course);
                        setExpandedSections({});
                      },
                      style: { flex: 1, background: "#f1f2f6", color: "#2d3436", border: "1px solid #ddd", padding: "0.4rem", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "center", gap: "5px" },
                      children: [
                        /* @__PURE__ */ jsxDEV(Edit, { size: 14 }, void 0, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 680,
                          columnNumber: 57
                        }, this),
                        " Edit"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 676,
                      columnNumber: 53
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleDelete(course._id),
                      style: { flex: 1, background: "#fff0f0", color: "#d63031", border: "1px solid #ffcccc", padding: "0.4rem", borderRadius: "4px", cursor: "pointer", display: "flex", justifyContent: "center", gap: "5px" },
                      children: [
                        /* @__PURE__ */ jsxDEV(Trash, { size: 14 }, void 0, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 686,
                          columnNumber: 57
                        }, this),
                        " Del"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 682,
                      columnNumber: 53
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 675,
                  columnNumber: 49
                }, this)
              ] }, course._id, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 666,
                columnNumber: 19
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 664,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 642,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { ref: newCourseFormRef, style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)" }, children: isEditing ? "Edit Course" : "Create New Course" }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 696,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Course Title" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 703,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    value: currentCourse.title,
                    onChange: (e) => setCurrentCourse({ ...currentCourse, title: e.target.value }),
                    placeholder: "Enter course title",
                    required: true,
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 704,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 702,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Description" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 715,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "textarea",
                  {
                    value: currentCourse.description,
                    onChange: (e) => setCurrentCourse({ ...currentCourse, description: e.target.value }),
                    placeholder: "Enter course description",
                    required: true,
                    rows: 3,
                    className: "form-input",
                    style: { fontFamily: "inherit", borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 716,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 714,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }, children: [
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                  /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Price (₹)" }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 729,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "number",
                      value: currentCourse.price,
                      onChange: (e) => setCurrentCourse({ ...currentCourse, price: e.target.value }),
                      required: true,
                      className: "form-input",
                      style: { borderRadius: "6px" }
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 730,
                      columnNumber: 49
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 728,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                  /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Original Price (₹)" }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 740,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "number",
                      value: currentCourse.originalPrice || "",
                      onChange: (e) => setCurrentCourse({ ...currentCourse, originalPrice: e.target.value }),
                      className: "form-input",
                      style: { borderRadius: "6px" }
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 741,
                      columnNumber: 49
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 739,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 727,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Thumbnail URL" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 752,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "10px" }, children: [
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      value: currentCourse.thumbnail,
                      onChange: (e) => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value }),
                      placeholder: "https://...",
                      className: "form-input",
                      style: { flex: 1, borderRadius: "6px" }
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 754,
                      columnNumber: 49
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "file",
                      id: "thumbnail-upload",
                      style: { display: "none" },
                      accept: "image/*",
                      onChange: handleUploadThumbnail
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 761,
                      columnNumber: 49
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: () => document.getElementById("thumbnail-upload").click(),
                      style: {
                        padding: "0 1rem",
                        background: "var(--surface-hover)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text)"
                      },
                      children: "Upload"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 768,
                      columnNumber: 49
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 753,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 751,
                columnNumber: 41
              }, this),
              currentCourse.thumbnail && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "-0.5rem" }, children: /* @__PURE__ */ jsxDEV(
                "img",
                {
                  src: currentCourse.thumbnail,
                  alt: "Thumbnail preview",
                  style: { width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" },
                  onError: (e) => {
                    e.target.style.display = "none";
                  },
                  onLoad: (e) => {
                    e.target.style.display = "block";
                  }
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 791,
                  columnNumber: 49
                },
                this
              ) }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 790,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Intro Videos" }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 804,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCurrentCourse((prev) => ({
                        ...prev,
                        introVideos: [...prev.introVideos || [], { title: "Intro", url: "" }]
                      })),
                      style: { fontSize: "0.8rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: "600" },
                      children: "+ Add Video"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 805,
                      columnNumber: 49
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 803,
                  columnNumber: 45
                }, this),
                (!currentCourse.introVideos || currentCourse.introVideos.length === 0) && /* @__PURE__ */ jsxDEV("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }, children: 'No intro videos. Click "+ Add Video" to add YouTube, m3u8, Bunny, or Drive links.' }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 817,
                  columnNumber: 21
                }, this),
                (currentCourse.introVideos || []).map(
                  (vid, vIdx) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem", alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        value: vid.title,
                        onChange: (e) => setCurrentCourse((prev) => {
                          const arr = [...prev.introVideos || []];
                          arr[vIdx] = { ...arr[vIdx], title: e.target.value };
                          return { ...prev, introVideos: arr };
                        }),
                        placeholder: "Label (e.g. Trailer)",
                        className: "form-input",
                        style: { flex: "0 0 120px", borderRadius: "6px", fontSize: "0.85rem" }
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 823,
                        columnNumber: 53
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        value: vid.url,
                        onChange: (e) => setCurrentCourse((prev) => {
                          const arr = [...prev.introVideos || []];
                          arr[vIdx] = { ...arr[vIdx], url: e.target.value };
                          return { ...prev, introVideos: arr };
                        }),
                        placeholder: "YouTube / m3u8 / Bunny / Drive URL",
                        className: "form-input",
                        style: { flex: 1, borderRadius: "6px", fontSize: "0.85rem" }
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 834,
                        columnNumber: 53
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => setCurrentCourse((prev) => {
                          const arr = [...prev.introVideos || []];
                          arr.splice(vIdx, 1);
                          return { ...prev, introVideos: arr };
                        }),
                        style: { color: "#d63031", background: "rgba(214,48,49,0.1)", border: "none", borderRadius: "4px", padding: "0.4rem 0.6rem", cursor: "pointer" },
                        children: /* @__PURE__ */ jsxDEV(Trash, { size: 14 }, void 0, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 854,
                          columnNumber: 57
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 845,
                        columnNumber: 53
                      },
                      this
                    )
                  ] }, vIdx, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 822,
                    columnNumber: 21
                  }, this)
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 802,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("hr", { style: { margin: "1rem 0", border: "none", borderTop: "1px solid #eee" } }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 860,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem" }, children: "Curriculum Builder" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 864,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
                  currentCourse.sections?.map(
                    (section, sIndex) => /* @__PURE__ */ jsxDEV("div", { style: { border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }, children: [
                      /* @__PURE__ */ jsxDEV("div", { style: { background: "rgba(255,255,255,0.03)", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }, children: [
                        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }, children: [
                          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
                            /* @__PURE__ */ jsxDEV("span", { style: { fontWeight: "bold", color: "var(--text-muted)" }, children: [
                              "Section ",
                              sIndex + 1,
                              ":"
                            ] }, void 0, true, {
                              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                              lineNumber: 871,
                              columnNumber: 69
                            }, this),
                            /* @__PURE__ */ jsxDEV(
                              "input",
                              {
                                value: section.title,
                                onChange: (e) => updateSectionTitle(sIndex, e.target.value),
                                className: "form-input",
                                style: { flex: 1, borderRadius: "4px", padding: "0.5rem" },
                                placeholder: "Section Title"
                              },
                              void 0,
                              false,
                              {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 872,
                                columnNumber: 69
                              },
                              this
                            )
                          ] }, void 0, true, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 870,
                            columnNumber: 65
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "0.5rem" }, children: [
                            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)", width: "70px" }, children: "Group Tag:" }, void 0, false, {
                              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                              lineNumber: 881,
                              columnNumber: 69
                            }, this),
                            /* @__PURE__ */ jsxDEV(
                              "input",
                              {
                                value: section.group || "",
                                onChange: (e) => updateSectionGroup(sIndex, e.target.value),
                                className: "form-input",
                                style: { flex: 1, borderRadius: "4px", padding: "0.4rem", fontSize: "0.85rem", background: "rgba(0,0,0,0.2)" },
                                placeholder: "e.g., JAVA DATA STRUCTURES & ALGORITHMS (Optional)"
                              },
                              void 0,
                              false,
                              {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 882,
                                columnNumber: 69
                              },
                              this
                            )
                          ] }, void 0, true, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 880,
                            columnNumber: 65
                          }, this)
                        ] }, void 0, true, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 869,
                          columnNumber: 61
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "1rem" }, children: [
                          /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => toggleSection(sIndex), style: { border: "none", background: "none", cursor: "pointer" }, children: expandedSections[sIndex] ? /* @__PURE__ */ jsxDEV(ChevronUp, { size: 18 }, void 0, false, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 893,
                            columnNumber: 97
                          }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { size: 18 }, void 0, false, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 893,
                            columnNumber: 123
                          }, this) }, void 0, false, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 892,
                            columnNumber: 65
                          }, this),
                          /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => removeSection(sIndex), style: { border: "none", background: "none", cursor: "pointer", color: "#d63031" }, children: /* @__PURE__ */ jsxDEV(Trash, { size: 18 }, void 0, false, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 896,
                            columnNumber: 69
                          }, this) }, void 0, false, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 895,
                            columnNumber: 65
                          }, this)
                        ] }, void 0, true, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 891,
                          columnNumber: 61
                        }, this)
                      ] }, void 0, true, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 868,
                        columnNumber: 57
                      }, this),
                      expandedSections[sIndex] && /* @__PURE__ */ jsxDEV("div", { style: { padding: "1rem", background: "var(--surface)" }, children: /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
                        section.lectures.map(
                          (lecture, lIndex) => /* @__PURE__ */ jsxDEV("div", { style: { padding: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "6px" }, children: [
                            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem", alignItems: "flex-end" }, children: [
                              /* @__PURE__ */ jsxDEV("div", { style: { flex: "1 1 200px" }, children: [
                                /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "0.2rem", display: "block" }, children: "Lecture Title" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 908,
                                  columnNumber: 85
                                }, this),
                                /* @__PURE__ */ jsxDEV(
                                  "input",
                                  {
                                    value: lecture.title,
                                    onChange: (e) => updateLecture(sIndex, lIndex, "title", e.target.value),
                                    className: "form-input",
                                    style: { width: "100%", borderRadius: "4px", padding: "0.5rem" }
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                    lineNumber: 909,
                                    columnNumber: 85
                                  },
                                  this
                                )
                              ] }, void 0, true, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 907,
                                columnNumber: 81
                              }, this),
                              /* @__PURE__ */ jsxDEV("div", { style: { flex: "2 1 250px" }, children: [
                                /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "0.2rem", display: "block" }, children: "Video URL" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 917,
                                  columnNumber: 85
                                }, this),
                                /* @__PURE__ */ jsxDEV(
                                  "input",
                                  {
                                    value: lecture.videoUrl,
                                    onChange: (e) => updateLecture(sIndex, lIndex, "videoUrl", e.target.value),
                                    onBlur: () => {
                                      if (lecture.videoUrl && !lecture.duration) {
                                        fetchLectureDetails(sIndex, lIndex, lecture.videoUrl);
                                      }
                                    },
                                    className: "form-input",
                                    style: { width: "100%", borderRadius: "4px", padding: "0.5rem" }
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                    lineNumber: 918,
                                    columnNumber: 85
                                  },
                                  this
                                )
                              ] }, void 0, true, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 916,
                                columnNumber: 81
                              }, this),
                              /* @__PURE__ */ jsxDEV("div", { style: { flex: "0 0 160px" }, children: [
                                /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "0.2rem", display: "block" }, children: "Duration" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 931,
                                  columnNumber: 85
                                }, this),
                                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "5px" }, children: [
                                  /* @__PURE__ */ jsxDEV(
                                    "input",
                                    {
                                      value: lecture.duration || "",
                                      onChange: (e) => updateLecture(sIndex, lIndex, "duration", e.target.value),
                                      placeholder: "10:05",
                                      className: "form-input",
                                      style: { width: "100%", borderRadius: "4px", padding: "0.5rem" }
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                      lineNumber: 933,
                                      columnNumber: 89
                                    },
                                    this
                                  ),
                                  /* @__PURE__ */ jsxDEV(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => fetchLectureDetails(sIndex, lIndex, lecture.videoUrl),
                                      title: "Auto-fetch duration",
                                      style: {
                                        background: "var(--primary)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "0.5rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      },
                                      children: /* @__PURE__ */ jsxDEV(Timer, { size: 16 }, void 0, false, {
                                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                        lineNumber: 949,
                                        columnNumber: 93
                                      }, this)
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                      lineNumber: 940,
                                      columnNumber: 89
                                    },
                                    this
                                  )
                                ] }, void 0, true, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 932,
                                  columnNumber: 85
                                }, this)
                              ] }, void 0, true, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 930,
                                columnNumber: 81
                              }, this),
                              /* @__PURE__ */ jsxDEV("div", { style: { flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }, children: [
                                /* @__PURE__ */ jsxDEV("label", { style: { fontSize: "0.75rem", fontWeight: "bold", color: lecture.freePreview ? "#00b894" : "var(--text-muted)", whiteSpace: "nowrap" }, children: "Demo" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 955,
                                  columnNumber: 85
                                }, this),
                                /* @__PURE__ */ jsxDEV(
                                  "input",
                                  {
                                    type: "checkbox",
                                    checked: !!lecture.freePreview,
                                    onChange: (e) => updateLecture(sIndex, lIndex, "freePreview", e.target.checked),
                                    title: "Mark as demo – visible to non-enrolled users",
                                    style: { width: "18px", height: "18px", accentColor: "#00b894", cursor: "pointer" }
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                    lineNumber: 956,
                                    columnNumber: 85
                                  },
                                  this
                                )
                              ] }, void 0, true, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 954,
                                columnNumber: 81
                              }, this),
                              /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => removeLecture(sIndex, lIndex), style: { flex: "0 0 auto", color: "#d63031", border: "none", background: "rgba(214, 48, 49, 0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.6rem", borderRadius: "4px", height: "fit-content" }, children: /* @__PURE__ */ jsxDEV(Trash, { size: 16 }, void 0, false, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 965,
                                columnNumber: 85
                              }, this) }, void 0, false, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 964,
                                columnNumber: 81
                              }, this)
                            ] }, void 0, true, {
                              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                              lineNumber: 906,
                              columnNumber: 77
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid #ddd" }, children: [
                              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }, children: [
                                /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-muted)" }, children: "Notes/Resources" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 972,
                                  columnNumber: 85
                                }, this),
                                /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => addNote(sIndex, lIndex), style: { fontSize: "0.8rem", color: "#0984e3", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }, children: "+ Add Note" }, void 0, false, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 973,
                                  columnNumber: 85
                                }, this)
                              ] }, void 0, true, {
                                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                lineNumber: 971,
                                columnNumber: 81
                              }, this),
                              lecture.notes?.map(
                                (note, nIndex) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }, children: [
                                  /* @__PURE__ */ jsxDEV(
                                    "input",
                                    {
                                      value: note.title,
                                      onChange: (e) => updateNote(sIndex, lIndex, nIndex, "title", e.target.value),
                                      placeholder: "Note Title",
                                      className: "form-input",
                                      style: { flex: 1, borderRadius: "4px", fontSize: "0.9rem", padding: "0.4rem" }
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                      lineNumber: 977,
                                      columnNumber: 89
                                    },
                                    this
                                  ),
                                  /* @__PURE__ */ jsxDEV(
                                    "input",
                                    {
                                      value: note.url,
                                      onChange: (e) => updateNote(sIndex, lIndex, nIndex, "url", e.target.value),
                                      placeholder: "URL (PDF/Link)",
                                      className: "form-input",
                                      style: { flex: 2, borderRadius: "4px", fontSize: "0.9rem", padding: "0.4rem" }
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                      lineNumber: 984,
                                      columnNumber: 89
                                    },
                                    this
                                  ),
                                  /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => removeNote(sIndex, lIndex, nIndex), style: { color: "#d63031", border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ jsxDEV(Trash, { size: 14 }, void 0, false, {
                                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                    lineNumber: 992,
                                    columnNumber: 93
                                  }, this) }, void 0, false, {
                                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                    lineNumber: 991,
                                    columnNumber: 89
                                  }, this)
                                ] }, nIndex, true, {
                                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                                  lineNumber: 976,
                                  columnNumber: 33
                                }, this)
                              )
                            ] }, void 0, true, {
                              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                              lineNumber: 970,
                              columnNumber: 77
                            }, this)
                          ] }, lIndex, true, {
                            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                            lineNumber: 905,
                            columnNumber: 29
                          }, this)
                        ),
                        /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => addLecture(sIndex), style: { width: "100%", padding: "0.5rem", border: "1px dashed var(--border)", borderRadius: "6px", background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", cursor: "pointer", fontWeight: "500" }, children: "+ Add Lecture" }, void 0, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 999,
                          columnNumber: 69
                        }, this)
                      ] }, void 0, true, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 903,
                        columnNumber: 65
                      }, this) }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 902,
                        columnNumber: 25
                      }, this)
                    ] }, sIndex, true, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 867,
                      columnNumber: 23
                    }, this)
                  ),
                  /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: addSection, style: { padding: "0.75rem", background: "var(--surface-hover)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }, children: "+ Add Section" }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1007,
                    columnNumber: 49
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 865,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 863,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("button", { type: "submit", style: { marginTop: "2rem", padding: "1rem", background: "#6c5ce7", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }, children: isEditing ? "Update Course" : "Create Course" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1013,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 700,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 695,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 640,
          columnNumber: 13
        }, this),
        activeTab === "notifications" && /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)" }, children: "Send Notification" }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1025,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSendNotification, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Title" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1028,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    value: newNotification.title,
                    onChange: (e) => setNewNotification({ ...newNotification, title: e.target.value }),
                    required: true,
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1029,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1027,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Message" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1038,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "textarea",
                  {
                    value: newNotification.message,
                    onChange: (e) => setNewNotification({ ...newNotification, message: e.target.value }),
                    required: true,
                    rows: 3,
                    className: "form-input",
                    style: { fontFamily: "inherit", borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1039,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1037,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Type" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1049,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: newNotification.type,
                    onChange: (e) => setNewNotification({ ...newNotification, type: e.target.value }),
                    className: "form-input",
                    style: { borderRadius: "6px" },
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "info", children: "Info" }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1056,
                        columnNumber: 49
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "warning", children: "Warning" }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1057,
                        columnNumber: 49
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "success", children: "Success" }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1058,
                        columnNumber: 49
                      }, this),
                      /* @__PURE__ */ jsxDEV("option", { value: "offer", children: "Offer" }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1059,
                        columnNumber: 49
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1050,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1048,
                columnNumber: 41
              }, this),
              newNotification.type === "offer" && /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Select Courses (Multiple)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1066,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: {
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "rgba(255,255,255,0.02)",
                  padding: "0.5rem"
                }, children: [
                  courses.map(
                    (course) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          type: "checkbox",
                          id: `course-${course._id}`,
                          checked: newNotification.relatedCourses.includes(course._id),
                          onChange: (e) => {
                            const checked = e.target.checked;
                            setNewNotification((prev) => {
                              const current = prev.relatedCourses || [];
                              if (checked) {
                                return { ...prev, relatedCourses: [...current, course._id] };
                              } else {
                                return { ...prev, relatedCourses: current.filter((id) => id !== course._id) };
                              }
                            });
                          },
                          style: { cursor: "pointer" }
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 1077,
                          columnNumber: 61
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "img",
                        {
                          src: course.thumbnail ? course.thumbnail.startsWith("http://localhost") ? course.thumbnail.replace("localhost", window.location.hostname) : course.thumbnail.startsWith("http") ? course.thumbnail : `http://${window.location.hostname}:5000${course.thumbnail}` : "/placeholder-course.jpg",
                          alt: "",
                          style: { width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" },
                          onError: (e) => {
                            e.target.src = "/placeholder-course.jpg";
                          }
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 1094,
                          columnNumber: 61
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("label", { htmlFor: `course-${course._id}`, style: { cursor: "pointer", fontSize: "0.95rem", width: "100%", display: "flex", flexDirection: "column" }, children: [
                        /* @__PURE__ */ jsxDEV("span", { style: { fontWeight: "500" }, children: course.title }, void 0, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 1101,
                          columnNumber: 65
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem", color: "var(--text-muted)" }, children: [
                          "₹",
                          course.price
                        ] }, void 0, true, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 1102,
                          columnNumber: 65
                        }, this)
                      ] }, void 0, true, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1100,
                        columnNumber: 61
                      }, this)
                    ] }, course._id, true, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1076,
                      columnNumber: 23
                    }, this)
                  ),
                  courses.length === 0 && /* @__PURE__ */ jsxDEV("p", { style: { padding: "0.5rem", color: "var(--text-muted)" }, children: "No courses available." }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1106,
                    columnNumber: 78
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1067,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)" }, children: [
                  "Selected: ",
                  newNotification.relatedCourses?.length || 0
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1108,
                  columnNumber: 49
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1065,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("button", { type: "submit", style: { marginTop: "1rem", padding: "0.8rem", background: "#6c5ce7", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }, children: "Send" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1111,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1026,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1024,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }, children: [
              /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", margin: 0, color: "var(--text)" }, children: "History" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1119,
                columnNumber: 41
              }, this),
              notifications.length > 0 && /* @__PURE__ */ jsxDEV("button", { onClick: handleClearAllNotifications, style: { color: "#d63031", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }, children: "Clear All" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1121,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1118,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "600px", overflowY: "auto" }, children: notifications.length === 0 ? /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--text-muted)" }, children: "No notifications." }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1127,
              columnNumber: 71
            }, this) : notifications.map(
              (notif) => /* @__PURE__ */ jsxDEV("div", { style: { padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.02)", borderLeft: `4px solid ${notif.type === "warning" ? "#ff7675" : notif.type === "offer" ? "#f59e0b" : "#74b9ff"}` }, children: [
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }, children: [
                  /* @__PURE__ */ jsxDEV("span", { style: { fontWeight: "bold", fontSize: "0.9rem" }, children: notif.title }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1130,
                    columnNumber: 53
                  }, this),
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => handleDeleteNotification(notif._id), style: { color: "#d63031", border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ jsxDEV(Trash, { size: 14 }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1131,
                    columnNumber: 197
                  }, this) }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1131,
                    columnNumber: 53
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1129,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("p", { style: { margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }, children: notif.message }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1133,
                  columnNumber: 49
                }, this),
                notif.type === "offer" && notif.relatedCourses && notif.relatedCourses.length > 0 && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "0.8rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }, children: notif.relatedCourses.map(
                  (course, idx) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid var(--border)" }, children: [
                    course.thumbnail && /* @__PURE__ */ jsxDEV(
                      "img",
                      {
                        src: course.thumbnail.startsWith("http://localhost") ? course.thumbnail.replace("localhost", window.location.hostname) : course.thumbnail.startsWith("http") ? course.thumbnail : `http://${window.location.hostname}:5000${course.thumbnail}`,
                        alt: "",
                        style: { width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" },
                        onError: (e) => {
                          e.target.style.display = "none";
                        }
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1141,
                        columnNumber: 25
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem" }, children: course.title || "Unknown Course" }, void 0, false, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1148,
                      columnNumber: 65
                    }, this)
                  ] }, idx, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1139,
                    columnNumber: 23
                  }, this)
                ) }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1137,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "0.5rem", fontSize: "0.75rem", color: "#999" }, children: [
                  new Date(notif.createdAt).toLocaleDateString(),
                  " • ",
                  notif.type
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1154,
                  columnNumber: 49
                }, this)
              ] }, notif._id, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1128,
                columnNumber: 19
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1126,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1117,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1023,
          columnNumber: 13
        }, this),
        activeTab === "videos" && /* @__PURE__ */ jsxDEV("div", { className: "profile-layout", style: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)", alignSelf: "start" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ jsxDEV(Video, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1170,
                columnNumber: 41
              }, this),
              " Bunny.net Configuration"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1169,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: fetchBunnyVideos, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "API Key (Access Key)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1174,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "password",
                    value: bunnyConfig.apiKey,
                    onChange: (e) => setBunnyConfig({ ...bunnyConfig, apiKey: e.target.value }),
                    required: true,
                    placeholder: "Enter API Key",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1175,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1173,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Library ID" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1186,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    value: bunnyConfig.libraryId,
                    onChange: (e) => setBunnyConfig({ ...bunnyConfig, libraryId: e.target.value }),
                    required: true,
                    placeholder: "Enter Library ID",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1187,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1185,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Collection ID (Optional)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1197,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    value: bunnyConfig.collectionId,
                    onChange: (e) => setBunnyConfig({ ...bunnyConfig, collectionId: e.target.value }),
                    placeholder: "Enter Collection ID",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1198,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1196,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "submit",
                  disabled: loadingBunny,
                  style: {
                    marginTop: "1rem",
                    padding: "0.8rem",
                    background: "#fd79a8",
                    // Bunny color-ish
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: loadingBunny ? "wait" : "pointer",
                    opacity: loadingBunny ? 0.7 : 1
                  },
                  children: loadingBunny ? "Fetching..." : "Fetch Videos"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1206,
                  columnNumber: 41
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1172,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1168,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)" }, children: [
              "Video Library (",
              bunnyVideos.length,
              ")"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1228,
              columnNumber: 37
            }, this),
            bunnyVideos.length === 0 ? /* @__PURE__ */ jsxDEV("div", { style: { textAlign: "center", padding: "3rem", color: "var(--text-muted)" }, children: [
              /* @__PURE__ */ jsxDEV(Video, { size: 48, style: { opacity: 0.2, marginBottom: "1rem" } }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1234,
                columnNumber: 45
              }, this),
              /* @__PURE__ */ jsxDEV("p", { children: "No videos loaded. Enter credentials to fetch content." }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1235,
                columnNumber: 45
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1233,
              columnNumber: 17
            }, this) : /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }, children: bunnyVideos.map(
              (video) => /* @__PURE__ */ jsxDEV("div", { style: { background: "rgba(255,255,255,0.02)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }, children: [
                /* @__PURE__ */ jsxDEV("div", { style: { position: "relative", paddingTop: "56.25%", background: "#000" }, children: /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: video.thumbnailUrl || `https://${bunnyConfig.libraryId}.b-cdn.net/${video.guid}/${video.thumbnailFileName}`,
                    alt: video.title,
                    style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
                    onError: (e) => e.target.style.display = "none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1242,
                    columnNumber: 57
                  },
                  this
                ) }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1241,
                  columnNumber: 53
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { padding: "0.8rem" }, children: [
                  /* @__PURE__ */ jsxDEV("h4", { style: { margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, title: video.title, children: video.title }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1250,
                    columnNumber: 57
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: formatDuration(video.length) }, void 0, false, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1254,
                      columnNumber: 61
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        onClick: () => {
                          navigator.clipboard.writeText(`https://player.mediadelivery.net/embed/${bunnyConfig.libraryId}/${video.guid}`);
                          toast.success("Embed URL Copied!");
                        },
                        style: { fontSize: "0.75rem", padding: "2px 6px", background: "var(--primary)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
                        children: "Copy URL"
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1257,
                        columnNumber: 61
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1253,
                    columnNumber: 57
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1249,
                  columnNumber: 53
                }, this)
              ] }, video.guid, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1240,
                columnNumber: 19
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1238,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1227,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1166,
          columnNumber: 13
        }, this),
        activeTab === "settings" && /* @__PURE__ */ jsxDEV("div", { style: { width: "100%" }, children: /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxDEV(Hammer, { size: 24 }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1281,
              columnNumber: 41
            }, this),
            " Site Settings"
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1280,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }, children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }, children: "Maintenance Mode" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1286,
                columnNumber: 45
              }, this),
              /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }, children: "Enable to show a maintenance popup to all non-admin users." }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1287,
                columnNumber: 45
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1285,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("label", { style: { position: "relative", display: "inline-block", width: "60px", height: "34px" }, children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "checkbox",
                  checked: maintenanceMode,
                  onChange: toggleMaintenanceMode,
                  style: { opacity: 0, width: 0, height: 0 }
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1292,
                  columnNumber: 45
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("span", { style: {
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: maintenanceMode ? "#22c55e" : "#ccc",
                transition: ".4s",
                borderRadius: "34px"
              } }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1298,
                columnNumber: 45
              }, this),
              /* @__PURE__ */ jsxDEV("span", { style: {
                position: "absolute",
                content: '""',
                height: "26px",
                width: "26px",
                left: "4px",
                bottom: "4px",
                backgroundColor: "white",
                transition: ".4s",
                borderRadius: "50%",
                transform: maintenanceMode ? "translateX(26px)" : "translateX(0)"
              } }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1303,
                columnNumber: 45
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1291,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1284,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }, children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h3", { style: { fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }, children: "Global Announcement Bar" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1315,
                columnNumber: 45
              }, this),
              /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }, children: "Set a message to display at the very top of the app. Leave empty to hide." }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1316,
                columnNumber: 45
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1314,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  value: globalAnnouncement,
                  onChange: (e) => setGlobalAnnouncement(e.target.value),
                  placeholder: "e.g. Flash Sale: 50% Off Top Courses Today Only!",
                  rows: 2,
                  className: "form-input",
                  style: { fontFamily: "inherit", borderRadius: "6px" }
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1321,
                  columnNumber: 45
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleUpdateAnnouncement,
                  style: { alignSelf: "flex-start", padding: "0.6rem 1.2rem", background: "#6c5ce7", color: "white", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer" },
                  children: "Update Announcement"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1329,
                  columnNumber: 45
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1320,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1313,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1279,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1278,
          columnNumber: 13
        }, this),
        activeTab === "students" && /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)", alignSelf: "start" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ jsxDEV(Users, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1347,
                columnNumber: 41
              }, this),
              " Manual Enrollment"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1346,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleManualEnroll, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Student Email" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1351,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "email",
                    value: manualEnrollEmail,
                    onChange: (e) => setManualEnrollEmail(e.target.value),
                    required: true,
                    placeholder: "user@example.com",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1352,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1350,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Target Course" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1363,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: manualEnrollCourse,
                    onChange: (e) => setManualEnrollCourse(e.target.value),
                    required: true,
                    className: "form-input",
                    style: { borderRadius: "6px" },
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "", disabled: true, children: "Select a course" }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1371,
                        columnNumber: 49
                      }, this),
                      courses.map(
                        (c) => /* @__PURE__ */ jsxDEV("option", { value: c._id, children: c.title }, c._id, false, {
                          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                          lineNumber: 1373,
                          columnNumber: 23
                        }, this)
                      )
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1364,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1362,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "submit",
                  style: {
                    marginTop: "1rem",
                    padding: "0.8rem",
                    background: "#6c5ce7",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  },
                  children: "Enroll Student"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1377,
                  columnNumber: 41
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1349,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1345,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)" }, children: [
              "Student Directory (",
              users.length,
              ")"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1391,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "600px", overflowY: "auto" }, children: users.length === 0 ? /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--text-muted)" }, children: "No students found." }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1395,
              columnNumber: 63
            }, this) : users.map(
              (user) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }, children: /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }, children: [
                /* @__PURE__ */ jsxDEV("div", { style: { flex: "1 1 200px" }, children: [
                  /* @__PURE__ */ jsxDEV("h3", { style: { margin: "0 0 0.2rem 0", fontSize: "1rem", fontWeight: "bold" }, children: user.name || "No Name provided" }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1400,
                    columnNumber: 57
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { style: { margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--text-muted)", wordBreak: "break-all" }, children: user.email }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1401,
                    columnNumber: 57
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" }, children: [
                    user.enrolledCourses?.map(
                      (c) => /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.75rem", padding: "2px 8px", background: "rgba(108, 92, 231, 0.1)", color: "#6c5ce7", borderRadius: "12px", border: "1px solid rgba(108, 92, 231, 0.2)" }, children: c.title }, c._id, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1404,
                        columnNumber: 27
                      }, this)
                    ),
                    (!user.enrolledCourses || user.enrolledCourses.length === 0) && /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: "Free User" }, void 0, false, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1409,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1402,
                    columnNumber: 57
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1399,
                  columnNumber: 53
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { flex: "0 0 auto", textAlign: "left", minWidth: "150px" }, children: [
                  /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.85rem", color: "var(--text-muted)", display: "block" }, children: [
                    "Join: ",
                    new Date(user.createdAt).toLocaleDateString()
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1414,
                    columnNumber: 57
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginTop: "0.2rem" }, children: [
                    "Last Login: ",
                    user.activeSessions && user.activeSessions.length > 0 ? new Date(Math.max(...user.activeSessions.map((session) => new Date(session.lastActive).getTime()))).toLocaleString() : "Never"
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1415,
                    columnNumber: 57
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleForceLogout(user.uid),
                      title: "Log out from all devices",
                      style: {
                        background: "rgba(214, 48, 49, 0.1)",
                        color: "#d63031",
                        border: "1px solid rgba(214, 48, 49, 0.2)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: "500"
                      },
                      children: "Force Logout"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1423,
                      columnNumber: 61
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1422,
                    columnNumber: 57
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1413,
                  columnNumber: 53
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1398,
                columnNumber: 49
              }, this) }, user._id, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1396,
                columnNumber: 19
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1394,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1390,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1343,
          columnNumber: 13
        }, this),
        activeTab === "coupons" && /* @__PURE__ */ jsxDEV("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)", alignSelf: "start" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }, children: [
              /* @__PURE__ */ jsxDEV(Plus, { size: 20 }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1454,
                columnNumber: 41
              }, this),
              " Create New Coupon"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1453,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleCreateCoupon, style: { display: "flex", flexDirection: "column", gap: "1.25rem" }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Coupon Code" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1458,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: newCoupon.code,
                    onChange: (e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() }),
                    required: true,
                    placeholder: "e.g. SUMMER50",
                    className: "form-input",
                    style: { borderRadius: "6px", textTransform: "uppercase" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1459,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1457,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Discount Percentage (%)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1470,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    max: "100",
                    value: newCoupon.discountPercentage,
                    onChange: (e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value }),
                    required: true,
                    placeholder: "e.g. 20",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1471,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1469,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Max Uses (Optional)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1484,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    value: newCoupon.maxUses,
                    onChange: (e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value }),
                    placeholder: "Leave empty for unlimited",
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1485,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1483,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxDEV("label", { style: { fontWeight: "500" }, children: "Expiration Date (Optional)" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1496,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "datetime-local",
                    value: newCoupon.validUntil,
                    onChange: (e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value }),
                    className: "form-input",
                    style: { borderRadius: "6px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1497,
                    columnNumber: 45
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1495,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "submit",
                  style: {
                    marginTop: "1rem",
                    padding: "0.8rem",
                    background: "#6c5ce7",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  },
                  children: "Create Coupon"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1505,
                  columnNumber: 41
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1456,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1452,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
            /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)" }, children: [
              "Active Coupons (",
              coupons.length,
              ")"
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1519,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "600px", overflowY: "auto" }, children: coupons.length === 0 ? /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--text-muted)" }, children: "No coupons found." }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1523,
              columnNumber: 65
            }, this) : coupons.map(
              (coupon) => /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.02)", opacity: coupon.isActive ? 1 : 0.6 }, children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("h3", { style: { margin: "0 0 0.2rem 0", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }, children: coupon.code }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1526,
                    columnNumber: 53
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }, children: [
                    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem", padding: "2px 8px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", borderRadius: "12px" }, children: [
                      coupon.discountPercentage,
                      "% OFF"
                    ] }, void 0, true, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1528,
                      columnNumber: 57
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem", padding: "2px 8px", background: "rgba(108, 92, 231, 0.1)", color: "#6c5ce7", borderRadius: "12px" }, children: [
                      "Uses: ",
                      coupon.currentUses,
                      " ",
                      coupon.maxUses ? `/ ${coupon.maxUses}` : "(Unlimited)"
                    ] }, void 0, true, {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1531,
                      columnNumber: 57
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1527,
                    columnNumber: 53
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { style: { margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }, children: [
                    "Expires: ",
                    coupon.validUntil ? new Date(coupon.validUntil).toLocaleString() : "Never"
                  ] }, void 0, true, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1535,
                    columnNumber: 53
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1525,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "0.5rem" }, children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleToggleCoupon(coupon._id),
                      title: coupon.isActive ? "Deactivate" : "Activate",
                      style: {
                        background: coupon.isActive ? "rgba(234, 179, 8, 0.1)" : "rgba(34, 197, 94, 0.1)",
                        color: coupon.isActive ? "#eab308" : "#22c55e",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "500"
                      },
                      children: coupon.isActive ? "Disable" : "Enable"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1540,
                      columnNumber: 53
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: () => handleDeleteCoupon(coupon._id),
                      title: "Delete",
                      style: {
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      },
                      children: /* @__PURE__ */ jsxDEV(Trash, { size: 16 }, void 0, false, {
                        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                        lineNumber: 1569,
                        columnNumber: 57
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                      lineNumber: 1555,
                      columnNumber: 53
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1539,
                  columnNumber: 49
                }, this)
              ] }, coupon._id, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1524,
                columnNumber: 19
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1522,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1518,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1450,
          columnNumber: 13
        }, this),
        activeTab === "transactions" && /* @__PURE__ */ jsxDEV("div", { style: { background: "var(--surface)", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxDEV(CreditCard, { size: 20 }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1583,
              columnNumber: 37
            }, this),
            " Transaction History"
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1582,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxDEV("table", { style: { width: "100%", borderCollapse: "collapse", textAlign: "left" }, children: [
            /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { style: { borderBottom: "2px solid var(--border)", color: "var(--text-muted)" }, children: [
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Date" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1589,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "User" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1590,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Course" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1591,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Amount (₹)" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1592,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Txn ID" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1593,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Status" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1594,
                columnNumber: 49
              }, this),
              /* @__PURE__ */ jsxDEV("th", { style: { padding: "1rem", fontWeight: 600 }, children: "Action" }, void 0, false, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1595,
                columnNumber: 49
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1588,
              columnNumber: 45
            }, this) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1587,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { children: payments.length === 0 ? /* @__PURE__ */ jsxDEV("tr", { children: /* @__PURE__ */ jsxDEV("td", { colSpan: "7", style: { padding: "2rem", textAlign: "center", color: "var(--text-muted)" }, children: "No transactions found." }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1601,
              columnNumber: 53
            }, this) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1600,
              columnNumber: 21
            }, this) : payments.map(
              (payment) => /* @__PURE__ */ jsxDEV("tr", { style: { borderBottom: "1px solid var(--border)", transition: "background 0.2s" }, children: [
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem", whiteSpace: "nowrap" }, children: new Date(payment.createdAt).toLocaleDateString() }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1606,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem" }, children: [
                  /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 500 }, children: payment.user?.name }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1608,
                    columnNumber: 61
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "0.8rem", color: "var(--text-muted)" }, children: payment.user?.email }, void 0, false, {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1609,
                    columnNumber: 61
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1607,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem" }, children: payment.courseId?.title || "Unknown Course" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1611,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem", fontWeight: 600 }, children: payment.amount }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1612,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem", fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }, children: payment.paymentId }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1613,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem" }, children: /* @__PURE__ */ jsxDEV("span", { style: {
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  background: payment.status === "successful" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: payment.status === "successful" ? "#22c55e" : "#ef4444"
                }, children: payment.status.toUpperCase() }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1615,
                  columnNumber: 61
                }, this) }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1614,
                  columnNumber: 57
                }, this),
                /* @__PURE__ */ jsxDEV("td", { style: { padding: "1rem" }, children: payment.status === "successful" ? /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => handleRefund(payment._id),
                    style: {
                      padding: "6px 12px",
                      background: "transparent",
                      color: "#ef4444",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      transition: "0.2s"
                    },
                    children: "Issue Refund"
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                    lineNumber: 1625,
                    columnNumber: 25
                  },
                  this
                ) : /* @__PURE__ */ jsxDEV("span", { style: { color: "var(--text-muted)", fontSize: "0.85rem" }, children: "-" }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1636,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                  lineNumber: 1623,
                  columnNumber: 57
                }, this)
              ] }, payment._id, true, {
                fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
                lineNumber: 1605,
                columnNumber: 21
              }, this)
            ) }, void 0, false, {
              fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
              lineNumber: 1598,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1586,
            columnNumber: 37
          }, this) }, void 0, false, {
            fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
            lineNumber: 1585,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
          lineNumber: 1581,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
        lineNumber: 635,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
      lineNumber: 535,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
    lineNumber: 529,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx",
    lineNumber: 528,
    columnNumber: 5
  }, this);
};
_s(AdminDashboard, "VjOhDvdwgHe61lEGr8FI+ljhmQA=");
_c = AdminDashboard;
export default AdminDashboard;
var _c;
$RefreshReg$(_c, "AdminDashboard");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/gugul/OneDrive/Desktop/Web Dev Projects/AuraEd/client/src/pages/AdminDashboard.jsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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LGVBQWVBO0FBQWUsSUFBQXlSO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJhcGkiLCJ1c2VOYXZpZ2F0ZSIsInRvYXN0IiwiUGx1cyIsIkVkaXQiLCJUcmFzaCIsIkNoZXZyb25Eb3duIiwiQ2hldnJvblVwIiwiVmlkZW8iLCJCZWxsIiwiU2VuZCIsIlRpbWVyIiwiSGFtbWVyIiwiQm9va09wZW4iLCJTZXR0aW5ncyIsIlVzZXJzIiwiVGlja2V0IiwiQ3JlZGl0Q2FyZCIsIkFkbWluRGFzaGJvYXJkIiwiX3MiLCJjb3Vyc2VzIiwic2V0Q291cnNlcyIsImlzRWRpdGluZyIsInNldElzRWRpdGluZyIsImN1cnJlbnRDb3Vyc2UiLCJzZXRDdXJyZW50Q291cnNlIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsInByaWNlIiwib3JpZ2luYWxQcmljZSIsInRodW1ibmFpbCIsInZpZGVvVXJsIiwiaW50cm9WaWRlb3MiLCJzZWN0aW9ucyIsIm5ld0NvdXJzZUZvcm1SZWYiLCJhY3RpdmVUYWIiLCJzZXRBY3RpdmVUYWIiLCJub3RpZmljYXRpb25zIiwic2V0Tm90aWZpY2F0aW9ucyIsIm5ld05vdGlmaWNhdGlvbiIsInNldE5ld05vdGlmaWNhdGlvbiIsIm1lc3NhZ2UiLCJ0eXBlIiwicmVjaXBpZW50IiwicmVsYXRlZENvdXJzZXMiLCJ1c2VycyIsInNldFVzZXJzIiwibWFudWFsRW5yb2xsRW1haWwiLCJzZXRNYW51YWxFbnJvbGxFbWFpbCIsIm1hbnVhbEVucm9sbENvdXJzZSIsInNldE1hbnVhbEVucm9sbENvdXJzZSIsImJ1bm55Q29uZmlnIiwic2V0QnVubnlDb25maWciLCJhcGlLZXkiLCJsaWJyYXJ5SWQiLCJjb2xsZWN0aW9uSWQiLCJidW5ueVZpZGVvcyIsInNldEJ1bm55VmlkZW9zIiwibG9hZGluZ0J1bm55Iiwic2V0TG9hZGluZ0J1bm55IiwibWFpbnRlbmFuY2VNb2RlIiwic2V0TWFpbnRlbmFuY2VNb2RlIiwiZ2xvYmFsQW5ub3VuY2VtZW50Iiwic2V0R2xvYmFsQW5ub3VuY2VtZW50IiwiY291cG9ucyIsInNldENvdXBvbnMiLCJuZXdDb3Vwb24iLCJzZXROZXdDb3Vwb24iLCJjb2RlIiwiZGlzY291bnRQZXJjZW50YWdlIiwibWF4VXNlcyIsInZhbGlkVW50aWwiLCJwYXltZW50cyIsInNldFBheW1lbnRzIiwiZmV0Y2hTZXR0aW5ncyIsIm1haW50UmVzIiwiYW5uUmVzIiwiUHJvbWlzZSIsImFsbCIsImdldCIsImRhdGEiLCJ2YWx1ZSIsImVycm9yIiwiY29uc29sZSIsInRvZ2dsZU1haW50ZW5hbmNlTW9kZSIsIm5ld1ZhbHVlIiwicG9zdCIsImtleSIsInN1Y2Nlc3MiLCJoYW5kbGVVcGRhdGVBbm5vdW5jZW1lbnQiLCJmZXRjaEJ1bm55VmlkZW9zIiwiZSIsInByZXZlbnREZWZhdWx0IiwiaXRlbXMiLCJsZW5ndGgiLCJleHBhbmRlZFNlY3Rpb25zIiwic2V0RXhwYW5kZWRTZWN0aW9ucyIsInRvZ2dsZVNlY3Rpb24iLCJpbmRleCIsInByZXYiLCJhZGRTZWN0aW9uIiwiZ3JvdXAiLCJsZWN0dXJlcyIsInVwZGF0ZVNlY3Rpb25UaXRsZSIsIm5ld1NlY3Rpb25zIiwidXBkYXRlU2VjdGlvbkdyb3VwIiwicmVtb3ZlU2VjdGlvbiIsIndpbmRvdyIsImNvbmZpcm0iLCJzcGxpY2UiLCJhZGRMZWN0dXJlIiwic2VjdGlvbkluZGV4IiwidGFyZ2V0U2VjdGlvbiIsImR1cmF0aW9uIiwiZnJlZVByZXZpZXciLCJub3RlcyIsInVwZGF0ZUxlY3R1cmUiLCJsZWN0dXJlSW5kZXgiLCJmaWVsZCIsInRhcmdldExlY3R1cmUiLCJuZXdMZWN0dXJlcyIsInJlbW92ZUxlY3R1cmUiLCJhZGROb3RlIiwidXJsIiwidXBkYXRlTm90ZSIsIm5vdGVJbmRleCIsIm5ld05vdGVzIiwicmVtb3ZlTm90ZSIsImZldGNoQ291cnNlcyIsImZldGNoQWxsTm90aWZpY2F0aW9ucyIsImZldGNoVXNlcnMiLCJmZXRjaENvdXBvbnMiLCJmZXRjaFBheW1lbnRzIiwiaGFuZGxlU3VibWl0IiwiY291cnNlRGF0YSIsIk51bWJlciIsInB1dCIsIl9pZCIsInJlc3BvbnNlIiwiaGFuZGxlRGVsZXRlIiwiaWQiLCJkZWxldGUiLCJoYW5kbGVTZW5kTm90aWZpY2F0aW9uIiwiaGFuZGxlRGVsZXRlTm90aWZpY2F0aW9uIiwiaGFuZGxlQ2xlYXJBbGxOb3RpZmljYXRpb25zIiwiaGFuZGxlTWFudWFsRW5yb2xsIiwiZW1haWwiLCJjb3Vyc2VJZCIsImhhbmRsZUZvcmNlTG9nb3V0IiwidWlkIiwiaGFuZGxlQ3JlYXRlQ291cG9uIiwiaGFuZGxlRGVsZXRlQ291cG9uIiwiaGFuZGxlVG9nZ2xlQ291cG9uIiwicGF0Y2giLCJoYW5kbGVSZWZ1bmQiLCJ0b2FzdElkIiwibG9hZGluZyIsImhhbmRsZVVwbG9hZFRodW1ibmFpbCIsImZpbGUiLCJ0YXJnZXQiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJoZWFkZXJzIiwic2VydmVyVXJsIiwibG9jYXRpb24iLCJob3N0bmFtZSIsImZvcm1hdER1cmF0aW9uIiwic2Vjb25kcyIsInRvdGFsU2Vjb25kcyIsIk1hdGgiLCJyb3VuZCIsImhvdXJzIiwiZmxvb3IiLCJtaW51dGVzIiwidHJpbSIsImZldGNoTGVjdHVyZURldGFpbHMiLCJ2aWRlb0lkIiwibGliSWQiLCJyZWdleCIsIm1hdGNoIiwiaW5jbHVkZXMiLCJmb3JtYXR0ZWREdXJhdGlvbiIsInBhZGRpbmdCb3R0b20iLCJwYWRkaW5nVG9wIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibWFyZ2luQm90dG9tIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJib3JkZXJSYWRpdXMiLCJwYWRkaW5nIiwiaGVpZ2h0Iiwid2lkdGgiLCJhbGlnbkl0ZW1zIiwiYmFja2dyb3VuZCIsImNvbG9yIiwidHJhbnNpdGlvbiIsImJvcmRlciIsImN1cnNvciIsInRleHRBbGlnbiIsIm1pbldpZHRoIiwianVzdGlmeUNvbnRlbnQiLCJjdXJyZW50Iiwic2V0VGltZW91dCIsInNjcm9sbEludG9WaWV3IiwiYmVoYXZpb3IiLCJibG9jayIsImZpcnN0SW5wdXQiLCJxdWVyeVNlbGVjdG9yIiwiZm9jdXMiLCJmbGV4RGlyZWN0aW9uIiwibWFwIiwiY291cnNlIiwiYm94U2hhZG93Iiwic3RhcnRzV2l0aCIsInJlcGxhY2UiLCJvYmplY3RGaXQiLCJzcmMiLCJtYXJnaW4iLCJzdWJzdHJpbmciLCJtYXJnaW5Ub3AiLCJmbGV4IiwiZm9udEZhbWlseSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjbGljayIsIm1heEhlaWdodCIsInN0eWxlIiwiZm9udFN0eWxlIiwidmlkIiwidklkeCIsImFyciIsImJvcmRlclRvcCIsInNlY3Rpb24iLCJzSW5kZXgiLCJvdmVyZmxvdyIsImJvcmRlckJvdHRvbSIsInBhZGRpbmdMZWZ0IiwibWFyZ2luTGVmdCIsImxlY3R1cmUiLCJsSW5kZXgiLCJmbGV4V3JhcCIsIndoaXRlU3BhY2UiLCJjaGVja2VkIiwiYWNjZW50Q29sb3IiLCJib3JkZXJMZWZ0Iiwibm90ZSIsIm5JbmRleCIsIm92ZXJmbG93WSIsImZpbHRlciIsIm5vdGlmIiwiaWR4IiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsImFsaWduU2VsZiIsIm9wYWNpdHkiLCJ2aWRlbyIsInBvc2l0aW9uIiwidGh1bWJuYWlsVXJsIiwiZ3VpZCIsInRodW1ibmFpbEZpbGVOYW1lIiwidG9wIiwibGVmdCIsInRleHRPdmVyZmxvdyIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInJpZ2h0IiwiYm90dG9tIiwiYmFja2dyb3VuZENvbG9yIiwiY29udGVudCIsInRyYW5zZm9ybSIsImMiLCJ1c2VyIiwibmFtZSIsIndvcmRCcmVhayIsImVucm9sbGVkQ291cnNlcyIsImFjdGl2ZVNlc3Npb25zIiwibWF4Iiwic2Vzc2lvbiIsImxhc3RBY3RpdmUiLCJnZXRUaW1lIiwidG9Mb2NhbGVTdHJpbmciLCJ0b1VwcGVyQ2FzZSIsInRleHRUcmFuc2Zvcm0iLCJjb3Vwb24iLCJpc0FjdGl2ZSIsImxldHRlclNwYWNpbmciLCJjdXJyZW50VXNlcyIsIm92ZXJmbG93WCIsImJvcmRlckNvbGxhcHNlIiwicGF5bWVudCIsImFtb3VudCIsInBheW1lbnRJZCIsInN0YXR1cyIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFkbWluRGFzaGJvYXJkLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgYXBpIGZyb20gJy4uL3V0aWxzL2FwaSc7XHJcbmltcG9ydCB7IHVzZU5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IHRvYXN0IH0gZnJvbSAncmVhY3QtaG90LXRvYXN0JztcclxuaW1wb3J0IHsgUGx1cywgRWRpdCwgVHJhc2gsIENoZXZyb25Eb3duLCBDaGV2cm9uVXAsIFZpZGVvLCBCZWxsLCBTZW5kLCBUaW1lciwgSGFtbWVyLCBCb29rT3BlbiwgU2V0dGluZ3MsIFVzZXJzLCBUaWNrZXQsIENyZWRpdENhcmQgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xyXG5cclxuY29uc3QgQWRtaW5EYXNoYm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBbY291cnNlcywgc2V0Q291cnNlc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbaXNFZGl0aW5nLCBzZXRJc0VkaXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW2N1cnJlbnRDb3Vyc2UsIHNldEN1cnJlbnRDb3Vyc2VdID0gdXNlU3RhdGUoe1xyXG4gICAgICAgIHRpdGxlOiAnJywgZGVzY3JpcHRpb246ICcnLCBwcmljZTogJycsIG9yaWdpbmFsUHJpY2U6ICcnLCB0aHVtYm5haWw6ICcnLCB2aWRlb1VybDogJycsIGludHJvVmlkZW9zOiBbXSwgc2VjdGlvbnM6IFtdXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IG5ld0NvdXJzZUZvcm1SZWYgPSB1c2VSZWYobnVsbCk7XHJcbiAgICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGUoJ2NvdXJzZXMnKTsgLy8gRGVmYXVsdCB0byBmdW5jdGlvbmFsIHRhYlxyXG4gICAgY29uc3QgW25vdGlmaWNhdGlvbnMsIHNldE5vdGlmaWNhdGlvbnNdID0gdXNlU3RhdGUoW10pO1xyXG4gICAgY29uc3QgW25ld05vdGlmaWNhdGlvbiwgc2V0TmV3Tm90aWZpY2F0aW9uXSA9IHVzZVN0YXRlKHtcclxuICAgICAgICB0aXRsZTogJycsIG1lc3NhZ2U6ICcnLCB0eXBlOiAnaW5mbycsIHJlY2lwaWVudDogJ2FsbCcsIHJlbGF0ZWRDb3Vyc2VzOiBbXVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBbdXNlcnMsIHNldFVzZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICAgIGNvbnN0IFttYW51YWxFbnJvbGxFbWFpbCwgc2V0TWFudWFsRW5yb2xsRW1haWxdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgY29uc3QgW21hbnVhbEVucm9sbENvdXJzZSwgc2V0TWFudWFsRW5yb2xsQ291cnNlXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgICBjb25zdCBbYnVubnlDb25maWcsIHNldEJ1bm55Q29uZmlnXSA9IHVzZVN0YXRlKHsgYXBpS2V5OiAnJywgbGlicmFyeUlkOiAnJywgY29sbGVjdGlvbklkOiAnJyB9KTtcclxuICAgIGNvbnN0IFtidW5ueVZpZGVvcywgc2V0QnVubnlWaWRlb3NdID0gdXNlU3RhdGUoW10pO1xyXG4gICAgY29uc3QgW2xvYWRpbmdCdW5ueSwgc2V0TG9hZGluZ0J1bm55XSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgICAvLyBNYWludGVuYW5jZSBNb2RlIFN0YXRlXHJcbiAgICBjb25zdCBbbWFpbnRlbmFuY2VNb2RlLCBzZXRNYWludGVuYW5jZU1vZGVdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICAgIC8vIEdsb2JhbCBBbm5vdW5jZW1lbnQgU3RhdGVcclxuICAgIGNvbnN0IFtnbG9iYWxBbm5vdW5jZW1lbnQsIHNldEdsb2JhbEFubm91bmNlbWVudF0gPSB1c2VTdGF0ZSgnJyk7XHJcblxyXG4gICAgLy8gQ291cG9uIFN0YXRlXHJcbiAgICBjb25zdCBbY291cG9ucywgc2V0Q291cG9uc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgICBjb25zdCBbbmV3Q291cG9uLCBzZXROZXdDb3Vwb25dID0gdXNlU3RhdGUoe1xyXG4gICAgICAgIGNvZGU6ICcnLCBkaXNjb3VudFBlcmNlbnRhZ2U6ICcnLCBtYXhVc2VzOiAnJywgdmFsaWRVbnRpbDogJydcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFBheW1lbnRzIFN0YXRlXHJcbiAgICBjb25zdCBbcGF5bWVudHMsIHNldFBheW1lbnRzXSA9IHVzZVN0YXRlKFtdKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZldGNoU2V0dGluZ3MgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbbWFpbnRSZXMsIGFublJlc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBpLmdldCgnL3NldHRpbmdzL21haW50ZW5hbmNlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBpLmdldCgnL3NldHRpbmdzL2Fubm91bmNlbWVudCcpXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIHNldE1haW50ZW5hbmNlTW9kZShtYWludFJlcy5kYXRhPy52YWx1ZSA9PT0gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRHbG9iYWxBbm5vdW5jZW1lbnQoYW5uUmVzLmRhdGE/LnZhbHVlIHx8ICcnKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZldGNoU2V0dGluZ3MoKTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICBjb25zdCB0b2dnbGVNYWludGVuYW5jZU1vZGUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSAhbWFpbnRlbmFuY2VNb2RlO1xyXG4gICAgICAgICAgICBhd2FpdCBhcGkucG9zdCgnL3NldHRpbmdzJywgeyBrZXk6ICdtYWludGVuYW5jZScsIHZhbHVlOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICAgICAgc2V0TWFpbnRlbmFuY2VNb2RlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcyhgTWFpbnRlbmFuY2UgTW9kZSAke25ld1ZhbHVlID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31gKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSBtYWludGVuYW5jZSBtb2RlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVVcGRhdGVBbm5vdW5jZW1lbnQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgYXBpLnBvc3QoJy9zZXR0aW5ncycsIHsga2V5OiAnYW5ub3VuY2VtZW50JywgdmFsdWU6IGdsb2JhbEFubm91bmNlbWVudCB9KTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcygnR2xvYmFsIGFubm91bmNlbWVudCB1cGRhdGVkIGRpcmVjdGx5IScpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIGFubm91bmNlbWVudCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZmV0Y2hCdW5ueVZpZGVvcyA9IGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHNldExvYWRpbmdCdW5ueSh0cnVlKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaS5wb3N0KCcvYnVubnkvdmlkZW9zJywgYnVubnlDb25maWcpO1xyXG4gICAgICAgICAgICBzZXRCdW5ueVZpZGVvcyhkYXRhLml0ZW1zIHx8IFtdKTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcyhgRmV0Y2hlZCAke2RhdGEuaXRlbXM/Lmxlbmd0aCB8fCAwfSB2aWRlb3NgKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdG9hc3QuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCB2aWRlb3MuIENoZWNrIGNyZWRlbnRpYWxzLicpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHNldExvYWRpbmdCdW5ueShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDdXJyaWN1bHVtIEhlbHBlcnNcclxuICAgIGNvbnN0IFtleHBhbmRlZFNlY3Rpb25zLCBzZXRFeHBhbmRlZFNlY3Rpb25zXSA9IHVzZVN0YXRlKHt9KTtcclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWN0aW9uID0gKGluZGV4KSA9PiB7XHJcbiAgICAgICAgc2V0RXhwYW5kZWRTZWN0aW9ucyhwcmV2ID0+ICh7IC4uLnByZXYsIFtpbmRleF06ICFwcmV2W2luZGV4XSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGFkZFNlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgIHNlY3Rpb25zOiBbLi4ucHJldi5zZWN0aW9ucywgeyBncm91cDogJycsIHRpdGxlOiAnTmV3IFNlY3Rpb24nLCBsZWN0dXJlczogW10gfV1cclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZVNlY3Rpb25UaXRsZSA9IChpbmRleCwgdGl0bGUpID0+IHtcclxuICAgICAgICBzZXRDdXJyZW50Q291cnNlKHByZXYgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdTZWN0aW9ucyA9IFsuLi5wcmV2LnNlY3Rpb25zXTtcclxuICAgICAgICAgICAgbmV3U2VjdGlvbnNbaW5kZXhdID0geyAuLi5uZXdTZWN0aW9uc1tpbmRleF0sIHRpdGxlIH07XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIHNlY3Rpb25zOiBuZXdTZWN0aW9ucyB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB1cGRhdGVTZWN0aW9uR3JvdXAgPSAoaW5kZXgsIGdyb3VwKSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbnMgPSBbLi4ucHJldi5zZWN0aW9uc107XHJcbiAgICAgICAgICAgIG5ld1NlY3Rpb25zW2luZGV4XSA9IHsgLi4ubmV3U2VjdGlvbnNbaW5kZXhdLCBncm91cCB9O1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBzZWN0aW9uczogbmV3U2VjdGlvbnMgfTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlU2VjdGlvbiA9IChpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0oJ1JlbW92ZSB0aGlzIHNlY3Rpb24/JykpIHJldHVybjtcclxuICAgICAgICBzZXRDdXJyZW50Q291cnNlKHByZXYgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdTZWN0aW9ucyA9IFsuLi5wcmV2LnNlY3Rpb25zXTtcclxuICAgICAgICAgICAgbmV3U2VjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4ucHJldiwgc2VjdGlvbnM6IG5ld1NlY3Rpb25zIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGFkZExlY3R1cmUgPSAoc2VjdGlvbkluZGV4KSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbnMgPSBbLi4ucHJldi5zZWN0aW9uc107XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSB7IC4uLm5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gfTtcclxuICAgICAgICAgICAgdGFyZ2V0U2VjdGlvbi5sZWN0dXJlcyA9IFsuLi50YXJnZXRTZWN0aW9uLmxlY3R1cmVzLCB7IHRpdGxlOiAnTmV3IExlY3R1cmUnLCB2aWRlb1VybDogJycsIGR1cmF0aW9uOiAnJywgZnJlZVByZXZpZXc6IGZhbHNlLCBub3RlczogW10gfV07XHJcbiAgICAgICAgICAgIG5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gPSB0YXJnZXRTZWN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBzZWN0aW9uczogbmV3U2VjdGlvbnMgfTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdXBkYXRlTGVjdHVyZSA9IChzZWN0aW9uSW5kZXgsIGxlY3R1cmVJbmRleCwgZmllbGQsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbnMgPSBbLi4ucHJldi5zZWN0aW9uc107XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSB7IC4uLm5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gfTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TGVjdHVyZSA9IHsgLi4udGFyZ2V0U2VjdGlvbi5sZWN0dXJlc1tsZWN0dXJlSW5kZXhdLCBbZmllbGRdOiB2YWx1ZSB9O1xyXG4gICAgICAgICAgICBjb25zdCBuZXdMZWN0dXJlcyA9IFsuLi50YXJnZXRTZWN0aW9uLmxlY3R1cmVzXTtcclxuICAgICAgICAgICAgbmV3TGVjdHVyZXNbbGVjdHVyZUluZGV4XSA9IHRhcmdldExlY3R1cmU7XHJcbiAgICAgICAgICAgIHRhcmdldFNlY3Rpb24ubGVjdHVyZXMgPSBuZXdMZWN0dXJlcztcclxuICAgICAgICAgICAgbmV3U2VjdGlvbnNbc2VjdGlvbkluZGV4XSA9IHRhcmdldFNlY3Rpb247XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIHNlY3Rpb25zOiBuZXdTZWN0aW9ucyB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCByZW1vdmVMZWN0dXJlID0gKHNlY3Rpb25JbmRleCwgbGVjdHVyZUluZGV4KSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbnMgPSBbLi4ucHJldi5zZWN0aW9uc107XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSB7IC4uLm5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gfTtcclxuICAgICAgICAgICAgY29uc3QgbmV3TGVjdHVyZXMgPSBbLi4udGFyZ2V0U2VjdGlvbi5sZWN0dXJlc107XHJcbiAgICAgICAgICAgIG5ld0xlY3R1cmVzLnNwbGljZShsZWN0dXJlSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB0YXJnZXRTZWN0aW9uLmxlY3R1cmVzID0gbmV3TGVjdHVyZXM7XHJcbiAgICAgICAgICAgIG5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gPSB0YXJnZXRTZWN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBzZWN0aW9uczogbmV3U2VjdGlvbnMgfTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgYWRkTm90ZSA9IChzZWN0aW9uSW5kZXgsIGxlY3R1cmVJbmRleCkgPT4ge1xyXG4gICAgICAgIHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlY3Rpb25zID0gWy4uLnByZXYuc2VjdGlvbnNdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTZWN0aW9uID0geyAuLi5uZXdTZWN0aW9uc1tzZWN0aW9uSW5kZXhdIH07XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0xlY3R1cmVzID0gWy4uLnRhcmdldFNlY3Rpb24ubGVjdHVyZXNdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMZWN0dXJlID0geyAuLi5uZXdMZWN0dXJlc1tsZWN0dXJlSW5kZXhdIH07XHJcbiAgICAgICAgICAgIHRhcmdldExlY3R1cmUubm90ZXMgPSBbLi4uKHRhcmdldExlY3R1cmUubm90ZXMgfHwgW10pLCB7IHRpdGxlOiAnTmV3IE5vdGUnLCB1cmw6ICcnIH1dO1xyXG4gICAgICAgICAgICBuZXdMZWN0dXJlc1tsZWN0dXJlSW5kZXhdID0gdGFyZ2V0TGVjdHVyZTtcclxuICAgICAgICAgICAgdGFyZ2V0U2VjdGlvbi5sZWN0dXJlcyA9IG5ld0xlY3R1cmVzO1xyXG4gICAgICAgICAgICBuZXdTZWN0aW9uc1tzZWN0aW9uSW5kZXhdID0gdGFyZ2V0U2VjdGlvbjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4ucHJldiwgc2VjdGlvbnM6IG5ld1NlY3Rpb25zIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZU5vdGUgPSAoc2VjdGlvbkluZGV4LCBsZWN0dXJlSW5kZXgsIG5vdGVJbmRleCwgZmllbGQsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbnMgPSBbLi4ucHJldi5zZWN0aW9uc107XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSB7IC4uLm5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gfTtcclxuICAgICAgICAgICAgY29uc3QgbmV3TGVjdHVyZXMgPSBbLi4udGFyZ2V0U2VjdGlvbi5sZWN0dXJlc107XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldExlY3R1cmUgPSB7IC4uLm5ld0xlY3R1cmVzW2xlY3R1cmVJbmRleF0gfTtcclxuICAgICAgICAgICAgY29uc3QgbmV3Tm90ZXMgPSBbLi4uKHRhcmdldExlY3R1cmUubm90ZXMgfHwgW10pXTtcclxuICAgICAgICAgICAgbmV3Tm90ZXNbbm90ZUluZGV4XSA9IHsgLi4ubmV3Tm90ZXNbbm90ZUluZGV4XSwgW2ZpZWxkXTogdmFsdWUgfTtcclxuICAgICAgICAgICAgdGFyZ2V0TGVjdHVyZS5ub3RlcyA9IG5ld05vdGVzO1xyXG4gICAgICAgICAgICBuZXdMZWN0dXJlc1tsZWN0dXJlSW5kZXhdID0gdGFyZ2V0TGVjdHVyZTtcclxuICAgICAgICAgICAgdGFyZ2V0U2VjdGlvbi5sZWN0dXJlcyA9IG5ld0xlY3R1cmVzO1xyXG4gICAgICAgICAgICBuZXdTZWN0aW9uc1tzZWN0aW9uSW5kZXhdID0gdGFyZ2V0U2VjdGlvbjtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4ucHJldiwgc2VjdGlvbnM6IG5ld1NlY3Rpb25zIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHJlbW92ZU5vdGUgPSAoc2VjdGlvbkluZGV4LCBsZWN0dXJlSW5kZXgsIG5vdGVJbmRleCkgPT4ge1xyXG4gICAgICAgIHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlY3Rpb25zID0gWy4uLnByZXYuc2VjdGlvbnNdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTZWN0aW9uID0geyAuLi5uZXdTZWN0aW9uc1tzZWN0aW9uSW5kZXhdIH07XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0xlY3R1cmVzID0gWy4uLnRhcmdldFNlY3Rpb24ubGVjdHVyZXNdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMZWN0dXJlID0geyAuLi5uZXdMZWN0dXJlc1tsZWN0dXJlSW5kZXhdIH07XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld05vdGVzID0gWy4uLih0YXJnZXRMZWN0dXJlLm5vdGVzIHx8IFtdKV07XHJcbiAgICAgICAgICAgIG5ld05vdGVzLnNwbGljZShub3RlSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB0YXJnZXRMZWN0dXJlLm5vdGVzID0gbmV3Tm90ZXM7XHJcbiAgICAgICAgICAgIG5ld0xlY3R1cmVzW2xlY3R1cmVJbmRleF0gPSB0YXJnZXRMZWN0dXJlO1xyXG4gICAgICAgICAgICB0YXJnZXRTZWN0aW9uLmxlY3R1cmVzID0gbmV3TGVjdHVyZXM7XHJcbiAgICAgICAgICAgIG5ld1NlY3Rpb25zW3NlY3Rpb25JbmRleF0gPSB0YXJnZXRTZWN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBzZWN0aW9uczogbmV3U2VjdGlvbnMgfTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gRGF0YSBGZXRjaGluZ1xyXG4gICAgY29uc3QgZmV0Y2hDb3Vyc2VzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXBpLmdldCgnL2NvdXJzZXMnKTtcclxuICAgICAgICAgICAgc2V0Q291cnNlcyhkYXRhKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGZldGNoIGNvdXJzZXNcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZmV0Y2hBbGxOb3RpZmljYXRpb25zID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXBpLmdldCgnL25vdGlmaWNhdGlvbnMvYWxsJyk7XHJcbiAgICAgICAgICAgIHNldE5vdGlmaWNhdGlvbnMoZGF0YSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBmZXRjaCBub3RpZmljYXRpb25zXCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGZldGNoVXNlcnMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkuZ2V0KCcvdXNlcnMnKTtcclxuICAgICAgICAgICAgc2V0VXNlcnMoZGF0YSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBmZXRjaCB1c2Vyc1wiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBmZXRjaENvdXBvbnMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkuZ2V0KCcvY291cG9ucycpO1xyXG4gICAgICAgICAgICBzZXRDb3Vwb25zKGRhdGEpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggY291cG9uc1wiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBmZXRjaFBheW1lbnRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXBpLmdldCgnL3BheW1lbnQvYWxsJyk7XHJcbiAgICAgICAgICAgIHNldFBheW1lbnRzKGRhdGEpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gZmV0Y2ggcGF5bWVudHNcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBmZXRjaENvdXJzZXMoKTtcclxuICAgICAgICBmZXRjaEFsbE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICBmZXRjaFVzZXJzKCk7XHJcbiAgICAgICAgZmV0Y2hDb3Vwb25zKCk7XHJcbiAgICAgICAgZmV0Y2hQYXltZW50cygpO1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIC8vIEhhbmRsZXJzXHJcbiAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBjb3Vyc2VEYXRhID0geyAuLi5jdXJyZW50Q291cnNlIH07XHJcbiAgICAgICAgICAgIGlmIChjb3Vyc2VEYXRhLm9yaWdpbmFsUHJpY2UpIHtcclxuICAgICAgICAgICAgICAgIGNvdXJzZURhdGEub3JpZ2luYWxQcmljZSA9IE51bWJlcihjb3Vyc2VEYXRhLm9yaWdpbmFsUHJpY2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY291cnNlRGF0YS5vcmlnaW5hbFByaWNlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlzRWRpdGluZykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgYXBpLnB1dChgL2NvdXJzZXMvJHtjdXJyZW50Q291cnNlLl9pZH1gLCBjb3Vyc2VEYXRhKTtcclxuICAgICAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0NvdXJzZSB1cGRhdGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBhcGkucG9zdCgnL2NvdXJzZXMnLCBjb3Vyc2VEYXRhKTtcclxuICAgICAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0NvdXJzZSBjcmVhdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0SXNFZGl0aW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgc2V0Q3VycmVudENvdXJzZSh7IHRpdGxlOiAnJywgZGVzY3JpcHRpb246ICcnLCBwcmljZTogJycsIG9yaWdpbmFsUHJpY2U6ICcnLCB0aHVtYm5haWw6ICcnLCB2aWRlb1VybDogJycsIGludHJvVmlkZW9zOiBbXSwgc2VjdGlvbnM6IFtdIH0pO1xyXG4gICAgICAgICAgICBmZXRjaENvdXJzZXMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdG9hc3QuZXJyb3IoZXJyb3IucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgJ09wZXJhdGlvbiBmYWlsZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZURlbGV0ZSA9IGFzeW5jIChpZCkgPT4ge1xyXG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKSkgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFwaS5kZWxldGUoYC9jb3Vyc2VzLyR7aWR9YCk7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0NvdXJzZSBkZWxldGVkJyk7XHJcbiAgICAgICAgICAgIGZldGNoQ291cnNlcygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKCdGYWlsZWQgdG8gZGVsZXRlIGNvdXJzZScpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlU2VuZE5vdGlmaWNhdGlvbiA9IGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFwaS5wb3N0KCcvbm90aWZpY2F0aW9ucycsIG5ld05vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ05vdGlmaWNhdGlvbiBTZW50Jyk7XHJcbiAgICAgICAgICAgIHNldE5ld05vdGlmaWNhdGlvbih7IHRpdGxlOiAnJywgbWVzc2FnZTogJycsIHR5cGU6ICdpbmZvJywgcmVjaXBpZW50OiAnYWxsJywgcmVsYXRlZENvdXJzZXM6IFtdIH0pO1xyXG4gICAgICAgICAgICBmZXRjaEFsbE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcignRmFpbGVkIHRvIHNlbmQgbm90aWZpY2F0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVEZWxldGVOb3RpZmljYXRpb24gPSBhc3luYyAoaWQpID0+IHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKCdEZWxldGUgdGhpcyBub3RpZmljYXRpb24/JykpIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBhcGkuZGVsZXRlKGAvbm90aWZpY2F0aW9ucy8ke2lkfWApO1xyXG4gICAgICAgICAgICB0b2FzdC5zdWNjZXNzKCdOb3RpZmljYXRpb24gZGVsZXRlZCcpO1xyXG4gICAgICAgICAgICBmZXRjaEFsbE5vdGlmaWNhdGlvbnMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcignRmFpbGVkIHRvIGRlbGV0ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlQ2xlYXJBbGxOb3RpZmljYXRpb25zID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0oJ0RlbGV0ZSBBTEwgbm90aWZpY2F0aW9ucz8nKSkgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFwaS5kZWxldGUoJy9ub3RpZmljYXRpb25zL2FsbCcpO1xyXG4gICAgICAgICAgICB0b2FzdC5zdWNjZXNzKCdBbGwgbm90aWZpY2F0aW9ucyBjbGVhcmVkJyk7XHJcbiAgICAgICAgICAgIGZldGNoQWxsTm90aWZpY2F0aW9ucygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKCdGYWlsZWQgdG8gY2xlYXIgbm90aWZpY2F0aW9ucycpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlTWFudWFsRW5yb2xsID0gYXN5bmMgKGUpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgYXBpLnBvc3QoJy91c2Vycy9lbnJvbGwtbWFudWFsJywgeyBlbWFpbDogbWFudWFsRW5yb2xsRW1haWwsIGNvdXJzZUlkOiBtYW51YWxFbnJvbGxDb3Vyc2UgfSk7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoXCJFbnJvbGxlZCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICAgICAgICAgIHNldE1hbnVhbEVucm9sbEVtYWlsKCcnKTtcclxuICAgICAgICAgICAgc2V0TWFudWFsRW5yb2xsQ291cnNlKCcnKTtcclxuICAgICAgICAgICAgZmV0Y2hVc2VycygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKGVycm9yLnJlc3BvbnNlPy5kYXRhPy5tZXNzYWdlIHx8ICdFbnJvbGxtZW50IGZhaWxlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlRm9yY2VMb2dvdXQgPSBhc3luYyAodWlkKSA9PiB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsb2cgb3V0IHRoaXMgdXNlciBmcm9tIGFsbCB0aGVpciBkZXZpY2VzP1wiKSkgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXBpLnBvc3QoYC91c2Vycy8ke3VpZH0vZm9yY2UtbG9nb3V0YCk7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoZGF0YS5tZXNzYWdlIHx8ICdVc2VyIGxvZ2dlZCBvdXQnKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcihlcnJvci5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGZvcmNlIGxvZ291dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gLS0tIENvdXBvbiBIYW5kbGVycyAtLS1cclxuICAgIGNvbnN0IGhhbmRsZUNyZWF0ZUNvdXBvbiA9IGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFwaS5wb3N0KCcvY291cG9ucycsIG5ld0NvdXBvbik7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0NvdXBvbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICBzZXROZXdDb3Vwb24oeyBjb2RlOiAnJywgZGlzY291bnRQZXJjZW50YWdlOiAnJywgbWF4VXNlczogJycsIHZhbGlkVW50aWw6ICcnIH0pO1xyXG4gICAgICAgICAgICBmZXRjaENvdXBvbnMoKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcihlcnJvci5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBjb3Vwb24nKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZURlbGV0ZUNvdXBvbiA9IGFzeW5jIChpZCkgPT4ge1xyXG4gICAgICAgIGlmICghd2luZG93LmNvbmZpcm0oJ0RlbGV0ZSB0aGlzIGNvdXBvbj8nKSkgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFwaS5kZWxldGUoYC9jb3Vwb25zLyR7aWR9YCk7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0NvdXBvbiBkZWxldGVkJyk7XHJcbiAgICAgICAgICAgIGZldGNoQ291cG9ucygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKCdGYWlsZWQgdG8gZGVsZXRlIGNvdXBvbicpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaGFuZGxlVG9nZ2xlQ291cG9uID0gYXN5bmMgKGlkKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgYXBpLnBhdGNoKGAvY291cG9ucy8ke2lkfS90b2dnbGVgKTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcygnQ291cG9uIHN0YXR1cyB1cGRhdGVkJyk7XHJcbiAgICAgICAgICAgIGZldGNoQ291cG9ucygpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRvYXN0LmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIGNvdXBvbiBzdGF0dXMnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIC0tLSBQYXltZW50IEhhbmRsZXJzIC0tLVxyXG4gICAgY29uc3QgaGFuZGxlUmVmdW5kID0gYXN5bmMgKGlkKSA9PiB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZWZ1bmQgdGhpcyBwYXltZW50PyBUaGlzIHdpbGwgcmV2b2tlIHRoZSB1c2VyJ3MgYWNjZXNzIHRvIHRoZSBjb3Vyc2UuXCIpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IHRvYXN0SWQgPSB0b2FzdC5sb2FkaW5nKCdQcm9jZXNzaW5nIHJlZnVuZCB2aWEgUmF6b3JwYXkuLi4nKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaS5wb3N0KGAvcGF5bWVudC9yZWZ1bmQvJHtpZH1gKTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcyhkYXRhLm1lc3NhZ2UgfHwgJ1JlZnVuZCBzdWNjZXNzZnVsJywgeyBpZDogdG9hc3RJZCB9KTtcclxuICAgICAgICAgICAgZmV0Y2hQYXltZW50cygpO1xyXG4gICAgICAgICAgICBmZXRjaFVzZXJzKCk7IC8vIFRvIHVwZGF0ZSBhY2Nlc3MgVUlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcihlcnJvci5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCAnRmFpbGVkIHRvIHByb2Nlc3MgcmVmdW5kJywgeyBpZDogdG9hc3RJZCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVVwbG9hZFRodW1ibmFpbCA9IGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmaWxlKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9hc3RJZCA9IHRvYXN0LmxvYWRpbmcoJ1VwbG9hZGluZyB0aHVtYm5haWwuLi4nKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkucG9zdCgnL3VwbG9hZCcsIGZvcm1EYXRhLCB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBkYXRhIGlzIHRoZSBwYXRoIHN0cmluZywgZS5nLiBcIi91cGxvYWRzL2ltYWdlLTEyMy5qcGdcIlxyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGNvbnN0cnVjdCB0aGUgZnVsbCBVUkxcclxuICAgICAgICAgICAgY29uc3Qgc2VydmVyVXJsID0gYGh0dHA6Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZX06NTAwMGA7XHJcbiAgICAgICAgICAgIHNldEN1cnJlbnRDb3Vyc2UoeyAuLi5jdXJyZW50Q291cnNlLCB0aHVtYm5haWw6IGAke3NlcnZlclVybH0ke2RhdGF9YCB9KTtcclxuICAgICAgICAgICAgdG9hc3Quc3VjY2VzcygnVGh1bWJuYWlsIHVwbG9hZGVkIScsIHsgaWQ6IHRvYXN0SWQgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVXBsb2FkIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgdG9hc3QuZXJyb3IoJ0ZhaWxlZCB0byB1cGxvYWQgdGh1bWJuYWlsJywgeyBpZDogdG9hc3RJZCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhlbHBlciB0byBmb3JtYXQgZHVyYXRpb25cclxuICAgIGNvbnN0IGZvcm1hdER1cmF0aW9uID0gKHNlY29uZHMpID0+IHtcclxuICAgICAgICBjb25zdCB0b3RhbFNlY29uZHMgPSBNYXRoLnJvdW5kKHNlY29uZHMpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigodG90YWxTZWNvbmRzICUgMzYwMCkgLyA2MCk7XHJcblxyXG4gICAgICAgIGlmIChob3VycyA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2hvdXJzfWhyICR7bWludXRlcyA+IDAgPyBtaW51dGVzICsgJ21pbnMnIDogJyd9YC50cmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgJHttaW51dGVzfW1pbnNgO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBmZXRjaExlY3R1cmVEZXRhaWxzID0gYXN5bmMgKHNlY3Rpb25JbmRleCwgbGVjdHVyZUluZGV4LCB2aWRlb1VybCkgPT4ge1xyXG4gICAgICAgIGlmICghdmlkZW9VcmwpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGV4dHJhY3QgVmlkZW8gSUQgYW5kIExpYnJhcnkgSUQgKGlmIHBvc3NpYmxlIGZyb20gVVJMLCBvdGhlcndpc2UgdXNlIGNvbmZpZylcclxuICAgICAgICAvLyBDb21tb24gVVJMOiBodHRwczovL2lmcmFtZS5tZWRpYWRlbGl2ZXJ5Lm5ldC9wbGF5L3tsaWJyYXJ5SWR9L3t2aWRlb0lkfSBvciBodHRwczovL3BsYXllci5tZWRpYWRlbGl2ZXJ5Lm5ldC9lbWJlZC97bGlicmFyeUlkfS97dmlkZW9JZH1cclxuICAgICAgICBsZXQgdmlkZW9JZCA9ICcnO1xyXG4gICAgICAgIGxldCBsaWJJZCA9IGJ1bm55Q29uZmlnLmxpYnJhcnlJZDsgLy8gRGVmYXVsdCB0byBjb25maWdcclxuXHJcbiAgICAgICAgY29uc3QgcmVnZXggPSAvKD86cGxheXxlbWJlZClcXC8oXFxkKylcXC8oW2EtekEtWjAtOS1dKykvO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gdmlkZW9VcmwubWF0Y2gocmVnZXgpO1xyXG4gICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICBsaWJJZCA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICB2aWRlb0lkID0gbWF0Y2hbMl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgbTN1OCBVUkxzIHRvIHVzZSB0aGUgZ2VuZXJpYyBwYXJzZXJcclxuICAgICAgICBpZiAodmlkZW9VcmwuaW5jbHVkZXMoJy5tM3U4JykpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9hc3RJZCA9IHRvYXN0LmxvYWRpbmcoJ1BhcnNpbmcgbTN1OCBkdXJhdGlvbi4uLicpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkucG9zdCgnL3NldHRpbmdzL20zdTgtZHVyYXRpb24nLCB7IHVybDogdmlkZW9VcmwgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREdXJhdGlvbiA9IGZvcm1hdER1cmF0aW9uKGRhdGEubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVMZWN0dXJlKHNlY3Rpb25JbmRleCwgbGVjdHVyZUluZGV4LCAnZHVyYXRpb24nLCBmb3JtYXR0ZWREdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Quc3VjY2VzcygnRHVyYXRpb24gYXV0by1mZXRjaGVkIScsIHsgaWQ6IHRvYXN0SWQgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0LmVycm9yKCdDb3VsZCBub3QgZGV0ZXJtaW5lIGR1cmF0aW9uIGZyb20gbTN1OCcsIHsgaWQ6IHRvYXN0SWQgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibTN1OCBwYXJzZSBlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0b2FzdC5lcnJvcignRmFpbGVkIHRvIHBhcnNlIG0zdTggZmlsZScsIHsgaWQ6IHRvYXN0SWQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG90aGVyIGdlbmVyaWMgVVJMcyB0byBza2lwIGF1dG8tZmV0Y2hcclxuICAgICAgICBpZiAodmlkZW9VcmwuaW5jbHVkZXMoJ2RyaXZlLmdvb2dsZS5jb20nKSB8fCB2aWRlb1VybC5pbmNsdWRlcygneW91dHViZS5jb20nKSB8fCB2aWRlb1VybC5pbmNsdWRlcygneW91dHUuYmUnKSkge1xyXG4gICAgICAgICAgICAvLyBSZXRyaWV2ZSBkdXJhdGlvbiBpZiBwb3NzaWJsZSBvciBqdXN0IHJldHVyblxyXG4gICAgICAgICAgICAvLyBGb3Igbm93LCBqdXN0IHNraXAgdGhlIGVycm9yXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdmlkZW9JZCB8fCAhbGliSWQgfHwgIWJ1bm55Q29uZmlnLmFwaUtleSkge1xyXG4gICAgICAgICAgICB0b2FzdC5lcnJvcignQ2Fubm90IGF1dG8tZmV0Y2guIEVuc3VyZSBVUkwgaXMgdmFsaWQgYW5kIEFQSSBLZXkgaXMgc2V0IGluIFwiVmlkZW8gTGlicmFyeVwiIHRhYi4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9hc3RJZCA9IHRvYXN0LmxvYWRpbmcoJ0ZldGNoaW5nIHZpZGVvIGRldGFpbHMuLi4nKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkucG9zdCgnL2J1bm55L3ZpZGVvLWRldGFpbHMnLCB7XHJcbiAgICAgICAgICAgICAgICBhcGlLZXk6IGJ1bm55Q29uZmlnLmFwaUtleSxcclxuICAgICAgICAgICAgICAgIGxpYnJhcnlJZDogbGliSWQsXHJcbiAgICAgICAgICAgICAgICB2aWRlb0lkOiB2aWRlb0lkXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIExlY3R1cmVcclxuICAgICAgICAgICAgc2V0Q3VycmVudENvdXJzZShwcmV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NlY3Rpb25zID0gWy4uLnByZXYuc2VjdGlvbnNdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0U2VjdGlvbiA9IHsgLi4ubmV3U2VjdGlvbnNbc2VjdGlvbkluZGV4XSB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGVjdHVyZXMgPSBbLi4udGFyZ2V0U2VjdGlvbi5sZWN0dXJlc107XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRMZWN0dXJlID0geyAuLi5uZXdMZWN0dXJlc1tsZWN0dXJlSW5kZXhdIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVjdHVyZS5kdXJhdGlvbiA9IGZvcm1hdER1cmF0aW9uKGRhdGEubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsOiBVcGRhdGUgdGl0bGUgaWYgZW1wdHk/IExldCdzIGp1c3QgdXBkYXRlIGR1cmF0aW9uIGZvciBub3cgYXMgcmVxdWVzdGVkLlxyXG4gICAgICAgICAgICAgICAgLy8gdGFyZ2V0TGVjdHVyZS50aXRsZSA9IGRhdGEudGl0bGU7IFxyXG5cclxuICAgICAgICAgICAgICAgIG5ld0xlY3R1cmVzW2xlY3R1cmVJbmRleF0gPSB0YXJnZXRMZWN0dXJlO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2VjdGlvbi5sZWN0dXJlcyA9IG5ld0xlY3R1cmVzO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VjdGlvbnNbc2VjdGlvbkluZGV4XSA9IHRhcmdldFNlY3Rpb247XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBzZWN0aW9uczogbmV3U2VjdGlvbnMgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0R1cmF0aW9uIHVwZGF0ZWQhJywgeyBpZDogdG9hc3RJZCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdG9hc3QuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBkZXRhaWxzJywgeyBpZDogdG9hc3RJZCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nQm90dG9tOiAnNHJlbScgfX0+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgc3R5bGU9e3sgcGFkZGluZ1RvcDogJzJyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7IGZvbnRTaXplOiAnMnJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgbWFyZ2luQm90dG9tOiAnMnJlbScsIHBhZGRpbmdCb3R0b206ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICBBZG1pbiBEYXNoYm9hcmRcclxuICAgICAgICAgICAgICAgIDwvaDE+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIE1haW4gQ29udGVudCBBcmVhIHVzaW5nIFByb2ZpbGUgTGF5b3V0ICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWxheW91dFwiIHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJzI1MHB4IDFmcicsIGdhcDogJzJyZW0nIH19PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogU2lkZWJhciBUYWJzICovfVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2xhc3MtcGFuZWxcIiBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICcxNnB4JywgcGFkZGluZzogJzFyZW0nLCBoZWlnaHQ6ICdmaXQtY29udGVudCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYignY291cnNlcycpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjc1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMXJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVRhYiA9PT0gJ2NvdXJzZXMnID8gJ3JnYmEoMTM5LCA5MiwgMjQ2LCAwLjEpJyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ2NvdXJzZXMnID8gJ3ZhcigtLXByaW1hcnkpJyA6ICd2YXIoLS10ZXh0LW11dGVkKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogYWN0aXZlVGFiID09PSAnY291cnNlcycgPyA2MDAgOiA0MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMC41cmVtJywgdHJhbnNpdGlvbjogJzAuMnMnLCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicsIHRleHRBbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm9va09wZW4gc2l6ZT17MjB9IC8+IENvdXJzZSBNYW5hZ2VtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ25vdGlmaWNhdGlvbnMnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMC43NXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzFyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY3RpdmVUYWIgPT09ICdub3RpZmljYXRpb25zJyA/ICdyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVUYWIgPT09ICdub3RpZmljYXRpb25zJyA/ICd2YXIoLS1wcmltYXJ5KScgOiAndmFyKC0tdGV4dC1tdXRlZCknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGFjdGl2ZVRhYiA9PT0gJ25vdGlmaWNhdGlvbnMnID8gNjAwIDogNDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzAuNXJlbScsIHRyYW5zaXRpb246ICcwLjJzJywgYm9yZGVyOiAnbm9uZScsIGN1cnNvcjogJ3BvaW50ZXInLCB0ZXh0QWxpZ246ICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJlbGwgc2l6ZT17MjB9IC8+IE5vdGlmaWNhdGlvbiBDZW50ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYigndmlkZW9zJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNzVyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxcmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlVGFiID09PSAndmlkZW9zJyA/ICdyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVUYWIgPT09ICd2aWRlb3MnID8gJ3ZhcigtLXByaW1hcnkpJyA6ICd2YXIoLS10ZXh0LW11dGVkKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogYWN0aXZlVGFiID09PSAndmlkZW9zJyA/IDYwMCA6IDQwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcwLjVyZW0nLCB0cmFuc2l0aW9uOiAnMC4ycycsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgdGV4dEFsaWduOiAnbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxWaWRlbyBzaXplPXsyMH0gLz4gVmlkZW8gTGlicmFyeVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCdzZXR0aW5ncycpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjc1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMXJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVRhYiA9PT0gJ3NldHRpbmdzJyA/ICdyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVUYWIgPT09ICdzZXR0aW5ncycgPyAndmFyKC0tcHJpbWFyeSknIDogJ3ZhcigtLXRleHQtbXV0ZWQpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmVUYWIgPT09ICdzZXR0aW5ncycgPyA2MDAgOiA0MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJzAuMnMnLCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicsIHRleHRBbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U2V0dGluZ3Mgc2l6ZT17MjB9IC8+IFNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ3N0dWRlbnRzJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNzVyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxcmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlVGFiID09PSAnc3R1ZGVudHMnID8gJ3JnYmEoMTM5LCA5MiwgMjQ2LCAwLjEpJyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ3N0dWRlbnRzJyA/ICd2YXIoLS1wcmltYXJ5KScgOiAndmFyKC0tdGV4dC1tdXRlZCknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IGFjdGl2ZVRhYiA9PT0gJ3N0dWRlbnRzJyA/IDYwMCA6IDQwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnMC4ycycsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgdGV4dEFsaWduOiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMC41cmVtJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVzZXJzIHNpemU9ezIwfSAvPiBTdHVkZW50IE1hbmFnZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYignY291cG9ucycpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjc1cmVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMXJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVRhYiA9PT0gJ2NvdXBvbnMnID8gJ3JnYmEoMTM5LCA5MiwgMjQ2LCAwLjEpJyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVRhYiA9PT0gJ2NvdXBvbnMnID8gJ3ZhcigtLXByaW1hcnkpJyA6ICd2YXIoLS10ZXh0LW11dGVkKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogYWN0aXZlVGFiID09PSAnY291cG9ucycgPyA2MDAgOiA0MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJzAuMnMnLCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicsIHRleHRBbGlnbjogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzAuNXJlbSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUaWNrZXQgc2l6ZT17MjB9IC8+IENvdXBvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYigndHJhbnNhY3Rpb25zJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNzVyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxcmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlVGFiID09PSAndHJhbnNhY3Rpb25zJyA/ICdyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKScgOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmVUYWIgPT09ICd0cmFuc2FjdGlvbnMnID8gJ3ZhcigtLXByaW1hcnkpJyA6ICd2YXIoLS10ZXh0LW11dGVkKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogYWN0aXZlVGFiID09PSAndHJhbnNhY3Rpb25zJyA/IDYwMCA6IDQwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnMC4ycycsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgdGV4dEFsaWduOiAnbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDcmVkaXRDYXJkIHNpemU9ezIwfSAvPiBUcmFuc2FjdGlvbnMgJiBSZWZ1bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7LyogQ29udGVudCBBcmVhICovfVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWluV2lkdGg6IDAgfX0+XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIENvdXJzZXMgVGFiICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7YWN0aXZlVGFiID09PSAnY291cnNlcycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzMDBweCwgMWZyKSknLCBnYXA6ICcycmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTGVmdDogQ291cnNlIExpc3QgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250U2l6ZTogJzEuMjVyZW0nLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5Zb3VyIENvdXJzZXM8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SXNFZGl0aW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudENvdXJzZSh7IHRpdGxlOiAnJywgZGVzY3JpcHRpb246ICcnLCBwcmljZTogJycsIG9yaWdpbmFsUHJpY2U6ICcnLCB0aHVtYm5haWw6ICcnLCB2aWRlb1VybDogJycsIGludHJvVmlkZW9zOiBbXSwgc2VjdGlvbnM6IFtdIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZFNlY3Rpb25zKHt9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHRvIGZvcm0gYW5kIGZvY3VzIGZpcnN0IGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdDb3Vyc2VGb3JtUmVmLmN1cnJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvdXJzZUZvcm1SZWYuY3VycmVudC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdzdGFydCcgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RJbnB1dCA9IG5ld0NvdXJzZUZvcm1SZWYuY3VycmVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdElucHV0KSBmaXJzdElucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnIzAwYjg5NCcsIGNvbG9yOiAnd2hpdGUnLCBib3JkZXI6ICdub25lJywgcGFkZGluZzogJzAuNXJlbSAxcmVtJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgY3Vyc29yOiAncG9pbnRlcicsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzVweCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGx1cyBzaXplPXsxNn0gLz4gTmV3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y291cnNlcy5tYXAoY291cnNlID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Y291cnNlLl9pZH0gc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzFyZW0nLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBib3hTaGFkb3c6ICcwIDJweCA1cHggcmdiYSgwLDAsMCwwLjEpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e2NvdXJzZS50aHVtYm5haWwgPyAoY291cnNlLnRodW1ibmFpbC5zdGFydHNXaXRoKCdodHRwOi8vbG9jYWxob3N0JykgPyBjb3Vyc2UudGh1bWJuYWlsLnJlcGxhY2UoJ2xvY2FsaG9zdCcsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkgOiBjb3Vyc2UudGh1bWJuYWlsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IGNvdXJzZS50aHVtYm5haWwgOiBgaHR0cDovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwJHtjb3Vyc2UudGh1bWJuYWlsfWApIDogJ2h0dHBzOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS8xNTAnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0PXtjb3Vyc2UudGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMjBweCcsIG9iamVjdEZpdDogJ2NvdmVyJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgbWFyZ2luQm90dG9tOiAnMC44cmVtJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcj17KGUpID0+IHsgZS50YXJnZXQuc3JjID0gJ2h0dHBzOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS8xNTA/dGV4dD1ObytJbWFnZSc7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBtYXJnaW46ICcwIDAgMC41cmVtIDAnLCBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2NvdXJzZS50aXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcwIDAgMC41cmVtIDAnLCBmb250U2l6ZTogJzAuOXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19Pntjb3Vyc2UuZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIDYwKX0uLi48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcwLjVyZW0nLCBtYXJnaW5Ub3A6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0SXNFZGl0aW5nKHRydWUpOyBzZXRDdXJyZW50Q291cnNlKGNvdXJzZSk7IHNldEV4cGFuZGVkU2VjdGlvbnMoe30pOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIGJhY2tncm91bmQ6ICcjZjFmMmY2JywgY29sb3I6ICcjMmQzNDM2JywgYm9yZGVyOiAnMXB4IHNvbGlkICNkZGQnLCBwYWRkaW5nOiAnMC40cmVtJywgYm9yZGVyUmFkaXVzOiAnNHB4JywgY3Vyc29yOiAncG9pbnRlcicsIGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBnYXA6ICc1cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEVkaXQgc2l6ZT17MTR9IC8+IEVkaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZURlbGV0ZShjb3Vyc2UuX2lkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBiYWNrZ3JvdW5kOiAnI2ZmZjBmMCcsIGNvbG9yOiAnI2Q2MzAzMScsIGJvcmRlcjogJzFweCBzb2xpZCAjZmZjY2NjJywgcGFkZGluZzogJzAuNHJlbScsIGJvcmRlclJhZGl1czogJzRweCcsIGN1cnNvcjogJ3BvaW50ZXInLCBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZ2FwOiAnNXB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaCBzaXplPXsxNH0gLz4gRGVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSaWdodDogQ291cnNlIEZvcm0gJiBDdXJyaWN1bHVtICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXtuZXdDb3Vyc2VGb3JtUmVmfSBzdHlsZT17eyBiYWNrZ3JvdW5kOiAndmFyKC0tc3VyZmFjZSknLCBwYWRkaW5nOiAnMnJlbScsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4wNSknLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tYm9yZGVyKScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250U2l6ZTogJzEuNXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgbWFyZ2luQm90dG9tOiAnMS41cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0KScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNFZGl0aW5nID8gJ0VkaXQgQ291cnNlJyA6ICdDcmVhdGUgTmV3IENvdXJzZSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaDI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxLjI1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBCYXNpYyBEZXRhaWxzICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5Db3Vyc2UgVGl0bGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VycmVudENvdXJzZS50aXRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Q3VycmVudENvdXJzZSh7IC4uLmN1cnJlbnRDb3Vyc2UsIHRpdGxlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBjb3Vyc2UgdGl0bGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19PkRlc2NyaXB0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRDb3Vyc2UuZGVzY3JpcHRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEN1cnJlbnRDb3Vyc2UoeyAuLi5jdXJyZW50Q291cnNlLCBkZXNjcmlwdGlvbjogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgY291cnNlIGRlc2NyaXB0aW9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cz17M31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICdpbmhlcml0JywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJzFmciAxZnInLCBnYXA6ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5QcmljZSAo4oK5KTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VycmVudENvdXJzZS5wcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEN1cnJlbnRDb3Vyc2UoeyAuLi5jdXJyZW50Q291cnNlLCBwcmljZTogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICc2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFdlaWdodDogJzUwMCcgfX0+T3JpZ2luYWwgUHJpY2UgKOKCuSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRDb3Vyc2Uub3JpZ2luYWxQcmljZSB8fCAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEN1cnJlbnRDb3Vyc2UoeyAuLi5jdXJyZW50Q291cnNlLCBvcmlnaW5hbFByaWNlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5UaHVtYm5haWwgVVJMPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTBweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRDb3Vyc2UudGh1bWJuYWlsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Q3VycmVudENvdXJzZSh7IC4uLmN1cnJlbnRDb3Vyc2UsIHRodW1ibmFpbDogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImh0dHBzOi8vLi4uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwidGh1bWJuYWlsLXVwbG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZFRodW1ibmFpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGh1bWJuYWlsLXVwbG9hZCcpLmNsaWNrKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwIDFyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1zdXJmYWNlLWhvdmVyKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzAuNXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS10ZXh0KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBUaHVtYm5haWwgUHJldmlldyAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjdXJyZW50Q291cnNlLnRodW1ibmFpbCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICctMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtjdXJyZW50Q291cnNlLnRodW1ibmFpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD1cIlRodW1ibmFpbCBwcmV2aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIG1heEhlaWdodDogJzE4MHB4Jywgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tYm9yZGVyKScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I9e2UgPT4geyBlLnRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Mb2FkPXtlID0+IHsgZS50YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBJbnRybyBWaWRlb3Mg4oCTIG11bHRpLXNlY3Rpb24gYnVpbGRlciAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5JbnRybyBWaWRlb3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50cm9WaWRlb3M6IFsuLi4ocHJldi5pbnRyb1ZpZGVvcyB8fCBbXSksIHsgdGl0bGU6ICdJbnRybycsIHVybDogJycgfV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS1wcmltYXJ5KScsIGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGN1cnNvcjogJ3BvaW50ZXInLCBmb250V2VpZ2h0OiAnNjAwJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIEFkZCBWaWRlb1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KCFjdXJyZW50Q291cnNlLmludHJvVmlkZW9zIHx8IGN1cnJlbnRDb3Vyc2UuaW50cm9WaWRlb3MubGVuZ3RoID09PSAwKSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsIG1hcmdpbjogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIGludHJvIHZpZGVvcy4gQ2xpY2sgXCIrIEFkZCBWaWRlb1wiIHRvIGFkZCBZb3VUdWJlLCBtM3U4LCBCdW5ueSwgb3IgRHJpdmUgbGlua3MuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsoY3VycmVudENvdXJzZS5pbnRyb1ZpZGVvcyB8fCBbXSkubWFwKCh2aWQsIHZJZHgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3ZJZHh9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC41cmVtJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dmlkLnRpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IFsuLi4ocHJldi5pbnRyb1ZpZGVvcyB8fCBbXSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbdklkeF0gPSB7IC4uLmFyclt2SWR4XSwgdGl0bGU6IGUudGFyZ2V0LnZhbHVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLnByZXYsIGludHJvVmlkZW9zOiBhcnIgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxhYmVsIChlLmcuIFRyYWlsZXIpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAnMCAwIDEyMHB4JywgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFNpemU6ICcwLjg1cmVtJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2aWQudXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IFsuLi4ocHJldi5pbnRyb1ZpZGVvcyB8fCBbXSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbdklkeF0gPSB7IC4uLmFyclt2SWR4XSwgdXJsOiBlLnRhcmdldC52YWx1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBpbnRyb1ZpZGVvczogYXJyIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJZb3VUdWJlIC8gbTN1OCAvIEJ1bm55IC8gRHJpdmUgVVJMXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAxLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBmb250U2l6ZTogJzAuODVyZW0nIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRDb3Vyc2UocHJldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IFsuLi4ocHJldi5pbnRyb1ZpZGVvcyB8fCBbXSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKHZJZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCBpbnRyb1ZpZGVvczogYXJyIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6ICcjZDYzMDMxJywgYmFja2dyb3VuZDogJ3JnYmEoMjE0LDQ4LDQ5LDAuMSknLCBib3JkZXI6ICdub25lJywgYm9yZGVyUmFkaXVzOiAnNHB4JywgcGFkZGluZzogJzAuNHJlbSAwLjZyZW0nLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaCBzaXplPXsxNH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociBzdHlsZT17eyBtYXJnaW46ICcxcmVtIDAnLCBib3JkZXI6ICdub25lJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNlZWUnIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIEN1cnJpY3VsdW0gQnVpbGRlciAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4ycmVtJywgZm9udFdlaWdodDogJzYwMCcsIG1hcmdpbkJvdHRvbTogJzFyZW0nIH19PkN1cnJpY3VsdW0gQnVpbGRlcjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y3VycmVudENvdXJzZS5zZWN0aW9ucz8ubWFwKChzZWN0aW9uLCBzSW5kZXgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtzSW5kZXh9IHN0eWxlPXt7IGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYm9yZGVyUmFkaXVzOiAnOHB4Jywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wMyknLCBwYWRkaW5nOiAnMXJlbScsIGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nLCBmbGV4OiAxIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19PlNlY3Rpb24ge3NJbmRleCArIDF9Ojwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlY3Rpb24udGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlU2VjdGlvblRpdGxlKHNJbmRleCwgZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgYm9yZGVyUmFkaXVzOiAnNHB4JywgcGFkZGluZzogJzAuNXJlbScgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWN0aW9uIFRpdGxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzFyZW0nLCBwYWRkaW5nTGVmdDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCB3aWR0aDogJzcwcHgnIH19Pkdyb3VwIFRhZzo8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWN0aW9uLmdyb3VwIHx8ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVNlY3Rpb25Hcm91cChzSW5kZXgsIGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIGJvcmRlclJhZGl1czogJzRweCcsIHBhZGRpbmc6ICcwLjRyZW0nLCBmb250U2l6ZTogJzAuODVyZW0nLCBiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwwLjIpJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4sIEpBVkEgREFUQSBTVFJVQ1RVUkVTICYgQUxHT1JJVEhNUyAoT3B0aW9uYWwpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzAuNXJlbScsIG1hcmdpbkxlZnQ6ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVNlY3Rpb24oc0luZGV4KX0gc3R5bGU9e3sgYm9yZGVyOiAnbm9uZScsIGJhY2tncm91bmQ6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkU2VjdGlvbnNbc0luZGV4XSA/IDxDaGV2cm9uVXAgc2l6ZT17MTh9IC8+IDogPENoZXZyb25Eb3duIHNpemU9ezE4fSAvPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcmVtb3ZlU2VjdGlvbihzSW5kZXgpfSBzdHlsZT17eyBib3JkZXI6ICdub25lJywgYmFja2dyb3VuZDogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgY29sb3I6ICcjZDYzMDMxJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJhc2ggc2l6ZT17MTh9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZFNlY3Rpb25zW3NJbmRleF0gJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICcxcmVtJywgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlY3Rpb24ubGVjdHVyZXMubWFwKChsZWN0dXJlLCBsSW5kZXgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2xJbmRleH0gc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nLCBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjAyKScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4V3JhcDogJ3dyYXAnLCBnYXA6ICcxcmVtJywgbWFyZ2luQm90dG9tOiAnMC41cmVtJywgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6ICcxIDEgMjAwcHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCBtYXJnaW5Cb3R0b206ICcwLjJyZW0nLCBkaXNwbGF5OiAnYmxvY2snIH19PkxlY3R1cmUgVGl0bGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtsZWN0dXJlLnRpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVMZWN0dXJlKHNJbmRleCwgbEluZGV4LCAndGl0bGUnLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGJvcmRlclJhZGl1czogJzRweCcsIHBhZGRpbmc6ICcwLjVyZW0nIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAnMiAxIDI1MHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJywgbWFyZ2luQm90dG9tOiAnMC4ycmVtJywgZGlzcGxheTogJ2Jsb2NrJyB9fT5WaWRlbyBVUkw8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtsZWN0dXJlLnZpZGVvVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVMZWN0dXJlKHNJbmRleCwgbEluZGV4LCAndmlkZW9VcmwnLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVjdHVyZS52aWRlb1VybCAmJiAhbGVjdHVyZS5kdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaExlY3R1cmVEZXRhaWxzKHNJbmRleCwgbEluZGV4LCBsZWN0dXJlLnZpZGVvVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBwYWRkaW5nOiAnMC41cmVtJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogJzAgMCAxNjBweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250U2l6ZTogJzAuOHJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScsIG1hcmdpbkJvdHRvbTogJzAuMnJlbScsIGRpc3BsYXk6ICdibG9jaycgfX0+RHVyYXRpb248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnNXB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtsZWN0dXJlLmR1cmF0aW9uIHx8ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlTGVjdHVyZShzSW5kZXgsIGxJbmRleCwgJ2R1cmF0aW9uJywgZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMTA6MDVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGJvcmRlclJhZGl1czogJzRweCcsIHBhZGRpbmc6ICcwLjVyZW0nIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZldGNoTGVjdHVyZURldGFpbHMoc0luZGV4LCBsSW5kZXgsIGxlY3R1cmUudmlkZW9VcmwpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQXV0by1mZXRjaCBkdXJhdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLXByaW1hcnkpJywgY29sb3I6ICd3aGl0ZScsIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC41cmVtJywgY3Vyc29yOiAncG9pbnRlcicsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRpbWVyIHNpemU9ezE2fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEZW1vIHRvZ2dsZSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6ICcwIDAgYXV0bycsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjI1cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRTaXplOiAnMC43NXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgY29sb3I6IGxlY3R1cmUuZnJlZVByZXZpZXcgPyAnIzAwYjg5NCcgOiAndmFyKC0tdGV4dC1tdXRlZCknLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT5EZW1vPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17ISFsZWN0dXJlLmZyZWVQcmV2aWV3fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gdXBkYXRlTGVjdHVyZShzSW5kZXgsIGxJbmRleCwgJ2ZyZWVQcmV2aWV3JywgZS50YXJnZXQuY2hlY2tlZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIk1hcmsgYXMgZGVtbyDigJMgdmlzaWJsZSB0byBub24tZW5yb2xsZWQgdXNlcnNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxOHB4JywgaGVpZ2h0OiAnMThweCcsIGFjY2VudENvbG9yOiAnIzAwYjg5NCcsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcmVtb3ZlTGVjdHVyZShzSW5kZXgsIGxJbmRleCl9IHN0eWxlPXt7IGZsZXg6ICcwIDAgYXV0bycsIGNvbG9yOiAnI2Q2MzAzMScsIGJvcmRlcjogJ25vbmUnLCBiYWNrZ3JvdW5kOiAncmdiYSgyMTQsIDQ4LCA0OSwgMC4xKScsIGN1cnNvcjogJ3BvaW50ZXInLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIHBhZGRpbmc6ICcwLjZyZW0nLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBoZWlnaHQ6ICdmaXQtY29udGVudCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaCBzaXplPXsxNn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBOb3RlcyBTZWN0aW9uIHdpdGhpbiBMZWN0dXJlIChTaW1wbGlmaWVkKSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAnMC41cmVtJywgcGFkZGluZ0xlZnQ6ICcxcmVtJywgYm9yZGVyTGVmdDogJzJweCBzb2xpZCAjZGRkJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIG1hcmdpbkJvdHRvbTogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+Tm90ZXMvUmVzb3VyY2VzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBhZGROb3RlKHNJbmRleCwgbEluZGV4KX0gc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBjb2xvcjogJyMwOTg0ZTMnLCBiYWNrZ3JvdW5kOiAnbm9uZScsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udFdlaWdodDogJzYwMCcgfX0+KyBBZGQgTm90ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsZWN0dXJlLm5vdGVzPy5tYXAoKG5vdGUsIG5JbmRleCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17bkluZGV4fSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNXJlbScsIG1hcmdpbkJvdHRvbTogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bm90ZS50aXRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZU5vdGUoc0luZGV4LCBsSW5kZXgsIG5JbmRleCwgJ3RpdGxlJywgZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTm90ZSBUaXRsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZmxleDogMSwgYm9yZGVyUmFkaXVzOiAnNHB4JywgZm9udFNpemU6ICcwLjlyZW0nLCBwYWRkaW5nOiAnMC40cmVtJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtub3RlLnVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZU5vdGUoc0luZGV4LCBsSW5kZXgsIG5JbmRleCwgJ3VybCcsIGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlVSTCAoUERGL0xpbmspXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4OiAyLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBmb250U2l6ZTogJzAuOXJlbScsIHBhZGRpbmc6ICcwLjRyZW0nIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcmVtb3ZlTm90ZShzSW5kZXgsIGxJbmRleCwgbkluZGV4KX0gc3R5bGU9e3sgY29sb3I6ICcjZDYzMDMxJywgYm9yZGVyOiAnbm9uZScsIGJhY2tncm91bmQ6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRyYXNoIHNpemU9ezE0fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IGFkZExlY3R1cmUoc0luZGV4KX0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzAuNXJlbScsIGJvcmRlcjogJzFweCBkYXNoZWQgdmFyKC0tYm9yZGVyKScsIGJvcmRlclJhZGl1czogJzZweCcsIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScsIGN1cnNvcjogJ3BvaW50ZXInLCBmb250V2VpZ2h0OiAnNTAwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBBZGQgTGVjdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e2FkZFNlY3Rpb259IHN0eWxlPXt7IHBhZGRpbmc6ICcwLjc1cmVtJywgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UtaG92ZXIpJywgY29sb3I6ICd2YXIoLS10ZXh0KScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgY3Vyc29yOiAncG9pbnRlcicsIGZvbnRXZWlnaHQ6ICdib2xkJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgQWRkIFNlY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcycmVtJywgcGFkZGluZzogJzFyZW0nLCBiYWNrZ3JvdW5kOiAnIzZjNWNlNycsIGNvbG9yOiAnd2hpdGUnLCBib3JkZXI6ICdub25lJywgYm9yZGVyUmFkaXVzOiAnOHB4JywgZm9udFNpemU6ICcxcmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNFZGl0aW5nID8gJ1VwZGF0ZSBDb3Vyc2UnIDogJ0NyZWF0ZSBDb3Vyc2UnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIE5vdGlmaWNhdGlvbnMgVGFiICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7YWN0aXZlVGFiID09PSAnbm90aWZpY2F0aW9ucycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzMDBweCwgMWZyKSknLCBnYXA6ICcycmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICd2YXIoLS1zdXJmYWNlKScsIHBhZGRpbmc6ICcycmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4yNXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgbWFyZ2luQm90dG9tOiAnMS41cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0KScgfX0+U2VuZCBOb3RpZmljYXRpb248L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU2VuZE5vdGlmaWNhdGlvbn0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMS4yNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19PlRpdGxlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e25ld05vdGlmaWNhdGlvbi50aXRsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXROZXdOb3RpZmljYXRpb24oeyAuLi5uZXdOb3RpZmljYXRpb24sIHRpdGxlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogJzZweCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19Pk1lc3NhZ2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bmV3Tm90aWZpY2F0aW9uLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmV3Tm90aWZpY2F0aW9uKHsgLi4ubmV3Tm90aWZpY2F0aW9uLCBtZXNzYWdlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cz17M31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6ICdpbmhlcml0JywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFdlaWdodDogJzUwMCcgfX0+VHlwZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bmV3Tm90aWZpY2F0aW9uLnR5cGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmV3Tm90aWZpY2F0aW9uKHsgLi4ubmV3Tm90aWZpY2F0aW9uLCB0eXBlOiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogJzZweCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJpbmZvXCI+SW5mbzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2FybmluZ1wiPldhcm5pbmc8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInN1Y2Nlc3NcIj5TdWNjZXNzPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvZmZlclwiPk9mZmVyPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTXVsdGktU2VsZWN0IENvdXJzZXMgZm9yIE9mZmVyIFR5cGUgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bmV3Tm90aWZpY2F0aW9uLnR5cGUgPT09ICdvZmZlcicgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19PlNlbGVjdCBDb3Vyc2VzIChNdWx0aXBsZSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tYm9yZGVyKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiAnMjAwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3dZOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjAyKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMC41cmVtJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vyc2VzLm1hcChjb3Vyc2UgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjb3Vyc2UuX2lkfSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjVyZW0nLCBwYWRkaW5nOiAnMC41cmVtJywgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4wNSknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17YGNvdXJzZS0ke2NvdXJzZS5faWR9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e25ld05vdGlmaWNhdGlvbi5yZWxhdGVkQ291cnNlcy5pbmNsdWRlcyhjb3Vyc2UuX2lkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBlLnRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldE5ld05vdGlmaWNhdGlvbihwcmV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHByZXYucmVsYXRlZENvdXJzZXMgfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCByZWxhdGVkQ291cnNlczogWy4uLmN1cnJlbnQsIGNvdXJzZS5faWRdIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5wcmV2LCByZWxhdGVkQ291cnNlczogY3VycmVudC5maWx0ZXIoaWQgPT4gaWQgIT09IGNvdXJzZS5faWQpIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e2NvdXJzZS50aHVtYm5haWwgPyAoY291cnNlLnRodW1ibmFpbC5zdGFydHNXaXRoKCdodHRwOi8vbG9jYWxob3N0JykgPyBjb3Vyc2UudGh1bWJuYWlsLnJlcGxhY2UoJ2xvY2FsaG9zdCcsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkgOiBjb3Vyc2UudGh1bWJuYWlsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IGNvdXJzZS50aHVtYm5haWwgOiBgaHR0cDovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwJHtjb3Vyc2UudGh1bWJuYWlsfWApIDogJy9wbGFjZWhvbGRlci1jb3Vyc2UuanBnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD1cIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzQwcHgnLCBoZWlnaHQ6ICc0MHB4Jywgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXJSYWRpdXM6ICc0cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yPXsoZSkgPT4geyBlLnRhcmdldC5zcmMgPSAnL3BsYWNlaG9sZGVyLWNvdXJzZS5qcGcnOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj17YGNvdXJzZS0ke2NvdXJzZS5faWR9YH0gc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicsIGZvbnRTaXplOiAnMC45NXJlbScsIHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT57Y291cnNlLnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+4oK5e2NvdXJzZS5wcmljZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vyc2VzLmxlbmd0aCA9PT0gMCAmJiA8cCBzdHlsZT17eyBwYWRkaW5nOiAnMC41cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+Tm8gY291cnNlcyBhdmFpbGFibGUuPC9wPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+U2VsZWN0ZWQ6IHtuZXdOb3RpZmljYXRpb24ucmVsYXRlZENvdXJzZXM/Lmxlbmd0aCB8fCAwfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcxcmVtJywgcGFkZGluZzogJzAuOHJlbScsIGJhY2tncm91bmQ6ICcjNmM1Y2U3JywgY29sb3I6ICd3aGl0ZScsIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBmb250V2VpZ2h0OiAnYm9sZCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjI1cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW46IDAsIGNvbG9yOiAndmFyKC0tdGV4dCknIH19Pkhpc3Rvcnk8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge25vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVDbGVhckFsbE5vdGlmaWNhdGlvbnN9IHN0eWxlPXt7IGNvbG9yOiAnI2Q2MzAzMScsIGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGN1cnNvcjogJ3BvaW50ZXInLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xlYXIgQWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxcmVtJywgbWF4SGVpZ2h0OiAnNjAwcHgnLCBvdmVyZmxvd1k6ICdhdXRvJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtub3RpZmljYXRpb25zLmxlbmd0aCA9PT0gMCA/IDxwIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19Pk5vIG5vdGlmaWNhdGlvbnMuPC9wPiA6IG5vdGlmaWNhdGlvbnMubWFwKG5vdGlmID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17bm90aWYuX2lkfSBzdHlsZT17eyBwYWRkaW5nOiAnMXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wMiknLCBib3JkZXJMZWZ0OiBgNHB4IHNvbGlkICR7bm90aWYudHlwZSA9PT0gJ3dhcm5pbmcnID8gJyNmZjc2NzUnIDogbm90aWYudHlwZSA9PT0gJ29mZmVyJyA/ICcjZjU5ZTBiJyA6ICcjNzRiOWZmJ31gIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJywgZm9udFNpemU6ICcwLjlyZW0nIH19Pntub3RpZi50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGhhbmRsZURlbGV0ZU5vdGlmaWNhdGlvbihub3RpZi5faWQpfSBzdHlsZT17eyBjb2xvcjogJyNkNjMwMzEnLCBib3JkZXI6ICdub25lJywgYmFja2dyb3VuZDogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT48VHJhc2ggc2l6ZT17MTR9IC8+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46IDAsIGZvbnRTaXplOiAnMC45cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+e25vdGlmLm1lc3NhZ2V9PC9wPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFNob3cgUmVsYXRlZCBDb3Vyc2VzIGZvciBPZmZlciAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge25vdGlmLnR5cGUgPT09ICdvZmZlcicgJiYgbm90aWYucmVsYXRlZENvdXJzZXMgJiYgbm90aWYucmVsYXRlZENvdXJzZXMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzAuOHJlbScsIGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC41cmVtJywgZmxleFdyYXA6ICd3cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bm90aWYucmVsYXRlZENvdXJzZXMubWFwKChjb3Vyc2UsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcwLjVyZW0nLCBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjA1KScsIHBhZGRpbmc6ICcwLjI1cmVtIDAuNXJlbScsIGJvcmRlclJhZGl1czogJzRweCcsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vyc2UudGh1bWJuYWlsICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17Y291cnNlLnRodW1ibmFpbC5zdGFydHNXaXRoKCdodHRwOi8vbG9jYWxob3N0JykgPyBjb3Vyc2UudGh1bWJuYWlsLnJlcGxhY2UoJ2xvY2FsaG9zdCcsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkgOiBjb3Vyc2UudGh1bWJuYWlsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IGNvdXJzZS50aHVtYm5haWwgOiBgaHR0cDovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfTo1MDAwJHtjb3Vyc2UudGh1bWJuYWlsfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD1cIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMjRweCcsIGhlaWdodDogJzI0cHgnLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBvYmplY3RGaXQ6ICdjb3ZlcicgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcj17KGUpID0+IHsgZS50YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJyB9fT57Y291cnNlLnRpdGxlIHx8ICdVbmtub3duIENvdXJzZSd9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcwLjVyZW0nLCBmb250U2l6ZTogJzAuNzVyZW0nLCBjb2xvcjogJyM5OTknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKG5vdGlmLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9IOKAoiB7bm90aWYudHlwZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBWaWRlbyBMaWJyYXJ5IFRhYiAoQnVubnkubmV0KSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ3ZpZGVvcycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9maWxlLWxheW91dFwiIHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJzFmciAyZnInLCBnYXA6ICcycmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogQ29uZmlndXJhdGlvbiBQYW5lbCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICd2YXIoLS1zdXJmYWNlKScsIHBhZGRpbmc6ICcycmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYWxpZ25TZWxmOiAnc3RhcnQnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjI1cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQpJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxWaWRlbyBzaXplPXsyMH0gLz4gQnVubnkubmV0IENvbmZpZ3VyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2ZldGNoQnVubnlWaWRlb3N9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEuMjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5BUEkgS2V5IChBY2Nlc3MgS2V5KTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtidW5ueUNvbmZpZy5hcGlLZXl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0QnVubnlDb25maWcoeyAuLi5idW5ueUNvbmZpZywgYXBpS2V5OiBlLnRhcmdldC52YWx1ZSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBBUEkgS2V5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogJzZweCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19PkxpYnJhcnkgSUQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17YnVubnlDb25maWcubGlicmFyeUlkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEJ1bm55Q29uZmlnKHsgLi4uYnVubnlDb25maWcsIGxpYnJhcnlJZDogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgTGlicmFyeSBJRFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICc2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5Db2xsZWN0aW9uIElEIChPcHRpb25hbCk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17YnVubnlDb25maWcuY29sbGVjdGlvbklkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEJ1bm55Q29uZmlnKHsgLi4uYnVubnlDb25maWcsIGNvbGxlY3Rpb25JZDogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgQ29sbGVjdGlvbiBJRFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICc2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nQnVubnl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMXJlbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwLjhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZkNzlhOCcsIC8vIEJ1bm55IGNvbG9yLWlzaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBsb2FkaW5nQnVubnkgPyAnd2FpdCcgOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGxvYWRpbmdCdW5ueSA/IDAuNyA6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nQnVubnkgPyAnRmV0Y2hpbmcuLi4nIDogJ0ZldGNoIFZpZGVvcyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVzdWx0cyBHcmlkICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjI1cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZpZGVvIExpYnJhcnkgKHtidW5ueVZpZGVvcy5sZW5ndGh9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2J1bm55VmlkZW9zLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgcGFkZGluZzogJzNyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VmlkZW8gc2l6ZT17NDh9IHN0eWxlPXt7IG9wYWNpdHk6IDAuMiwgbWFyZ2luQm90dG9tOiAnMXJlbScgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5ObyB2aWRlb3MgbG9hZGVkLiBFbnRlciBjcmVkZW50aWFscyB0byBmZXRjaCBjb250ZW50LjwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjAwcHgsIDFmcikpJywgZ2FwOiAnMS41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YnVubnlWaWRlb3MubWFwKCh2aWRlbykgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17dmlkZW8uZ3VpZH0gc3R5bGU9e3sgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wMiknLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBvdmVyZmxvdzogJ2hpZGRlbicsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHBhZGRpbmdUb3A6ICc1Ni4yNSUnLCBiYWNrZ3JvdW5kOiAnIzAwMCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3ZpZGVvLnRodW1ibmFpbFVybCB8fCBgaHR0cHM6Ly8ke2J1bm55Q29uZmlnLmxpYnJhcnlJZH0uYi1jZG4ubmV0LyR7dmlkZW8uZ3VpZH0vJHt2aWRlby50aHVtYm5haWxGaWxlTmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3ZpZGVvLnRpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgb2JqZWN0Rml0OiAnY292ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I9eyhlKSA9PiBlLnRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzAuOHJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjVyZW0gMCcsIGZvbnRTaXplOiAnMC45cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0KScsIHdoaXRlU3BhY2U6ICdub3dyYXAnLCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyB9fSB0aXRsZT17dmlkZW8udGl0bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dmlkZW8udGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC43NXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdER1cmF0aW9uKHZpZGVvLmxlbmd0aCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGBodHRwczovL3BsYXllci5tZWRpYWRlbGl2ZXJ5Lm5ldC9lbWJlZC8ke2J1bm55Q29uZmlnLmxpYnJhcnlJZH0vJHt2aWRlby5ndWlkfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3MoJ0VtYmVkIFVSTCBDb3BpZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6ICcwLjc1cmVtJywgcGFkZGluZzogJzJweCA2cHgnLCBiYWNrZ3JvdW5kOiAndmFyKC0tcHJpbWFyeSknLCBjb2xvcjogJ3doaXRlJywgYm9yZGVyOiAnbm9uZScsIGJvcmRlclJhZGl1czogJzRweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvcHkgVVJMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTZXR0aW5ncyBUYWIgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdzZXR0aW5ncycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjVyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dCknLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIYW1tZXIgc2l6ZT17MjR9IC8+IFNpdGUgU2V0dGluZ3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgcGFkZGluZzogJzEuNXJlbScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZDogJ3JnYmEoMjU1LDI1NSwyNTUsMC4wMiknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgZm9udFNpemU6ICcxLjFyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIG1hcmdpbkJvdHRvbTogJzAuNXJlbScgfX0+TWFpbnRlbmFuY2UgTW9kZTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScsIGZvbnRTaXplOiAnMC45cmVtJywgbWFyZ2luOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbmFibGUgdG8gc2hvdyBhIG1haW50ZW5hbmNlIHBvcHVwIHRvIGFsbCBub24tYWRtaW4gdXNlcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB3aWR0aDogJzYwcHgnLCBoZWlnaHQ6ICczNHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17bWFpbnRlbmFuY2VNb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dG9nZ2xlTWFpbnRlbmFuY2VNb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAncG9pbnRlcicsIHRvcDogMCwgbGVmdDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBtYWludGVuYW5jZU1vZGUgPyAnIzIyYzU1ZScgOiAnI2NjYycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICcuNHMnLCBib3JkZXJSYWRpdXM6ICczNHB4J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgY29udGVudDogJ1wiXCInLCBoZWlnaHQ6ICcyNnB4Jywgd2lkdGg6ICcyNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJzRweCcsIGJvdHRvbTogJzRweCcsIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJy40cycsIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogbWFpbnRlbmFuY2VNb2RlID8gJ3RyYW5zbGF0ZVgoMjZweCknIDogJ3RyYW5zbGF0ZVgoMCknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogR2xvYmFsIEFubm91bmNlbWVudCBQYW5lbCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcycmVtJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMXJlbScsIHBhZGRpbmc6ICcxLjVyZW0nLCBib3JkZXI6ICcxcHggc29saWQgdmFyKC0tYm9yZGVyKScsIGJvcmRlclJhZGl1czogJzhweCcsIGJhY2tncm91bmQ6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4xcmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW5Cb3R0b206ICcwLjVyZW0nIH19Pkdsb2JhbCBBbm5vdW5jZW1lbnQgQmFyPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJywgZm9udFNpemU6ICcwLjlyZW0nLCBtYXJnaW46IDAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNldCBhIG1lc3NhZ2UgdG8gZGlzcGxheSBhdCB0aGUgdmVyeSB0b3Agb2YgdGhlIGFwcC4gTGVhdmUgZW1wdHkgdG8gaGlkZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2dsb2JhbEFubm91bmNlbWVudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRHbG9iYWxBbm5vdW5jZW1lbnQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gRmxhc2ggU2FsZTogNTAlIE9mZiBUb3AgQ291cnNlcyBUb2RheSBPbmx5IVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3M9ezJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiAnaW5oZXJpdCcsIGJvcmRlclJhZGl1czogJzZweCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlVXBkYXRlQW5ub3VuY2VtZW50fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhbGlnblNlbGY6ICdmbGV4LXN0YXJ0JywgcGFkZGluZzogJzAuNnJlbSAxLjJyZW0nLCBiYWNrZ3JvdW5kOiAnIzZjNWNlNycsIGNvbG9yOiAnd2hpdGUnLCBib3JkZXI6ICdub25lJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFdlaWdodDogJzUwMCcsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVcGRhdGUgQW5ub3VuY2VtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTdHVkZW50cyBUYWIgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdzdHVkZW50cycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzMDBweCwgMWZyKSknLCBnYXA6ICcycmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTGVmdDogTWFudWFsIEVucm9sbG1lbnQgRm9ybSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICd2YXIoLS1zdXJmYWNlKScsIHBhZGRpbmc6ICcycmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJywgYWxpZ25TZWxmOiAnc3RhcnQnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjI1cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQpJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVc2VycyBzaXplPXsyMH0gLz4gTWFudWFsIEVucm9sbG1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZU1hbnVhbEVucm9sbH0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMS4yNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICc1MDAnIH19PlN0dWRlbnQgRW1haWw8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bWFudWFsRW5yb2xsRW1haWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TWFudWFsRW5yb2xsRW1haWwoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInVzZXJAZXhhbXBsZS5jb21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFdlaWdodDogJzUwMCcgfX0+VGFyZ2V0IENvdXJzZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bWFudWFsRW5yb2xsQ291cnNlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE1hbnVhbEVucm9sbENvdXJzZShlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICc2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCIgZGlzYWJsZWQ+U2VsZWN0IGEgY291cnNlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vyc2VzLm1hcChjID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtjLl9pZH0gdmFsdWU9e2MuX2lkfT57Yy50aXRsZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcxcmVtJywgcGFkZGluZzogJzAuOHJlbScsIGJhY2tncm91bmQ6ICcjNmM1Y2U3JywgY29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBmb250V2VpZ2h0OiAnYm9sZCcsIGN1cnNvcjogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbnJvbGwgU3R1ZGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJpZ2h0OiBTdHVkZW50cyBMaXN0ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjI1cmVtJywgZm9udFdlaWdodDogJ2JvbGQnLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0dWRlbnQgRGlyZWN0b3J5ICh7dXNlcnMubGVuZ3RofSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxcmVtJywgbWF4SGVpZ2h0OiAnNjAwcHgnLCBvdmVyZmxvd1k6ICdhdXRvJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt1c2Vycy5sZW5ndGggPT09IDAgPyA8cCBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJyB9fT5ObyBzdHVkZW50cyBmb3VuZC48L3A+IDogdXNlcnMubWFwKHVzZXIgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXt1c2VyLl9pZH0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMXJlbScsIHBhZGRpbmc6ICcxcmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjAyKScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEZXNrdG9wL1RhYmxldCBsYXlvdXQgdmlhIGdyaWQgb3IgZmxleCB3cmFwICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleFdyYXA6ICd3cmFwJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgZ2FwOiAnMXJlbScsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogJzEgMSAyMDBweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjJyZW0gMCcsIGZvbnRTaXplOiAnMXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57dXNlci5uYW1lIHx8ICdObyBOYW1lIHByb3ZpZGVkJ308L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAgMCAwLjVyZW0gMCcsIGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCB3b3JkQnJlYWs6ICdicmVhay1hbGwnIH19Pnt1c2VyLmVtYWlsfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMC41cmVtJywgZmxleFdyYXA6ICd3cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3VzZXIuZW5yb2xsZWRDb3Vyc2VzPy5tYXAoYyA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e2MuX2lkfSBzdHlsZT17eyBmb250U2l6ZTogJzAuNzVyZW0nLCBwYWRkaW5nOiAnMnB4IDhweCcsIGJhY2tncm91bmQ6ICdyZ2JhKDEwOCwgOTIsIDIzMSwgMC4xKScsIGNvbG9yOiAnIzZjNWNlNycsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSgxMDgsIDkyLCAyMzEsIDAuMiknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjLnRpdGxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyghdXNlci5lbnJvbGxlZENvdXJzZXMgfHwgdXNlci5lbnJvbGxlZENvdXJzZXMubGVuZ3RoID09PSAwKSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzAuNzVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJyB9fT5GcmVlIFVzZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogJzAgMCBhdXRvJywgdGV4dEFsaWduOiAnbGVmdCcsIG1pbldpZHRoOiAnMTUwcHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCBkaXNwbGF5OiAnYmxvY2snIH19PkpvaW46IHtuZXcgRGF0ZSh1c2VyLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Ub3A6ICcwLjJyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMYXN0IExvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmFjdGl2ZVNlc3Npb25zICYmIHVzZXIuYWN0aXZlU2Vzc2lvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUoTWF0aC5tYXgoLi4udXNlci5hY3RpdmVTZXNzaW9ucy5tYXAoc2Vzc2lvbiA9PiBuZXcgRGF0ZShzZXNzaW9uLmxhc3RBY3RpdmUpLmdldFRpbWUoKSkpKS50b0xvY2FsZVN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnTmV2ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcwLjVyZW0nLCBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVGb3JjZUxvZ291dCh1c2VyLnVpZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkxvZyBvdXQgZnJvbSBhbGwgZGV2aWNlc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDIxNCwgNDgsIDQ5LCAwLjEpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNkNjMwMzEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDIxNCwgNDgsIDQ5LCAwLjIpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNHB4IDEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjhyZW0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc1MDAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGb3JjZSBMb2dvdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIENvdXBvbnMgVGFiICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7YWN0aXZlVGFiID09PSAnY291cG9ucycgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgzMDBweCwgMWZyKSknLCBnYXA6ICcycmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTGVmdDogQ3JlYXRlIENvdXBvbiBGb3JtICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknLCBhbGlnblNlbGY6ICdzdGFydCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250U2l6ZTogJzEuMjVyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dCknLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MjB9IC8+IENyZWF0ZSBOZXcgQ291cG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVDcmVhdGVDb3Vwb259IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEuMjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5Db3Vwb24gQ29kZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e25ld0NvdXBvbi5jb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE5ld0NvdXBvbih7IC4uLm5ld0NvdXBvbiwgY29kZTogZS50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKSB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIFNVTU1FUjUwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogJzZweCcsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5EaXNjb3VudCBQZXJjZW50YWdlICglKTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e25ld0NvdXBvbi5kaXNjb3VudFBlcmNlbnRhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmV3Q291cG9uKHsgLi4ubmV3Q291cG9uLCBkaXNjb3VudFBlcmNlbnRhZ2U6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gMjBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC41cmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZm9udFdlaWdodDogJzUwMCcgfX0+TWF4IFVzZXMgKE9wdGlvbmFsKTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e25ld0NvdXBvbi5tYXhVc2VzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE5ld0NvdXBvbih7IC4uLm5ld0NvdXBvbiwgbWF4VXNlczogZS50YXJnZXQudmFsdWUgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTGVhdmUgZW1wdHkgZm9yIHVubGltaXRlZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0taW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICc2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcwLjVyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBmb250V2VpZ2h0OiAnNTAwJyB9fT5FeHBpcmF0aW9uIERhdGUgKE9wdGlvbmFsKTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJkYXRldGltZS1sb2NhbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtuZXdDb3Vwb24udmFsaWRVbnRpbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXROZXdDb3Vwb24oeyAuLi5uZXdDb3Vwb24sIHZhbGlkVW50aWw6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcxcmVtJywgcGFkZGluZzogJzAuOHJlbScsIGJhY2tncm91bmQ6ICcjNmM1Y2U3JywgY29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBmb250V2VpZ2h0OiAnYm9sZCcsIGN1cnNvcjogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGUgQ291cG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUmlnaHQ6IENvdXBvbnMgTGlzdCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICd2YXIoLS1zdXJmYWNlKScsIHBhZGRpbmc6ICcycmVtJywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJveFNoYWRvdzogJzAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1ib3JkZXIpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4yNXJlbScsIGZvbnRXZWlnaHQ6ICdib2xkJywgbWFyZ2luQm90dG9tOiAnMS41cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0KScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3RpdmUgQ291cG9ucyAoe2NvdXBvbnMubGVuZ3RofSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxcmVtJywgbWF4SGVpZ2h0OiAnNjAwcHgnLCBvdmVyZmxvd1k6ICdhdXRvJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vwb25zLmxlbmd0aCA9PT0gMCA/IDxwIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19Pk5vIGNvdXBvbnMgZm91bmQuPC9wPiA6IGNvdXBvbnMubWFwKGNvdXBvbiA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2NvdXBvbi5faWR9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIHBhZGRpbmc6ICcxcmVtJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjAyKScsIG9wYWNpdHk6IGNvdXBvbi5pc0FjdGl2ZSA/IDEgOiAwLjYgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDAuMnJlbSAwJywgZm9udFNpemU6ICcxLjFyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIGxldHRlclNwYWNpbmc6ICcxcHgnIH19Pntjb3Vwb24uY29kZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNXJlbScsIG1hcmdpblRvcDogJzAuNXJlbScsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcwLjhyZW0nLCBwYWRkaW5nOiAnMnB4IDhweCcsIGJhY2tncm91bmQ6ICdyZ2JhKDM0LCAxOTcsIDk0LCAwLjEpJywgY29sb3I6ICcjMjJjNTVlJywgYm9yZGVyUmFkaXVzOiAnMTJweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vwb24uZGlzY291bnRQZXJjZW50YWdlfSUgT0ZGXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgcGFkZGluZzogJzJweCA4cHgnLCBiYWNrZ3JvdW5kOiAncmdiYSgxMDgsIDkyLCAyMzEsIDAuMSknLCBjb2xvcjogJyM2YzVjZTcnLCBib3JkZXJSYWRpdXM6ICcxMnB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXNlczoge2NvdXBvbi5jdXJyZW50VXNlc30ge2NvdXBvbi5tYXhVc2VzID8gYC8gJHtjb3Vwb24ubWF4VXNlc31gIDogJyhVbmxpbWl0ZWQpJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzAuNXJlbSAwIDAgMCcsIGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXhwaXJlczoge2NvdXBvbi52YWxpZFVudGlsID8gbmV3IERhdGUoY291cG9uLnZhbGlkVW50aWwpLnRvTG9jYWxlU3RyaW5nKCkgOiAnTmV2ZXInfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzAuNXJlbScgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlVG9nZ2xlQ291cG9uKGNvdXBvbi5faWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtjb3Vwb24uaXNBY3RpdmUgPyBcIkRlYWN0aXZhdGVcIiA6IFwiQWN0aXZhdGVcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb3Vwb24uaXNBY3RpdmUgPyAncmdiYSgyMzQsIDE3OSwgOCwgMC4xKScgOiAncmdiYSgzNCwgMTk3LCA5NCwgMC4xKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb3Vwb24uaXNBY3RpdmUgPyAnI2VhYjMwOCcgOiAnIzIyYzU1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb3Vwb24uaXNBY3RpdmUgPyAnRGlzYWJsZScgOiAnRW5hYmxlJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZURlbGV0ZUNvdXBvbihjb3Vwb24uX2lkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjM5LCA2OCwgNjgsIDAuMSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNlZjQ0NDQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaCBzaXplPXsxNn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFRyYW5zYWN0aW9ucyBUYWIgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHthY3RpdmVUYWIgPT09ICd0cmFuc2FjdGlvbnMnICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJ3ZhcigtLXN1cmZhY2UpJywgcGFkZGluZzogJzJyZW0nLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDUpJywgYm9yZGVyOiAnMXB4IHNvbGlkIHZhcigtLWJvcmRlciknIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyBmb250U2l6ZTogJzEuMjVyZW0nLCBmb250V2VpZ2h0OiAnYm9sZCcsIG1hcmdpbkJvdHRvbTogJzEuNXJlbScsIGNvbG9yOiAndmFyKC0tdGV4dCknLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q3JlZGl0Q2FyZCBzaXplPXsyMH0gLz4gVHJhbnNhY3Rpb24gSGlzdG9yeVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBvdmVyZmxvd1g6ICdhdXRvJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGJvcmRlckNvbGxhcHNlOiAnY29sbGFwc2UnLCB0ZXh0QWxpZ246ICdsZWZ0JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgc3R5bGU9e3sgYm9yZGVyQm90dG9tOiAnMnB4IHNvbGlkIHZhcigtLWJvcmRlciknLCBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt7IHBhZGRpbmc6ICcxcmVtJywgZm9udFdlaWdodDogNjAwIH19PkRhdGU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nLCBmb250V2VpZ2h0OiA2MDAgfX0+VXNlcjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyBwYWRkaW5nOiAnMXJlbScsIGZvbnRXZWlnaHQ6IDYwMCB9fT5Db3Vyc2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nLCBmb250V2VpZ2h0OiA2MDAgfX0+QW1vdW50ICjigrkpPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt7IHBhZGRpbmc6ICcxcmVtJywgZm9udFdlaWdodDogNjAwIH19PlR4biBJRDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyBwYWRkaW5nOiAnMXJlbScsIGZvbnRXZWlnaHQ6IDYwMCB9fT5TdGF0dXM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nLCBmb250V2VpZ2h0OiA2MDAgfX0+QWN0aW9uPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cGF5bWVudHMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj1cIjdcIiBzdHlsZT17eyBwYWRkaW5nOiAnMnJlbScsIHRleHRBbGlnbjogJ2NlbnRlcicsIGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknIH19Pk5vIHRyYW5zYWN0aW9ucyBmb3VuZC48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRzLm1hcChwYXltZW50ID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3BheW1lbnQuX2lkfSBzdHlsZT17eyBib3JkZXJCb3R0b206ICcxcHggc29saWQgdmFyKC0tYm9yZGVyKScsIHRyYW5zaXRpb246ICdiYWNrZ3JvdW5kIDAuMnMnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMXJlbScsIHdoaXRlU3BhY2U6ICdub3dyYXAnIH19PntuZXcgRGF0ZShwYXltZW50LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDUwMCB9fT57cGF5bWVudC51c2VyPy5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICd2YXIoLS10ZXh0LW11dGVkKScgfX0+e3BheW1lbnQudXNlcj8uZW1haWx9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nIH19PntwYXltZW50LmNvdXJzZUlkPy50aXRsZSB8fCAnVW5rbm93biBDb3Vyc2UnfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxcmVtJywgZm9udFdlaWdodDogNjAwIH19PntwYXltZW50LmFtb3VudH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMXJlbScsIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLCBmb250U2l6ZTogJzAuODVyZW0nLCBjb2xvcjogJ3ZhcigtLXRleHQtbXV0ZWQpJyB9fT57cGF5bWVudC5wYXltZW50SWR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgcGFkZGluZzogJzFyZW0nIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzRweCA4cHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgZm9udFNpemU6ICcwLjhyZW0nLCBmb250V2VpZ2h0OiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBwYXltZW50LnN0YXR1cyA9PT0gJ3N1Y2Nlc3NmdWwnID8gJ3JnYmEoMzQsIDE5NywgOTQsIDAuMSknIDogJ3JnYmEoMjM5LCA2OCwgNjgsIDAuMSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHBheW1lbnQuc3RhdHVzID09PSAnc3VjY2Vzc2Z1bCcgPyAnIzIyYzU1ZScgOiAnI2VmNDQ0NCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cGF5bWVudC5zdGF0dXMudG9VcHBlckNhc2UoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxcmVtJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BheW1lbnQuc3RhdHVzID09PSAnc3VjY2Vzc2Z1bCcgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlUmVmdW5kKHBheW1lbnQuX2lkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLCBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLCBjb2xvcjogJyNlZjQ0NDQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2VmNDQ0NCcsIGJvcmRlclJhZGl1czogJzZweCcsIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA1MDAsIGZvbnRTaXplOiAnMC44NXJlbScsIHRyYW5zaXRpb246ICcwLjJzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXNzdWUgUmVmdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1tdXRlZCknLCBmb250U2l6ZTogJzAuODVyZW0nIH19Pi08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBZG1pbkRhc2hib2FyZDtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy9ndWd1bC9PbmVEcml2ZS9EZXNrdG9wL1dlYiBEZXYgUHJvamVjdHMvQXVyYUVkL2NsaWVudC9zcmMvcGFnZXMvQWRtaW5EYXNoYm9hcmQuanN4In0=