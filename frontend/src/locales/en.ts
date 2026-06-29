export const en = {
  brand: {
    homeAria: "THYRO LABORATORIES home",
    subtitle: "Smart Booking & Management System",
  },
  nav: {
    home: "Home",
    about: "About",
    tests: "Tests",
    certifications: "Certifications",
    contact: "Contact",
    login: "Login",
    register: "Register",
    logout: "Logout",
    notifications: "Notifications",
    account: "Account",
    openNotifications: "Open notifications",
    openAccount: "Open account",
    toggleMenu: "Toggle menu",
  },
  common: {
    bookTest: "Book Test",
    callLaboratory: "Call Laboratory",
    whatsapp: "WhatsApp",
    cancel: "Cancel",
    notProvided: "Not Provided",
    notAvailable: "Not Available",
  },
  password: {
    show: "Show password",
    hide: "Hide password",
  },
  validation: {
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    passwordRequired: "Password is required.",
    passwordMin: "Password must be at least 6 characters.",
    confirmPassword: "Confirm your password.",
    confirmNewPassword: "Confirm your new password.",
    passwordsMatch: "Passwords do not match.",
    fullName: "Full name is required.",
    name: "Name is required.",
    phone10: "Enter a 10 digit phone number.",
    phoneRequired: "Phone number is required.",
    messageMin: "Message must be at least 10 characters.",
    preferredDate: "Preferred date is required.",
    preferredTimeSlot: "Preferred time slot is required.",
    currentPassword: "Current password is required.",
    nextPasswordMin: "New password must be at least 6 characters.",
  },
  errors: {
    request: "Unable to complete request.",
    passwordResetConfig:
      "Password reset is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    invalidResetLink:
      "Password reset link is invalid or has expired. Please request a new link.",
  },
  auth: {
    errors: {
      duplicateEmail: "An account with this email already exists.",
      noAccount: "No registered account was found for this email.",
      incorrectPassword: "The email or password is incorrect.",
      noRegisteredAccount: "No registered account was found.",
      currentPassword: "The current password is incorrect.",
      authProvider: "useAuth must be used within AuthProvider.",
    },
  },
  home: {
    hero: {
      imageAlt: "Modern automated diagnostic laboratory",
      eyebrow: "Fully Automated Diagnostic Laboratory",
      tagline: "Fast | Accurate | Trusted Reports in Just 2 Hours",
    },
    highlights: {
      registered: "Government Registered",
      homeSample: "Home Sample Collection",
      fastReports: "Fast Reports",
      reliable: "Reliable Diagnostics",
    },
    services: {
      eyebrow: "Services Overview",
      heading: "Complete laboratory testing for Miryalaguda patients.",
      pathology: {
        title: "Pathology Testing",
        text: "Routine and advanced diagnostic investigations for everyday care.",
      },
      hormone: {
        title: "Hormone Testing",
        text: "Thyroid and reproductive hormone tests with dependable reporting.",
      },
      preventive: {
        title: "Preventive Profiles",
        text: "Diabetes, liver, kidney, lipid, vitamin, and infection screening.",
      },
    },
    features: {
      eyebrow: "Features",
      heading: "Designed for fast booking and calm account management.",
      text: "Patients can keep browsing public pages after login and manage everything from one profile area.",
      automated: "Fully automated diagnostic laboratory",
      fast: "Reports in just 2 hours for eligible tests",
      booking: "Patient-friendly booking from tests page",
      account: "Single account area for bookings, reports, and notifications",
    },
    certification: {
      eyebrow: "Certification Highlights",
      heading: "Government Registered Diagnostic Centre",
      text: "Registered with District Registration Authority - Nalgonda.",
      button: "View Certifications",
    },
    contact: {
      eyebrow: "Contact CTA",
      heading: "Need help choosing a test?",
      text: "Call THYRO LABORATORIES for test booking, home sample collection, or laboratory visit details.",
      button: "Contact Laboratory",
    },
  },
  about: {
    eyebrow: "About",
    intro:
      "THYRO LABORATORIES is a fully automated diagnostic laboratory located opposite Abhaya Hospital, Doctors Colony, Miryalaguda.",
    owner: "Owner",
    location: {
      title: "Laboratory Location",
      address:
        "Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana - 508207",
    },
    services: {
      eyebrow: "Services",
      heading: "Diagnostic services focused on practical patient needs.",
      pathology: "Pathology Testing",
      hormone: "Hormone Testing",
      diabetes: "Diabetes Testing",
      vitamin: "Vitamin Testing",
      liver: "Liver Testing",
      kidney: "Kidney Testing",
      infectious: "Infectious Disease Testing",
    },
  },
  tests: {
    eyebrow: "Laboratory Tests",
    heading: "Search, filter, and book your laboratory test.",
    subheading:
      "Select a test first. The booking form opens only after you choose Book Test.",
    searchPlaceholder: "Search tests",
    allCategories: "All Categories",
    reportTime: "Report Time: ",
    emptyTitle: "No tests found",
    emptyText: "Try a different search or category filter.",
    sort: {
      default: "Default Order",
      lowHigh: "Price: Low to High",
      highLow: "Price: High to Low",
    },
    price: {
      contact: "Contact laboratory",
      inr: "INR {{price}}",
    },
    categories: {
      "Hormone Tests": "Hormone Tests",
      Diabetes: "Diabetes",
      "Blood Tests": "Blood Tests",
      "Vitamin Tests": "Vitamin Tests",
      "Liver Tests": "Liver Tests",
      "Kidney Tests": "Kidney Tests",
      "Heart & Risk Markers": "Heart & Risk Markers",
      "Infection Tests": "Infection Tests",
    },
    reportTimes: {
      "Same day": "Same day",
      "2 hours": "2 hours",
    },
    items: {
      T3: {
        name: "T3",
        description:
          "Thyroid hormone test used as part of thyroid health assessment.",
      },
      T4: {
        name: "T4",
        description: "Thyroid hormone test for evaluating thyroid function.",
      },
      TSH: {
        name: "TSH",
        description:
          "Thyroid stimulating hormone test for routine thyroid screening.",
      },
      "T3 T4 TSH Profile": {
        name: "T3 T4 TSH Profile",
        description: "Combined thyroid profile covering T3, T4, and TSH.",
      },
      FSH: {
        name: "FSH",
        description: "Hormone test used in reproductive health evaluation.",
      },
      LH: {
        name: "LH",
        description:
          "Hormone test used in reproductive and endocrine assessment.",
      },
      PRL: {
        name: "PRL",
        description: "Prolactin test used for hormone balance assessment.",
      },
      Testosterone: {
        name: "Testosterone",
        description: "Hormone test for testosterone level assessment.",
      },
      HBA1C: {
        name: "HBA1C",
        description:
          "Average blood sugar marker used for diabetes monitoring.",
      },
      "Fasting Blood Sugar": {
        name: "Fasting Blood Sugar",
        description: "Blood sugar test collected after fasting.",
      },
      "Post Lunch Blood Sugar": {
        name: "Post Lunch Blood Sugar",
        description: "Blood sugar test collected after food intake.",
      },
      CBP: {
        name: "CBP",
        description:
          "Complete blood picture for routine blood health screening.",
      },
      CBC: {
        name: "CBC",
        description: "Complete blood count for blood cell assessment.",
      },
      ESR: {
        name: "ESR",
        description: "Inflammation marker test used in routine investigations.",
      },
      "Platelet Count": {
        name: "Platelet Count",
        description:
          "Platelet level test used for blood clotting assessment.",
      },
      "Vitamin D": {
        name: "Vitamin D",
        description:
          "Vitamin D level assessment for deficiency screening.",
      },
      "Vitamin B12": {
        name: "Vitamin B12",
        description:
          "Vitamin B12 assessment for deficiency screening.",
      },
      "Liver Profile": {
        name: "Liver Profile",
        description: "Panel for routine liver function assessment.",
      },
      SGOT: {
        name: "SGOT",
        description: "Liver enzyme test used in liver health evaluation.",
      },
      SGPT: {
        name: "SGPT",
        description: "Liver enzyme test used in liver health evaluation.",
      },
      Bilirubin: {
        name: "Bilirubin",
        description:
          "Liver marker test used for jaundice and liver assessment.",
      },
      "Kidney Profile": {
        name: "Kidney Profile",
        description: "Panel for routine kidney function assessment.",
      },
      Creatinine: {
        name: "Creatinine",
        description:
          "Kidney function marker commonly used in renal screening.",
      },
      "Blood Urea": {
        name: "Blood Urea",
        description: "Kidney function marker used in renal assessment.",
      },
      "Uric Acid": {
        name: "Uric Acid",
        description:
          "Uric acid level assessment for metabolic health monitoring.",
      },
      "Lipid Profile": {
        name: "Lipid Profile",
        description:
          "Cholesterol and lipid panel for heart risk assessment.",
      },
      hsCRP: {
        name: "hsCRP",
        description: "Inflammation marker used for risk evaluation.",
      },
      HIV: {
        name: "HIV",
        description: "Infectious disease screening test.",
      },
      HBsAg: {
        name: "HBsAg",
        description: "Hepatitis B screening test.",
      },
      HCV: {
        name: "HCV",
        description: "Hepatitis C screening test.",
      },
      Dengue: {
        name: "Dengue",
        description:
          "Dengue investigation for fever and infection assessment.",
      },
      VDRL: {
        name: "VDRL",
        description: "Infectious disease screening test.",
      },
    },
  },
  booking: {
    selectedTest: "Selected Test",
    report: "Report",
    closeForm: "Close booking form",
    authRequiredTitle: "Login or register to continue booking.",
    authRequiredText:
      "Booking details are auto-filled from your registered account, so patient contact information is not entered again on this form.",
    accountDetails: "Account Details",
    bookingType: "Booking Type",
    preferredDate: "Preferred Date",
    preferredTimeSlot: "Preferred Time Slot",
    selectTimeSlot: "Select time slot",
    submitting: "Booking...",
    messages: {
      submitted: "Booking submitted successfully.",
    },
    types: {
      "Home Sample Collection": "Home Sample Collection",
      "Laboratory Visit": "Laboratory Visit",
      "Request Callback": "Request Callback",
    },
    status: {
      Requested: "Requested",
      Pending: "Pending",
      Confirmed: "Confirmed",
      "Sample Collection Scheduled": "Sample Collection Scheduled",
      "Sample Collected": "Sample Collected",
      Processing: "Processing",
      "Report Ready": "Report Ready",
      Completed: "Completed",
      Cancelled: "Cancelled",
    },
  },
  certifications: {
    eyebrow: "Certifications",
    heading: "Professional laboratory registrations and compliance.",
    authority: "Authority",
    provider: "Provider",
    registrationNumber: "Registration Number",
    validity: "Validity",
    government: {
      title: "Government Registered Diagnostic Centre",
      authority: "District Registration Authority - Nalgonda",
    },
    biomedical: {
      title: "Biomedical Waste Management",
      authority: "Roma Industries",
    },
  },
  contact: {
    eyebrow: "Contact",
    address:
      "Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana - 508207",
    visitTitle: "Visit Laboratory",
    call: "Call",
    phoneNumbers: "Phone Numbers",
    mapTitle: "THYRO LABORATORIES location map",
    actions: {
      WhatsApp: "WhatsApp",
      Email: "Email",
      Call: "Call",
    },
    form: {
      eyebrow: "Contact Form",
      heading: "Send an enquiry",
      message: "Message",
      success:
        "Your enquiry is ready. Please use call, WhatsApp, or email for the fastest response.",
      submit: "Submit Enquiry",
    },
  },
  footer: {
    description:
      "THYRO LABORATORIES Smart Booking & Management System for patient-friendly laboratory test booking and account management.",
    contact: "Contact",
    address:
      "Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana - 508207",
    quickLinks: "Quick Links",
    copyright:
      "Copyright 2026 THYRO LABORATORIES. All rights reserved.",
  },
  login: {
    subtitle:
      "Access your profile to view personal information, bookings, reports, notifications, and account settings.",
    heading: "Welcome back",
    password: "Password",
    forgotPassword: "Forgot Password?",
    passwordResetSuccess:
      "Your password has been reset successfully. Please login with your new password.",
    submitting: "Logging in...",
    newUser: "New to THYRO LABORATORIES?",
    error: "Unable to login.",
  },
  register: {
    subtitle:
      "Create your local account for booking laboratory tests and managing your profile information.",
    heading: "Create account",
    confirmPassword: "Confirm Password",
    submitting: "Registering...",
    alreadyRegistered: "Already registered?",
    error: "Unable to register.",
  },
  forgotPassword: {
    title: "Forgot Password",
    subtitle:
      "Enter your registered email address and we will send a secure reset link through Supabase Authentication.",
    heading: "Reset your password",
    success:
      "A password reset link has been sent to your registered email address.",
    error: "Unable to send password reset email.",
    sending: "Sending...",
    send: "Send reset link",
    remembered: "Remembered your password?",
  },
  resetPassword: {
    title: "Reset Password",
    subtitle:
      "Create a new password for your account using the secure reset link from your email.",
    heading: "Choose a new password",
    verifying: "Verifying reset link...",
    verifyError: "Unable to verify password reset link.",
    invalidLink:
      "Password reset link is invalid or has expired. Please request a new link.",
    success: "Your password has been reset successfully.",
    error: "Unable to reset password.",
    resetting: "Resetting...",
    submit: "Reset password",
    needLink: "Need a new link?",
    requestLink: "Request password reset",
  },
  profile: {
    title: "Profile",
    subtitle:
      "Your personal information, bookings, reports, notifications, and account settings are managed here.",
    sections: {
      section1: "Section 1",
      section2: "Section 2",
      section3: "Section 3",
      section4: "Section 4",
      section5: "Section 5",
      section6: "Section 6",
    },
    personal: {
      title: "Personal Information",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      email: "Email",
      dateOfBirth: "Date Of Birth",
      gender: "Gender",
      address: "Address",
      profilePhoto: "Profile Photo",
      uploaded: "Uploaded",
      notUploaded: "Not Uploaded",
    },
    language: {
      title: "Language Preference",
      selectLabel: "Preferred Language",
      labels: {
        en: "English",
        te: "Telugu (తెలుగు)",
        hi: "Hindi (हिन्दी)",
        ta: "Tamil",
        kn: "Kannada",
        ml: "Malayalam",
      },
    },
    messages: {
      profileUpdated: "Profile updated in the database.",
      passwordChanged: "Password changed.",
      languageSaved: "Language preference saved.",
    },
    errors: {
      changePassword: "Unable to change password.",
    },
    bookings: {
      title: "My Bookings",
      loading: "Loading bookings...",
      upcoming: "Upcoming Bookings",
      previous: "Previous Bookings",
      noUpcoming: "No upcoming bookings found.",
      noPrevious: "No previous bookings available.",
      testName: "Test Name",
      bookingId: "Booking ID",
      bookingDate: "Booking Date",
      preferredTimeSlot: "Preferred Time Slot",
      bookingMode: "Booking Mode",
      createdDate: "Created Date",
      bookingStatus: "Booking Status",
      downloadReport: "Download Report",
      cancelBooking: "Cancel Booking",
      bookTest: "Book Test",
      cancelMissingId:
        "Unable to cancel this booking because the booking ID is missing.",
      cancelSuccess: "Booking cancelled successfully.",
    },
    reports: {
      title: "My Reports",
      loading: "Loading reports...",
      empty: "No reports available",
      generated: "Generated",
      viewReport: "View report",
    },
    notifications: {
      title: "Notifications",
      loading: "Loading notifications...",
      empty: "No notifications available",
      read: "Read",
      unread: "Unread",
    },
    settings: {
      title: "Account Settings",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      saving: "Saving...",
      saveChanges: "Save Changes",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
    },
    dialogs: {
      cancelTitle: "Cancel Booking",
      cancelMessage: "Are you sure you want to cancel this booking?",
      no: "No",
      cancelling: "Cancelling...",
      yesCancel: "Yes, Cancel",
      cannotCancelTitle: "Cannot Cancel Booking",
      cannotCancelMessage:
        "This booking has already been confirmed by THYRO LABORATORIES. Once a booking is confirmed, it cannot be cancelled online. Please contact the laboratory for further assistance.",
      call: "Call Laboratory",
      whatsapp: "WhatsApp Laboratory",
      close: "Close",
    },
  },
  reports: {
    status: {
      Pending: "Pending",
      Ready: "Ready",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    },
  },
  notifications: {
    titles: {
      "Booking created": "Booking created",
    },
    messages: {
      bookingCreated: "Your {{testName}} booking is {{status}}.",
    },
  },
  notFound: {
    title: "Page not found",
    message: "The page you are looking for is not available.",
  },
} as const;
