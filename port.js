const fs = require('fs');
let html = fs.readFileSync('C:/Users/Ratio/Documents/coffee/coffees-html/index.html', 'utf8');
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if(bodyMatch) {
    let content = bodyMatch[1];
    // Replace src="img.png" with src="{{ 'images/img.png' | asset }}"
    content = content.replace(/src="(?!http)(.*?)"/g, "src=\"{{ 'images/$1' | asset }}\"");
    content = content.replace(/url\('(?!http)(.*?)'\)/g, "url('{{ 'images/$1' | asset }}')");
    
    let twig = '{% extends "layouts.master" %}\n{% block content %}\n' + content + '\n{% endblock %}';
    fs.writeFileSync('D:/store_Ratio/Ratio-Salla-Theme/src/views/pages/index.twig', twig);
    console.log('Successfully wrote index.twig');
}
