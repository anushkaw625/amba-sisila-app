// ============================================================
// අඹ සිසිල Management System
// Supabase Authentication + Role Based Access + POS
// ============================================================


// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://wazmcrsdzehterjkyeqt.supabase.co";

// IMPORTANT:
// මෙතන දැනට ඔයාගේ app.js එකේ තියෙන SAME
// Supabase Publishable Key එක දාන්න.
//
// Service Role / Secret Key එක දාන්න එපා.

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_pxnXrMQ7wDKH5bvizimAKw_ELu-HO-t";


const supabase = window.supabase.createClient(
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
    stockTitle: "Stock",
    expensesTitle: "Expenses",
    reportsTitle: "Reports",
    employeesTitle: "Employees",
    settingsTitle: "Settings",

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

    language: "භාෂාව"

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
    stockTitle: "Stock",
    expensesTitle: "Expenses",
    reportsTitle: "Reports",
    employeesTitle: "Employees",
    settingsTitle: "Settings",

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

    language: "Language"

  }

};


// ============================================================
// TRANSLATION HELPER
// ============================================================

function t(key) {

  return (
    dict[language] &&
    dict[language][key]
  ) || key;

}


// ============================================================
// MONEY
// ============================================================

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


// ============================================================
// HTML ESCAPE
// ============================================================

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


// ============================================================
// DATE
// ============================================================

function formatDate(value) {

  if (!value) return "-";

  const date = new Date(value);

  return date.toLocaleString(
    "en-LK",
    {
      dateStyle: "medium",
      timeStyle: "short"
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
// APP SCREEN
// ============================================================

function showApp() {

  const loginScreen =
    document.getElementById("loginScreen");

  const mainApp =
    document.getElementById("mainApp");


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

    // --------------------------------------------------------
    // Username → email
    // --------------------------------------------------------

    const {
      data: emailData,
      error: emailError
    } =
      await supabase.rpc(
        "get_login_email",
        {
          p_username: username
        }
      );


    if (emailError) {

      console.error(
        "Username lookup error:",
        emailError
      );

      throw emailError;

    }


    const email = emailData;


    if (!email) {

      throw new Error(
        "Invalid username"
      );

    }


    // --------------------------------------------------------
    // Supabase Auth
    // --------------------------------------------------------

    const {
      data,
      error
    } =
      await supabase.auth.signInWithPassword({

        email: email,

        password: password

      });


    if (error) {

      throw error;

    }


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


    if (message) {

      message.textContent =
        t("loginError");

    }

  }

}


// ============================================================
// LOAD PROFILE
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
        "id, username, full_name, role, language"
      )
      .eq(
        "id",
        currentUser.id
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Profile error:",
      error
    );

    throw error;

  }


  currentProfile =
    data;


  if (currentProfile) {

    if (
      currentProfile.language === "si" ||
      currentProfile.language === "en"
    ) {

      language =
        currentProfile.language;

      localStorage.setItem(
        "amba_language",
        language
      );

    }

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


  ownerOnlyMenus.forEach(id => {

    const element =
      document.getElementById(id);

    if (!element) return;


    if (isOwner) {

      element.style.display = "";

    } else {

      element.style.display = "none";

    }

  });


  const posMenu =
    document.getElementById(
      "posMenu"
    );


  if (posMenu) {

    posMenu.style.display = "";

  }

}


// ============================================================
// HEADER
// ============================================================

function updateHeader() {

  const userElement =
    document.getElementById(
      "currentUser"
    );

  if (userElement) {

    userElement.textContent =
      currentProfile
        ? (
            currentProfile.full_name ||
            currentProfile.username
          )
        : "";

  }


  const langElement =
    document.getElementById(
      "lang"
    );

  if (langElement) {

    langElement.textContent =
      language === "si"
        ? "සිං"
        : "EN";

  }


  const dateElement =
    document.getElementById(
      "date"
    );

  if (dateElement) {

    dateElement.textContent =
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
  ) {
    return;
  }


  language = lang;


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


  if (currentPage) {

    await show(
      currentPage
    );

  }

}


// ============================================================
// SHOW PAGE
// ============================================================

async function show(page) {

  if (!currentProfile) {

    return;

  }


  // Employees can ONLY access POS

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
      titles[page] ||
      "අඹ සිසිල";

  }


  document
    .querySelectorAll(
      ".nav-btn"
    )
    .forEach(button => {

      button.classList.remove(
        "active"
      );

    });


  const activeButton =
    document.querySelector(
      `[data-page="${page}"]`
    );


  if (activeButton) {

    activeButton.classList.add(
      "active"
    );

  }


  if (page === "dashboard") {

    await dashboard();

    return;

  }


  if (page === "pos") {

    await posPage();

    return;

  }


  if (page === "products") {

    await productsPage();

    return;

  }


  if (page === "stock") {

    await stockPage();

    return;

  }


  if (page === "expenses") {

    await expensesPage();

    return;

  }


  if (page === "reports") {

    await reportsPage();

    return;

  }


  if (page === "employees") {

    await employeesPage();

    return;

  }


  if (page === "settings") {

    await settingsPage();

    return;

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


  if (!app) return;


  // ----------------------------------------------------------
  // Sales
  // ----------------------------------------------------------

  let salesQuery =
    supabase
      .from("sales")
      .select(
        "id, total, payment_method, created_at"
      );


  const {
    data: sales,
    error: salesError
  } =
    await salesQuery;


  if (salesError) {

    console.error(
      "Dashboard sales error:",
      salesError
    );

  }


  const saleRows =
    sales || [];


  const totalSales =
    saleRows.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total || 0
        ),
      0
    );


  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  const todaySales =
    saleRows
      .filter(sale => {

        const d =
          new Date(
            sale.created_at
          );

        return d >= today;

      })
      .reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.total || 0
          ),
        0
      );


  // ----------------------------------------------------------
  // Products
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // Low stock
  // ----------------------------------------------------------

  const {
    data: lowStock
  } =
    await supabase
      .from("ingredients")
      .select(
        "id, name, current_stock, min_stock"
      )
      .lte(
        "current_stock",
        supabase
          ? 0
          : 0
      )
      .limit(5);


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

      ${
        saleRows.length === 0
          ? `<p>${t("noData")}</p>`
          : `
            <div class="table-wrap">

              <table>

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>

                </thead>

                <tbody>

                  ${
                    saleRows
                      .slice(-10)
                      .reverse()
                      .map(sale => `
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
                      `)
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
// POS STATE
// ============================================================

let posProducts = [];

let posCart = [];

let selectedPaymentMethod =
  "cash";

let customerPaid = 0;


// ============================================================
// LOAD POS PRODUCTS
// ============================================================

async function loadPOSProducts() {

  const {
    data,
    error
  } =
    await supabase
      .from("products")
      .select(`
        id,
        name_si,
        name_en,
        selling_price,
        active
      `)
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
      "POS products error:",
      error
    );

    alert(
      "Products load karanna bari una."
    );

    return;

  }


  posProducts =
    data || [];

}


// ============================================================
// POS PAGE
// ============================================================

async function posPage() {

  await loadPOSProducts();

  renderPOS();

}


// ============================================================
// RENDER POS
// ============================================================

function renderPOS() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


  let productHTML = "";


  if (
    posProducts.length === 0
  ) {

    productHTML = `
      <div class="empty-state">
        ${t("productsEmpty")}
      </div>
    `;

  } else {

    productHTML =
      posProducts
        .map(product => {

          const productName =
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

                ${escapeHTML(
                  productName
                )}

              </div>


              <div class="pos-product-price">

                ${money(
                  product.selling_price
                )}

              </div>

            </button>

          `;

        })
        .join("");

  }


  // ----------------------------------------------------------
  // CART
  // ----------------------------------------------------------

  let cartHTML = "";


  if (
    posCart.length === 0
  ) {

    cartHTML = `
      <div class="empty-state">
        ${t("cartEmpty")}
      </div>
    `;

  } else {

    cartHTML =
      posCart
        .map(
          (item, index) => {

            const productName =
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

                    ${escapeHTML(
                      productName
                    )}

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
                    onclick="changePOSQty(${index}, -1)"
                  >
                    −
                  </button>


                  <strong>
                    ${item.quantity}
                  </strong>


                  <button
                    onclick="changePOSQty(${index}, 1)"
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

                  ${money(
                    subtotal
                  )}

                </strong>

              </div>

            `;

          }
        )
        .join("");

  }


  // ----------------------------------------------------------
  // TOTAL
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // CASH
  // ----------------------------------------------------------

  let cashHTML = "";


  if (
    selectedPaymentMethod ===
    "cash"
  ) {

    cashHTML = `

      <div
        style="
          margin-top:15px;
        "
      >

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
          paid >= total &&
          total > 0
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

                  ${money(
                    change
                  )}

                </strong>

              </div>

            `
            : ""
        }


        ${
          paid < total &&
          paid > 0
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

                  ${money(
                    remaining
                  )}

                </strong>

              </div>

            `
            : ""
        }

      </div>

    `;

  }


  // ----------------------------------------------------------
  // POS UI
  // ----------------------------------------------------------

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
                selectedPaymentMethod ===
                "cash" &&
                Number(
                  customerPaid
                ) < total
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


// ============================================================
// ADD TO CART
// ============================================================

function addToPOSCart(
  productId
) {

  const product =
    posProducts.find(
      p => p.id === productId
    );


  if (!product) return;


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


// ============================================================
// CHANGE QUANTITY
// ============================================================

function changePOSQty(
  index,
  amount
) {

  if (!posCart[index]) return;


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


// ============================================================
// REMOVE ITEM
// ============================================================

function removePOSItem(
  index
) {

  if (!posCart[index]) return;


  posCart.splice(
    index,
    1
  );


  renderPOS();

}


// ============================================================
// GET TOTAL
// ============================================================

function getPOSCartTotal() {

  return posCart.reduce(
    (
      total,
      item
    ) => {

      return total +
        (
          Number(
            item.selling_price
          ) *
          Number(
            item.quantity
          )
        );

    },
    0
  );

}


// ============================================================
// SELECT PAYMENT
// ============================================================

function selectPOSPayment(
  method
) {

  selectedPaymentMethod =
    method;


  if (
    method === "card"
  ) {

    customerPaid = 0;

  }


  renderPOS();

}


// ============================================================
// CUSTOMER PAID
// ============================================================

function updateCustomerPaid(
  value
) {

  customerPaid =
    Number(value) || 0;


  renderPOS();


  setTimeout(
    () => {

      const input =
        document.getElementById(
          "customerPaidInput"
        );


      if (input) {

        input.focus();

        try {

          input.setSelectionRange(
            input.value.length,
            input.value.length
          );

        } catch (e) {}

      }

    },
    0
  );

}


// ============================================================
// CLEAR CART
// ============================================================

function clearPOSCart() {

  posCart = [];

  customerPaid = 0;

  selectedPaymentMethod =
    "cash";


  renderPOS();

}


// ============================================================
// COMPLETE SALE
// ============================================================

async function completePOSSale() {

  if (
    posCart.length === 0
  ) {

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
    selectedPaymentMethod ===
    "cash" &&
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

      button.innerText =
        t("saving");

    }
  );


  try {

    // --------------------------------------------------------
    // Prepare cart
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Call Supabase RPC
    // --------------------------------------------------------

    const {
      data,
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


    if (error) {

      console.error(
        "Complete sale error:",
        error
      );

      throw error;

    }


    const saleId =
      data;


    const change =
      selectedPaymentMethod ===
      "cash"
        ? paid - total
        : 0;


    // --------------------------------------------------------
    // Success
    // --------------------------------------------------------

    alert(

      t("saleCompleted") +

      "\n\n" +

      t("total") +
      ": " +
      money(total) +

      "\n" +

      t("change") +
      ": " +
      money(change)

    );


    console.log(
      "Sale completed:",
      saleId
    );


    // --------------------------------------------------------
    // Reset POS
    // --------------------------------------------------------

    posCart = [];

    customerPaid = 0;

    selectedPaymentMethod =
      "cash";


    await posPage();


  } catch (error) {

    console.error(
      "SALE ERROR:",
      error
    );


    alert(

      t("saleFailed") +

      "\n\n" +

      error.message

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


  if (!app) return;


  const {
    data,
    error
  } =
    await supabase
      .from("products")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    app.innerHTML = `
      <div class="card">
        Error loading products.
      </div>
    `;

    console.error(error);

    return;

  }


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("productsTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Name
              </th>

              <th>
                Price
              </th>

              <th>
                Active
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              (data || [])
                .map(
                  product => `

                    <tr>

                      <td>
                        ${escapeHTML(
                          product.name_si ||
                          product.name_en ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${money(
                          product.selling_price
                        )}
                      </td>

                      <td>
                        ${
                          product.active
                            ? "Yes"
                            : "No"
                        }
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
// STOCK PAGE
// ============================================================

async function stockPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


  const {
    data,
    error
  } =
    await supabase
      .from("ingredients")
      .select("*")
      .order(
        "name",
        {
          ascending: true
        }
      );


  if (error) {

    app.innerHTML = `
      <div class="card">
        Error loading stock.
      </div>
    `;

    console.error(error);

    return;

  }


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("stockTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Ingredient
              </th>

              <th>
                Unit
              </th>

              <th>
                Current Stock
              </th>

              <th>
                Minimum
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              (data || [])
                .map(
                  item => `

                    <tr>

                      <td>
                        ${escapeHTML(
                          item.name
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.unit || "-"
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.current_stock || 0
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.min_stock || 0
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
// EXPENSES PAGE
// ============================================================

async function expensesPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


  const {
    data,
    error
  } =
    await supabase
      .from("expenses")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(50);


  if (error) {

    app.innerHTML = `
      <div class="card">
        Error loading expenses.
      </div>
    `;

    console.error(error);

    return;

  }


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("expensesTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Date
              </th>

              <th>
                Description
              </th>

              <th>
                Amount
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              (data || [])
                .map(
                  item => `

                    <tr>

                      <td>
                        ${formatDate(
                          item.created_at
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.description ||
                          item.name ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${money(
                          item.amount
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
// REPORTS PAGE
// ============================================================

async function reportsPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


  const {
    data,
    error
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


  if (error) {

    console.error(error);

    app.innerHTML = `
      <div class="card">
        Error loading reports.
      </div>
    `;

    return;

  }


  const sales =
    data || [];


  const total =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total || 0
        ),
      0
    );


  app.innerHTML = `

    <div class="dashboard-grid">

      <div class="stat-card">

        <div class="stat-title">
          ${t("totalSales")}
        </div>

        <div class="stat-value">
          ${money(total)}
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-title">
          ${t("totalOrders")}
        </div>

        <div class="stat-value">
          ${sales.length}
        </div>

      </div>

    </div>


    <div class="card">

      <h2>
        ${t("reportsTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Date
              </th>

              <th>
                Payment
              </th>

              <th>
                Total
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              sales
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

  `;

}


// ============================================================
// EMPLOYEES PAGE
// ============================================================

async function employeesPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


  if (
    !currentProfile ||
    currentProfile.role !== "owner"
  ) {

    app.innerHTML = `
      <div class="card">
        Access denied.
      </div>
    `;

    return;

  }


  const {
    data,
    error
  } =
    await supabase
      .from("profiles")
      .select(
        "id, username, full_name, role, language"
      )
      .order(
        "full_name",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(error);

    app.innerHTML = `
      <div class="card">
        Error loading employees.
      </div>
    `;

    return;

  }


  app.innerHTML = `

    <div class="card">

      <h2>
        ${t("employeesTitle")}
      </h2>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Username
              </th>

              <th>
                Name
              </th>

              <th>
                Role
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              (data || [])
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
                        ${escapeHTML(
                          person.role
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
// SETTINGS PAGE
// ============================================================

async function settingsPage() {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) return;


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

  `;

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

    if (message) {

      message.textContent =
        language === "en"
          ? "Enter your username first."
          : "මුලින් Username එක ඇතුළත් කරන්න.";

    }

    return;

  }


  try {

    const {
      data,
      error
    } =
      await supabase.rpc(
        "get_login_email",
        {
          p_username:
            username
        }
      );


    if (error) {

      throw error;

    }


    const email =
      data;


    if (!email) {

      throw new Error(
        "Username not found"
      );

    }


    const {
      error:
        resetError
    } =
      await supabase.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              window.location.origin
          }
        );


    if (resetError) {

      throw resetError;

    }


    alert(
      language === "en"
        ? "Password reset email sent."
        : "Password reset email එක යැව්වා."
    );


  } catch (error) {

    console.error(
      "Password reset error:",
      error
    );


    if (message) {

      message.textContent =
        language === "en"
          ? "Password reset failed."
          : "Password reset කරන්න බැරි වුණා.";

    }

  }

}


// ============================================================
// SESSION CHECK
// ============================================================

async function checkSession() {

  const {
    data
  } =
    await supabase.auth.getSession();


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
      "Session profile error:",
      error
    );

    await supabase.auth.signOut();

    currentUser = null;

    currentProfile = null;

    showLogin();

  }

}


// ============================================================
// AUTH STATE LISTENER
// ============================================================

supabase.auth.onAuthStateChange(
  async (
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
// LOGIN ENTER KEY
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

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

  }
);


// ============================================================
// NAVIGATION BUTTONS
// ============================================================

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );


    if (!button) return;


    const page =
      button.dataset.page;


    if (page) {

      show(page);

    }

  }
);


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    // Login button
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


    // Logout button
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


    // Forgot password
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


    // Check existing session
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


