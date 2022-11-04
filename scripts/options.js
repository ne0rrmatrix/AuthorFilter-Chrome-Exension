let authors = [];
function insertAuthor(first,last) 
{
  let name = {}
  name.first_name = first;
  name.last_name = last;
  authors.push(name);
};

document.body.onload = function() 
{
  authors.length = 0;
 
  chrome.runtime.sendMessage({question:"authors"});

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
  {
     
        for (const author of request.SendingAuthors) 
        {
          insertAuthor(author.first_name,author.last_name);
          console.log(author.first_name + ' ' + author.last_name);
        };
      

      isChecked = request.SendingChecked;
  });
}


show();

document.getElementById("reset").onclick =function() 
{
  authors.length = 0;
  chrome.runtime.sendMessage({AuthorsData:authors});
  location.reload()
}

function show() 
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

    btnAdd.addEventListener('click', () => 
    {
      let first = document.getElementById('first_name').value;
      let last = document.getElementById('last_name').value;
      insertAuthor(first,last);
      chrome.runtime.sendMessage({AuthorsData:authors});
      location.reload()
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
    
    if (authors.length > 0)
    {
        for (let i = 0; i < authors.length; i++)
        {
            let btnDel = document.createElement('button');
            btnDel.innerText = "Del";
            btnDel.id = "Del";
            btnDel.className = "button button3";
            
            btnDel.addEventListener('click', () => 
            {
              authors.splice(i,1);
              chrome.runtime.sendMessage({AuthorsData:authors});
              console.log("Option seding Author Data as: OptionsAuthors")
              location.reload();
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
};

