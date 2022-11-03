var authors = [];
var sponsored = false;
var savedCounter = 0;
const elementToObserver = document.querySelector('body');


var port = chrome.runtime.connect({name:"content"});
port.onMessage.addListener(function(response,sender,sendResponse)
{
	StoreDataAndFilter(response);
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log(sender.tab ?
				  "from a content script:" + sender.tab.url :
				  "from the extension");
	  if (request.greeting == "hello")
		sendResponse({farewell: savedCounter.toString()});
	}
  );

const observer = new MutationObserver(() => 
{
	console.log('Mutation observed!');
	filter();
});

checkPage();
 if (!location.href.includes('amazon')) {observer.disconnect();console.log('Observer Disconnected!')}
setTimeout(() => {observer.disconnect();console.log('Observer Disconnected!');checkPage();}, 5000);
 

function SendData(counter)
{
	if (counter > 0)
	{
		savedCounter = counter;
	}
	
	if (savedCounter > 0)
	{
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
			  console.log(sender.tab ?
						  "from a content script:" + sender.tab.url :
						  "from the extension");
			  if (request.greeting == "hello")
				sendResponse({farewell: savedCounter.toString()});
			}
		  );
		chrome.runtime.sendMessage(savedCounter);
	}
};

function filter() 
{
	let counter = 0;
	let sponsoredCounter = 0;
	const arr = Array.from(document.querySelectorAll('[data-index]'))
	for (let i = 0; i < arr.length; i++)
		{
			if (sponsored && arr.textContent.includes('Sponsored'))
			{
				arr[i].innerHTML = '';
				sponsoredCounter += 1;
			}
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
		if (counter > savedCounter) savedCounter = counter;
		SendData(savedCounter)
};

function StoreDataAndFilter(response)
{
	if (typeof response === "undefined") {
        
       }
	else if (response != 'number')
	{
		for (const author of response) 
		{
			insertAuthor(author.first_name,author.last_name);
			
		}
		filter();
	}	
};

function checkPage() {
	observer.observe(elementToObserver,{subtree: true, childList: true,characterData: true});
	console.log('Observer Connected!');
};

function insertAuthor(first,last) 
{
	let name = {}
	name.first_name = first;
	name.last_name = last;
	authors.push(name);
};