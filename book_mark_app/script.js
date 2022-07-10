const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal,focus on input

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// modal Event listeners
modalShow.addEventListener('click',showModal); 
modalClose.addEventListener('click',() => modal.classList.remove('show-modal')); 
window.addEventListener('click',(e) => (e.target == modal ? modal.classList.remove('show-modal') : false)); 

// Validate form
  function validate(nameValue, urlValue){
      const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
     const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    //valid
    return true;
 }
// Build bookmarks DOM
function buildBookmarks(){
    // remove all bookmarkvelements
    bookmarksContainer.textContent = '';
    // build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Items
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / linkcontainer
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        // link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item); 
    });
}


// Fetch  Bookmark
function fetchBookmarks(){
    // GEt Bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else{
        // Creat bookmarks array in localstorage
        bookmarks = [
            {
                name: 'Shivanshu github',
                url: 'https://github.com/SHIVanshuSingh07',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url == url){
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localstorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
 function storeBookmark(e) {
     e.preventDefault();
     const nameValue = websiteNameEl.value;
     let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://','https://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark ={
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}
// // Event libtener
bookmarkForm.addEventListener('submit', storeBookmark);
   
// on load, fetch bookmarks
fetchBookmarks();