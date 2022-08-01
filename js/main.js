let books;
const addBook = document.querySelector('#btn-addBook');
const addBookUserForm = document.querySelector('#add-book')
const tfTitle = document.querySelector('#tfBookTitle');
const tfAuthor = document.querySelector('#tfAuthor');
const year = document.querySelector('#year');
const isReaded = document.querySelector('#IsReaded');
const REFRESH = 'refresh';
let isUpdate = false;
let isSearch = false;
let id;
let searchResult;


document.addEventListener('DOMContentLoaded', () => {
    books = getBooks();
    displayBooks(books);
    const tfSearch = document.querySelector('#searchBook');
    const unreadedBook = document.querySelector('#unreadedBooks')
    const readedBook = document.querySelector('#readedBooks');



    if (addBook) {
        addBook.onclick = () => {
            document.querySelector('.add-book').style.display = 'flex';
            isUpdate = false;
            isReaded.removeAttribute('disabled')

        };
        addBookUserForm.addEventListener('submit', (event) => {
            const selectedIndex = books.findIndex(e=> e.id == id );
            !isUpdate ? books.push(createBook('',tfTitle.value, tfAuthor.value, year.value, isReaded.checked)) : books[selectedIndex]= createBook(id,tfTitle.value, tfAuthor.value, year.value, isReaded.checked);
            if(isSearch){
                const p = searchResult.findIndex(e => e.id == books[selectedIndex].id);
                searchResult[p]= createBook(id,tfTitle.value, tfAuthor.value, year.value, isReaded.checked);
                displayBooks(searchResult);
            }else displayBooks(books);

            event.preventDefault();
            addBookUserForm.parentElement.style.display = 'none';
            update();
        });
        addBookUserForm.querySelector('.close').onclick = () => {
            addBookUserForm.parentElement.style.display = 'none';
        };
    }
    tfSearch.oninput = () => {
        isSearch = tfSearch.value === '' ? false : true ;
        const clue = tfSearch.value.toLowerCase();
        searchResult = filterBook(e => {
            return  e.title.includes(clue)
        })
        console.log(searchResult);
        displayBooks(searchResult);
    }

    if(unreadedBook && readedBook){
            let unread ;
            let readed ;
        if(isSearch){
            unread = filterBook(e => e.title.includes(tfSearch.value.toLowerCase()) && e.isReaded == false)
            readed = filterBook(e => e.title.includes(tfSearch.value.toLowerCase()) && e.isReaded == true)
        }else{
            unread = filterBook(e => e.isReaded == false);
            readed = filterBook(e => e.isReaded == true);
        }
        
        unreadedBook.innerHTML = unread.reduce((p,c) => p + renderBookReadMenu(c),'');
        readedBook.innerHTML = readed.reduce((p,c) => p + renderBookReadMenu(c),'');
        

        const markTrigger = document.querySelectorAll('.books .btn-read');
        markTrigger.forEach(e => {
            e.onclick = (event) => {
                const id  = event.target.parentElement.parentElement.id;
                console.log(id);
                const bookindex = books.findIndex(e => e.id == id);
                books[bookindex].isReaded = books[bookindex].isReaded ? false : true ; 
                update();
                document.dispatchEvent(new Event('DOMContentLoaded'));
            }
        })

        tfSearch.oninput = () => {
            isSearch = tfSearch.value === '' ? false : true ;
            document.dispatchEvent(new Event('DOMContentLoaded'))
        }

    }

});

const createBook = (id  ,title, authorName, year, isReaded) => {
    return {
        id : id || generateId(),
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


const displayBooks = (bookss) => {
    const booksc = document.querySelector('#booksList');
    const manageBook = document.querySelector('#booksManage');
    
    if (booksc) {
        booksc.innerHTML = bookss.reduce((p, c) => p + renderBook(c), '');
    } 
    else if (manageBook) {
        manageBook.innerHTML = bookss.reduce((p, c) => p + renderBookManager(c), '');
    }

    if(addBook){
        const btnUpdate = document.querySelectorAll('.btn-update');
        const btnDelete = document.querySelectorAll('.btn-delete');

        btnDelete.forEach(e => {
            e.onclick = (event) => {
                const id = event.target.parentElement.parentElement.id;
                if(confirm('apakah anda yakin untuk menghapus buku ? ')){
                    books = filterBook(e => e.id != id);
                    update();
                    if(isSearch) {
                        searchResult = searchResult.filter(e=> e.id != id);
                        displayBooks(searchResult)
                    }else {
                        displayBooks(books)
                    } 
                }
            }
        });

        btnUpdate.forEach(e=>{
            e.onclick = (event) => {
                isUpdate = true;
                id = event.target.parentElement.parentElement.id;
                const selectedBook = books.findIndex(e=> e.id == id);
                tfTitle.value = books[selectedBook].title;
                tfAuthor.value = books[selectedBook].authorName;
                year.value = books[selectedBook].year;
                isReaded.setAttribute('disabled',true)
                document.querySelector('.add-book').style.display = 'flex';
            }
        });
    }
}
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


const renderBookReadMenu = (book) => {
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
            <button class="btn btn-secondary btn-read" >Mark as ${book.isReaded ? 'Unreaded' : 'Readed' }</button>
        </div>
    </div>
    `
}
const filterBook = (calback) => {
    return [...books].filter(e => calback(e));
}


