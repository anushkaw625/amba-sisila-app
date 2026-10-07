

// ============================================================
// අඹ සිසිල Management System
// Supabase Authentication
// ============================================================

// ---------- SUPABASE CONFIG ----------

const SUPABASE_URL = "https://wazmcrsdzehterjkyeqt.supabase.co";

// Vercel Environment Variables plain HTML app එකෙන් direct access
// කරන්න බැරි නිසා publishable key එක client-side භාවිතා කරමු.
// මෙතන Vercel එකේ දැනට තියෙන SAME publishable key එක paste කරන්න.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pxnXrMQ7wDKH5bvizimAKw_ELu-HO-t";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ============================================================
// LANGUAGE
// ============================================================

const dict = {
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
        orders: "ඇණවුම්",
        profit: "ලාභය",
        low: "අඩු තොග",
        recent: "මෑත විකුණුම්",
        add: "එක් කරන්න",
        name: "නම",
        price: "විකුණුම් මිල",
        cost: "පිරිවැය",
        qty: "ප්‍රමාණය",
        payment: "ගෙවීම් ක්‍රමය",
        cash: "මුදල්",
        card: "කාඩ්",
        save: "සුරකින්න"
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
        orders: "Orders",
        profit: "Profit",
        low: "Low Stock",
        recent: "Recent Sales",
        add: "Add",
        name: "Name",
        price: "Selling Price",
        cost: "Cost",
        qty: "Quantity",
        payment: "Payment Method",
        cash: "Cash",
        card: "Card",
        save: "Save"
    }
};

let lang = localStorage.getItem("amba_lang") || "si";
let page = "dashboard";

const t = key => dict[lang]?.[key] || key;

const money = n =>
    "Rs. " +
    Number(n || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


// ============================================================
// AUTH
// ============================================================

let currentUser = null;
let currentProfile = null;


// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

async function login(username, password) {

    username = String(username || "").trim();
    password = String(password || "");

    if (!username || !password) {
        throw new Error(
            lang === "si"
                ? "Username සහ Password දෙකම ඇතුළත් කරන්න."
                : "Please enter username and password."
        );
    }

    // Username → Email
    const { data: email, error: emailError } =
        await supabaseClient.rpc(
            "get_login_email",
            {
                p_username: username
            }
        );

    if (emailError) {
        console.error(emailError);
        throw new Error(
            lang === "si"
                ? "Login system එකට සම්බන්ධ වීමට නොහැක."
                : "Unable to connect to login system."
        );
    }

    if (!email) {
        throw new Error(
            lang === "si"
                ? "Username එක හමු නොවීය."
                : "Username not found."
        );
    }

    // Supabase Auth login
    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        console.error(error);

        throw new Error(
            lang === "si"
                ? "Username හෝ Password වැරදියි."
                : "Incorrect username or password."
        );
    }

    currentUser = data.user;

    await loadProfile();

    showApp();

    return true;
}


// ------------------------------------------------------------
// LOAD PROFILE
// ------------------------------------------------------------

async function loadProfile() {

    if (!currentUser) return null;

    const {
        data,
        error
    } = await supabaseClient
        .from("profiles")
        .select("id, username, full_name, role, language")
        .eq("id", currentUser.id)
        .single();

    if (error) {
        console.error(error);
        throw new Error(
            lang === "si"
                ? "User profile එක ලබාගත නොහැක."
                : "Unable to load user profile."
        );
    }

    currentProfile = data;

    if (data.language) {
        lang = data.language;
        localStorage.setItem("amba_lang", lang);
    }

    return data;
}


// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------

async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    currentUser = null;
    currentProfile = null;

    showLogin();
}


// ============================================================
// SESSION CHECK
// ============================================================

async function checkSession() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(error);
            showLogin();
            return;
        }

        if (data.session) {

            currentUser = data.session.user;

            await loadProfile();

            showApp();

        } else {

            showLogin();

        }

    } catch (error) {

        console.error(error);
        showLogin();

    }
}


// ============================================================
// LOGIN SCREEN
// ============================================================

function showLogin() {

    const loginScreen =
        document.getElementById("loginScreen");

    const main =
        document.querySelector("main");

    const sidebar =
        document.querySelector("aside");

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    if (main) {
        main.style.display = "none";
    }

    if (sidebar) {
        sidebar.style.display = "none";
    }
}


// ============================================================
// SHOW APPLICATION
// ============================================================

function showApp() {

    const loginScreen =
        document.getElementById("loginScreen");

    const main =
        document.querySelector("main");

    const sidebar =
        document.querySelector("aside");

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

    if (main) {
        main.style.display = "";
    }

    if (sidebar) {
        sidebar.style.display = "";
    }

    applyRolePermissions();

    render();
}


// ============================================================
// ROLE PERMISSIONS
// ============================================================

function applyRolePermissions() {

    if (!currentProfile) return;

    const role = currentProfile.role;

    const employeeOnlyHide = [
        "employees",
        "expenses",
        "reports",
        "settings"
    ];

    employeeOnlyHide.forEach(pageName => {

        const buttons =
            document.querySelectorAll(
                `[onclick="show('${pageName}')"]`
            );

        buttons.forEach(button => {

            if (role === "employee") {
                button.style.display = "none";
            } else {
                button.style.display = "";
            }

        });

    });
}


// ============================================================
// NAVIGATION
// ============================================================

function show(x) {

    page = x;

    render();

    const aside =
        document.querySelector("aside");

    if (aside) {
        aside.classList.remove("open");
    }
}


// ============================================================
// LANGUAGE
// ============================================================

function persistLanguage() {

    localStorage.setItem(
        "amba_lang",
        lang
    );
}

function setLang(x) {

    lang = x;

    persistLanguage();

    render();
}


// ============================================================
// RENDER
// ============================================================

function render() {

    const title =
        document.getElementById("title");

    const date =
        document.getElementById("date");

    const language =
        document.getElement
