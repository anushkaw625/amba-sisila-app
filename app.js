// ============================================================
// අඹ සිසිල Management System
// Supabase Authentication + Role Based UI
// ============================================================

// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL = "https://wazmcrsdzehterjkyeqt.supabase.co";

// මෙතන ඔයාගේ Supabase PUBLISHABLE KEY එක දාන්න.
// Service Role / Secret Key එක දාන්න එපා.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pxnXrMQ7wDKH5bvizimAKw_ELu-HO-t";


// ============================================================
// SUPABASE CLIENT
// ============================================================

let supabaseClient = null;

if (window.supabase && window.supabase.createClient) {

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

} else {

  console.error("Supabase library not loaded.");

}


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentUser = null;
let currentProfile = null;

let currentPage = "dashboard";

let language =
  localStorage.getItem("amba_lang") || "si";


// ============================================================
// LANGUAGE
// ============================================================

const translations = {

  si: {

    dashboard: "උපකරණ පුවරුව",
    pos: "POS / විකුණුම්",
    products: "නිෂ්පාදන",
    stock: "තොග",
    expenses: "වියදම්",
    reports: "වාර්තා",
    employees: "සේවකයින්",
    settings: "සැකසුම්",

    sales: "අද විකුණුම්",
    orders: "අද ඇණවුම්",
    profit: "ලාභය",
    low: "අඩු තොග",
    recent: "මෑත විකුණුම්",

    cash: "මුදල්",
    card: "කාඩ්",

    name: "නම",
    price: "විකුණුම් මිල",
    cost: "පිරිවැය",
    qty: "ප්‍රමාණය",

    save: "සුරකින්න",
    add: "එක් කරන්න",

    welcome: "සාදරයෙන් පිළිගනිමු",
    owner: "හිමිකරු",
    employee: "සේවකයා",

    noData: "දත්ත නොමැත",

    posTitle: "POS / විකුණුම්",
    productsTitle: "නිෂ්පාදන කළමනාකරණය",
    stockTitle: "තොග කළමනාකරණය",
    expensesTitle: "වියදම්",
    reportsTitle: "වාර්තා",
    employeesTitle: "සේවක කළමනාකරණය",
    settingsTitle: "සැකසුම්",

    comingSoon: "මෙම කොටස ඊළඟ අදියරේදී සම්පූර්ණ කරනු ඇත.",

    logout: "Logout"

  },

  en: {

    dashboard: "Dashboard",
    pos: "POS / Sales",
    products: "Products",
    stock: "Stock",
    expenses: "Expenses",
    reports: "Reports",
    employees: "Employees",
    settings: "Settings",

    sales: "Today's Sales",
    orders: "Today's Orders",
    profit: "Profit",
    low: "Low Stock",
    recent: "Recent Sales",

    cash: "Cash",
    card: "Card",

    name: "Name",
    price: "Selling Price",
    cost: "Cost",
    qty: "Quantity",

    save: "Save",
    add: "Add",

    welcome: "Welcome",
    owner: "Owner",
    employee: "Employee",

    noData: "No data",

    posTitle: "POS / Sales",
    productsTitle: "Product Management",
    stockTitle: "Stock Management",
    expensesTitle: "Expenses",
    reportsTitle: "Reports",
    employeesTitle: "Employee Management",
    settingsTitle: "Settings",

    comingSoon: "This section will be completed in the next stage.",

    logout: "Logout"

  }

};


// ============================================================
// TRANSLATION FUNCTION
// ============================================================

function t(key) {

  if (
    translations[language] &&
    translations[language][key]
  ) {

    return translations[language][key];

  }

  return key;

}


// ============================================================
// MONEY FORMAT
// ============================================================

function money(value) {

  const number = Number(value || 0);

  return "Rs. " + number.toLocaleString(
    "en-LK",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );

}


// ============================================================
// LOGIN SCREEN
// ============================================================

function showLogin() {

  const loginScreen =
    document.getElementById("loginScreen");

  const mainApp =
    document.getElementById("mainApp");

  if (loginScreen) {

    loginScreen.classList.remove("app-hidden");

  }

  if (mainApp) {

    mainApp.classList.add("app-hidden");

  }

}


// ============================================================
// MAIN APP SCREEN
// ============================================================

function showApp() {

  const loginScreen =
    document.getElementById("loginScreen");

  const mainApp =
    document.getElementById("mainApp");

  if (loginScreen) {

    loginScreen.classList.add("app-hidden");

  }

  if (mainApp) {

    mainApp.classList.remove("app-hidden");

  }

}


// ============================================================
// LOGIN
// ============================================================

async function loginUser() {

  const usernameInput =
    document.getElementById("loginUsername");

  const passwordInput =
    document.getElementById("loginPassword");

  const message =
    document.getElementById("loginMessage");

  if (!usernameInput || !passwordInput) {

    return;

  }

  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value;

  if (message) {

    message.textContent = "";

  }

  if (!username || !password) {

    if (message) {

      message.textContent =
        "Username සහ Password දෙකම ඇතුළත් කරන්න.";

    }

    return;

  }

  if (!supabaseClient) {

    if (message) {

      message.textContent =
        "Supabase connection error.";

    }

    return;

  }

  try {

    if (message) {

      message.textContent =
        "Logging in...";

    }


    // --------------------------------------------------------
    // Username → Email
    // --------------------------------------------------------

    const rpcResult =
      await supabaseClient.rpc(
        "get_login_email",
        {
          p_username: username
        }
      );


    if (rpcResult.error) {

      console.error(
        "Username lookup error:",
        rpcResult.error
      );

      if (message) {

        message.textContent =
          "Login error. Please try again.";

      }

      return;

    }


    const email =
      rpcResult.data;


    if (!email) {

      if (message) {

        message.textContent =
          "Username හමු නොවීය.";

      }

      return;

    }


    // --------------------------------------------------------
    // Supabase Login
    // --------------------------------------------------------

    const loginResult =
      await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });


    if (loginResult.error) {

      console.error(
        "Login error:",
        loginResult.error
      );

      if (message) {

        message.textContent =
          "Username හෝ Password වැරදියි.";

      }

      return;

    }


    currentUser =
      loginResult.data.user;


    // --------------------------------------------------------
    // Load Profile
    // --------------------------------------------------------

    await loadProfile();


    if (!currentProfile) {

      if (message) {

        message.textContent =
          "User profile එක හමු නොවීය.";

      }

      await supabaseClient.auth.signOut();

      return;

    }


    showApp();

    applyRolePermissions();

    updateHeader();

    show("dashboard");


  } catch (error) {

    console.error("Login exception:", error);

    if (message) {

      message.textContent =
        "Login failed. Please try again.";

    }

  }

}


// ============================================================
// LOAD USER PROFILE
// ============================================================

async function loadProfile() {

  if (!supabaseClient || !currentUser) {

    return null;

  }

  const result =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();


  if (result.error) {

    console.error(
      "Profile error:",
      result.error
    );

    currentProfile = null;

    return null;

  }


  currentProfile =
    result.data;

  if (currentProfile.language) {

    language =
      currentProfile.language;

    localStorage.setItem(
      "amba_lang",
      language
    );

  }

  return currentProfile;

}


// ============================================================
// FORGOT PASSWORD
// ============================================================

async function forgotPassword() {

  const usernameInput =
    document.getElementById("loginUsername");

  const message =
    document.getElementById("loginMessage");

  if (!usernameInput) {

    return;

  }

  const username =
    usernameInput.value.trim();


  if (!username) {

    if (message) {

      message.textContent =
        "මුලින් Username එක ඇතුළත් කරන්න.";

    }

    return;

  }


  if (!supabaseClient) {

    return;

  }


  try {

    if (message) {

      message.textContent =
        "Checking account...";

    }


    const rpcResult =
      await supabaseClient.rpc(
        "get_login_email",
        {
          p_username: username
        }
      );


    if (rpcResult.error) {

      console.error(
        "Forgot password error:",
        rpcResult.error
      );

      if (message) {

        message.textContent =
          "Request failed.";

      }

      return;

    }


    const email =
      rpcResult.data;


    if (!email) {

      if (message) {

        message.textContent =
          "Username හමු නොවීය.";

      }

      return;

    }


    const resetResult =
      await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin
        }
      );


    if (resetResult.error) {

      console.error(
        "Password reset error:",
        resetResult.error
      );

      if (message) {

        message.textContent =
          "Password reset request failed.";

      }

      return;

    }


    if (message) {

      message.textContent =
        "Password reset link එක email එකට යවා ඇත.";

    }


  } catch (error) {

    console.error(
      "Forgot password exception:",
      error
    );

    if (message) {

      message.textContent =
        "Something went wrong.";

    }

  }

}


// ============================================================
// LOGOUT
// ============================================================

async function logoutUser() {

  if (!supabaseClient) {

    return;

  }

  try {

    await supabaseClient.auth.signOut();

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }

  currentUser = null;

  currentProfile = null;

  showLogin();

  const username =
    document.getElementById("loginUsername");

  const password =
    document.getElementById("loginPassword");

  const message =
    document.getElementById("loginMessage");


  if (username) {

    username.value = "";

  }

  if (password) {

    password.value = "";

  }

  if (message) {

    message.textContent = "";

  }

}


// ============================================================
// ROLE PERMISSIONS
// ============================================================

function applyRolePermissions() {

  const employeesMenu =
    document.getElementById("employeesMenu");


  if (!employeesMenu) {

    return;

  }


  const role =
    currentProfile?.role || "employee";


  if (role === "owner") {

    employeesMenu.style.display = "";

  } else {

    employeesMenu.style.display = "none";

  }

}


// ============================================================
// HEADER
// ============================================================

function updateHeader() {

  const userElement =
    document.getElementById("currentUser");

  const dateElement =
    document.getElementById("date");


  if (userElement) {

    const username =
      currentProfile?.username ||
      currentUser?.email ||
      "";

    const role =
      currentProfile?.role === "owner"
        ? t("owner")
        : t("employee");


    userElement.textContent =
      username + " • " + role;

  }


  if (dateElement) {

    const now =
      new Date();


    dateElement.textContent =
      now.toLocaleDateString(
        language === "si"
          ? "si-LK"
          : "en-LK",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );

  }

}


// ============================================================
// LANGUAGE CHANGE
// ============================================================

async function setLang(value) {

  if (
    value !== "si" &&
    value !== "en"
  ) {

    value = "si";

  }


  language = value;

  localStorage.setItem(
    "amba_lang",
    language
  );


  if (currentProfile && supabaseClient) {

    await supabaseClient
      .from("profiles")
      .update({
        language: language
      })
      .eq("id", currentUser.id);

  }


  updateHeader();

  show(currentPage);

}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function show(pageName) {

  currentPage =
    pageName;


  const title =
    document.getElementById("title");


  if (title) {

    const titles = {

      dashboard: t("dashboard"),
      pos: t("pos"),
      products: t("products"),
      stock: t("stock"),
      expenses: t("expenses"),
      reports: t("reports"),
      employees: t("employees"),
      settings: t("settings")

    };


    title.textContent =
      titles[pageName] ||
      pageName;

  }


  // Close mobile menu

  const sidebar =
    document.querySelector("aside");

  if (sidebar) {

    sidebar.classList.remove("open");

  }


  switch (pageName) {

    case "dashboard":
      dashboard();
      break;

    case "pos":
      posPage();
      break;

    case "products":
      productsPage();
      break;

    case "stock":
      stockPage();
      break;

    case "expenses":
      expensesPage();
      break;

    case "reports":
      reportsPage();
      break;

    case "employees":
      employeesPage();
      break;

    case "settings":
      settingsPage();
      break;

    default:
      dashboard();

  }

}


// ============================================================
// DASHBOARD
// ============================================================

function dashboard() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  const role =
    currentProfile?.role ||
    "employee";


  let ownerProfitCard = "";


  if (role === "owner") {

    ownerProfitCard =
      '<div class="card">' +
      '<div class="card-title">' +
      t("profit") +
      '</div>' +
      '<div class="card-value">' +
      money(0) +
      '</div>' +
      '</div>';

  }


  app.innerHTML =
    '<div class="dashboard-grid">' +

      '<div class="card">' +
        '<div class="card-title">' +
          t("sales") +
        '</div>' +
        '<div class="card-value">' +
          money(0) +
        '</div>' +
      '</div>' +

      '<div class="card">' +
        '<div class="card-title">' +
          t("orders") +
        '</div>' +
        '<div class="card-value">0</div>' +
      '</div>' +

      ownerProfitCard +

      '<div class="card">' +
        '<div class="card-title">' +
          t("low") +
        '</div>' +
        '<div class="card-value">0</div>' +
      '</div>' +

    '</div>' +

    '<div class="panel">' +
      '<h2>' +
        t("recent") +
      '</h2>' +

      '<div class="empty-state">' +
        t("noData") +
      '</div>' +

    '</div>';

}


// ============================================================
// POS
// ============================================================

function posPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("posTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

      '<div class="pos-placeholder">' +

        '<div class="card">' +
          '<div class="card-title">' +
            t("cash") +
          '</div>' +
          '<div class="card-value">' +
            money(0) +
          '</div>' +
        '</div>' +

        '<div class="card">' +
          '<div class="card-title">' +
            t("card") +
          '</div>' +
          '<div class="card-value">' +
            money(0) +
          '</div>' +
        '</div>' +

      '</div>' +

    '</div>';

}


// ============================================================
// PRODUCTS
// ============================================================

function productsPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("productsTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

      '<button class="btn" onclick="alert(' +
      "'Product management will be added next.'" +
      ')">' +

        '+ ' +
        t("add") +

      '</button>' +

    '</div>';

}


// ============================================================
// STOCK
// ============================================================

function stockPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("stockTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

    '</div>';

}


// ============================================================
// EXPENSES
// ============================================================

function expensesPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("expensesTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

      '<button class="btn" onclick="alert(' +
      "'Expense management will be added next.'" +
      ')">' +

        '+ ' +
        t("add") +

      '</button>' +

    '</div>';

}


// ============================================================
// REPORTS
// ============================================================

function reportsPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  const role =
    currentProfile?.role ||
    "employee";


  if (role !== "owner") {

    app.innerHTML =
      '<div class="panel">' +

        '<h2>' +
          t("reportsTitle") +
        '</h2>' +

        '<p>' +
          "මෙම කොටස Owner සඳහා පමණි." +
        '</p>' +

      '</div>';

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("reportsTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

    '</div>';

}


// ============================================================
// EMPLOYEES
// ============================================================

function employeesPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  const role =
    currentProfile?.role ||
    "employee";


  if (role !== "owner") {

    app.innerHTML =
      '<div class="panel">' +

        '<h2>' +
          t("employeesTitle") +
        '</h2>' +

        '<p>' +
          "මෙම කොටස Owner සඳහා පමණි." +
        '</p>' +

      '</div>';

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("employeesTitle") +
      '</h2>' +

      '<p>' +
        t("comingSoon") +
      '</p>' +

      '<button class="btn" onclick="alert(' +
      "'Employee management will be added next.'" +
      ')">' +

        '+ ' +
        t("add") +

      '</button>' +

    '</div>';

}


// ============================================================
// SETTINGS
// ============================================================

function settingsPage() {

  const app =
    document.getElementById("app");

  if (!app) {

    return;

  }


  app.innerHTML =
    '<div class="panel">' +

      '<h2>' +
        t("settingsTitle") +
      '</h2>' +

      '<div class="setting-row">' +

        '<strong>Language</strong>' +

        '<select onchange="setLang(this.value)">' +

          '<option value="si"' +
          (language === "si" ? " selected" : "") +
          '>සිංහල</option>' +

          '<option value="en"' +
          (language === "en" ? " selected" : "") +
          '>English</option>' +

        '</select>' +

      '</div>' +

    '</div>';

}


// ============================================================
// CHECK EXISTING SESSION
// ============================================================

async function checkSession() {

  if (!supabaseClient) {

    console.error(
      "Supabase client not available."
    );

    showLogin();

    return;

  }


  try {

    const result =
      await supabaseClient.auth.getSession();


    if (result.error) {

      console.error(
        "Session error:",
        result.error
      );

      showLogin();

      return;

    }


    const session =
      result.data.session;


    if (!session) {

      showLogin();

      return;

    }


    currentUser =
      session.user;


    await loadProfile();


    if (!currentProfile) {

      await supabaseClient.auth.signOut();

      showLogin();

      return;

    }


    showApp();

    applyRolePermissions();

    updateHeader();

    show("dashboard");


  } catch (error) {

    console.error(
      "Session check error:",
      error
    );

    showLogin();

  }

}


// ============================================================
// AUTH STATE LISTENER
// ============================================================

function setupAuthListener() {

  if (!supabaseClient) {

    return;

  }


  supabaseClient.auth.onAuthStateChange(
    async function(event, session) {

      console.log(
        "Auth event:",
        event
      );


      if (
        event === "SIGNED_OUT"
      ) {

        currentUser = null;

        currentProfile = null;

        showLogin();

        return;

      }


      if (
        event === "SIGNED_IN" &&
        session
      ) {

        currentUser =
          session.user;

      }

    }
  );

}


// ============================================================
// ENTER KEY LOGIN
// ============================================================

function setupLoginKeyboard() {

  const password =
    document.getElementById("loginPassword");


  if (!password) {

    return;

  }


  password.addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        loginUser();

      }

    }
  );

}


// ============================================================
// INITIALIZE APP
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    console.log(
      "අඹ සිසිල Management System starting..."
    );


    // Set language selector

    const languageSelect =
      document.getElementById("lang");


    if (languageSelect) {

      languageSelect.value =
        language;

    }


    setupLoginKeyboard();

    setupAuthListener();

    await checkSession();

  }
);


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.loginUser =
  loginUser;

window.forgotPassword =
  forgotPassword;

window.logoutUser =
  logoutUser;

window.show =
  show;

window.setLang =
  setLang;

window.dashboard =
  dashboard;

window.posPage =
  posPage;

window.productsPage =
  productsPage;

window.stockPage =
  stockPage;

window.expensesPage =
  expensesPage;

window.reportsPage =
  reportsPage;

window.employeesPage =
  employeesPage;

window.settingsPage =
  settingsPage;
