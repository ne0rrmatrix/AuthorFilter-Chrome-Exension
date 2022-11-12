//TODO Make function async and add await
//TODO Fix any formatting, spacing, and make sure function are on bottom.


document.getElementById("reset").onclick = () => 
{
  let authors = [];
  authors.length = 0;
  SendAuthors({SendingAuthors: authors});
  load();
};


document.body.onload = async () =>
{
  load();
};


const load = async () =>
{
  filter();
  
  try {
        await getAuthors({question: 'Authors'}).then((response) => {
          let answer = insertAuthor(response)
          answer.then((authors) => {
            createTableElements(authors);
              show(authors);
          })
        })
  }
  catch {
          console.log('error');
          let authors = [];
          createTableElements(authors)
  }
};


const getAuthors = async (msg) =>
{
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, function(response) 
      {
        if (typeof response.Sending == 'undefined') 
        {
          reject()
        }
        else 
        {
          resolve(response);
        }
        
    })
	});
};


const insertAuthor = async (response) => 
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


const filter = () => 
{
  
  const arr = document.querySelector('div');
    arr.innerHTML ='';
}


const SendAuthors = async (msg)  => 
{
  return new Promise((resolve,reject) => {
    chrome.runtime.sendMessage(msg, function(response)
    {
      if (typeof response.answer == 'undefined')
      {
        reject();
      }
      else resolve(response);
    });
  })
};


const createTableElements = async (authors) =>
{
  
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  let tr = document.createElement('tr');
    
  let arr = ['First Name','Last Name','Del'];
  
  for (const element of arr) 
  {
    let th = document.createElement('th'); 
    let text = document.createTextNode(element)
    th.appendChild(text);
    tr.appendChild(th);
    tbody.appendChild(tr);
  }

  let fn = document.createElement("input");
  fn.id = "first_name";
  let ln = document.createElement("input");
  ln.id = "last_name";
  
  let btnAdd = document.createElement('button');
  btnAdd.innerText = "Add";
  btnAdd.id = "Add";
  btnAdd.className = "button";

  btnAdd.addEventListener('click', async () => 
  {
    let first = document.getElementById('first_name').value;
    let last = document.getElementById('last_name').value;
    try 
    {
      let name = {};
      name.first_name = first;
      name.last_name = last;
      authors.push(name);
      await  SendAuthors({SendingAuthors: authors});
      load();
    }
    catch 
    {
            console.log('Error')
    }
  });


  arr = [fn,ln,btnAdd];
  tr = document.createElement('tr');
    for (const element of arr) 
    {
        let td = document.createElement('td');
        td.appendChild(element);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

  table.appendChild(tbody);
  document.getElementById("blocklist").appendChild(table);
};


const show = async (authors) => 
{
    let tbody  = document.getElementById('blocklist').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
  
    for (let i = 0; i < authors.length; i++)
    {  
      let tr = document.createElement('tr')
      tr.id = i;
      let fn = document.createTextNode(authors[i].first_name);
      let ln = document.createTextNode(authors[i].last_name);
      let btnDel = document.createElement('button');
      btnDel.innerText = "Del";
      btnDel.id = "del";
      btnDel.className = "button button3";
      let arr = [fn,ln,btnDel];
    
      for (const element of arr)
      {
          
          let td = document.createElement('td');
          td.appendChild(element);
          tr.appendChild(td);
          tbody.appendChild(tr);          
      }

      btnDel.addEventListener('click', async () => 
            {
              authors.splice(authors[i],1);
              let msg = {SendingAuthors: authors}
              await SendAuthors(msg);
              load();          
            });
  }
  document.getElementById('blocklist').appendChild(tbody);
};