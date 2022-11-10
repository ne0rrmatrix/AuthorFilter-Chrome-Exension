//TODO Make function async and add await
//TODO Fix any formatting, spacing, and make sure function are on bottom.

let authors = [];


function insertAuthor(first,last) 
{
  let name = {}
  name.first_name = first;
  name.last_name = last;
  authors.push(name);
};


document.body.onload = async () =>
{
 
  await getAuthors();
  
};


document.getElementById("reset").onclick = () => 
{
  authors.length = 0;
  SendAuthors();
  show();
};


async function getAuthors()
{
  authors.length = 0;
  chrome.runtime.sendMessage({question: "Authors"}, function(response) 
		{
			for (const author of response.Sending) 
        {
          insertAuthor(author.first_name,author.last_name);
        };
        show()
        return;
		});

}


function filter() 
{
  
  const arr = document.querySelector('div');
    arr.innerHTML ='';
};


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
    return;
  })
};

async function show() 
{
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    let arr = ['First Name','Last Name','Del']
    
    for (let i = 0; i < arr.length; i++) 
    {
      let th = document.createElement('th'); 
      let text = document.createTextNode(arr[i])
      th.appendChild(text)
      tr.appendChild(th);
      tbody.appendChild(tr);
    };

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
      insertAuthor(first,last);
      try {
        let msg = {SendingAuthors: authors}
        let answer = await  SendAuthors(msg);
        console.log(answer.answer);
        filter();
        show();
      }
      catch {
            console.log('Send authors failed from options.js!');
      }
      
    //  SendAuthors();
     
    });

    arr = [fn,ln,btnAdd];
    tr = document.createElement('tr');
    
    for (let i = 0; i < arr.length; i++) 
    {
        let td = document.createElement('td');
        td.appendChild(arr[i]);
        tr.appendChild(td);
        tbody.appendChild(tr);
    };

    tr = document.createElement('tr');
    
    if (authors.length != '')
    {
        for (let i = 0; i < authors.length; i++)
        {
            let btnDel = document.createElement('button');
            btnDel.innerText = "Del";
            btnDel.id = "Del";
            btnDel.className = "button button3";
            
            btnDel.addEventListener('click', async () => 
            {
              authors.splice(i,1);
              try {
                let msg = {SendingAuthors: authors}
                let answer = await  SendAuthors(msg);
                console.log(answer.answer);
                filter();
                show();
              }
              catch {
                    console.log('Send authors failed from options.js!');
              }
              
            });

            tr = document.createElement('tr');
            let fn = document.createTextNode(authors[i].first_name);
            let ln = document.createTextNode(authors[i].last_name);
            arr = [fn,ln,btnDel]
            
            for (let k = 0; k < arr.length; k++)
            {
                var td = document.createElement('td');
                td.appendChild(arr[k]);
                tr.appendChild(td);
                tbody.appendChild(tr);
            };
        };
    };

    table.appendChild(tbody);
    document.getElementById("blocklist").appendChild(table);
    return;
};

