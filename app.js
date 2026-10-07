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
    lang !== "si" &&
    lang !== "en"
  )
    return;

  language =
    lang;

  localStorage.setItem(
    "amba_language",
    language
  );

  if (currentUser) {

    await supabase
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

  await show(
    currentPage
  );

}


// ============================================================
// NAVIGATION
// ============================================================

async function show(page) {

  if (!currentProfile)
    return;

  if (
    currentProfile.role === "employee" &&
    page !== "pos"
  ) {

    page = "pos";

  }

  currentPage =
    page;

  const title =
    document.getElementById(
      "title"
    );

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

  if (title)
    title.textContent =
      titles[page] ||
      "අඹ සිසිල";

  document
    .querySelectorAll(
      ".nav-btn"
    )
    .forEach(
      btn =>
        btn.classList.remove(
          "active"
        )
    );

  const active =
    document.querySelector(
      `[data-page="${page}"]`
    );

  if (active)
    active.classList.add(
      "active"
    );

  if (page === "dashboard")
    return dashboard();

  if (page === "pos")
    return posPage();

  if (page === "products")
    return productsPage();

  if (page === "stock")
    return stockPage();

  if (page === "expenses")
    return expensesPage();

  if (page === "reports")
    return reportsPage();

  if (page === "employees")
    return employeesPage();

  if (page === "settings")
    return settingsPage();

}


// ============================================================
// DASHBOARD
// ============================================================

async function dashboard() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  app.innerHTML =
    `<div class="card">${t("loading")}</div>`;

  const {
    data: sales
  } =
    await supabase
      .from("sales")
      .select(
        "id,total,payment_method,created_at"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  const {
    count: productCount
  } =
    await supabase
      .from("products")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "active",
        true
      );

  const {
    data: ingredients
  } =
    await supabase
      .from("ingredients")
      .select(
        "id,name_si,name_en,current_stock,minimum_stock,unit"
      )
      .order(
        "name_si",
        {
          ascending: true
        }
      );

  const saleRows =
    sales || [];

  const totalSales =
    saleRows.reduce(
      (sum, row) =>
        sum +
        Number(row.total || 0),
      0
    );

  const startToday =
    new Date();

  startToday.setHours(
    0,
    0,
    0,
    0
  );

  const todaySales =
    saleRows
      .filter(
        row =>
          new Date(
            row.created_at
          ) >= startToday
      )
      .reduce(
        (sum, row) =>
          sum +
          Number(
            row.total || 0
          ),
        0
      );

  const lowStock =
    (ingredients || [])
      .filter(
        item =>
          Number(
            item.current_stock || 0
          ) <=
          Number(
            item.minimum_stock || 0
          )
      )
      .slice(
        0,
        5
      );

  app.innerHTML = `

    <div class="dashboard-grid">

      <div class="stat-card">
        <div class="stat-title">
          ${t("totalSales")}
        </div>
        <div class="stat-value">
          ${money(totalSales)}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-title">
          ${t("todaySales")}
        </div>
        <div class="stat-value">
          ${money(todaySales)}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-title">
          ${t("totalOrders")}
        </div>
        <div class="stat-value">
          ${saleRows.length}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-title">
          ${t("productsCount")}
        </div>
        <div class="stat-value">
          ${productCount || 0}
        </div>
      </div>

    </div>


    <div class="card">

      <h2>
        ${t("recentSales")}
      </h2>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>${t("date")}</th>
              <th>${t("payment")}</th>
              <th>${t("total")}</th>
            </tr>

          </thead>

          <tbody>

            ${
              saleRows.length === 0

                ? `
                  <tr>
                    <td colspan="3">
                      ${t("noData")}
                    </td>
                  </tr>
                `

                :

                saleRows
                  .slice(
                    0,
                    10
                  )
                  .map(
                    sale => `

                      <tr>

                        <td>
                          ${formatDate(
                            sale.created_at
                          )}
                        </td>

                        <td>
                          ${escapeHTML(
                            sale.payment_method
                          )}
                        </td>

                        <td>
                          ${money(
                            sale.total
                          )}
                        </td>

                      </tr>

                    `
                  )
                  .join("")
            }

          </tbody>

        </table>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("lowStock")}
      </h2>

      ${
        lowStock.length === 0

          ? `<p>${t("noData")}</p>`

          :

          `
            <div class="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Stock</th>
                    <th>Minimum</th>
                  </tr>
                </thead>

                <tbody>

                  ${
                    lowStock
                      .map(
                        item => `

                          <tr>

                            <td>
                              ${escapeHTML(
                                language === "en"
                                  ? (
                                      item.name_en ||
                                      item.name_si
                                    )
                                  : (
                                      item.name_si ||
                                      item.name_en
                                    )
                              )}
                            </td>

                            <td>
                              ${Number(
                                item.current_stock || 0
                              )}
                              ${escapeHTML(
                                item.unit || ""
                              )}
                            </td>

                            <td>
                              ${Number(
                                item.minimum_stock || 0
                              )}
                            </td>

                          </tr>

                        `
                      )
                      .join("")
                  }

                </tbody>

              </table>

            </div>
          `
      }

    </div>

  `;

}


// ============================================================
// POS
// ============================================================

async function loadPOSProducts() {

  const {
    data,
    error
  } =
    await supabase
      .from("products")
      .select(
        "id,name_si,name_en,selling_price,active"
      )
      .eq(
        "active",
        true
      )
      .order(
        "name_si",
        {
          ascending: true
        }
      );

  if (error) {

    console.error(
      error
    );

    posProducts = [];

    return;

  }

  posProducts =
    data || [];

}


async function posPage() {

  await loadPOSProducts();

  renderPOS();

}


function renderPOS() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  const productHTML =
    posProducts.length === 0

      ? `
        <div class="empty-state">
          ${t("productsEmpty")}
        </div>
      `

      :

      posProducts
        .map(
          product => {

            const name =
              language === "en"
                ? (
                    product.name_en ||
                    product.name_si
                  )
                : (
                    product.name_si ||
                    product.name_en
                  );

            return `

              <button
                class="pos-product"
                onclick="addToPOSCart('${product.id}')"
              >

                <div class="pos-product-name">
                  ${escapeHTML(name)}
                </div>

                <div class="pos-product-price">
                  ${money(
                    product.selling_price
                  )}
                </div>

              </button>

            `;

          }
        )
        .join("");


  const cartHTML =
    posCart.length === 0

      ? `
        <div class="empty-state">
          ${t("cartEmpty")}
        </div>
      `

      :

      posCart
        .map(
          (item, index) => {

            const name =
              language === "en"
                ? (
                    item.name_en ||
                    item.name_si
                  )
                : (
                    item.name_si ||
                    item.name_en
                  );

            const subtotal =
              Number(
                item.selling_price
              ) *
              Number(
                item.quantity
              );

            return `

              <div class="pos-cart-item">

                <div class="pos-cart-info">

                  <strong>
                    ${escapeHTML(name)}
                  </strong>

                  <small>
                    ${money(
                      item.selling_price
                    )}
                    ×
                    ${item.quantity}
                  </small>

                </div>


                <div class="pos-cart-controls">

                  <button
                    onclick="changePOSQty(${index},-1)"
                  >
                    −
                  </button>

                  <strong>
                    ${item.quantity}
                  </strong>

                  <button
                    onclick="changePOSQty(${index},1)"
                  >
                    +
                  </button>

                  <button
                    class="pos-remove"
                    onclick="removePOSItem(${index})"
                  >
                    ×
                  </button>

                </div>


                <strong>
                  ${money(subtotal)}
                </strong>

              </div>

            `;

          }
        )
        .join("");


  const total =
    getPOSCartTotal();

  const paid =
    Number(
      customerPaid
    ) || 0;

  const change =
    paid >= total
      ? paid - total
      : 0;

  const remaining =
    paid < total
      ? total - paid
      : 0;


  let cashHTML = "";

  if (
    selectedPaymentMethod === "cash"
  ) {

    cashHTML = `

      <div style="margin-top:15px;">

        <div class="payment-title">
          ${t("customerGave")}
        </div>

        <input
          id="customerPaidInput"
          type="number"
          min="0"
          step="0.01"
          value="${customerPaid || ""}"
          placeholder="0.00"
          oninput="updateCustomerPaid(this.value)"
          style="
            width:100%;
            box-sizing:border-box;
            padding:12px;
            border:1px solid #ccd6d0;
            border-radius:8px;
            font-size:18px;
          "
        />

        ${
          paid >= total && total > 0

            ? `
              <div
                style="
                  margin-top:10px;
                  padding:10px;
                  background:#e9f5ed;
                  border-radius:8px;
                  color:#176542;
                "
              >

                <strong>
                  ${t("change")}:
                  ${money(change)}
                </strong>

              </div>
            `

            : ""
        }


        ${
          paid < total && paid > 0

            ? `
              <div
                style="
                  margin-top:10px;
                  padding:10px;
                  background:#fff3cd;
                  border-radius:8px;
                  color:#7a5b00;
                "
              >

                <strong>
                  ${t("remaining")}:
                  ${money(remaining)}
                </strong>

              </div>
            `

            : ""
        }

      </div>

    `;

  }


  app.innerHTML = `

    <div class="pos-layout">

      <div class="card">

        <div class="pos-panel-header">

          <h2>
            ${t("products")}
          </h2>

        </div>

        <div class="pos-product-grid">

          ${productHTML}

        </div>

      </div>


      <div class="card">

        <div class="pos-panel-header">

          <h2>
            ${t("currentSale")}
          </h2>

        </div>


        <div class="pos-cart-list">

          ${cartHTML}

        </div>


        <div class="pos-summary">

          <div class="pos-total-row">

            <strong>
              ${t("total")}
            </strong>

            <strong>
              ${money(total)}
            </strong>

          </div>


          <div class="payment-title">
            ${t("paymentMethod")}
          </div>


          <div class="payment-buttons">

            <button
              class="${
                selectedPaymentMethod === "cash"
                  ? "payment-active"
                  : ""
              }"
              onclick="selectPOSPayment('cash')"
            >
              ${t("cash")}
            </button>


            <button
              class="${
                selectedPaymentMethod === "card"
                  ? "payment-active"
                  : ""
              }"
              onclick="selectPOSPayment('card')"
            >
              ${t("card")}
            </button>

          </div>


          ${cashHTML}


          <button
            class="primary-btn pos-complete-btn"
            onclick="completePOSSale()"
            ${
              posCart.length === 0 ||
              (
                selectedPaymentMethod === "cash" &&
                paid < total
              )
                ? "disabled"
                : ""
            }
          >
            ${t("completeSale")}
          </button>


          <button
            class="secondary-btn pos-clear-btn"
            onclick="clearPOSCart()"
            ${
              posCart.length === 0
                ? "disabled"
                : ""
            }
          >
            ${t("clearBill")}
          </button>

        </div>

      </div>

    </div>

  `;

}


function addToPOSCart(
  productId
) {

  const product =
    posProducts.find(
      p =>
        p.id === productId
    );

  if (!product)
    return;

  const existing =
    posCart.find(
      item =>
        item.product_id ===
        productId
    );

  if (existing) {

    existing.quantity += 1;

  } else {

    posCart.push({

      product_id:
        product.id,

      name_si:
        product.name_si,

      name_en:
        product.name_en,

      selling_price:
        Number(
          product.selling_price
        ),

      quantity: 1

    });

  }

  renderPOS();

}


function changePOSQty(
  index,
  amount
) {

  if (!posCart[index])
    return;

  posCart[index].quantity +=
    amount;

  if (
    posCart[index].quantity <= 0
  ) {

    posCart.splice(
      index,
      1
    );

  }

  renderPOS();

}


function removePOSItem(
  index
) {

  if (!posCart[index])
    return;

  posCart.splice(
    index,
    1
  );

  renderPOS();

}


function getPOSCartTotal() {

  return posCart.reduce(
    (
      total,
      item
    ) =>
      total +
      (
        Number(
          item.selling_price
        ) *
        Number(
          item.quantity
        )
      ),
    0
  );

}


function selectPOSPayment(
  method
) {

  selectedPaymentMethod =
    method;

  if (method === "card")
    customerPaid = 0;

  renderPOS();

}


function updateCustomerPaid(
  value
) {

  customerPaid =
    Number(value) || 0;

  renderPOS();

}


function clearPOSCart() {

  posCart = [];

  customerPaid = 0;

  selectedPaymentMethod =
    "cash";

  renderPOS();

}


// ============================================================
// COMPLETE POS SALE
// ============================================================

async function completePOSSale() {

  if (posCart.length === 0) {

    alert(
      t("cartEmptyError")
    );

    return;

  }

  const total =
    getPOSCartTotal();

  const paid =
    Number(
      customerPaid
    ) || 0;

  if (
    selectedPaymentMethod === "cash" &&
    paid < total
  ) {

    alert(
      t("paymentNotEnough")
    );

    return;

  }

  if (!currentUser) {

    alert(
      t("loginAgain")
    );

    return;

  }

  const buttons =
    document.querySelectorAll(
      ".pos-complete-btn"
    );

  buttons.forEach(
    button => {

      button.disabled =
        true;

      button.textContent =
        t("saving");

    }
  );

  try {

    const saleItems =
      posCart.map(
        item => ({

          product_id:
            item.product_id,

          quantity:
            Number(
              item.quantity
            )

        })
      );

    const {
      data: saleId,
      error
    } =
      await supabase.rpc(
        "complete_pos_sale",
        {

          p_items:
            saleItems,

          p_payment_method:
            selectedPaymentMethod,

          p_employee_id:
            currentUser.id

        }
      );

    if (error)
      throw error;


    // Get receipt information
    const {
      data: sale
    } =
      await supabase
        .from("sales")
        .select(
          "id,receipt_number,employee_id,subtotal,discount,total,payment_method,created_at"
        )
        .eq(
          "id",
          saleId
        )
        .maybeSingle();


    lastCompletedSale = {

      sale:
        sale,

      items:
        [...posCart],

      customerPaid:
        selectedPaymentMethod === "cash"
          ? paid
          : total,

      change:
        selectedPaymentMethod === "cash"
          ? paid - total
          : 0

    };


    alert(
      t("saleCompleted")
    );


    posCart = [];

    customerPaid = 0;

    selectedPaymentMethod =
      "cash";


    renderPOS();


    // Receipt automatically opens after sale
    setTimeout(
      () => {

        if (lastCompletedSale)
          printReceipt(
            lastCompletedSale
          );

      },
      300
    );


  } catch (error) {

    console.error(
      "SALE ERROR:",
      error
    );

    alert(
      t("saleFailed") +
      "\n\n" +
      (
        error.message ||
        ""
      )
    );

    renderPOS();

  }

}


// ============================================================
// PRODUCTS PAGE
// ============================================================

async function productsPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  app.innerHTML =
    `<div class="card">${t("loading")}</div>`;


  const {
    data: products,
    error
  } =
    await supabase
      .from("products")
      .select(
        `
          id,
          name_si,
          name_en,
          category_id,
          selling_price,
          active,
          created_at
        `
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  const {
    data: categories
  } =
    await supabase
      .from("categories")
      .select(
        "id,name_si,name_en"
      )
      .order(
        "name_si"
      );


  if (error) {

    console.error(
      error
    );

    app.innerHTML =
      `<div class="card">${t("error")}</div>`;

    return;

  }


  const categoryOptions =
    (categories || [])
      .map(
        category => `

          <option value="${category.id}">
            ${
              escapeHTML(
                language === "en"
                  ? (
                      category.name_en ||
                      category.name_si
                    )
                  : (
                      category.name_si ||
                      category.name_en
                    )
              )
            }
          </option>

        `
      )
      .join("");


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("addProduct")}
      </h2>


      <form
        onsubmit="saveProduct(event)"
        style="
          display:grid;
          gap:10px;
          margin-bottom:20px;
        "
      >

        <input
          type="hidden"
          id="productId"
        />


        <input
          id="productNameSi"
          required
          placeholder="${t("productNameSi")}"
          style="padding:11px;"
        />


        <input
          id="productNameEn"
          placeholder="${t("productNameEn")}"
          style="padding:11px;"
        />


        <select
          id="productCategory"
          style="padding:11px;"
        >

          <option value="">
            ${t("category")}
          </option>

          ${categoryOptions}

        </select>


        <input
          id="productPrice"
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="${t("price")}"
          style="padding:11px;"
        />


        <label>

          <input
            id="productActive"
            type="checkbox"
            checked
          />

          ${t("active")}

        </label>


        <div>

          <button
            class="primary-btn"
            type="submit"
          >
            ${t("save")}
          </button>

          <button
            class="secondary-btn"
            type="button"
            onclick="resetProductForm()"
          >
            ${t("cancel")}
          </button>

        </div>

      </form>

    </div>


    <div class="card">

      <h2>
        ${t("productsTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Active</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            ${
              (products || [])
                .map(
                  product => {

                    const category =
                      (categories || [])
                        .find(
                          c =>
                            c.id ===
                            product.category_id
                        );

                    const name =
                      language === "en"
                        ? (
                            product.name_en ||
                            product.name_si
                          )
                        : (
                            product.name_si ||
                            product.name_en
                          );

                    return `

                      <tr>

                        <td>
                          ${escapeHTML(name)}
                        </td>

                        <td>
                          ${
                            category
                              ? escapeHTML(
                                  language === "en"
                                    ? (
                                        category.name_en ||
                                        category.name_si
                                      )
                                    : (
                                        category.name_si ||
                                        category.name_en
                                      )
                                )
                              : "-"
                          }
                        </td>

                        <td>
                          ${money(
                            product.selling_price
                          )}
                        </td>

                        <td>
                          ${
                            product.active
                              ? t("yes")
                              : t("no")
                          }
                        </td>

                        <td>

                          <button
                            class="secondary-btn"
                            onclick="editProduct('${product.id}')"
                          >
                            ${t("edit")}
                          </button>

                          <button
                            class="secondary-btn"
                            onclick="toggleProduct('${product.id}',${product.active ? "false" : "true"})"
                          >
                            ${
                              product.active
                                ? "Disable"
                                : "Enable"
                            }
                          </button>

                        </td>

                      </tr>

                    `;

                  }
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("category")}
      </h2>

      <form
        onsubmit="saveCategory(event)"
        style="
          display:grid;
          gap:10px;
        "
      >

        <input
          id="categoryNameSi"
          required
          placeholder="Category Sinhala"
          style="padding:11px;"
        />

        <input
          id="categoryNameEn"
          placeholder="Category English"
          style="padding:11px;"
        />

        <button
          class="primary-btn"
          type="submit"
        >
          ${t("save")}
        </button>

      </form>

    </div>

  `;

}


// ============================================================
// PRODUCT FUNCTIONS
// ============================================================

async function saveProduct(event) {

  event.preventDefault();

  const id =
    document.getElementById(
      "productId"
    ).value;

  const payload = {

    name_si:
      document.getElementById(
        "productNameSi"
      ).value.trim(),

    name_en:
      document.getElementById(
        "productNameEn"
      ).value.trim(),

    category_id:
      document.getElementById(
        "productCategory"
      ).value || null,

    selling_price:
      Number(
        document.getElementById(
          "productPrice"
        ).value
      ),

    active:
      document.getElementById(
        "productActive"
      ).checked

  };


  try {

    if (id) {

      const {
        error
      } =
        await supabase
          .from("products")
          .update(
            payload
          )
          .eq(
            "id",
            id
          );

      if (error)
        throw error;

      alert(
        t("updated")
      );

    } else {

      const {
        error
      } =
        await supabase
          .from("products")
          .insert(
            payload
          );

      if (error)
        throw error;

      alert(
        t("saved")
      );

    }

    await productsPage();

  } catch (error) {

    console.error(
      error
    );

    alert(
      error.message ||
      t("error")
    );

  }

}


async function editProduct(
  id
) {

  const {
    data,
    error
  } =
    await supabase
      .from("products")
      .select("*")
      .eq(
        "id",
        id
      )
      .single();

  if (error) {

    alert(
      error.message
    );

    return;

  }

  const idInput =
    document.getElementById(
      "productId"
    );

  if (!idInput)
    return;

  idInput.value =
    data.id;

  document.getElementById(
    "productNameSi"
  ).value =
    data.name_si || "";

  document.getElementById(
    "productNameEn"
  ).value =
    data.name_en || "";

  document.getElementById(
    "productCategory"
  ).value =
    data.category_id || "";

  document.getElementById(
    "productPrice"
  ).value =
    data.selling_price || 0;

  document.getElementById(
    "productActive"
  ).checked =
    data.active !== false;

  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );

}


async function toggleProduct(
  id,
  active
) {

  const {
    error
  } =
    await supabase
      .from("products")
      .update({
        active:
          active
      })
      .eq(
        "id",
        id
      );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  await productsPage();

}


function resetProductForm() {

  const form =
    document.querySelector(
      "form"
    );

  if (form)
    form.reset();

  const id =
    document.getElementById(
      "productId"
    );

  if (id)
    id.value = "";

}


async function saveCategory(
  event
) {

  event.preventDefault();

  const nameSi =
    document.getElementById(
      "categoryNameSi"
    ).value.trim();

  const nameEn =
    document.getElementById(
      "categoryNameEn"
    ).value.trim();

  if (!nameSi && !nameEn)
    return;

  const {
    error
  } =
    await supabase
      .from("categories")
      .insert({

        name_si:
          nameSi,

        name_en:
          nameEn

      });

  if (error) {

    alert(
      error.message
    );

    return;

  }

  alert(
    t("saved")
  );

  await productsPage();

}


// ============================================================
// STOCK / INGREDIENTS PAGE
// ============================================================

async function stockPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  const {
    data: ingredients
  } =
    await supabase
      .from("ingredients")
      .select("*")
      .order(
        "name_si",
        {
          ascending: true
        }
      );


  const {
    data: products
  } =
    await supabase
      .from("products")
      .select(
        "id,name_si,name_en"
      )
      .order(
        "name_si"
      );


  const {
    data: recipes
  } =
    await supabase
      .from("recipes")
      .select(
        "*"
      );


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("addIngredient")}
      </h2>


      <form
        onsubmit="saveIngredient(event)"
        style="
          display:grid;
          gap:10px;
        "
      >

        <input
          type="hidden"
          id="ingredientId"
        />

        <input
          id="ingredientNameSi"
          required
          placeholder="${t("ingredientSi")}"
          style="padding:11px;"
        />

        <input
          id="ingredientNameEn"
          placeholder="${t("ingredientEn")}"
          style="padding:11px;"
        />


        <select
          id="ingredientUnit"
          style="padding:11px;"
        >

          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
          <option value="pcs">pcs</option>

        </select>


        <input
          id="ingredientStock"
          type="number"
          min="0"
          step="0.001"
          placeholder="${t("currentStock")}"
          style="padding:11px;"
        />


        <input
          id="ingredientMinimum"
          type="number"
          min="0"
          step="0.001"
          placeholder="${t("minimumStock")}"
          style="padding:11px;"
        />


        <input
          id="ingredientCost"
          type="number"
          min="0"
          step="0.0001"
          placeholder="${t("costPerUnit")}"
          style="padding:11px;"
        />


        <div>

          <button
            class="primary-btn"
            type="submit"
          >
            ${t("save")}
          </button>

          <button
            class="secondary-btn"
            type="button"
            onclick="resetIngredientForm()"
          >
            ${t("cancel")}
          </button>

        </div>

      </form>

    </div>


    <div class="card">

      <h2>
        ${t("stockIn")}
      </h2>


      <form
        onsubmit="addStock(event)"
        style="
          display:grid;
          gap:10px;
        "
      >

        <select
          id="stockIngredient"
          required
          style="padding:11px;"
        >

          <option value="">
            ${t("selectIngredient")}
          </option>

          ${
            (ingredients || [])
              .map(
                item => `

                  <option value="${item.id}">

                    ${
                      escapeHTML(
                        language === "en"
                          ? (
                              item.name_en ||
                              item.name_si
                            )
                          : (
                              item.name_si ||
                              item.name_en
                            )
                      )
                    }

                  </option>

                `
              )
              .join("")
          }

        </select>


        <input
          id="stockAddQuantity"
          required
          type="number"
          min="0.001"
          step="0.001"
          placeholder="${t("stockQuantity")}"
          style="padding:11px;"
        />


        <input
          id="stockNote"
          placeholder="${t("stockNote")}"
          style="padding:11px;"
        />


        <button
          class="primary-btn"
          type="submit"
        >
          ${t("stockIn")}
        </button>

      </form>

    </div>


    <div class="card">

      <h2>
        ${t("stockTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Ingredient</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Minimum</th>
              <th>Cost</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            ${
              (ingredients || [])
                .map(
                  item => `

                    <tr>

                      <td>

                        ${
                          escapeHTML(
                            language === "en"
                              ? (
                                  item.name_en ||
                                  item.name_si
                                )
                              : (
                                  item.name_si ||
                                  item.name_en
                                )
                          )
                        }

                      </td>

                      <td>
                        ${escapeHTML(
                          item.unit || ""
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.current_stock || 0
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.minimum_stock || 0
                        )}
                      </td>

                      <td>
                        ${money(
                          item.cost_per_unit
                        )}
                      </td>

                      <td>

                        <button
                          class="secondary-btn"
                          onclick="editIngredient('${item.id}')"
                        >
                          ${t("edit")}
                        </button>

                      </td>

                    </tr>

                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("recipes")}
      </h2>


      <form
        onsubmit="saveRecipe(event)"
        style="
          display:grid;
          gap:10px;
        "
      >

        <select
          id="recipeProduct"
          required
          style="padding:11px;"
        >

          <option value="">
            ${t("selectProduct")}
          </option>

          ${
            (products || [])
              .map(
                p => `

                  <option value="${p.id}">

                    ${
                      escapeHTML(
                        language === "en"
                          ? (
                              p.name_en ||
                              p.name_si
                            )
                          : (
                              p.name_si ||
                              p.name_en
                            )
                      )
                    }

                  </option>

                `
              )
              .join("")
          }

        </select>


        <select
          id="recipeIngredient"
          required
          style="padding:11px;"
        >

          <option value="">
            ${t("selectIngredient")}
          </option>

          ${
            (ingredients || [])
              .map(
                item => `

                  <option value="${item.id}">

                    ${
                      escapeHTML(
                        language === "en"
                          ? (
                              item.name_en ||
                              item.name_si
                            )
                          : (
                              item.name_si ||
                              item.name_en
                            )
                      )
                    }

                  </option>

                `
              )
              .join("")
          }

        </select>


        <input
          id="recipeQuantity"
          required
          type="number"
          min="0.0001"
          step="0.0001"
          placeholder="${t("quantity")}"
          style="padding:11px;"
        />


        <button
          class="primary-btn"
          type="submit"
        >
          ${t("saveRecipe")}
        </button>

      </form>


      <div
        class="table-wrap"
        style="margin-top:20px;"
      >

        <table>

          <thead>

            <tr>

              <th>Product</th>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            ${
              (recipes || [])
                .map(
                  recipe => {

                    const product =
                      (products || [])
                        .find(
                          p =>
                            p.id ===
                            recipe.product_id
                        );

                    const ingredient =
                      (ingredients || [])
                        .find(
                          i =>
                            i.id ===
                            recipe.ingredient_id
                        );

                    return `

                      <tr>

                        <td>
                          ${
                            product
                              ? escapeHTML(
                                  language === "en"
                                    ? (
                                        product.name_en ||
                                        product.name_si
                                      )
                                    : (
                                        product.name_si ||
                                        product.name_en
                                      )
                                )
                              : "-"
                          }
                        </td>

                        <td>
                          ${
                            ingredient
                              ? escapeHTML(
                                  language === "en"
                                    ? (
                                        ingredient.name_en ||
                                        ingredient.name_si
                                      )
                                    : (
                                        ingredient.name_si ||
                                        ingredient.name_en
                                      )
                                )
                              : "-"
                          }
                        </td>

                        <td>
                          ${Number(
                            recipe.quantity
                          )}
                        </td>

                        <td>

                          <button
                            class="secondary-btn"
                            onclick="deleteRecipe('${recipe.id}')"
                          >
                            ${t("delete")}
                          </button>

                        </td>

                      </tr>

                    `;

                  }
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;

}


// ============================================================
// INGREDIENT FUNCTIONS
// ============================================================

async function saveIngredient(
  event
) {

  event.preventDefault();

  const id =
    document.getElementById(
      "ingredientId"
    ).value;

  const payload = {

    name_si:
      document.getElementById(
        "ingredientNameSi"
      ).value.trim(),

    name_en:
      document.getElementById(
        "ingredientNameEn"
      ).value.trim(),

    unit:
      document.getElementById(
        "ingredientUnit"
      ).value,

    current_stock:
      Number(
        document.getElementById(
          "ingredientStock"
        ).value
      ) || 0,

    minimum_stock:
      Number(
        document.getElementById(
          "ingredientMinimum"
        ).value
      ) || 0,

    cost_per_unit:
      Number(
        document.getElementById(
          "ingredientCost"
        ).value
      ) || 0

  };


  try {

    if (id) {

      const {
        error
      } =
        await supabase
          .from("ingredients")
          .update(
            payload
          )
          .eq(
            "id",
            id
          );

      if (error)
        throw error;

      alert(
        t("updated")
      );

    } else {

      const {
        error
      } =
        await supabase
          .from("ingredients")
          .insert(
            payload
          );

      if (error)
        throw error;

      alert(
        t("saved")
      );

    }

    await stockPage();

  } catch (error) {

    console.error(
      error
    );

    alert(
      error.message ||
      t("error")
    );

  }

}


async function editIngredient(
  id
) {

  const {
    data,
    error
  } =
    await supabase
      .from("ingredients")
      .select("*")
      .eq(
        "id",
        id
      )
      .single();

  if (error) {

    alert(
      error.message
    );

    return;

  }

  document.getElementById(
    "ingredientId"
  ).value =
    data.id;

  document.getElementById(
    "ingredientNameSi"
  ).value =
    data.name_si || "";

  document.getElementById(
    "ingredientNameEn"
  ).value =
    data.name_en || "";

  document.getElementById(
    "ingredientUnit"
  ).value =
    data.unit || "g";

  document.getElementById(
    "ingredientStock"
  ).value =
    data.current_stock || 0;

  document.getElementById(
    "ingredientMinimum"
  ).value =
    data.minimum_stock || 0;

  document.getElementById(
    "ingredientCost"
  ).value =
    data.cost_per_unit || 0;

  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );

}


function resetIngredientForm() {

  document
    .getElementById(
      "ingredientId"
    ).value = "";

  document
    .getElementById(
      "ingredientNameSi"
    ).value = "";

  document
    .getElementById(
      "ingredientNameEn"
    ).value = "";

  document
    .getElementById(
      "ingredientStock"
    ).value = "";

  document
    .getElementById(
      "ingredientMinimum"
    ).value = "";

  document
    .getElementById(
      "ingredientCost"
    ).value = "";

}


async function addStock(
  event
) {

  event.preventDefault();

  const ingredientId =
    document.getElementById(
      "stockIngredient"
    ).value;

  const quantity =
    Number(
      document.getElementById(
        "stockAddQuantity"
      ).value
    );

  const note =
    document.getElementById(
      "stockNote"
    ).value.trim();

  if (
    !ingredientId ||
    quantity <= 0
  )
    return;

  const {
    data: ingredient,
    error: findError
  } =
    await supabase
      .from("ingredients")
      .select(
        "current_stock,cost_per_unit"
      )
      .eq(
        "id",
        ingredientId
      )
      .single();

  if (findError) {

    alert(
      findError.message
    );

    return;

  }

  const {
    error: updateError
  } =
    await supabase
      .from("ingredients")
      .update({

        current_stock:
          Number(
            ingredient.current_stock || 0
          ) + quantity,

        updated_at:
          new Date().toISOString()

      })
      .eq(
        "id",
        ingredientId
      );

  if (updateError) {

    alert(
      updateError.message
    );

    return;

  }

  const {
    error: movementError
  } =
    await supabase
      .from("stock_movements")
      .insert({

        ingredient_id:
          ingredientId,

        movement_type:
          "purchase",

        quantity:
          quantity,

        unit_cost:
          Number(
            ingredient.cost_per_unit || 0
          ),

        note:
          note || "Stock In",

        created_by:
          currentUser
            ? currentUser.id
            : null

      });

  if (movementError) {

    console.error(
      movementError
    );

  }

  alert(
    t("saved")
  );

  await stockPage();

}


async function saveRecipe(
  event
) {

  event.preventDefault();

  const productId =
    document.getElementById(
      "recipeProduct"
    ).value;

  const ingredientId =
    document.getElementById(
      "recipeIngredient"
    ).value;

  const quantity =
    Number(
      document.getElementById(
        "recipeQuantity"
      ).value
    );

  if (
    !productId ||
    !ingredientId ||
    quantity <= 0
  )
    return;

  const {
    error
  } =
    await supabase
      .from("recipes")
      .upsert(
        {

          product_id:
            productId,

          ingredient_id:
            ingredientId,

          quantity:
            quantity

        },
        {
          onConflict:
            "product_id,ingredient_id"
        }
      );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  alert(
    t("saved")
  );

  await stockPage();

}


async function deleteRecipe(
  id
) {

  if (
    !confirm(
      t("confirmDelete")
    )
  )
    return;

  const {
    error
  } =
    await supabase
      .from("recipes")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  await stockPage();

}


// ============================================================
// EXPENSES
// ============================================================

async function expensesPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  const {
    data: expenses
  } =
    await supabase
      .from("expenses")
      .select("*")
      .order(
        "expense_date",
        {
          ascending: false
        }
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("addExpense")}
      </h2>


      <form
        onsubmit="saveExpense(event)"
        style="
          display:grid;
          gap:10px;
        "
      >

        <input
          id="expenseCategory"
          placeholder="${t("expenseCategory")}"
          style="padding:11px;"
        />


        <input
          id="expenseDescription"
          required
          placeholder="${t("description")}"
          style="padding:11px;"
        />


        <input
          id="expenseAmount"
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="${t("amount")}"
          style="padding:11px;"
        />


        <select
          id="expensePayment"
          style="padding:11px;"
        >

          <option value="cash">
            ${t("cash")}
          </option>

          <option value="card">
            ${t("card")}
          </option>

        </select>


        <input
          id="expenseDate"
          type="date"
          value="${todayISO()}"
          style="padding:11px;"
        />


        <button
          class="primary-btn"
          type="submit"
        >
          ${t("save")}
        </button>

      </form>

    </div>


    <div class="card">

      <h2>
        ${t("expensesTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>${t("date")}</th>
              <th>${t("expenseCategory")}</th>
              <th>${t("description")}</th>
              <th>${t("amount")}</th>
              <th>${t("payment")}</th>
              <th>${t("delete")}</th>

            </tr>

          </thead>


          <tbody>

            ${
              (expenses || [])
                .map(
                  expense => `

                    <tr>

                      <td>
                        ${escapeHTML(
                          expense.expense_date ||
                          expense.created_at
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          expense.category ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          expense.description ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${money(
                          expense.amount
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          expense.payment_method ||
                          "-"
                        )}
                      </td>

                      <td>

                        <button
                          class="secondary-btn"
                          onclick="deleteExpense('${expense.id}')"
                        >
                          ${t("delete")}
                        </button>

                      </td>

                    </tr>

                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;

}


async function saveExpense(
  event
) {

  event.preventDefault();

  const payload = {

    category:
      document.getElementById(
        "expenseCategory"
      ).value.trim(),

    description:
      document.getElementById(
        "expenseDescription"
      ).value.trim(),

    amount:
      Number(
        document.getElementById(
          "expenseAmount"
        ).value
      ),

    payment_method:
      document.getElementById(
        "expensePayment"
      ).value,

    expense_date:
      document.getElementById(
        "expenseDate"
      ).value,

    created_by:
      currentUser
        ? currentUser.id
        : null

  };


  const {
    error
  } =
    await supabase
      .from("expenses")
      .insert(
        payload
      );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  alert(
    t("saved")
  );

  await expensesPage();

}


async function deleteExpense(
  id
) {

  if (
    !confirm(
      t("confirmDelete")
    )
  )
    return;

  const {
    error
  } =
    await supabase
      .from("expenses")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    alert(
      error.message
    );

    return;

  }

  await expensesPage();

}


// ============================================================
// REPORTS
// ============================================================

async function reportsPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  const today =
    todayISO();

  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("reportsTitle")}
      </h2>


      <div
        style="
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(150px,1fr));
          gap:10px;
        "
      >

        <div>

          <label>
            ${t("fromDate")}
          </label>

          <input
            id="reportFrom"
            type="date"
            value="${today}"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px;
            "
          />

        </div>


        <div>

          <label>
            ${t("toDate")}
          </label>

          <input
            id="reportTo"
            type="date"
            value="${today}"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px;
            "
          />

        </div>

      </div>


      <button
        class="primary-btn"
        onclick="generateReport()"
        style="margin-top:12px;"
      >
        ${t("generateReport")}
      </button>


      <div
        id="reportResult"
        style="margin-top:20px;"
      ></div>

    </div>

  `;

  await generateReport();

}


async function generateReport() {

  const result =
    document.getElementById(
      "reportResult"
    );

  if (!result)
    return;

  const from =
    document.getElementById(
      "reportFrom"
    ).value;

  const to =
    document.getElementById(
      "reportTo"
    ).value;


  const start =
    new Date(
      `${from}T00:00:00`
    );

  const end =
    new Date(
      `${to}T23:59:59.999`
    );


  const {
    data: sales
  } =
    await supabase
      .from("sales")
      .select(
        "id,total,payment_method,created_at"
      )
      .gte(
        "created_at",
        start.toISOString()
      )
      .lte(
        "created_at",
        end.toISOString()
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  const {
    data: expenses
  } =
    await supabase
      .from("expenses")
      .select(
        "id,amount,description,expense_date,created_at"
      )
      .gte(
        "expense_date",
        from
      )
      .lte(
        "expense_date",
        to
      );


  const saleRows =
    sales || [];

  const expenseRows =
    expenses || [];


  const totalSales =
    saleRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.total || 0
        ),
      0
    );


  const totalExpenses =
    expenseRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.amount || 0
        ),
      0
    );


  // ----------------------------------------------------------
  // Calculate approximate COGS from recipes
  // ----------------------------------------------------------

  let cogs = 0;


  if (saleRows.length > 0) {

    const saleIds =
      saleRows.map(
        row => row.id
      );


    const {
      data: saleItems
    } =
      await supabase
        .from("sale_items")
        .select(
          "sale_id,product_id,quantity"
        )
        .in(
          "sale_id",
          saleIds
        );


    const {
      data: recipes
    } =
      await supabase
        .from("recipes")
        .select(
          "product_id,ingredient_id,quantity"
        );


    const {
      data: ingredients
    } =
      await supabase
        .from("ingredients")
        .select(
          "id,cost_per_unit"
        );


    (saleItems || [])
      .forEach(
        item => {

          const productRecipes =
            (recipes || [])
              .filter(
                recipe =>
                  recipe.product_id ===
                  item.product_id
              );

          productRecipes
            .forEach(
              recipe => {

                const ingredient =
                  (ingredients || [])
                    .find(
                      i =>
                        i.id ===
                        recipe.ingredient_id
                    );

                if (!ingredient)
                  return;

                cogs +=

                  Number(
                    recipe.quantity || 0
                  ) *

                  Number(
                    item.quantity || 0
                  ) *

                  Number(
                    ingredient.cost_per_unit || 0
                  );

              }
            );

        }
      );

  }


  const netProfit =
    totalSales -
    cogs -
    totalExpenses;


  const cashSales =
    saleRows
      .filter(
        s =>
          s.payment_method ===
          "cash"
      )
      .reduce(
        (sum, s) =>
          sum +
          Number(
            s.total || 0
          ),
        0
      );


  const cardSales =
    saleRows
      .filter(
        s =>
          s.payment_method ===
          "card"
      )
      .reduce(
        (sum, s) =>
          sum +
          Number(
            s.total || 0
          ),
        0
      );


  result.innerHTML = `

    <div class="dashboard-grid">

      <div class="stat-card">

        <div class="stat-title">
          ${t("totalSales")}
        </div>

        <div class="stat-value">
          ${money(totalSales)}
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-title">
          ${t("costOfGoods")}
        </div>

        <div class="stat-value">
          ${money(cogs)}
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-title">
          ${t("expenseReport")}
        </div>

        <div class="stat-value">
          ${money(totalExpenses)}
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-title">
          ${t("netProfit")}
        </div>

        <div class="stat-value">
          ${money(netProfit)}
        </div>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("salesReport")}
      </h2>

      <p>
        Cash:
        <strong>
          ${money(cashSales)}
        </strong>
      </p>

      <p>
        Card:
        <strong>
          ${money(cardSales)}
        </strong>
      </p>

      <p>
        Orders:
        <strong>
          ${saleRows.length}
        </strong>
      </p>

    </div>


    <div class="card">

      <h2>
        ${t("salesReport")}
      </h2>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>${t("date")}</th>
              <th>${t("payment")}</th>
              <th>${t("total")}</th>

            </tr>

          </thead>


          <tbody>

            ${
              saleRows
                .map(
                  sale => `

                    <tr>

                      <td>
                        ${formatDate(
                          sale.created_at
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          sale.payment_method
                        )}
                      </td>

                      <td>
                        ${money(
                          sale.total
                        )}
                      </td>

                    </tr>

                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("expenseReport")}
      </h2>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>${t("date")}</th>
              <th>${t("description")}</th>
              <th>${t("amount")}</th>

            </tr>

          </thead>


          <tbody>

            ${
              expenseRows
                .map(
                  expense => `

                    <tr>

                      <td>
                        ${escapeHTML(
                          expense.expense_date
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          expense.description ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${money(
                          expense.amount
                        )}
                      </td>

                    </tr>

                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;

}


// ============================================================
// EMPLOYEES
// ============================================================

async function employeesPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  if (
    !currentProfile ||
    currentProfile.role !== "owner"
  ) {

    app.innerHTML =
      `<div class="card">Access denied.</div>`;

    return;

  }


  const {
    data: employees,
    error
  } =
    await supabase
      .from("profiles")
      .select(
        "id,username,full_name,role,language,active"
      )
      .order(
        "full_name"
      );


  if (error) {

    app.innerHTML =
      `<div class="card">${error.message}</div>`;

    return;

  }


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("employeesTitle")}
      </h2>


      <p>
        Employee Auth account එක මුලින් Supabase
        Authentication වල create කරලා තිබිය යුතුයි.
        මෙතැනින් ඒ account එකේ Profile / Role /
        Language / Active status manage කරන්න පුළුවන්.
      </p>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                ${t("usernameCol")}
              </th>

              <th>
                ${t("nameCol")}
              </th>

              <th>
                ${t("role")}
              </th>

              <th>
                ${t("languageCol")}
              </th>

              <th>
                ${t("status")}
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              (employees || [])
                .map(
                  person => `

                    <tr>

                      <td>
                        ${escapeHTML(
                          person.username
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          person.full_name
                        )}
                      </td>

                      <td>

                        <select
                          id="role-${person.id}"
                          style="padding:7px;"
                        >

                          <option
                            value="owner"
                            ${
                              person.role === "owner"
                                ? "selected"
                                : ""
                            }
                          >
                            ${t("owner")}
                          </option>

                          <option
                            value="employee"
                            ${
                              person.role === "employee"
                                ? "selected"
                                : ""
                            }
                          >
                            ${t("employee")}
                          </option>

                        </select>

                      </td>


                      <td>

                        <select
                          id="lang-${person.id}"
                          style="padding:7px;"
                        >

                          <option
                            value="si"
                            ${
                              person.language === "si"
                                ? "selected"
                                : ""
                            }
                          >
                            සිංහල
                          </option>

                          <option
                            value="en"
                            ${
                              person.language === "en"
                                ? "selected"
                                : ""
                            }
                          >
                            English
                          </option>

                        </select>

                      </td>


                      <td>

                        <select
                          id="active-${person.id}"
                          style="padding:7px;"
                        >

                          <option
                            value="true"
                            ${
                              person.active !== false
                                ? "selected"
                                : ""
                            }
                          >
                            Active
                          </option>

                          <option
                            value="false"
                            ${
                              person.active === false
                                ? "selected"
                                : ""
                            }
                          >
                            Inactive
                          </option>

                        </select>

                      </td>


                      <td>

                        <button
                          class="primary-btn"
                          onclick="updateEmployee('${person.id}')"
                        >
                          ${t("update")}
                        </button>

                      </td>

                    </tr>

                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;

}


async function updateEmployee(
  id
) {

  if (
    !currentProfile ||
    currentProfile.role !== "owner"
  )
    return;


  const role =
    document.getElementById(
      `role-${id}`
    ).value;

  const lang =
    document.getElementById(
      `lang-${id}`
    ).value;

  const active =
    document.getElementById(
      `active-${id}`
    ).value === "true";


  const {
    error
  } =
    await supabase
      .from("profiles")
      .update({

        role:
          role,

        language:
          lang,

        active:
          active

      })
      .eq(
        "id",
        id
      );


  if (error) {

    alert(
      error.message
    );

    return;

  }

  alert(
    t("updated")
  );

  await employeesPage();

}


// ============================================================
// SETTINGS
// ============================================================

async function settingsPage() {

  const app =
    document.getElementById(
      "app"
    );

  if (!app)
    return;

  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("settingsTitle")}
      </h2>


      <p>
        ${t("language")}
      </p>


      <div class="payment-buttons">

        <button
          class="${
            language === "si"
              ? "payment-active"
              : ""
          }"
          onclick="setLang('si')"
        >
          සිංහල
        </button>


        <button
          class="${
            language === "en"
              ? "payment-active"
              : ""
          }"
          onclick="setLang('en')"
        >
          English
        </button>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("welcome")}
      </h2>

      <p>
        ${
          currentProfile
            ? escapeHTML(
                currentProfile.full_name ||
                currentProfile.username
              )
            : ""
        }
      </p>

      <p>
        Username:
        ${
          currentProfile
            ? escapeHTML(
                currentProfile.username
              )
            : ""
        }
      </p>

      <p>
        Role:
        ${
          currentProfile
            ? escapeHTML(
                currentProfile.role
              )
            : ""
        }
      </p>

    </div>

  `;

}


// ============================================================
// RECEIPT PRINT
// ============================================================

function printReceipt(
  receiptData
) {

  if (!receiptData)
    return;

  const sale =
    receiptData.sale;

  const items =
    receiptData.items || [];

  const paid =
    Number(
      receiptData.customerPaid || 0
    );

  const change =
    Number(
      receiptData.change || 0
    );


  const itemHTML =
    items
      .map(
        item => {

          const name =
            language === "en"
              ? (
                  item.name_en ||
                  item.name_si
                )
              : (
                  item.name_si ||
                  item.name_en
                );

          const lineTotal =
            Number(
              item.selling_price
            ) *
            Number(
              item.quantity
            );

          return `

            <tr>

              <td>
                ${escapeHTML(name)}
              </td>

              <td style="text-align:center;">
                ${item.quantity}
              </td>

              <td style="text-align:right;">
                ${money(lineTotal)}
              </td>

            </tr>

          `;

        }
      )
      .join("");


  const receiptNumber =
    sale &&
    sale.receipt_number
      ? sale.receipt_number
      : sale
        ? sale.id
        : "";


  const receiptWindow =
    window.open(
      "",
      "_blank",
      "width=400,height=700"
    );


  if (!receiptWindow) {

    alert(
      "Popup blocked. Please allow popups."
    );

    return;

  }


  receiptWindow.document.write(`

    <!doctype html>

    <html>

      <head>

        <meta charset="utf-8">

        <title>
          අඹ සිසිල Receipt
        </title>

        <style>

          body {
            font-family:
              Arial,
              sans-serif;

            width: 280px;

            margin: 0 auto;

            padding: 15px;

            color: #000;
          }

          .center {
            text-align:center;
          }

          h2 {
            margin: 0 0 5px;
          }

          p {
            margin: 4px 0;
            font-size: 13px;
          }

          table {
            width:100%;
            border-collapse:collapse;
            margin-top:12px;
            font-size:12px;
          }

          th,
          td {
            padding:5px 2px;
            border-bottom:1px dashed #999;
          }

          .total {
            font-size:17px;
            font-weight:bold;
          }

          .line {
            border-top:1px dashed #000;
            margin:10px 0;
          }

          @media print {

            body {
              width:280px;
            }

          }

        </style>

      </head>


      <body>

        <div class="center">

          <h2>
            අඹ සිසිල
          </h2>

          <p>
            Receipt #${escapeHTML(
              receiptNumber
            )}
          </p>

          <p>
            ${formatDate(
              sale
                ? sale.created_at
                : new Date()
            )}
          </p>

        </div>


        <div class="line"></div>


        <table>

          <thead>

            <tr>

              <th>
                Item
              </th>

              <th>
                Qty
              </th>

              <th>
                Amount
              </th>

            </tr>

          </thead>


          <tbody>

            ${itemHTML}

          </tbody>

        </table>


        <div class="line"></div>


        <p>
          ${t("subtotal")}:
          <strong>
            ${money(
              sale
                ? sale.subtotal
                : getPOSCartTotal()
            )}
          </strong>
        </p>


        <p class="total">

          ${t("total")}:
          ${money(
            sale
              ? sale.total
              : 0
          )}

        </p>


        <p>

          ${t("payment")}:
          ${
            sale
              ? escapeHTML(
                  sale.payment_method
                )
              : ""
          }

        </p>


        <p>

          ${t("customerPayment")}:
          ${money(paid)}

        </p>


        <p>

          ${t("receiptChange")}:
          ${money(change)}

        </p>


        <div class="line"></div>


        <div class="center">

          <p>
            Thank you!
          </p>

          <p>
            අඹ සිසිල
          </p>

        </div>


        <script>

          window.onload = function() {

            window.print();

          };

        </script>

      </body>

    </html>

  `);


  receiptWindow.document.close();

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

  const username =
    usernameInput
      ? usernameInput.value.trim()
      : "";


  if (!username) {

    if (message)
      message.textContent =
        language === "en"
          ? "Enter your username first."
          : "මුලින් Username එක ඇතුළත් කරන්න.";

    return;

  }


  try {

    const {
      data: email,
      error
    } =
      await supabase.rpc(
        "get_login_email",
        {
          p_username:
            username
        }
      );

    if (error)
      throw error;

    if (!email)
      throw new Error(
        "Username not found"
      );


    const {
      error: resetError
    } =
      await supabase.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              window.location.origin
          }
        );


    if (resetError)
      throw resetError;


    alert(
      language === "en"
        ? "Password reset email sent."
        : "Password reset email එක යැව්වා."
    );


  } catch (error) {

    console.error(
      error
    );

    if (message)
      message.textContent =
        language === "en"
          ? "Password reset failed."
          : "Password reset කරන්න බැරි වුණා.";

  }

}


// ============================================================
// SESSION
// ============================================================

async function checkSession() {

  const {
    data
  } =
    await supabase.auth
      .getSession();

  const session =
    data.session;

  if (!session) {

    currentUser = null;

    currentProfile = null;

    showLogin();

    return;

  }


  currentUser =
    session.user;


  try {

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
      error
    );

    await supabase.auth.signOut();

    currentUser = null;

    currentProfile = null;

    showLogin();

  }

}


// ============================================================
// AUTH STATE
// ============================================================

supabase.auth.onAuthStateChange(
  (
    event,
    session
  ) => {

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


// ============================================================
// NAVIGATION CLICK
// ============================================================

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );

    if (!button)
      return;

    const page =
      button.dataset.page;

    if (page)
      show(page);

  }
);


// ============================================================
// ENTER KEY LOGIN
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Enter"
    )
      return;

    const loginScreen =
      document.getElementById(
        "loginScreen"
      );

    if (
      loginScreen &&
      !loginScreen.classList.contains(
        "app-hidden"
      )
    ) {

      loginUser();

    }

  }
);


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const loginButton =
      document.getElementById(
        "loginButton"
      );

    if (loginButton) {

      loginButton.addEventListener(
        "click",
        loginUser
      );

    }


    const logoutButton =
      document.getElementById(
        "logoutButton"
      );

    if (logoutButton) {

      logoutButton.addEventListener(
        "click",
        logoutUser
      );

    }


    const forgotButton =
      document.getElementById(
        "forgotPasswordButton"
      );

    if (forgotButton) {

      forgotButton.addEventListener(
        "click",
        forgotPassword
      );

    }


    await checkSession();

  }
);


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.loginUser =
  loginUser;

window.logoutUser =
  logoutUser;

window.forgotPassword =
  forgotPassword;

window.show =
  show;

window.setLang =
  setLang;

window.dashboard =
  dashboard;

window.posPage =
  posPage;

window.renderPOS =
  renderPOS;

window.addToPOSCart =
  addToPOSCart;

window.changePOSQty =
  changePOSQty;

window.removePOSItem =
  removePOSItem;

window.selectPOSPayment =
  selectPOSPayment;

window.updateCustomerPaid =
  updateCustomerPaid;

window.clearPOSCart =
  clearPOSCart;

window.completePOSSale =
  completePOSSale;

window.productsPage =
  productsPage;

window.saveProduct =
  saveProduct;

window.editProduct =
  editProduct;

window.toggleProduct =
  toggleProduct;

window.resetProductForm =
  resetProductForm;

window.saveCategory =
  saveCategory;

window.stockPage =
  stockPage;

window.saveIngredient =
  saveIngredient;

window.editIngredient =
  editIngredient;

window.resetIngredientForm =
  resetIngredientForm;

window.addStock =
  addStock;

window.saveRecipe =
  saveRecipe;

window.deleteRecipe =
  deleteRecipe;

window.expensesPage =
  expensesPage;

window.saveExpense =
  saveExpense;

window.deleteExpense =
  deleteExpense;

window.reportsPage =
  reportsPage;

window.generateReport =
  generateReport;

window.employeesPage =
  employeesPage;

window.updateEmployee =
  updateEmployee;

window.settingsPage =
  settingsPage;

window.printReceipt =
  printReceipt;

