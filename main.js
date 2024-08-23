const hamburgerBTN = document.querySelector('.hamburger')
const navLinks = document.querySelector('.navLinks')
const submitInput = document.querySelector('#submit');
const submitBtn = document.querySelector('.submitBtn');
const errorMessage = document.querySelector('.error');
const linkListDOM = document.querySelector('.linkList');
// API KEY sk_786e38d884694311bff55143d22a1b4e


// Navigation Hamburger Menu 
function hideMenu(){
if(navLinks.classList.contains("displayNone")){
    navLinks.classList.remove('displayNone')
}else{
    navLinks.classList.add('displayNone')
}
}

function copyFunctionality(){
            // Adding Functionality to the Copy Bottons on Load
            const copyButtons =  document.querySelectorAll('.copyButton');

            for(let copyButton of copyButtons){
                let shortenedLinkText = copyButton.previousElementSibling.innerText; 
                //Creating a Text Input and making the value of the shortened Link Text in order to copy it
    
                
                copyButton.addEventListener('click', () => {
                    let tempInputEl = document.createElement('input');
                    tempInputEl.setAttribute('value',shortenedLinkText);
                    copyButton.appendChild(tempInputEl);
                    tempInputEl.select();
                    document.execCommand('copy');
                    copyButton.removeChild(tempInputEl);
    
                    //Styling the Button
                    copyButton.classList.remove('copyButton')
                    copyButton.classList.add('copyButtonClicked')
                    copyButton.innerText = "Copied!"
     
                })
               
            }
}
function deleteFunctionality(){
    let deleteButtons= Array.from(document.querySelectorAll('.deleteButton'))
    deleteButtons.forEach((element,index)=>{
        element.addEventListener('click', (e)=>{
            //Get Element from Dom
            element.parentElement.parentElement.remove();
            // console.log(e.target)
            // console.log('index of Div:',index)
            let clickedIndex = index;
            let pastLinks = JSON.parse(localStorage.getItem('linkHistory'))
            pastLinks.splice(clickedIndex, 1);
            localStorage.setItem('linkHistory', JSON.stringify(pastLinks))
            
        })
    })

}


//Show Link History when page is Loaded
function showLinksonLoad (){
    if(localStorage.getItem('linkHistory')== null){
        return
    }
    let pastLinks = JSON.parse(localStorage.getItem('linkHistory'))
    linkListDOM.innerHTML =''
    // Loop Through the Array for the Dom 
    for(let pastLink of pastLinks){

        linkListDOM.innerHTML += `
        <li class="listItem">
      <div class="listItemLeft">
        <p class="submittedLink">${pastLink.link}</p>
      </div>
      <div class="listItemRight">
        <a href="#" class="shortenedLink">${pastLink.shortenedLink}</a>
        <button class="copyButton">Copy</button>
        <button class="deleteButton">Delete</button>
      </div>
    </li>
        `;
    }


    deleteFunctionality()
    copyFunctionality()    
}

//Turn Link into Shortened Link

 function shortenLink(){
   // Make Sure there is the Input is not Empty
    if(submitInput.value === ''|| submitInput.value === null){
        errorMessage.classList.remove("displayNone")
        errorMessage.textContent = 'Please Add a Link'
        submitInput.classList.add('inputError')
        return
    }


    // Function to Check if the URL is actually a URL
    let validURL;
    function isValidURL(url){
        try{
            new URL(url);
            validURL = true 
        }
        catch(error){
            validURL = false;
        }
    }
    isValidURL(submitInput.value)
    
    
    if(!validURL){
       errorMessage.classList.remove("displayNone")
       errorMessage.textContent = 'Please Enter a Valid Url'
       submitInput.classList.add('inputError')
       return
    }else{
        errorMessage.classList.add("displayNone")
        submitInput.classList.remove('inputError')
    }

  //  Send Input Value to API and Return the Shortened Link
    let data = {
        "url": submitInput.value,
        "expiry": "30m"
    };
    fetch('https://api.manyapis.com/v1-create-short-url',{
        method: 'POST',
        headers:{
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key':'sk_786e38d884694311bff55143d22a1b4e'
        },
        body: JSON.stringify(data)
    }).then((res) =>{ 
        if(!res.ok){
            throw Error('Could Not Fetch Data Please Try Again Later')
        }
        return res.json()
    }).then(function(body){
        let shortURL = body.shortUrl
        addNewLink(shortURL)
    }).catch(err =>{
        errorMessage.classList.remove("displayNone")
        errorMessage.textContent = `${err.message}`
        submitInput.classList.add('inputError')
    })

 }

 function addNewLink(shortURL){


//////////// Put the Links in an Object 
    let newLink = {
        link: submitInput.value,
        shortenedLink: shortURL,
    }



    // Create new Array of Links if it doesn't exist 
    
    if(localStorage.getItem('linkHistory')== null){
        localStorage.setItem('linkHistory', '[]')
    }
    // Add the object with Links to the array in Local Storage
    let pastLinks = JSON.parse(localStorage.getItem('linkHistory'))
    pastLinks.unshift(newLink);
    linkListDOM.innerHTML =''
    // Loop Through the Array for the Dom 
    for(let pastLink of pastLinks){

        
        
        linkListDOM.innerHTML += `
        <li class="listItem">
      <div class="listItemLeft">
        <p class="submittedLink">${pastLink.link}</p>
      </div>
      <div class="listItemRight">
        <a href="${pastLink.shortenedLink}" class="shortenedLink">${pastLink.shortenedLink}</a>
        <button class="copyButton" id="copyButton">Copy</button>
         <button class="deleteButton">Delete</button>
      </div>
    </li>
        `
        deleteFunctionality()
        copyFunctionality()

    }

    localStorage.setItem('linkHistory', JSON.stringify(pastLinks))


    // Loop through local Storage to show the list of shortened Links
}



// Copy Link
 function copyLink(){
     copyButton.classList.remove('copyButton')
     copyButton.classList.add('copyButtonClicked')
     copyButton.innerText = "Copied"
 }

window.addEventListener('DOMContentLoaded', showLinksonLoad)
hamburgerBTN.addEventListener('click', hideMenu)
submitBtn.addEventListener('click', shortenLink)

