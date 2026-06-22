const fs=require('fs');
let html=fs.readFileSync('C:/Users/Ratio/Documents/coffee/coffees-html/index.html', 'utf8');
let headMatch=html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if(headMatch){
    let head=headMatch[1];
    let cdnAndStyles = head.match(/<link href="https:\/\/fonts[^>]+>[\s\S]*?<style>[\s\S]*?<\/style>/i);
    if(cdnAndStyles){
        let twig=fs.readFileSync('D:/store_Ratio/Ratio-Salla-Theme/src/views/pages/index.twig', 'utf8');
        let newBlock = '\n{% block styles %}\n' + cdnAndStyles[0] + '\n{% endblock %}\n';
        twig = twig.replace('{% block content %}', newBlock + '{% block content %}');
        fs.writeFileSync('D:/store_Ratio/Ratio-Salla-Theme/src/views/pages/index.twig', twig);
        console.log('Styles injected!');
    }
}
