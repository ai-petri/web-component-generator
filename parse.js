const vm = require('vm');


module.exports = function parse(template, context)
{
    var n = 0;
    var tag = false;
    var closingTag = false;
    var expression = false;
    var currentTag = "";
    var currentElement = {name:"div", number:0, text:""};
    var elements = [];

    var contextString = "";
    if(context && Object.keys(context).length > 0)
    {
        contextString = Object.keys(context).map(prop=>`let ${prop}=${(typeof(context[prop] == "string"))? "\""+context[prop]+"\"": context[prop]};`).join("");
    }
    

    var str = `let a${currentElement.number} = document.createElement("${currentElement.name}");\n`;

    var expr = "";


    for(let i=0; i<template.length; i++)
    {
        let char = template[i];

        if(expression)
        {
            if(char == "}")
            {
                expression = false;
                if(!tag)
                {
                    
                    currentElement.text += vm.runInNewContext(contextString + expr);

                }
                expr = "";
            }
            else
            {
                expr += char;
            }
        }
        else
        {
            switch(char)
            {
                case "{":
                    expression = true;
                    break;
                case "<":
                    tag = true;
                    break;
                case "/":
                    closingTag = true;
                    break;
                case ">":
                    if(closingTag)
                    {
                        currentElement = elements.pop(); 
                        if(currentElement.text.length > 0)
                        {
                            str += `a${currentElement.number}.innerText = "${currentElement.text}";\n`;
                        }                             
                    }
                    else
                    {
                        let parent = currentElement;
                        let name = currentTag.split(" ")[0];
                        currentElement = {name, number: ++n, text: ""};
                        str += `let a${currentElement.number} = document.createElement("${currentElement.name}");\n`;
                        let attributes = currentTag.trim().split(" ").slice(1);
                        for(let attr of attributes)
                        {
                            let parts = attr.split("=");
                            str += `a${currentElement.number}.setAttribute("${parts[0]}",${parts[1]});\n`
                        }
                        str += `a${parent.number}.append(a${currentElement.number})\n`; 
                        elements.push(currentElement);
                    }
                    tag = false;
                    closingTag = false;
                    currentTag = "";
                    break;
                default:
                    if(tag)
                    {
                        currentTag += char;               
                    }
                    else
                    {
                        currentElement.text += char;
                    }
                    break;
            }

        }

        
    }

    return str;
}
