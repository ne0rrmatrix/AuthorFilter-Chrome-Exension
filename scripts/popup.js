var counter = 0;
var isChecked = 1;

chrome.runtime.sendMessage({question:"Counter"}, function(response) 
{
  savedCounter = response.SendingCounter;
  console.log(response.SendingCounter);
  filter();
  changed(response.SendingCounter);
});

 function SendStatus(status)
 {
  chrome.runtime.sendMessage({Status: status}, function(response) 
  {
    if (response.answer === "Received") console.log("Succesfully sent status!");
  });
 }     
document.body.onload = function() 
{
  

  let h2 = document.createElement('h2');
  let tbody = document.createElement('tbody');
  let text = document.createTextNode('Authors Blocked');
  let numbers_text = document.createTextNode(counter);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement('h2');
  h2.appendChild(numbers_text);
  tbody.appendChild(h2);
  document.getElementById("AuthorsBlocked").appendChild(tbody);
}

const checkbox = document.getElementById('btn')

checkbox.addEventListener('click', function() {
    if (isChecked == 1) {
    isChecked = 0;
    SendStatus(0)
    console.log(isChecked);
    
  } else 
  {
    isChecked = 1;
    SendStatus(1);
    console.log(1);
  }
 
})

function filter() 
{
    const arr = document.querySelector('div');
    arr.innerHTML ='';
}
function changed(counter)
{
  let h2 = document.createElement('h2');
  let tbody = document.createElement('tbody');
  let text = document.createTextNode('Authors Blocked');
  let numbers_text = document.createTextNode(counter);

  h2.appendChild(text);
  tbody.appendChild(h2);
  h2 = document.createElement('h2');
  h2.appendChild(numbers_text);
  tbody.appendChild(h2);
  document.getElementById("AuthorsBlocked").appendChild(tbody);
}   