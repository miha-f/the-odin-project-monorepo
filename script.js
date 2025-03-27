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

    const table = document.createElement("table");
    const trHeading = document.createElement("tr");
    const thTitle = document.createElement("th");
    thTitle.textContent = "Title";
    const thAuthor = document.createElement("th");
    thAuthor.textContent = "Author";
    const thPages = document.createElement("th");
    thPages.textContent = "Pages";
    const thRead = document.createElement("th");
    thRead.textContent = "Read";
    const thRemove = document.createElement("th");
    thRemove.textContent = "Remove";
    trHeading.appendChild(thTitle);
    trHeading.appendChild(thAuthor);
    trHeading.appendChild(thPages);
    trHeading.appendChild(thRead);
    trHeading.appendChild(thRemove);
    table.appendChild(trHeading);

    library.forEach((book) => {
        const row = document.createElement("tr");
        const tdTitle = document.createElement("td");
        tdTitle.textContent = book.title;
        const tdAuthor = document.createElement("td");
        tdAuthor.textContent = book.author;
        const tdPages = document.createElement("td");
        tdPages.textContent = book.numberOfPages;
        const tdRead = document.createElement("td");
        tdRead.textContent = book.isRead;
        const tdRemove = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        tdRemove.appendChild(removeButton);
        row.appendChild(tdTitle);
        row.appendChild(tdAuthor);
        row.appendChild(tdPages);
        row.appendChild(tdRead);
        row.appendChild(tdRemove);
        table.appendChild(row);
    });
    div.appendChild(table);
};

addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, true);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
addBookToLibrary("Moby-Dick", "Herman Melville", 635, true);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 432, false);
addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, true);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, false);

displayBooksInLibrary();
