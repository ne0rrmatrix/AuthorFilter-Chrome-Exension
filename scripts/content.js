var authors = [];
var sponsored = false;
var savedCounter = 0;
var ischecked = 1;

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

getIsChecked();
const composeObserver = new MutationObserver(() => 
{
	console.log('Mutation observed!');
	filter();
});

function addObserverIfDesiredNodeAvailable() {
    var composeBox = document.querySelector('#search');
	
    if(!composeBox) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    var config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
	//checkPage();
	console.log('Observer Connected!');
	
}
addObserverIfDesiredNodeAvailable();

setTimeout(() => {composeObserver.disconnect();console.log('Observer Disconnected!');addObserverIfDesiredNodeAvailable();}, 5000);

function filter() 
{
	let counter = 0;
	
	console.log(ischecked);
	if (ischecked == 1 || typeof temp == 'undefined')
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
}

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
//GetIsCheckedStatus()
function getIsChecked()
{
	chrome.runtime.sendMessage({question:"ischeck"}, function(response) 
	{
		console.log('Received ischeck! ' + response.Sendingischeck);	
		ischecked = response.Sendingischeck; 
	});
}
