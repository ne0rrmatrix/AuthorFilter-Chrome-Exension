var counter = 0;
var isChecked = "yes";



document.body.onload = function() 
{
  chrome.runtime.sendMessage({question:"ischeckedOptions"}, function(response) 
  {
    if (typeof response.Sending != 'undefined')
    isChecked = response.Sending; 
  });

  chrome.runtime.sendMessage({question:"PopupCounter"}, function(response) 
  {
    if (typeof response.Sending != 'undefined')
      counter = response.Sending; 
  });

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
    if (isChecked == 'yes') {
    isChecked = "no";
    chrome.runtime.sendMessage({PopupChecked:'no'});
    console.log('no');
    
  } else {
    isChecked = 'yes';
    chrome.runtime.sendMessage({PopupChecked:'yes'});
    console.log('yes');
  }
 
});
