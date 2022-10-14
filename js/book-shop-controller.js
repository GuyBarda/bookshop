"use strict";

function onInit() {
    renderFilterByQueryStringParams();
    renderBooks();
    renderPageNumber();
}

function renderBooks() {
    const elCardsContainer = document.querySelector(".books-container-cards");
    const elListContainer = document.querySelector(".books-container-list");
    if (gDisplayBy === "cards") {
        renderByCards();
        elCardsContainer.classList.remove("hidden");
        elListContainer.classList.add("hidden");
    } else if (gDisplayBy === "list") {
        renderByList();
        elCardsContainer.classList.add("hidden");
        elListContainer.classList.remove("hidden");
    }
}

function renderByCards() {
    let books = getBooks();
    // let strHtmls = books.map(
    //     (book) => `
    //     <article class="book-preview">
    //         <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
    //         <h5>"${book.name}"</h5>
    //         <h6>Price: <span>${book.price}</span>$</h6>
    //         <button onclick="onReadBook('${book.id}')">Details</button>
    //         <button onclick="onUpdateBook('${book.id}')">Update</button>
    //         <img src1="img/${book.name}.png" alt="Book's name: ${book.name}">
    //     </article>
    //     `
    // );
    let strHtmls = books.map(
        (book) =>
            `<div class="card col col-sm-6 col-lg-3 px-0 text-center border-0" >
                <div class="p-3">
                    <div class="container bg-gradient position-relative" style="background-color: #e59c90;">
                    <button type="button" class="btn-remove btn-close position-absolute top-0 start-100 translate-middle" aria-label="Close" onclick="onDeleteBook('${book.id}')"></button>
                        <img src="${book.img}" class="card-img-top" alt="..." style="width: 70%">
                        <div class="card-body">
                            <h5 class="card-title">${book.name}</h5>
                            <p class="card-text">Price: <span>${book.price}</span>$</p>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-danger" onclick="onReadBook('${book.id}')" data-trans="details">Details</button>
                                <button type="button" class="btn btn-danger" onclick="onUpdateBook('${book.id}')" data-trans="update">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    );
    document.querySelector(".books-container-cards .row").innerHTML = strHtmls.join("");
}

function renderByList() {
    let books = getBooks();
    let strHtmls = books.map(
        (book) => `
        <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}$</td>
            <td><button onclick="onReadBook('${book.id}')">Details</button></td>
            <td><button onclick="onUpdateBook('${book.id}')">Update</button></td>
            <td><button class="btn-remove" onclick="onDeleteBook('${book.id}')">Delete</button></td>
        </tr>
        `
    );
    strHtmls.unshift(`
    <tr>
        <th>id</th>
        <th onclick="setBookSort({name: 1});renderBooks()">Title</th>
        <th onclick="setBookSort({price: 1});renderBooks()">Price</th>
        <th colspan="3">Actions</th>
    </tr>
    `);
    document.querySelector(".books-container-list .table-list").innerHTML = strHtmls.join("");
}

function renderPageNumber() {
    const elPageNumberP = document.querySelector(".page .page-number");
    elPageNumberP.innerText = getPageNumberString();
}

function onDeleteBook(bookId) {
    // if (!confirm("are you sure?")) return;
    deleteBook(bookId);
    flashMsg(`Book Deleted`);
    renderBooks();
}

function onAddBook() {
    let bookName = prompt("Name of the book?", "The Wave").trim();
    if (bookName) {
        const book = addBook(bookName);
        renderBooks();
        flashMsg(`"${bookName}" Added (id: ${book.id})`);
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId);
    let newPrice = +prompt("Price?", book.price);
    if (newPrice && book.price !== newPrice) {
        updateBook(bookId, newPrice);
        renderBooks();
        flashMsg(`${book.name}'s Price has been updated to: ${book.price}$`);
    }
}

function onReadBook(bookId) {
    let book = getBookById(bookId);
    let elModal = document.querySelector(".modal");
    elModal.querySelector("h3").innerText = book.name;
    elModal.querySelector("h4 span").innerText = book.price;
    elModal.querySelector("p").innerText = book.desc;
    console.log(book.rate);
    elModal.querySelector(".rate p").innerText = book.rate;
    elModal.classList.remove("hidden");
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy);
    renderBooks();
    console.log(filterBy);
    setPageNum(0);
    renderPageNumber();

    const queryStringParams = `?name=${filterBy.name}&minPrice=${filterBy.minPrice}`;
    const newUrl =
        window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams;
    window.history.pushState({ path: newUrl }, "", newUrl);
}

function onSetSortBy(value) {
    const isDesc = document.querySelector(".sort-desc").checked;

    const sortBy = {
        [value]: isDesc ? -1 : 1,
    };

    setBookSort(sortBy);
    renderBooks();
}

function onChangePage(action) {
    action === "+" ? nextPage() : prevPage();
    renderBooks();
    renderPageNumber();
}

function onDisplayBy(displayBy) {
    setDisplayBy(displayBy);
    renderBooks();
}

function onCloseModal() {
    document.querySelector(".modal").classList.add("hidden");
}

function onChangeRate(action) {
    let elH3 = document.querySelector(".modal h3");
    let bookName = elH3.innerText;
    let book = getBookByName(bookName);
    action === "+" ? addRate(book) : substractRate(book);
    document.querySelector(".modal .rate p").innerText = book.rate;
    renderBooks();
}

function onSetLang(lang) {
    setLang(lang);
    translateTo();
    setDirection(lang);
    renderBooks();
}

function flashMsg(msg) {
    const el = document.querySelector(".user-msg");
    el.innerText = msg;
    el.classList.add("open");
    setTimeout(() => {
        el.classList.remove("open");
    }, 3000);
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    const filterBy = {
        name: queryStringParams.get("name") || "",
        minPrice: +queryStringParams.get("minPrice") || 0,
        minRate: +queryStringParams.get("minRate") || 0,
    };

    if (!filterBy.name && !filterBy.minPrice && !filterBy.minRate) return;

    document.querySelector(".filter-name").value = filterBy.name;
    document.querySelector(".filter-price-range").value = filterBy.minPrice;
    document.querySelector(".filter-rate-range").value = filterBy.minRate;
    setBookFilter(filterBy);
}

function setDirection(lang) {
    if (lang === "he") document.body.classList.add("rtl");
    else document.body.classList.remove("rtl");
}
