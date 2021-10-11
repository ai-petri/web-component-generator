
export default function createTree(template)
{
    function Element(tag,parent)
    {
        let arr = tag.split(" ");
        this.name = arr[0];
        this.attributes = {};
        if(arr.length>1)
        {
            for(let i=1; i<arr.length; i++)
            {
                let parts = arr[i].split("=");
                this.attributes[parts[0]] = parts[1];
            }
        }
        this.parent = parent;
        this.children = [];
        this.text = "";
    }

    var tag = false;
    var closingTag = false;
    var currentTag = "";
    var root = new Element("root");
    var currentElement = root;

    for(let i=0; i<template.length; i++)
    {
        let char = template[i];

        
        switch(char)
        {
            case "<":
                tag = true;
                break;
            case "/":
                closingTag = true;
                break;
            case ">":
                if(closingTag && currentTag == currentElement.name)
                {
                    currentElement = currentElement.parent;
                }
                else
                {
                    let el = new Element(currentTag,currentElement)
                    currentElement.children.push(el);
                    currentElement = el;
                }
                currentTag = "";
                tag = false;
                closingTag = false;
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

        }
    }

    return root;
}
