function processData(data) {
    var html = '';
    for (element of data.data) {
        html += `<div class="kn">`;
        html += `<h2>${element.kn}</h2>`;
        html += `<p>${element.meaning}</p>`;
        html += `<div class="example">`;
        for (example of element.example) {
            html += `<p>${example}</p>`;
        }
        html += `</div></div>`;
    }
    document.getElementById('filecontent').innerHTML = html;
};

fetch('https://officialcommentsleague.github.io/data.json')
    .then(response => response.json())
    .then(data => processData(data));