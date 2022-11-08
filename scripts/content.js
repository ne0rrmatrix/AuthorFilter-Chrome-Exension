var authors = [];
var sponsored = false;
var savedCounter = 0;
var ischecked;

getIsChecked();

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request.ischeckedSending) {sendResponse({answer: "Received"});ischecked = request.ischeckedSending;
		console.log("received ischeck. Value is: " + ischecked);
		sendResponse({answer: "Received"});}
		if (response.question == 'Counter') sendResponse({SendingCounter: counter})
	});

chrome.runtime.sendMessage({question:"Authors"}, function(response) 
{
	authors.length = 0;
	console.log('Received author list!');
	for (const author of response.Sending) 
		{
			insertAuthor(author.first_name,author.last_name);
			console.log(author.first_name + ' ' + author.last_name);
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
	console.log('Observer Connected!');
	
};

addObserverIfDesiredNodeAvailable();

setTimeout(() => {composeObserver.disconnect();console.log('Observer Disconnected!');addObserverIfDesiredNodeAvailable();}, 5000);

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
						console.log(author.first_name + " " + author.last_name + " deleted!")
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
		chrome.runtime.sendMessage({Counter: counter}, function(response) 
		{
			console.log(response.answer);	
		});
	}
};

function getIsChecked()
{
	if (typeof ischecked != 'undefined' || ischecked != '')
	{
		chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		console.log('Received ischeck! ' + response.Sendingischeck);	
		ischecked = response.Sendingischeck; 
	});
	filter();
	}
	
};
