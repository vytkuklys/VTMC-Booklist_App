"use strict";
let preventClick = 0;
let editMode = false;

class Book{
    constructor(title, author, pagesTotal, pagesRead, rating){
        this.title = title;
        this.author = author;
        this.pagesTotal = pagesTotal;
        this.pagesRead = pagesRead;
        this.pagesLeft = pagesTotal - pagesRead;
        this.rating = rating;
    }
}

class LocalStore{
    static getBooks(){
        let books;

        if(localStorage.getItem('books')){
            books = JSON.parse(localStorage.getItem('books'));
        }else{
            books = [];
        }
        return books;
    }
    static addBook(book)
    {
        let books = LocalStore.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    static getBook(title, author){
        let books = LocalStore.getBooks();
        books.forEach((book, index) => {
            if(book.title == title && book.author == author){
                return book;
            }
        });
        let cat = books.map((book) => {
            if(book.title == title && book.author == author){
                return book;
            }
        });
        return cat;
    }
    static removeBook(title, author){
        let books = LocalStore.getBooks();
        books.forEach((book, index) => {
            if(book.title == title && book.author == author){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI{
    static displayBooks(){
        const books = LocalStore.getBooks();
        books.forEach((book) => UI.addBook(book));
    }
    static addBook(book){
        const list = document.getElementById('book-list');
        const rating = this.getRating(book.rating);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pagesLeft}</td>
        <td>${rating}</td>
        <td>
        <a href="#" class="btn btn-sm delete fa fa-trash"></a>
        </td>
        <td>
        <a href="#" class="btn btn-sm edit fa fa-edit"></a>
        </td>
        `;

        list.appendChild(row);
    }
    static clearField(){
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("pagesTotal").value = '';
        document.getElementById("pagesRead").value = '';
        document.querySelector('input[name="rate"]:checked').checked = 0;
    }
    static editBook(book){
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("pagesTotal").value = book.pagesTotal;
        document.getElementById("pagesRead").value = book.pagesRead;
        document.getElementById(book.rating).checked = 1;
        this.editBtn();
    }
    static editBtn(){
        document.getElementById("submit").classList.remove('btn-success');
        document.getElementById("submit").classList.add('btn-primary');
        document.getElementById("submit").value = "Edit";
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className} pl-5 p-1`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const table = document.querySelector(".table");
        container.insertBefore(div, table);
        preventClick = 1;
        setTimeout(() =>{
            document.querySelector('.alert').remove();
            preventClick = 0;
        }, 1250);
    }
    static getRating(rating){
        let starRating = {
            'rate-1': `<span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-2': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-3': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span><span class="fas fa-star"></span>`,
            'rate-4': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star"></span>`,
            'rate-5': `<span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span><span class="fas fa-star active"></span>`
        };
        return starRating[rating];
    }
    static deleteBook(element){
        element.parentElement.parentElement.remove();
        UI.showAlert("Book has been deleted successfully", "success");
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//add books

document.addEventListener('submit', function(e){
    e.preventDefault();
    if(preventClick == 1) return;
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const total = document.querySelector("#pagesTotal").value;
    const read = document.querySelector("#pagesRead").value;
    let rating = document.querySelector('input[name="rate"]:checked');
    if(!title || !author || !total || !read || !rating){
        UI.showAlert("All fields should be filled. Rating is obligatory", "danger");
    }else if(editMode){
        
    }else{
        rating = rating.id;
        const book = new Book(title, author, total, read, rating);
        UI.addBook(book);
        LocalStore.addBook(book);
        UI.showAlert("Book has been added successfully", "success");
        UI.clearField();
    }
});

//remove a book

document.querySelector('#book-list').addEventListener('click', function(e){
    e.preventDefault();
    if(e.target.classList.contains('delete')){
        let title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let author = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        LocalStore.removeBook(title, author);
        UI.deleteBook(e.target);
    }
    else if(e.target.classList.contains('edit')){
        let title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let author = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let book = LocalStore.getBook(title, author);
        console.log(book[0]);
        UI.editBook(book[0]);
        console.log(title, author);
    }
});