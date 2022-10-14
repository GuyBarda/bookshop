"use strict";

var gTrans = {
    h1: {
        en: "Bookshop App",
        he: "חנות ספרים",
    },
    "filter-by": {
        en: "Filter By",
        he: "פילטור לפי",
    },
    "min-price": {
        en: "Min Price:",
        he: "מחיר מינימלי",
    },
    "min-rate": {
        en: "Min Rate:",
        he: "דירוג מינימלי",
    },
    "books-name": {
        en: "Books's Name:",
        he: "חנות ספרים",
    },
    "sort-by": {
        en: "Sort By",
        he: "מיין לפי",
    },
    name: {
        en: "name",
        he: "שם",
    },
    price: {
        en: "price",
        he: "מחיר",
    },
    descending: {
        en: "Descending",
        he: "סדר יורד",
    },
    display: {
        en: "Display",
        he: "תראה לפי",
    },
    "translate-to": {
        en: "Translate to",
        he: "תרגם ל",
    },
    "add-book": {
        en: "Add Book",
        he: "הוסף ספר",
    },
    // "previous-page": {
    //     en: "Previous Page",
    //     he: "הדף הקודם",
    // },
    // "next-page": {
    //     en: "Next Page",
    //     he: "הדף הבא",
    // },
    "translate-to": {
        en: "Translate to",
        he: "תרגם ל",
    },
    hebrew: {
        en: "Hebrew",
        he: "עברית",
    },
    english: {
        en: "English",
        he: "אנגלית",
    },
    update: {
        en: "Update",
        he: "עדכן",
    },
    details: {
        en: "Details",
        he: "מידע",
    },
};

var gCurrLang = "en";

function translateTo() {
    const els = document.querySelectorAll("[data-trans]");
    console.log(els);
    els.forEach((el) => {
        const transKey = el.dataset.trans;
        const trans = getTrans(transKey);
        el.innerText = trans;
        if (el.placeholder) el.placeholder = trans;
    });
}

function getTrans(transKey) {
    const transMap = gTrans[transKey];
    if (!transMap) return "UNKNOWN";
    let trans = transMap[gCurrLang];
    if (!trans) trans = transMap.en;
    return trans;
}

function setLang(lang) {
    gCurrLang = lang;
}
