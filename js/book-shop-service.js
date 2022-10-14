"use strict";

const STORAGE_KEY = "booksDB";
const STORAGE_KEY_LAYOUT = "favLayout";
const PAGE_SIZE = 8;

var gDisplayBy = "cards";
var gPageIdx = 0;
var gFilterBy = { name: "", minPrice: 0, minRate: 0 };
var gBooks;

createBooks();

function getBooks() {
    // Filtering:
    let books = gBooks.filter((book) => book.name.includes(gFilterBy.name) && book.price >= gFilterBy.minPrice);

    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE;
    books = books.slice(startIdx, startIdx + PAGE_SIZE);
    return books;
}

function createBooks() {
    let books = loadFromStorage(STORAGE_KEY);
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = [];
        for (let i = 0; i < 21; i++) {
            let bookName = makeLorem(2).trim();
            books.push(_createBook(bookName));
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(name) {
    return {
        id: makeId(),
        name,
        price: getRandomIntInclusive(50, 250),
        img: `https://edit.org/photos/images/cat/book-covers-big-2019101610.jpg-1300.jpg`,
        desc: name + makeLorem(20),
        rate: 0,
    };
}

function getBookById(bookId) {
    const book = gBooks.find((book) => bookId === book.id);
    return book;
}

function getBookByName(bookName) {
    const book = gBooks.find((book) => bookName.toLowerCase() === book.name);
    return book;
}

function getPageNumberString() {
    let numOfPages = Math.floor(gBooks.length / PAGE_SIZE) + 1;
    return `${gPageIdx + 1}/${numOfPages}`;
}
function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => bookId === book.id);
    gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(name) {
    const book = _createBook(name);
    gBooks.unshift(book);
    _saveBooksToStorage();
    return book;
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find((book) => book.id === bookId);
    book.price = newPrice;
    _saveBooksToStorage();
    return book;
}

function addRate(book) {
    if (book.rate === 10) return;
    book.rate++;
    _saveBooksToStorage();
}

function substractRate(book) {
    if (book.rate === 0) return;
    book.rate--;
    _saveBooksToStorage();
}

function setBookFilter(filterBy = {}) {
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice;
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate;
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name;
    else gFilterBy.name = "";
    return gFilterBy;
}

function setBookSort(sortBy = {}) {
    console.log("set book sort", sortBy);
    if (sortBy.price !== undefined) {
        gBooks.sort((b1, b2) => (b1.price - b2.price) * sortBy.price);
    } else if (sortBy.name !== undefined) {
        gBooks.sort((b1, b2) => b1.name.localeCompare(b2.name) * sortBy.name);
    }
}

function nextPage() {
    if (Math.floor(gBooks.length / PAGE_SIZE) === gPageIdx) return;
    gPageIdx++;
}

function prevPage() {
    if (gPageIdx === 0) return;
    gPageIdx--;
}

function setDisplayBy(displayBy) {
    gDisplayBy = displayBy;
}

function setPageNum(num) {
    gPageIdx = num;
}
function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks);
}
