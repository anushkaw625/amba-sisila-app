// ============================================================
// අඹ සිසිල MANAGEMENT SYSTEM
// FULL SUPABASE VERSION
// Authentication + Roles + Products + Stock + Recipes
// POS + Expenses + Reports + Employees + Settings + Receipt
// ============================================================


// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://wazmcrsdzehterjkyeqt.supabase.co";

// IMPORTANT:
// මෙතන දැනට ඔයාගේ වැඩ කරන Publishable Key එකම දාන්න.
// Service Role / Secret Key දාන්න එපා.

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_pxnXrMQ7wDKH5bvizimAKw_ELu-HO-t";

const supabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


// ============================================================
// GLOBAL STATE
// ============================================================

let currentUser = null;
let currentProfile = null;
let currentPage = "dashboard";

let language =
  localStorage.getItem("amba_language") || "si";

let posProducts = [];
let posCart = [];
let selectedPaymentMethod = "cash";
let customerPaid = 0;

let editingProductId = null;
let editingIngredientId = null;
let editingExpenseId = null;

let lastCompletedSale = null;


// ============================================================
// TRANSLATIONS
// ============================================================

const dict = {

  si: {

    dashboard: "Dashboard",
    pos: "POS / Sales",
    products: "Products",
    stock: "Stock",
    expenses: "Expenses",
    reports: "Reports",
    employees: "Employees",
    settings: "Settings",
    logout: "Logout",

    welcome: "ආයුබෝවන්",
    totalSales: "මුළු විකුණුම්",
    todaySales: "අද විකුණුම්",
    totalOrders: "මුළු Orders",
    profit: "ලාභය",
    lowStock: "අඩු Stock",
    recentSales: "මෑත විකුණුම්",

    productsCount: "භාණ්ඩ ගණන",
    noData: "දත්ත නොමැත",

    username: "Username",
    password: "Password",
    login: "Login",
    forgotPassword: "Password අමතකද?",
    loginError: "Username හෝ Password වැරදියි.",

    productsTitle: "Products",
    stockTitle: "Stock / Ingredients",
    expensesTitle: "Expenses",
    reportsTitle: "Reports",
    employeesTitle: "Employees",
    settingsTitle: "Settings",

    addProduct: "Product එකක් Add කරන්න",
    editProduct: "Product Edit කරන්න",
    productNameSi: "Product Name (සිංහල)",
    productNameEn: "Product Name (English)",
    category: "Category",
    price: "Selling Price",
    active: "Active",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",

    addIngredient: "Ingredient එකක් Add කරන්න",
    editIngredient: "Ingredient Edit කරන්න",
    ingredientSi: "Ingredient Name (සිංහල)",
    ingredientEn: "Ingredient Name (English)",
    unit: "Unit",
    currentStock: "Current Stock",
    minimumStock: "Minimum Stock",
    costPerUnit: "Cost / Unit",

    recipes: "Recipes",
    recipe: "Recipe",
    addRecipe: "Recipe එකක් Add කරන්න",
    selectProduct: "Product එක තෝරන්න",
    selectIngredient: "Ingredient එක තෝරන්න",
    quantity: "Quantity",
    saveRecipe: "Recipe Save කරන්න",

    stockIn: "Stock Add කරන්න",
    stockQuantity: "Add Quantity",
    stockNote: "Note",

    currentSale: "වත්මන් බිල්පත",
    total: "මුළු එකතුව",
    paymentMethod: "ගෙවීමේ ක්‍රමය",
    cash: "මුදල්",
    card: "කාඩ්",
    customerGave: "Customer අපට දුන් මුදල",
    change: "ආපසු දිය යුතු මුදල",
    remaining: "තව ගෙවිය යුතු මුදල",
    completeSale: "බිල්පත අවසන් කරන්න",
    clearBill: "බිල්පත Clear කරන්න",
    productsEmpty: "Products නැහැ.",
    cartEmpty: "භාණ්ඩ එකතු කරලා නැහැ.",

    saving: "Save වෙමින්...",
    saleCompleted: "බිල්පත සාර්ථකව අවසන් කළා!",
    saleFailed: "බිල්පත අවසන් කරන්න බැරි වුණා.",
    paymentNotEnough: "Customer දුන් මුදල ප්‍රමාණවත් නැහැ.",
    loginAgain: "කරුණාකර නැවත Login වෙන්න.",
    cartEmptyError: "බිල්පත හිස්.",

    addExpense: "Expense එකක් Add කරන්න",
    expenseCategory: "Expense Category",
    description: "Description",
    amount: "Amount",
    expenseDate: "Date",

    salesReport: "Sales Report",
    expenseReport: "Expense Report",
    costOfGoods: "භාණ්ඩ පිරිවැය",
    netProfit: "ශුද්ධ ලාභය",
    fromDate: "From",
    toDate: "To",
    generateReport: "Report බලන්න",

    usernameCol: "Username",
    nameCol: "Name",
    role: "Role",
    languageCol: "Language",
    status: "Status",

    owner: "Owner",
    employee: "Employee",

    language: "භාෂාව",

    printReceipt: "Receipt Print කරන්න",
    close: "Close",
    receipt: "Receipt",
    date: "Date",
    payment: "Payment",
    subtotal: "Subtotal",
    customerPayment: "Customer Payment",
    receiptChange: "Change",

    yes: "Yes",
    no: "No",

    confirmDelete: "මෙය Delete කරන්නද?",
    saved: "සාර්ථකව Save කළා.",
    updated: "සාර්ථකව Update කළා.",
    deleted: "සාර්ථකව Delete කළා.",

    error: "දෝෂයක් ඇති වුණා.",
    loading: "Loading..."
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
    logout: "Logout",

    welcome: "Welcome",
    totalSales: "Total Sales",
    todaySales: "Today's Sales",
    totalOrders: "Total Orders",
    profit: "Profit",
    lowStock: "Low Stock",
    recentSales: "Recent Sales",

    productsCount: "Products",
    noData: "No data",

    username: "Username",
    password: "Password",
    login: "Login",
    forgotPassword: "Forgot password?",
    loginError: "Invalid username or password.",

    productsTitle: "Products",
    stockTitle: "Stock / Ingredients",
    expensesTitle: "Expenses",
    reportsTitle: "Reports",
    employeesTitle: "Employees",
    settingsTitle: "Settings",

    addProduct: "Add Product",
    editProduct: "Edit Product",
    productNameSi: "Product Name (Sinhala)",
    productNameEn: "Product Name (English)",
    category: "Category",
    price: "Selling Price",
    active: "Active",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",

    addIngredient: "Add Ingredient",
    editIngredient: "Edit Ingredient",
    ingredientSi: "Ingredient Name (Sinhala)",
    ingredientEn: "Ingredient Name (English)",
    unit: "Unit",
    currentStock: "Current Stock",
    minimumStock: "Minimum Stock",
    costPerUnit: "Cost / Unit",

    recipes: "Recipes",
    recipe: "Recipe",
    addRecipe: "Add Recipe",
    selectProduct: "Select Product",
    selectIngredient: "Select Ingredient",
    quantity: "Quantity",
    saveRecipe: "Save Recipe",

    stockIn: "Add Stock",
    stockQuantity: "Add Quantity",
    stockNote: "Note",

    currentSale: "Current Sale",
    total: "Total",
    paymentMethod: "Payment Method",
    cash: "Cash",
    card: "Card",
    customerGave: "Customer gave",
    change: "Change",
    remaining: "Remaining",
    completeSale: "Complete Sale",
    clearBill: "Clear Bill",
    productsEmpty: "No products.",
    cartEmpty: "No items added.",

    saving: "Saving...",
    saleCompleted: "Sale completed successfully!",
    saleFailed: "Sale could not be completed.",
    paymentNotEnough: "Customer payment is not enough.",
    loginAgain: "Please login again.",
    cartEmptyError: "Cart is empty.",

    addExpense: "Add Expense",
    expenseCategory: "Expense Category",
    description: "Description",
    amount: "Amount",
    expenseDate: "Date",

    salesReport: "Sales Report",
    expenseReport: "Expense Report",
    costOfGoods: "Cost of Goods",
    netProfit: "Net Profit",
    fromDate: "From",
    toDate: "To",
    generateReport: "Generate Report",

    usernameCol: "Username",
    nameCol: "Name",
    role: "Role",
    languageCol: "Language",
    status: "Status",

    owner: "Owner",
    employee: "Employee",

    language: "Language",

    printReceipt: "Print Receipt",
    close: "Close",
    receipt: "Receipt",
    date: "Date",
    payment: "Payment",
    subtotal: "Subtotal",
    customerPayment: "Customer Payment",
    receiptChange: "Change",

    yes: "Yes",
    no: "No",

    confirmDelete: "Delete this item?",
    saved: "Saved successfully.",
    updated: "Updated successfully.",
    deleted: "Deleted successfully.",

    error: "An error occurred.",
    loading: "Loading..."
  }

};


// ============================================================
// HELPERS
// ============================================================

function t(key) {

  return (
    dict[language] &&
    dict[language][key]
  ) || key;

}


function money(value) {

  return "Rs. " +
    Number(value || 0).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function formatDate(value) {

  if (!value) return "-";

  const d = new Date(value);

  return d.toLocaleString(
    "en-LK",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );

}


function todayISO() {

  const d = new Date();

  const year =
    d.getFullYear();

  const month =
    String(
      d.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      d.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function showLogin() {

  const login =
    document.getElementById(
      "loginScreen"
    );

  const app =
    document.getElementById(
      "mainApp"
    );

  if (login)
    login.classList.remove(
      "app-hidden"
    );

  if (app)
    app.classList.add(
      "app-hidden"
    );

}


function showApp() {

  const login =
    document.getElementById(
      "loginScreen"
    );

  const app =
    document.getElementById(
      "mainApp"
    );

  if (login)
    login.classList.add(
      "app-hidden"
    );

  if (app)
    app.classList.remove(
      "app-hidden"
    );

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

  const username =
    usernameInput
      ? usernameInput.value.trim()
      : "";

  const password =
    passwordInput
      ? passwordInput.value
      : "";

  if (!username || !password) {

    if (message) {

      message.textContent =
        language === "en"
          ? "Enter username and password."
          : "Username සහ Password ඇතුළත් කරන්න.";

    }

    return;
  }

  if (message) {

    message.textContent =
      language === "en"
        ? "Logging in..."
        : "Login වෙමින්...";

  }

  try {

    const {
      data: email,
      error: emailError
    } =
      await supabase.rpc(
        "get_login_email",
        {
          p_username:
            username
        }
      );

    if (emailError)
      throw emailError;

    if (!email)
      throw new Error(
        "Invalid username"
      );

    const {
      data,
      error
    } =
      await supabase.auth
        .signInWithPassword({

          email: email,
          password: password

        });

    if (error)
      throw error;

    currentUser =
      data.user;

    await loadProfile();

    showApp();

    applyRolePermissions();

    updateHeader();

    await show(
      currentProfile &&
      currentProfile.role === "employee"
        ? "pos"
        : "dashboard"
    );

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    if (message)
      message.textContent =
        t("loginError");

  }

}


// ============================================================
// PROFILE
// ============================================================

async function loadProfile() {

  if (!currentUser) {

    currentProfile = null;

    return;

  }

  const {
    data,
    error
  } =
    await supabase
      .from("profiles")
      .select(
        "id, username, full_name, role, language, active"
      )
      .eq(
        "id",
        currentUser.id
      )
      .maybeSingle();

  if (error)
    throw error;

  currentProfile =
    data;

  if (
    currentProfile &&
    currentProfile.active === false
  ) {

    await supabase.auth.signOut();

    throw new Error(
      "Account inactive"
    );

  }

  if (
    currentProfile &&
    (
      currentProfile.language === "si" ||
      currentProfile.language === "en"
    )
  ) {

    language =
      currentProfile.language;

    localStorage.setItem(
      "amba_language",
      language
    );

  }

}


// ============================================================
// LOGOUT
// ============================================================

async function logoutUser() {

  await supabase.auth.signOut();

  currentUser = null;

  currentProfile = null;

  posCart = [];

  customerPaid = 0;

  selectedPaymentMethod =
    "cash";

  showLogin();

}


// ============================================================
// ROLE PERMISSIONS
// ============================================================

function applyRolePermissions() {

  const ownerOnlyMenus = [

    "dashboardMenu",
    "productsMenu",
    "stockMenu",
    "expensesMenu",
    "reportsMenu",
    "employeesMenu",
    "settingsMenu"

  ];

  const isOwner =
    currentProfile &&
    currentProfile.role === "owner";

  ownerOnlyMenus.forEach(
    id => {

      const el =
        document.getElementById(
          id
        );

      if (!el)
        return;

      el.style.display =
        isOwner
          ? ""
          : "none";

    }
  );

}


// ============================================================
// HEADER
// ============================================================

function updateHeader() {

  const user =
    document.getElementById(
      "currentUser"
    );

  if (user) {

    user.textContent =
      currentProfile
        ? (
            currentProfile.full_name ||
            currentProfile.username
          )
        : "";

  }

  const lang =
    document.getElementById(
      "lang"
    );

  if (lang) {

    lang.textContent =
      language === "si"
        ? "සිං"
        : "EN";

  }

  const date =
    document.getElementById(
      "date"
    );

  if (date) {

    date.textContent =
      new Date().toLocaleDateString(
        "en-LK",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );

  }

}


// ============================================================
// LANGUAGE
// ============================================================

async function setLang(lang) {

  if (
    lang !== "

