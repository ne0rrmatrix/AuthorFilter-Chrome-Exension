// TODO test test test!!!!
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
	composeObserver.disconnect();
	await load();
})


const load = async () =>
{
	try {
		await getAuthors({question: 'Authors'}).then((response) =>
		{
			let answer = insertAuthor(response)
			answer.then((authors) => {
				let ischecked = getIsChecked({question: 'ischeck'})
				ischecked.then((response) => {
					filter(authors,response.Sendingischeck);
					SendData({Counter: counter});
					addObserverIfDesiredNodeAvailable();
				})
			})
		})
	}
	catch {
			console.log('error!');
	}
}


const addObserverIfDesiredNodeAvailable = () => 
{
    let composeBox = document.querySelector('#search');
	
    if(!composeBox) 
	{
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    let config = {subtree: true, childList: true,characterData: true};
    composeObserver.observe(composeBox,config);
}


const filter = async (authors,ischecked) =>  
new Promise((resolve, reject) => 
{
	if (ischecked == 'no') {
		reject();
	}
	composeObserver.disconnect();
	const arr = Array.from(document.querySelectorAll('[data-index]'));
	for (const element of arr) {
		for (const author of authors) {
			if (element.textContent.includes(author.first_name) && element.textContent.includes(author.last_name)) {
				element.innerHTML = '';
				counter = counter + 1;
			}
		}
	}
	resolve();
})


const insertAuthor = async (response) => 
new Promise((resolve, reject) => {
	if (typeof response.Sending == 'undefined') {
		reject();
	}
	let authors = [];
	for (const author of response.Sending) {
		let name = {};
		name.first_name = author.first_name;
		name.last_name = author.last_name;
		authors.push(name);
	}
	resolve(authors);
})


const SendData = async (msg) =>
new Promise((resolve, reject) => {
	{
		chrome.runtime.sendMessage(msg, function (response) {
			if (response.answer != "confirmed!") {
				reject();
			}
			else
				resolve();
		});
	}
})


const getIsChecked =  async (msg) =>
new Promise((resolve, reject) => {
	chrome.runtime.sendMessage(msg, function (response) {
		if (typeof response.Sendingischeck == 'undefined') {
			reject();
		}
		else
			resolve(response);
	});
})


const getAuthors = async (msg) =>
new Promise((resolve, reject) => {
	chrome.runtime.sendMessage(msg, function (response) {
		if (typeof response.Sending == 'undefined') {
			reject();
		}

		else {
			resolve(response);
		}
	});
})

