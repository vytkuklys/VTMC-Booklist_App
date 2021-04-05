"use strict";
// preventClick is used to prevent multiple false submissions in shorter than 1.25s intevals (line - 159-164, 188)
let preventClick = 0;
// editMode is used to note when user is editting a book and not adding a new one (line 200-210 and 229-234)
let editMode = 0;

class Book {
    constructor(title, author, pagesTotal, pagesRead, rating, id) {
        this.title = title;
        this.author = author;
        this.pagesTotal = pagesTotal;
        this.pagesRead = pagesRead;
        this.pagesLeft = pagesTotal - pagesRead;
        this.rating = rating;
        this.id = id;
    }
}

class LocalStore {
    static getBooks() {
        let books;

        if (localStorage.getItem('books')) {
            books = JSON.parse(localStorage.getItem('books'));
        } else {
            books = [];
        }
        return books;
    }
    static addBook(book, index = -1) {
        let books = LocalStore.getBooks();
        if (index == -1) {
            books.push(book);
        } else {
            books.splice(index, 0, book);
        }
        localStorage.setItem('books', JSON.stringify(books));
    }
    static getBook(id) {
        let books = LocalStore.getBooks();
        let book = books.map((book) => {
            if (book.id === Number(id)) {
                return book;
            }
        }).filter(function (x) {
            return x !== undefined;
        });
        return book[0];
    }
    static getId() {
        let books = LocalStore.getBooks();
        let rand = Math.round(Math.random() * 100000000);
        let check = false;
        books.map((book) => {
            if (book.id == rand) {
                check = true;
            }
        })
        if (check) {
            return this.getId();
        }
        return rand;
    }
    static removeBook(id) {
        let books = LocalStore.getBooks();
        let indexNr;
        books.forEach((book, index) => {
            if (book.id === Number(id)) {
                books.splice(index, 1);
                indexNr = index;
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
        //indexNr is returned to know where to insert the editted row later (line 203-204).
        return indexNr;
    }
}

class UI {
    static displayBooks() {
        const books = LocalStore.getBooks();
        books.forEach((book) => UI.addBook(book));
    }
    static addBook(book) {
        const list = document.getElementById('book-list');
        const rating = this.getRating(book.rating);
        const row = document.createElement('tr');
        row.id = book.id;
        row.innerHTML = `
        <td class="border-right">${book.title}</td>
        <td class="d-none d-md-table-cell border-right">${book.author}</td>
        <td class="d-none d-md-table-cell border-right">${book.pagesLeft}</td>
        <td class="d-none d-md-table-cell border-right">${rating}</td>
        <td class="border-right">
        <a href="#" class="btn btn-sm delete fa fa-trash"></a>
        </td>
        <td>
        <a href="#book-form" class="btn btn-sm edit fa fa-edit"></a>
        </td>
        `;

        list.appendChild(row);
    }
    static editBook(book) {
        const row = document.getElementById(`${book.id}`);
        const rating = this.getRating(book.rating);
        row.innerHTML = `
        <td class="border-right">${book.title}</td>
        <td class="d-none d-md-table-cell border-right">${book.author}</td>
        <td class="d-none d-md-table-cell border-right">${book.pagesLeft}</td>
        <td class="d-none d-md-table-cell border-right">${rating}</td>
        <td class="border-right">
        <a href="#" class="btn btn-sm delete fa fa-trash"></a>
        </td>
        <td>
        <a href="#book-form" class="btn btn-sm edit fa fa-edit"></a>
        </td>
        `;
    }
    //make fields empty after submissions/edits
    static clearField() {
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("pagesTotal").value = '';
        document.getElementById("pagesRead").value = '';
        document.querySelector('input[name="rate"]:checked').checked = 0;
    }
    //display edit options after click on edit btn
    static displayEditOptions(book) {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("pagesTotal").value = book.pagesTotal;
        document.getElementById("pagesRead").value = book.pagesRead;
        document.getElementById(book.rating).checked = 1;
        this.editBtn();
    }
    //change appearance of submit btn after click on edit btn
    static editBtn() {
        let btn = document.getElementById("submit");
        document.getElementById("submit").classList.remove('btn-success');
        document.getElementById("submit").classList.add('btn-primary');
        btn.value = "Edit";
    }
    //reset appearance changes of submit btn after submission of edits
    static resetBtn() {
        let btn = document.getElementById("submit");
        document.getElementById("submit").classList.add('btn-success');
        document.getElementById("submit").classList.remove('btn-primary');
        btn.value = "Submit";
    }
    //display a message indicating success or failure with according color selected by className (danger or success)
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} pl-5 p-1`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const table = document.querySelector(".table");
        container.insertBefore(div, table);
        preventClick = 1;
        setTimeout(() => {
            document.querySelector('.alert').remove();
            preventClick = 0;
        }, 1250);
    }
    //getRating is used to display a correct star count in the table of books
    static getRating(rating) {
        let starRating = {
            'rate-1': `<span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-2': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-3': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-4': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span>`,
            'rate-5': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span>`
        };
        return starRating[rating];
    }
    static deleteBook(element) {
        element.parentElement.parentElement.remove();
        UI.showAlert("Book has been deleted successfully", "success");
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//add or edit books if all fields have values, and 'total pages' and 'pages read' fields contain numeric values, and 'total pages' is not exceeded by 'pages read'

document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (preventClick == 1) return;
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const total = document.querySelector("#pagesTotal").value;
    const read = document.querySelector("#pagesRead").value;
    let rating = document.querySelector('input[name="rate"]:checked');
    if (!title || !author || !total || !read || !rating) {
        UI.showAlert("All fields should be filled. Rating is obligatory", "danger");
    } else if (!Number(read) || !Number(total)) {
        UI.showAlert("'Total pages' and 'Pages already read' fields should contain numeric values.", "danger");
    } else if (Number(total) < Number(read)) {
        UI.showAlert("'Pages already read' cannot exceed total pages.", "danger");
    } else if (editMode) {
        rating = rating.id;
        const book = new Book(title, author, total, read, rating, editMode);
        let index = LocalStore.removeBook(editMode);
        LocalStore.addBook(book, index);
        UI.editBook(book);
        editMode = 0;
        UI.resetBtn();
        UI.showAlert("Book has been edited successfully", "success");
        UI.clearField();
    } else {
        rating = rating.id;
        let id = LocalStore.getId();
        const book = new Book(title, author, total, read, rating, id);
        UI.addBook(book);
        LocalStore.addBook(book);
        UI.showAlert("Book has been added successfully", "success");
        UI.clearField();
    }
});

//remove or edit a book

document.querySelector('#book-list').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
        let id = e.target.parentElement.parentElement.id;
        LocalStore.removeBook(id);
        UI.deleteBook(e.target);
    } else if (e.target.classList.contains('edit')) {
        let id = e.target.parentElement.parentElement.id;
        let book = LocalStore.getBook(id);
        UI.displayEditOptions(book);
        editMode = book.id;
    }
});