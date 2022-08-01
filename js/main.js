let books;
const addBook = document.querySelector('#btn-addBook');
const addBookUserForm = document.querySelector('#add-book')
const RENDER_BOOKS = 'renderbooks';
const tfTitle = document.querySelector('#tfBookTitle');
const tfAuthor = document.querySelector('#tfAuthor');
const year = document.querySelector('#year');
const isReaded = document.querySelector('#IsReaded');
const REFRESH = 'refresh';
let isUpdate = false;
let selectedBook = 0;



window.addEventListener('DOMContentLoaded', () => {
    books = getBooks();
    document.dispatchEvent(new Event(RENDER_BOOKS));
    if (addBook) {

        addBook.onclick = () => {
            document.querySelector('.add-book').style.display = 'flex';
        };
        addBookUserForm.addEventListener('submit', (event) => {

            !isUpdate ? books.push(createBook(tfTitle.value, tfAuthor.value, year.value, isReaded.checked)) : books[selectedBook]= createBook(tfTitle.value, tfAuthor.value, year.value, isReaded.checked);
            update();
            document.dispatchEvent(new Event(RENDER_BOOKS))
            event.preventDefault();
            addBookUserForm.parentElement.style.display = 'none';
            isUpdate = false;
            selectedBook = -1;
        });
        addBookUserForm.querySelector('.close').onclick = () => {
            addBookUserForm.parentElement.style.display = 'none';

        };
    }
});

const createBook = (title, authorName, year, isReaded) => {
    return {
        id: generateId(),
        title,
        authorName,
        year,
        isReaded: isReaded
    }
}
const generateId = () => {
    return new Date().getTime();
}
const update = () => {
    localStorage.setItem('books', JSON.stringify(books));
}
const getBooks = () => {
    return JSON.parse(localStorage.getItem('books') || '[]')
}

document.addEventListener(RENDER_BOOKS, () => {
    const booksc = document.querySelector('#booksList');
    const manageBook = document.querySelector('#booksManage');
    
    if (booksc) {
        booksc.innerHTML = books.reduce((p, c) => p + renderBook(c), '');
    } 
    else if (manageBook) {
        manageBook.innerHTML = books.reduce((p, c) => p + renderBookManager(c), '');
    }

    if(addBook){
        const btnUpdate = document.querySelectorAll('.btn-update');
        const btnDelete = document.querySelectorAll('.btn-delete');

        btnDelete.forEach(e => {
            e.onclick = (event) => {
                const id = event.target.parentElement.parentElement.id;
                books = filterBook(e => e.id != id);
                update();
                document.dispatchEvent(new Event(RENDER_BOOKS))
            }
        });

        btnUpdate.forEach(e=>{
            e.onclick = (event) => {
                isUpdate = true;
                const id = event.target.parentElement.parentElement.id;
                selectedBook = books.findIndex(e=> e.id == id);
                tfTitle.value = books[selectedBook].title;
                tfAuthor.value = books[selectedBook].authorName;
                year.value = books[selectedBook].year;
                isReaded.setAttribute('disabled',true)
                document.querySelector('.add-book').style.display = 'flex';
            }
        });
    }
});

const renderBook = (book) => {
    return `
    <div class="book" id="${book.id}">
        <div class="book-image">
            <img src="./assets/book.jfif" alt="dsfdfsfdsa" class="poster">
        </div>
        <div class="book-description">
            <h3 class="title" id="title">${book.title}</h3>
            <p class="authorName">Author : ${book.authorName}</p>
            <p class="year">Year : ${book.year}</p>
            <p class="status">Book Status : ${book.isReaded ? 'Readed' : 'Unreaded'} </p>
        </div>
    </div>
    `
}

const renderBookManager = (book) => {
    return `
    <div class="book" id="${book.id}">
        <div class="book-image">
            <img src="./assets/book.jfif" alt="dsfdfsfdsa" class="poster">
        </div>
        <div class="book-description">
            <h3 class="title" id="title">${book.title}</h3>
            <p class="authorName">Author : <span id="author">${book.authorName}</span></p>
            <p class="year">Year : <span id="publishYear">${book.year}</span></p>
        </div>
        <div class="book-manager flx gap05">
            <button class="btn btn-secondary btn-delete" >Delete</button>
            <button class="btn btn-secondary btn-update" >Update</button>
        </div>
    </div>
    `
}

const filterBook = (calback) => {
    return books.filter(e => calback(e));
}


