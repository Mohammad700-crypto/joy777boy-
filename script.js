// إعدادات Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// البريد الإلكتروني المسموح له
const authorizedEmail = "mohammad2010ammen@gmail.com";

// التحقق من تسجيل الدخول
document.getElementById("loginButton").addEventListener("click", function() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    // محاولة تسجيل الدخول
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // تحقق إذا كان البريد الإلكتروني هو البريد المسموح به
            if (user.email === authorizedEmail) {
                document.getElementById("authSection").style.display = "none";
                document.getElementById("contentSection").style.display = "block";
                loadFiles(); // تحميل الملفات من Firestore
            } else {
                alert("هذا البريد الإلكتروني غير مسموح له بالدخول!");
                auth.signOut();
            }
        })
        .catch((error) => {
            alert("خطأ في تسجيل الدخول: " + error.message);
        });
});

// إضافة محتوى وحفظه
document.getElementById("saveButton").addEventListener("click", function() {
    const fileContent = document.getElementById("fileContent").value;
    if (fileContent) {
        // حفظ المحتوى في Firestore
        db.collection("files").add({
            content: fileContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert("تم حفظ الملف بنجاح!");
            loadFiles(); // إعادة تحميل الملفات بعد الحفظ
        })
        .catch((error) => {
            alert("حدث خطأ أثناء حفظ الملف: " + error.message);
        });
    } else {
        alert("يرجى إدخال محتوى للملف!");
    }
});

// تحميل الملفات من Firestore
function loadFiles() {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = ""; // مسح القائمة القديمة
    db.collection("files").orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const listItem = document.createElement("li");
                listItem.textContent = doc.data().content;
                fileList.appendChild(listItem);
            });
        })
        .catch((error) => {
            alert("خطأ في تحميل الملفات: " + error.message);
        });
}
