var authors = [];
var sponsored = false;
var Ischecked = 'yes';
var savedCounter = 0;

const elementToObserver = document.querySelector('#search');


chrome.runtime.sendMessage({question:"data"});

chrome.runtime.onMessage.addListener(function(msg) {
	
		for (const author of msg.SendAuthors) 
		{
			insertAuthor(author.first_name,author.last_name);
			
		}
		isChecked = msg.SendingChecked;
})

const observer = new MutationObserver(() => 
{
	console.log('Mutation observed!');
	filter();
});

checkPage();
 if (!location.href.includes('amazon')) {observer.disconnect();console.log('Observer Disconnected!')}
setTimeout(() => {observer.disconnect();console.log('Observer Disconnected!');checkPage();}, 5000);
 

function filter() 
{
	let counter = 0;
	const arr = Array.from(document.querySelectorAll('#search'))
	if (arr != '' && authors.length != '') 
	{
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
			chrome.runtime.sendMessage({CounterData : savedCounter})
		}	
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
}