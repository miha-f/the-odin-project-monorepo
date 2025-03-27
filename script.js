const dialog = document.getElementById('dialog');
const newBookButton = document.getElementById('new-book');
const submitButton = document.getElementById('submit-button');

newBookButton.addEventListener('click', () => {
    dialog.showModal();
});

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const numberOfPages = document.getElementById('numberOfPages');
    const read = document.getElementById('read');
    addBookToLibrary(title.value, author.value, numberOfPages.value, read.checked);
    refreshDisplayLibrary();
    dialog.close();
});

const library = [];

function Book(title, author, numberOfPages, isRead) {
    if (!new.target)
        throw Error("you should use 'new' keyword when creating book");

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.isRead = isRead;
};

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.numberOfPages} pages, ${this.isRead ? 'read' : 'not read yet'}`;
};

const refreshDisplayLibrary = () => {
    const div = document.querySelector(".main");
    while (div.firstChild) {
        div.removeChild(div.lastChild);
    }
    displayBooksInLibrary();
}

const addBookToLibrary = (title, author, numberOfPages, isRead) => {
    library.push(new Book(title, author, numberOfPages, isRead));
};

const displayBooksInLibrary = () => {
    const div = document.querySelector(".main");
    library.forEach((book) => {
        const info = document.createElement("p");
        info.textContent = book.info();
        div.appendChild(info);
    });
};

addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, true);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
addBookToLibrary("Moby-Dick", "Herman Melville", 635, true);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 432, false);
addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, true);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, false);

displayBooksInLibrary();
