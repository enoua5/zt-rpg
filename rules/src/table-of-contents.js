document.addEventListener("DOMContentLoaded", () => {

    /**
     * Creates a non-conflicting id for a heading
     * 
     * @param {string} heading_text - the text of the heading that the id will be based on
     * 
     * @return {string}
     */
    function create_heading_id(heading_text)
    {
        let base_id = heading_text.split('').filter(c=>c.match(/[a-zA-Z0-9\s\-]/)).map(c => c.match(/\s/) ? '-':c).join('');
        let id = base_id;

        let count = 10;
        while(document.getElementById(id))
        {
            id = base_id + "-" + count.toString(36);
            count++;
        }

        return id;
    }

    /**
     * Creates the table of contents for the page
     * 
     * @return {HTMLElement}
     */
    function create_table_of_contents()
    {
        let table_of_contents = document.createElement("details");
        let summary = document.createElement("summary");
        summary.innerText = "Table of Contents";
        table_of_contents.appendChild(summary);


        // get a list of all headings on the page in order
        let headings = document.querySelectorAll("h2,h3,h4,h5,h6");
        let li_stack = [{ item: table_of_contents, level: 1 }];
        for(let heading of headings)
        {
            let heading_text = heading.innerText;
            let heading_level = parseInt(heading.tagName[1]);

            let li = document.createElement("li");
            let a = document.createElement("a");
            a.innerText = heading_text;
            li.appendChild(a);

            if(!heading.id)
            {
                let id = create_heading_id(heading.innerText);
                heading.id = id;
            }
            a.href = "#"+heading.id;


            while(heading_level < li_stack[li_stack.length - 1].level)
            {
                li_stack.pop();
            }

            if(heading_level > li_stack[li_stack.length - 1].level)
            {
                // the current item is nested in the last
                let ul = document.createElement("ul");
                ul.appendChild(li);
                li_stack[li_stack.length - 1].item.appendChild(ul);
                li_stack.push({ item: li, level: heading_level });
            }
            else
            {
                li_stack[li_stack.length - 1].item.after(li);
                li_stack[li_stack.length - 1].item = li;
            }
        }

        return table_of_contents;
    }


    let h1s = document.getElementsByTagName("h1");
    
    // quit if we don't have a main heading to work off of
    if(h1s.length == 0) return;

    // if there's multiple main headings, we just want the first
    let h1 = h1s.item(0);


    // add the table of contents dropdown
    h1.after(document.createElement("hr"))
    h1.after(create_table_of_contents());
});
