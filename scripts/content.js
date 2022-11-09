var authors = [];
var sponsored = false;
var savedCounter = 0;
var ischecked;

getIsChecked();

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request.ischeckedSending) {ischecked = request.ischeckedSending;}
		if (response.question == 'Counter') sendResponse({SendingCounter: counter})
	});

chrome.runtime.sendMessage({question:"Authors"}, function(response) 
{
	authors.length = 0;
	for (const author of response.Sending) 
		{
			insertAuthor(author.first_name,author.last_name);
		};
		filter();
});

const composeObserver = new MutationObserver(() => 
{
	getIsChecked();
	filter();
});

function addObserverIfDesiredNodeAvailable() {
    var composeBox = document.querySelector('#search');
	
    if(!composeBox) {
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    var config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
	
};

addObserverIfDesiredNodeAvailable();

setTimeout(() => {composeObserver.disconnect();addObserverIfDesiredNodeAvailable();}, 5000);

function filter() 
{
	let counter = 0;
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
						counter +=1;
					}
				}
		}
		if (counter > savedCounter) 
		{
			savedCounter = counter;
			SendData(counter);
		}	
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
	if (typeof ischecked != 'undefined' || ischecked != '')
	{
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		if (response.Sendingischeck) ischecked = response.Sendingischeck; 
	});
	filter();
	}
	
};
