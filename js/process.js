function makeId(str) {
    return 'kn_id_' + str.replace(' ', '-');
}

function linkify(str) {
    var result = '';
    var lastIdx = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] == '[') {
            result += str.slice(lastIdx, i);
            i++;
            var linkIdx = i;
            while (str[i] != ']') {
                i++;
            }
            var linkingText = str.slice(linkIdx, i);
            var idName = makeId(linkingText);
            result += `<a href="#${idName}">${linkingText}</a>`;
            lastIdx = i + 1;
        }
    }
    result += str.slice(lastIdx, i)
    return result;
};

function processData(data) {
    var html = '';
    for (element of data.data) {
        var idName = makeId(element.kn);
        html += `<div id=${idName} class="kn">`;
        html += `<h2><a href="#${idName}">${element.kn}</a></h2>`;
        for (p of element.meaning) {
            html += `<p>${linkify(p)}</p>`;
        }
        html += `<div class="example">`;
        for (p of element.example) {
            html += `<p>${linkify(p)}</p>`;
        }
        html += `</div></div>`;
    }
    document.getElementById('filecontent').innerHTML = html;
};

var jsonURL = 'https://officialcommentsleague.github.io/data/data.json';
if (testing) {
    jsonURL = 'http://localhost:3000/data/data.json';
}

fetch(jsonURL, { mode: 'cors' })
    .then(response => response.json())
    .then(data => processData(data));