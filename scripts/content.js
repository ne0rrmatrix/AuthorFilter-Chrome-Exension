// TODO clean up variable so that I only use one counter!!!
// TODO clean up console logs.
// TODO test test test!!!!

var authors = [];
var sponsored = false;
var savedCounter = 0;
var ischecked = '';
var clicked = false;
let counter = 0;




chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request.ischeckedSending) {ischecked = request.ischeckedSending;}
		if (response.question == 'Counter') sendResponse({SendingCounter: counter})
	});

	


function getAuthors()
{
	chrome.runtime.sendMessage({question:"Authors"}, function(response) 
	{
		authors.length = 0;
		for (const author of response.Sending) 
			{
				insertAuthor(author.first_name,author.last_name);
			};
			filter();
	});
}



const composeObserver = new MutationObserver(() => 
{
	filter();
});


document.body.onload = function() 
{
	getIsChecked();
	getAuthors();
	filter()
}




function addObserverIfDesiredNodeAvailable() {
    var composeBox = document.querySelector('#search');
	
    if(!composeBox) {
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    var config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
	
};


function filter() 
{
		composeObserver.disconnect();
		if (ischecked == 'yes')
		{
			const arr = Array.from(document.querySelectorAll('[data-index]'))
			for (let i = 0; i < arr.length; i++)
			{
					for (author of authors)
					{
						if (arr[i].textContent.includes(author.first_name) && arr[i].textContent.includes(author.last_name)) 
						{ 
							arr[i].innerHTML ='';
							counter = counter + 1;
								savedCounter = counter;
						}
					}
			};

			SendData(savedCounter);
			addObserverIfDesiredNodeAvailable();
		}
};


function insertAuthor(first,last) 
{
	let name = {}
	name.first_name = first;
	name.last_name = last;
	authors.push(name);
};


function SendData(counter)
{
	if (counter > 0)
	{
		savedCounter = counter;
		chrome.runtime.sendMessage({Counter: counter})
	}
};


function getIsChecked()
{
	
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		if (response.Sendingischeck) {ischecked = response.Sendingischeck;}; 
	});
}

window.addEventListener('click', () => {
counter = 0;
savedCounter = 0;
filter();
});