// TODO Clean up variable so that I only use one counter!!!
// TODO Clean up console logs.
// TODO test test test!!!!
// TODO Make function async and add await.
// TODO Clean up spacing, fix any formatting.

var clicked = false;
counter = 0;


const composeObserver = new MutationObserver(() => 
{
	composeObserver.disconnect();
	load();
});


document.body.onload = async () => 
{
	await load();
};


window.addEventListener('click', async () => 
{
	counter = 0;
	await load();
});


const load = async () =>
{
	let ischecked = '';
	try {
		let msg = {question: 'Authors'};
		let response = await getAuthors(msg);
		let msg1 = {question: 'ischeck'};
		answer = await getIsChecked(msg1);
		ischecked = answer.Sendingischeck;
		let authors = await insertAuthor(response);
		counter = await filter(authors,ischecked,counter);
	}
	catch {
			console.log('error!');
	}
	addObserverIfDesiredNodeAvailable(counter);
	return;
}



function addObserverIfDesiredNodeAvailable(counter) {
    var composeBox = document.querySelector('#search');
	
    if(!composeBox) 
	{
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    };
    var config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
	return (counter);
};


filter = async (authors,ischecked) =>  
{
	return new Promise((resolve,reject) => {
		composeObserver.disconnect();
		if (ischecked == 'yes' || ischecked == '')
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
						};
					};
			};
			SendData(counter);
		if (true) resolve(counter);
		};
	})
		
};


insertAuthor = async (response) => 
{
	let authors = [];
	return new Promise((resolve,reject) =>
	{
		for (const author of response.Sending) 
		{			
			let name = {}
			name.first_name = author.first_name;
			name.last_name = author.last_name;
			authors.push(name);
		};
		if (typeof response.Sending == 'undefined') 
		{
			console.log("Error receiving author data! ");
			reject();
		}
		else resolve(authors);
	})
};


function SendData(counter)
{
	if (counter > 0)
	{
		savedCounter = counter;
		chrome.runtime.sendMessage({Counter: counter})
	};
};


const getIsChecked =  async (msg) =>
{
	return new Promise((resolve,reject) =>
	{
		chrome.runtime.sendMessage(msg, function(response) 
		{
			if (typeof response.Sendingischeck == 'undefined') 
			{
				console.log('error getting ischeck');
				reject();
			}
			else resolve(response);
		});
	return;
	})
}


const getAuthors = async (msg) =>
{
	return new Promise((resolve,reject) => {
		chrome.runtime.sendMessage(msg, function(response)
    {
      if (typeof response.Sending == 'undefined')
      {
        reject();
      }
      else resolve(response);
    });
    return;
	})
};

