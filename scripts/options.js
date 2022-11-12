//TODO Make function async and add await
//TODO Fix any formatting, spacing, and make sure function are on bottom.

let authors = [];
let btnAdd = document.createElement('button');


btnAdd.addEventListener('click', async () => 
{
  let first = document.getElementById('first_name').value;
  let last = document.getElementById('last_name').value;
  insertAuthor(first,last);
  let msg = {SendingAuthors: authors};
  await  SendAuthors(msg);
  load();
});


document.getElementById("reset").onclick = () => 
{
  let authors = [];
  authors.length = 0;
  let msg = {SendingAuthors: authors}
  SendAuthors(msg);
  load();
};


document.body.onload = async () =>
{
  load();
};


const insertAuthor = async (first,last) =>
{
  let name = {};
  name.first_name = first;
  name.last_name = last;
  authors.push(name);
};


const load = async () =>
{
  filter();
  createTableElements();
  try {
        await getAuthors();
        show();
  }
  catch {
          console.log('error');
  }
};


const getAuthors = async () =>
{
  return new Promise((resolve, reject) => {
    authors.length = 0;
    chrome.runtime.sendMessage({question: "Authors"}, function(response) 
      {
        if (typeof response.Sending == 'undefined') {reject()}
        for (const author of response.Sending) 
          {
            insertAuthor(author.first_name,author.last_name);
          }
        resolve();
    })
	});
};


function filter() 
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


const createTableElements = async () =>
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
 
  btnAdd.innerText = "Add";
  btnAdd.id = "Add";
  btnAdd.className = "button";

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


const show = async () => 
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

