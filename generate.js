const parse = require("./parse");

module.exports = function generate(name, source, context)
{

    var Name = name.split("-").map(part=>part[0].toUpperCase() + part.slice(1).toLowerCase()).join("");
    return `
    class ${Name} extends HTMLElement
    {
        constructor()
        {
            super();
        }
        connectedCallback()
        {

${parse(source,context)}

            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(a0);
        }
    }
    customElements.define("${name}", ${Name});

    `
}