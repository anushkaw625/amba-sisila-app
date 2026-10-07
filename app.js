// ============================================================
// අඹ සිසිල Management System
// Supabase Authentication + Role Based UI
// Dashboard + Employee POS Only
// FULL POS VERSION
// ============================================================


// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://wazmcrsdzehterjkyeqt.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_pxnXrMQ7wDKH5bvizimAKw_ELu-HO-t";


// ============================================================
// SUPABASE CLIENT
// ============================================================

let supabaseClient = null;

if (
  window.supabase &&
  window.supabase.createClient
) {

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

} else {

  console.error(
    "Supabase library not loaded."
  );

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
// POS GLOBAL VARIABLES
// ============================================================

let posProducts = [];

let posCart = [];

let selectedPaymentMethod = "cash";


// ============================================================
// TRANSLATIONS
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

    comingSoon:
      "මෙම කොටස ඊළඟ අදියරේදී සම්පූර්ණ කරනු ඇත.",

    logout: "Logout",

    loading: "පූරණය වෙමින්...",
    today: "අද",
    noSales: "අද විකුණුම් නොමැත",
    accessDenied: "මෙම කොටස Owner සඳහා පමණි.",

    payment: "ගෙවීම",

    productsEmpty:
      "Products තාම එකතු කරලා නැහැ.",

    cartEmpty:
      "Cart එක හිස්.",

    completeSale:
      "විකිණීම සම්පූර්ණ කරන්න",

    clearCart:
      "Cart එක හිස් කරන්න",

    paymentMethod:
      "ගෙවීම් ක්‍රමය",

    saleNotConnected:
      "Sale save කිරීම ඊළඟ පියවරේදී connect කරමු."

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

    comingSoon:
      "This section will be completed in the next stage.",

    logout: "Logout",

    loading: "Loading...",
    today: "Today",
    noSales: "No sales today",
    accessDenied: "This section is for Owner only.",

    payment: "Payment",

    productsEmpty:
      "No products have been added yet.",

    cartEmpty:
      "Cart is empty.",

    completeSale:
      "Complete Sale",

    clearCart:
      "Clear Cart",

    paymentMethod:
      "Payment Method",

    saleNotConnected:
      "Sale saving will be connected in the next step."

  }

};


// ============================================================
// TRANSLATION
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
// MONEY
// ============================================================

function money(value) {

  const number =
    Number(value || 0);

  return "Rs. " +
    number.toLocaleString(
      "en-LK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


// ============================================================
// DATE HELPERS
// ============================================================

function getTodayStart() {

  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;

}


function getTomorrowStart() {

  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  date.setDate(
    date.getDate() + 1
  );

  return date;

}


function getRecordDate(record) {

  return (
    record.created_at ||
    record.createdAt ||
    record.date ||
    record.sale_date ||
    record.sold_at ||
    null
  );

}


function getRecordAmount(record) {

  const possibleFields = [

    "total_amount",
    "total",
    "grand_total",
    "amount",
    "sale_total",
    "net_total",
    "total_price"

  ];


  for (
    const field of possibleFields
  ) {

    if (
      record[field] !== undefined &&
      record[field] !== null
    ) {

      const value =
        Number(record[field]);


      if (
        !Number.isNaN(value)
      ) {

        return value;

      }

    }

  }


  return 0;

}


function getRecordPayment(record) {

  const value =
    record.payment_method ||
    record.payment_type ||
    record.method ||
    "";

  return String(value);

}


// ============================================================
// LOGIN SCREEN
// ============================================================

function showLogin() {

  const loginScreen =
    document.getElementById(
      "loginScreen"
    );


  const mainApp =
    document.getElementById(
      "mainApp"
    );


  if (loginScreen) {

    loginScreen.classList.remove(
      "app-hidden"
    );

  }


  if (mainApp) {

    mainApp.classList.add(
      "app-hidden"
    );

  }

}


// ============================================================
// MAIN APP SCREEN
// ============================================================

function showApp() {

  const loginScreen =
    document.getElementById(
      "loginScreen"
    );


  const mainApp =
    document.getElementById(
      "mainApp"
    );


  if (loginScreen) {

    loginScreen.classList.add(
      "app-hidden"
    );

  }


  if (mainApp) {

    mainApp.classList.remove(
      "app-hidden"
    );

  }

}


// ============================================================
// LOGIN
// ============================================================

async function loginUser() {

  const usernameInput =
    document.getElementById(
      "loginUsername"
    );


  const passwordInput =
    document.getElementById(
      "loginPassword"
    );


  const message =
    document.getElementById(
      "loginMessage"
    );


  if (
    !usernameInput ||
    !passwordInput
  ) {

    return;

  }


  const username =
    usernameInput.value.trim();


  const password =
    passwordInput.value;


  if (message) {

    message.textContent = "";

  }


  if (
    !username ||
    !password
  ) {

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


    // Username → Email

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


    // Supabase Login

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


    // Load profile

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


    // Employee → POS directly

    if (
      currentProfile.role ===
      "employee"
    ) {

      show("pos");

    } else {

      show("dashboard");

    }


  } catch (error) {

    console.error(
      "Login exception:",
      error
    );


    if (message) {

      message.textContent =
        "Login failed. Please try again.";

    }

  }

}


// ============================================================
// LOAD PROFILE
// ============================================================

async function loadProfile() {

  if (
    !supabaseClient ||
    !currentUser
  ) {

    return null;

  }


  const result =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq(
        "id",
        currentUser.id
      )
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


  if (
    currentProfile.language
  ) {

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
    document.getElementById(
      "loginUsername"
    );


  const message =
    document.getElementById(
      "loginMessage"
    );


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
      await supabaseClient.auth
        .resetPasswordForEmail(
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

  posCart = [];

  posProducts = [];

  selectedPaymentMethod =
    "cash";


  showLogin();


  const username =
    document.getElementById(
      "loginUsername"
    );


  const password =
    document.getElementById(
      "loginPassword"
    );


  const message =
    document.getElementById(
      "loginMessage"
    );


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

  const role =
    currentProfile?.role ||
    "employee";


  const employeesMenu =
    document.getElementById(
      "employeesMenu"
    );


  const navButtons =
    document.querySelectorAll(
      "aside nav button"
    );


  // Owner

  if (
    role === "owner"
  ) {

    if (employeesMenu) {

      employeesMenu.style.display =
        "";

    }


    navButtons.forEach(
      function(button) {

        button.style.display =
          "";

      }
    );


    return;

  }


  // Employee

  if (employeesMenu) {

    employeesMenu.style.display =
      "none";

  }


  navButtons.forEach(
    function(button) {

      const onclick =
        button.getAttribute(
          "onclick"
        ) || "";


      if (
        onclick.includes(
          "show('pos')"
        ) ||
        onclick.includes(
          "logoutUser"
        )
      ) {

        button.style.display =
          "";

      } else {

        button.style.display =
          "none";

      }

    }
  );

}


// ============================================================
// HEADER
// ============================================================

function updateHeader() {

  const userElement =
    document.getElementById(
      "currentUser"
    );


  const dateElement =
    document.getElementById(
      "date"
    );


  const languageSelect =
    document.getElementById(
      "lang"
    );


  if (userElement) {

    const username =
      currentProfile?.username ||
      currentUser?.email ||
      "";


    const role =
      currentProfile?.role ===
      "owner"

        ? t("owner")

        : t("employee");


    userElement.textContent =
      username +
      " • " +
      role;

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


  if (languageSelect) {

    languageSelect.value =
      language;

  }

}


// ============================================================
// LANGUAGE
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


  if (
    currentProfile &&
    currentUser &&
    supabaseClient
  ) {

    await supabaseClient
      .from("profiles")
      .update({
        language: language
      })
      .eq(
        "id",
        currentUser.id
      );

  }


  updateHeader();


  if (
    currentProfile?.role ===
    "employee"
  ) {

    show("pos");

  } else {

    show(currentPage);

  }

}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function show(pageName) {

  // ----------------------------------------------------------
  // SECURITY: Employee can only access POS
  // ----------------------------------------------------------

  if (
    currentProfile?.role ===
    "employee"
  ) {

    if (
      pageName !== "pos"
    ) {

      pageName = "pos";

    }

  }


  currentPage =
    pageName;


  const title =
    document.getElementById(
      "title"
    );


  if (title) {

    const titles = {

      dashboard:
        t("dashboard"),

      pos:
        t("pos"),

      products:
        t("products"),

      stock:
        t("stock"),

      expenses:
        t("expenses"),

      reports:
        t("reports"),

      employees:
        t("employees"),

      settings:
        t("settings")

    };


    title.textContent =
      titles[pageName] ||
      pageName;

  }


  // Close mobile menu

  const sidebar =
    document.querySelector(
      "aside"
    );


  if (sidebar) {

    sidebar.classList.remove(
      "open"
    );

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

async function dashboard() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  // Employee should never see Dashboard

  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

    return;

  }


  // Loading UI

  app.innerHTML =

    '<div class="panel">' +

      '<h2>' +
        t("dashboard") +
      '</h2>' +

      '<p>' +
        t("loading") +
      '</p>' +

    '</div>';


  let sales = [];

  let products = [];

  let expenses = [];


  // ----------------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------------

  if (supabaseClient) {

    const salesResult =
      await supabaseClient
        .from("sales")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        )
        .limit(500);


    if (
      salesResult.error
    ) {

      console.error(
        "Sales dashboard error:",
        salesResult.error
      );

    } else {

      sales =
        salesResult.data ||
        [];

    }


    const productsResult =
      await supabaseClient
        .from("products")
        .select("*")
        .limit(500);


    if (
      productsResult.error
    ) {

      console.error(
        "Products dashboard error:",
        productsResult.error
      );

    } else {

      products =
        productsResult.data ||
        [];

    }


    const expensesResult =
      await supabaseClient
        .from("expenses")
        .select("*")
        .limit(500);


    if (
      expensesResult.error
    ) {

      console.error(
        "Expenses dashboard error:",
        expensesResult.error
      );

    } else {

      expenses =
        expensesResult.data ||
        [];

    }

  }


  // ----------------------------------------------------------
  // TODAY FILTER
  // ----------------------------------------------------------

  const todayStart =
    getTodayStart();


  const tomorrowStart =
    getTomorrowStart();


  const todaySales =
    sales.filter(
      function(record) {

        const dateValue =
          getRecordDate(record);


        if (!dateValue) {

          return false;

        }


        const date =
          new Date(dateValue);


        return (
          date >= todayStart &&
          date < tomorrowStart
        );

      }
    );


  const todayExpenses =
    expenses.filter(
      function(record) {

        const dateValue =
          getRecordDate(record);


        if (!dateValue) {

          return false;

        }


        const date =
          new Date(dateValue);


        return (
          date >= todayStart &&
          date < tomorrowStart
        );

      }
    );


  // ----------------------------------------------------------
  // TODAY SALES TOTAL
  // ----------------------------------------------------------

  const todaySalesTotal =
    todaySales.reduce(
      function(total, record) {

        return (
          total +
          getRecordAmount(record)
        );

      },
      0
    );


  // ----------------------------------------------------------
  // TODAY EXPENSE TOTAL
  // ----------------------------------------------------------

  const todayExpenseTotal =
    todayExpenses.reduce(
      function(total, record) {

        return (
          total +
          getRecordAmount(record)
        );

      },
      0
    );


  // ----------------------------------------------------------
  // TEMP PROFIT
  // ----------------------------------------------------------

  const estimatedProfit =
    todaySalesTotal -
    todayExpenseTotal;


  // ----------------------------------------------------------
  // LOW STOCK
  // ----------------------------------------------------------

  const lowStockProducts =
    products.filter(
      function(product) {

        const qty =
          Number(
            product.stock_qty ??
            product.stock ??
            product.quantity ??
            product.qty ??
            0
          );


        const minimum =
          Number(
            product.min_stock ??
            product.minimum_stock ??
            product.low_stock ??
            0
          );


        if (
          minimum > 0 &&
          qty <= minimum
        ) {

          return true;

        }


        return (
          minimum === 0 &&
          qty <= 0
        );

      }
    );


  // ----------------------------------------------------------
  // RECENT SALES
  // ----------------------------------------------------------

  const recentSales =
    sales.slice(
      0,
      8
    );


  // ----------------------------------------------------------
  // RECENT SALES HTML
  // ----------------------------------------------------------

  let recentHTML = "";


  if (
    recentSales.length === 0
  ) {

    recentHTML =
      '<div class="empty">' +
        t("noSales") +
      '</div>';

  } else {

    recentHTML =

      '<div style="overflow-x:auto;">' +

        '<table class="table">' +

          '<thead>' +

            '<tr>' +

              '<th>' +
                t("today") +
              '</th>' +

              '<th>' +
                t("payment") +
              '</th>' +

              '<th>' +
                t("sales") +
              '</th>' +

            '</tr>' +

          '</thead>' +

          '<tbody>';


    recentSales.forEach(
      function(record) {

        const dateValue =
          getRecordDate(record);


        const amount =
          getRecordAmount(record);


        const payment =
          getRecordPayment(record);


        let dateText =
          "-";


        if (dateValue) {

          const date =
            new Date(dateValue);


          dateText =
            date.toLocaleString(
              language === "si"
                ? "si-LK"
                : "en-LK",
              {
                dateStyle:
                  "short",

                timeStyle:
                  "short"
              }
            );

        }


        recentHTML +=

          '<tr>' +

            '<td>' +
              dateText +
            '</td>' +

            '<td>' +
              (
                payment ||
                "-"
              ) +
            '</td>' +

            '<td>' +
              money(amount) +
            '</td>' +

          '</tr>';

      }
    );


    recentHTML +=

          '</tbody>' +

        '</table>' +

      '</div>';

  }


  // ----------------------------------------------------------
  // DASHBOARD HTML
  // ----------------------------------------------------------

  app.innerHTML =

    '<div class="cards">' +

      '<div class="card">' +

        '<small>' +
          t("sales") +
        '</small>' +

        '<div class="num">' +
          money(todaySalesTotal) +
        '</div>' +

      '</div>' +


      '<div class="card">' +

        '<small>' +
          t("orders") +
        '</small>' +

        '<div class="num">' +
          todaySales.length +
        '</div>' +

      '</div>' +


      '<div class="card">' +

        '<small>' +
          t("profit") +
        '</small>' +

        '<div class="num">' +
          money(estimatedProfit) +
        '</div>' +

      '</div>' +


      '<div class="card">' +

        '<small>' +
          t("low") +
        '</small>' +

        '<div class="num">' +
          lowStockProducts.length +
        '</div>' +

      '</div>' +

    '</div>' +


    '<div class="grid">' +

      '<div class="panel">' +

        '<h2>' +
          t("recent") +
        '</h2>' +

        recentHTML +

      '</div>' +


      '<div class="panel">' +

        '<h2>' +
          t("today") +
        '</h2>' +

        '<p>' +
          t("sales") +
          ': <strong>' +
          money(todaySalesTotal) +
          '</strong>' +
        '</p>' +

        '<p>' +
          t("orders") +
          ': <strong>' +
          todaySales.length +
          '</strong>' +
        '</p>' +

        '<p>' +
          t("profit") +
          ': <strong>' +
          money(estimatedProfit) +
          '</strong>' +
        '</p>' +

        '<p>' +
          t("low") +
          ': <strong>' +
          lowStockProducts.length +
          '</strong>' +
        '</p>' +

      '</div>' +

    '</div>';

}


// ============================================================
// POS - LOAD PRODUCTS
// ============================================================

async function loadPOSProducts() {

  if (!supabaseClient) {

    return [];

  }


  const result =
    await supabaseClient
      .from("products")
      .select("*")
      .order(
        "name",
        {
          ascending: true
        }
      );


  if (result.error) {

    console.error(
      "POS products error:",
      result.error
    );


    return [];

  }


  return result.data || [];

}


// ============================================================
// POS PAGE
// ============================================================

async function posPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------

  app.innerHTML =

    '<div class="panel">' +

      '<h2>' +
        t("posTitle") +
      '</h2>' +

      '<p>' +
        t("loading") +
      '</p>' +

    '</div>';


  // ----------------------------------------------------------
  // Load products
  // ----------------------------------------------------------

  posProducts =
    await loadPOSProducts();


  // ----------------------------------------------------------
  // Render POS
  // ----------------------------------------------------------

  renderPOS();

}


// ============================================================
// POS - RENDER
// ============================================================

function renderPOS() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  // ----------------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------------

  let productsHTML = "";


  if (
    posProducts.length === 0
  ) {

    productsHTML =

      '<div class="empty">' +

        '🍲 ' +
        t("productsEmpty") +

        '<br><br>' +

        (
          language === "si"
            ? "Owner → Products section එකෙන් products add කරන්න."
            : "Add products from Owner → Products section."
        ) +

      '</div>';

  } else {

    productsHTML =

      '<div class="pos-product-grid">';


    posProducts.forEach(
      function(product) {

        const price =
          Number(
            product.price ??
            product.selling_price ??
            product.sale_price ??
            0
          );


        const name =
          product.name ||
          product.product_name ||
          "Product";


        const safeName =
          String(name)
            .replace(
              /'/g,
              "\\'"
            )
            .replace(
              /"/g,
              "&quot;"
            );


        productsHTML +=

          '<button ' +

            'class="pos-product" ' +

            'onclick="addToPOSCart(\'' +

              String(product.id) +

            '\')"' +

          '>' +

            '<div class="pos-product-name">' +

              safeName +

            '</div>' +

            '<div class="pos-product-price">' +

              money(price) +

            '</div>' +

          '</button>';

      }
    );


    productsHTML +=
      '</div>';

  }


  // ----------------------------------------------------------
  // CART
  // ----------------------------------------------------------

  let cartHTML = "";


  if (
    posCart.length === 0
  ) {

    cartHTML =

      '<div class="empty">' +

        '🛒 ' +
        t("cartEmpty") +

      '</div>';

  } else {

    cartHTML =

      '<div class="pos-cart-list">';


    posCart.forEach(
      function(item, index) {

        cartHTML +=

          '<div class="pos-cart-item">' +

            '<div class="pos-cart-info">' +

              '<strong>' +
                item.name +
              '</strong>' +

              '<small>' +

                money(item.price) +

                ' × ' +

                item.qty +

              '</small>' +

            '</div>' +


            '<div class="pos-cart-controls">' +

              '<button ' +

                'onclick="changePOSQty(' +

                  index +

                  ',-1)"' +

              '>−</button>' +


              '<span>' +

                item.qty +

              '</span>' +


              '<button ' +

                'onclick="changePOSQty(' +

                  index +

                  ',1)"' +

              '>+</button>' +


              '<button ' +

                'class="pos-remove"' +

                'onclick="removePOSItem(' +

                  index +

                ')"' +

              '>×</button>' +

            '</div>' +


            '<strong>' +

              money(
                item.price *
                item.qty
              ) +

            '</strong>' +

          '</div>';

      }
    );


    cartHTML +=
      '</div>';

  }


  // ----------------------------------------------------------
  // TOTAL
  // ----------------------------------------------------------

  const total =
    getPOSCartTotal();


  // ----------------------------------------------------------
  // FULL POS
  // ----------------------------------------------------------

  app.innerHTML =

    '<div class="pos-layout">' +


      // ------------------------------------------------------
      // PRODUCT SIDE
      // ------------------------------------------------------

      '<div class="panel pos-products-panel">' +

        '<div class="pos-panel-header">' +

          '<h2>🍲 Products</h2>' +

        '</div>' +

        productsHTML +

      '</div>' +


      // ------------------------------------------------------
      // CART SIDE
      // ------------------------------------------------------

      '<div class="panel pos-cart-panel">' +

        '<div class="pos-panel-header">' +

          '<h2>🛒 Cart</h2>' +

        '</div>' +

        cartHTML +


        '<div class="pos-summary">' +

          '<div class="pos-total-row">' +

            '<span>Total</span>' +

            '<strong>' +

              money(total) +

            '</strong>' +

          '</div>' +


          '<div class="payment-title">' +

            t("paymentMethod") +

          '</div>' +


          '<div class="payment-buttons">' +


            '<button ' +

              'class="' +

              (
                selectedPaymentMethod ===
                "cash"

                  ? "payment-active"

                  : ""
              ) +

              '" ' +

              'onclick="selectPOSPayment(\'cash\')"' +

            '>' +

              '💵 ' +
              t("cash") +

            '</button>' +


            '<button ' +

              'class="' +

              (
                selectedPaymentMethod ===
                "card"

                  ? "payment-active"

                  : ""
              ) +

              '" ' +

              'onclick="selectPOSPayment(\'card\')"' +

            '>' +

              '💳 ' +
              t("card") +

            '</button>' +


          '</div>' +


          '<button ' +

            'class="btn pos-complete-btn"' +

            'onclick="completePOSSale()"' +

            (
              posCart.length === 0

                ? " disabled"

                : ""
            ) +

          '>' +

            '✅ ' +
            t("completeSale") +

          '</button>' +


          '<button ' +

            'class="btn alt pos-clear-btn"' +

            'onclick="clearPOSCart()"' +

            (
              posCart.length === 0

                ? " disabled"

                : ""
            ) +

          '>' +

            '🗑️ ' +
            t("clearCart") +

          '</button>' +


        '</div>' +

      '</div>' +


    '</div>';

}


// ============================================================
// POS - ADD TO CART
// ============================================================

function addToPOSCart(productId) {

  const product =
    posProducts.find(
      function(item) {

        return (
          String(item.id) ===
          String(productId)
        );

      }
    );


  if (!product) {

    return;

  }


  const existing =
    posCart.find(
      function(item) {

        return (
          String(item.id) ===
          String(product.id)
        );

      }
    );


  if (existing) {

    existing.qty += 1;

  } else {

    posCart.push({

      id:
        product.id,

      name:
        product.name ||
        product.product_name ||
        "Product",

      price:
        Number(
          product.price ??
          product.selling_price ??
          product.sale_price ??
          0
        ),

      qty:
        1

    });

  }


  renderPOS();

}


// ============================================================
// POS - CHANGE QUANTITY
// ============================================================

function changePOSQty(
  index,
  amount
) {

  if (
    !posCart[index]
  ) {

    return;

  }


  posCart[index].qty +=
    amount;


  if (
    posCart[index].qty <= 0
  ) {

    posCart.splice(
      index,
      1
    );

  }


  renderPOS();

}


// ============================================================
// POS - REMOVE ITEM
// ============================================================

function removePOSItem(index) {

  if (
    !posCart[index]
  ) {

    return;

  }


  posCart.splice(
    index,
    1
  );


  renderPOS();

}


// ============================================================
// POS - TOTAL
// ============================================================

function getPOSCartTotal() {

  return posCart.reduce(
    function(total, item) {

      return (
        total +
        (
          Number(item.price) *
          Number(item.qty)
        )
      );

    },
    0
  );

}


// ============================================================
// POS - PAYMENT METHOD
// ============================================================

function selectPOSPayment(method) {

  if (
    method !== "cash" &&
    method !== "card"
  ) {

    method = "cash";

  }


  selectedPaymentMethod =
    method;


  renderPOS();

}


// ============================================================
// POS - CLEAR CART
// ============================================================

function clearPOSCart() {

  posCart = [];

  selectedPaymentMethod =
    "cash";

  renderPOS();

}


// ============================================================
// POS - COMPLETE SALE
// ============================================================

async function completePOSSale() {

  if (
    posCart.length === 0
  ) {

    alert(
      t("cartEmpty")
    );

    return;

  }


  const total =
    getPOSCartTotal();


  if (
    total <= 0
  ) {

    alert(
      language === "si"
        ? "Sale total එක වැරදියි."
        : "Sale total is invalid."
    );

    return;

  }


  // ----------------------------------------------------------
  // DATABASE TRANSACTION WILL BE CONNECTED NEXT
  // ----------------------------------------------------------

  alert(
    t("saleNotConnected")
  );

}


// ============================================================
// PRODUCTS
// ============================================================

function productsPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  if (
    currentProfile?.role !==
    "owner"
  ) {

    show("pos");

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

          (
            language === "si"
              ? " selected"
              : ""
          ) +

          '>සිංහල</option>' +


          '<option value="en"' +

          (
            language === "en"
              ? " selected"
              : ""
          ) +

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
      await supabaseClient.auth
        .getSession();


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


    if (
      currentProfile.role ===
      "employee"
    ) {

      show("pos");

    } else {

      show("dashboard");

    }


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
    function(event, session) {

      console.log(
        "Auth event:",
        event
      );


      if (
        event ===
        "SIGNED_OUT"
      ) {

        currentUser = null;

        currentProfile = null;

        posCart = [];

        posProducts = [];

        showLogin();

        return;

      }


      if (
        event ===
        "SIGNED_IN" &&
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
    document.getElementById(
      "loginPassword"
    );


  if (!password) {

    return;

  }


  password.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        loginUser();

      }

    }
  );

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    console.log(
      "අඹ සිසිල Management System starting..."
    );


    const languageSelect =
      document.getElementById(
        "lang"
      );


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


// POS GLOBAL FUNCTIONS

window.addToPOSCart =
  addToPOSCart;

window.changePOSQty =
  changePOSQty;

window.removePOSItem =
  removePOSItem;

window.selectPOSPayment =
  selectPOSPayment;

window.clearPOSCart =
  clearPOSCart;

window.completePOSSale =
  completePOSSale;
