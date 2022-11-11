// TODO Clean up variable so that I only use one counter!!!
// TODO Clean up console logs.
// TODO test test test!!!!
// TODO Make function async and add await.
// TODO Clean up spacing, fix any formatting.


let counter = 0;


const composeObserver = new MutationObserver(() => 
{
	composeObserver.disconnect();
	load();
})


document.body.onload = async () => 
{
	await load();
}


window.addEventListener('click', async () => 
{
	counter = 0;
	await load();
})


let load = async () =>
{
	let ischecked = '';
	try {
		await getAuthors({question: 'Authors'}).then((response) =>
		{
			let answer = insertAuthor(response)
			answer.then((authors) => {
				let response = getIsChecked({question: 'ischeck'})
				response.then(() => {
					counter = filter(authors,ischecked,counter);
				})
			})
		})
	}
	catch {
			console.log('error!');
	}
	addObserverIfDesiredNodeAvailable();
}


function addObserverIfDesiredNodeAvailable() {
    let composeBox = document.querySelector('#search');
	
    if(!composeBox) 
	{
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    };
    let config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
}


const filter = async (authors,ischecked,counter) =>  
{
	return new Promise((resolve,reject) => {
		composeObserver.disconnect();
		if (ischecked == 'no')
		{
			reject();
		}
			const arr = Array.from(document.querySelectorAll('[data-index]'))
			for (const element of arr)
			{
					for (const author of authors)
					{
						if (element.textContent.includes(author.first_name) && element.textContent.includes(author.last_name)) 
						{ 
							element.innerHTML ='';
							counter = counter + 1;
						}
					}
			}
			SendData(counter);
			resolve(counter);
		})
}


let insertAuthor = async (response) => 
{
	let authors = [];
	return new Promise((resolve,reject) =>
	{
		for (const author of response.Sending) 
		{			
			let name = {};
			name.first_name = author.first_name;
			name.last_name = author.last_name;
			authors.push(name);
		}
		if (typeof response.Sending == 'undefined') 
		{
			console.log("Error receiving author data! ");
			reject();
		}
		else resolve(authors);
	})
}


const SendData = (counter) =>
{
	if (counter > 0)
	{
		chrome.runtime.sendMessage({Counter: counter})
	}
}


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
		})
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
    })
	})
}

