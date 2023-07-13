var workingSave = "";
var allChars = {};


function inputsToObj()
{
    let obj = {};
    let inputs = document.querySelectorAll("input:not(.dont-save), textarea:not(.dont-save)");
    for(let i of inputs)
    {
        if(i.type == "checkbox")
        {
            obj[i.id] = i.checked;
            continue;
        }
        obj[i.id] = i.value;
    }
    return obj;
}

function loadSaves()
{
    let saveStr = localStorage.getItem("e5-ztchar2-saves") || "";
    try
    {
        allChars = JSON.parse(saveStr);
    }
    catch(e)
    {
        console.info("Saves reset with notice: ", e);
        allChars = {};
        localStorage.setItem("e5-ztchar2-saves", "{}")
    }
}

function fillInputsFromObj(obj)
{
    for(let key of Object.keys(obj))
    {
        console.log(key+": "+obj[key])
        let input = document.getElementById(key);
        if(input.type == 'checkbox') input.checked = obj[key];
        else input.value = obj[key];
    }
}

function loadActive()
{
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if(id != null)
    {
        workingSave = id;
        let char = allChars[id];
        if(char)
        {
            fillInputsFromObj(char);
            return;
        }
    }

    let char = localStorage.getItem("e5-ztchar2-autosave");
    if(char)
    {
        try
        {
            fillInputsFromObj(JSON.parse(char));
        }
        catch(e){}
    }
}

function autosave()
{
    localStorage.setItem("e5-ztchar2-autosave", JSON.stringify(inputsToObj()));
}

function save()
{
    autosave();

    if(!workingSave)
    {
        saveAs();
        return;
    }

    allChars[workingSave] = inputsToObj();
    localStorage.setItem("e5-ztchar2-saves", JSON.stringify(allChars));
    alert("Save completed.")
}

function saveAs()
{
    let id = prompt("Enter a name for the save");
    if(!id)
    {
        alert("Save canceled")
        return;
    }
    if(id in allChars)
    {
        let overwrite = confirm("You already have a save named "+id+". Would you like to overwrite it? WARNING: this cannot be undone.");
        if(!overwrite)
        {
            alert("Save canceled");
            return;
        }
        // else fallthrough
    }
    workingSave = id;
    save();
}

function deleteSave()
{
    if(workingSave)
    {
        let del = confirm("Are you sure you want to delete "+workingSave+"? WARNING: this cannot be undone");
        if(del)
        {
            delete allChars[workingSave];
            localStorage.setItem("e5-ztchar2-saves", JSON.stringify(allChars));
            localStorage.setItem("e5-ztchar2-autosave", "{}");
            reset();
            alert(workingSave+" deleted");
            location.assign("index.html")

        }
        else
        {
            alert("Deletion canceled");
        }
    }
    else
    {
        let del = confirm("Are you sure you want to delete your autosave? WARNING: this cannot be undone");
        if(del)
        {
            localStorage.setItem("e5-ztchar2-autosave", "{}");
            reset();
        }
        else
        {
            alert("Deletion canceled");
        }

    }

}

function exportSave()
{
    document.getElementById("export-box").innerText = JSON.stringify(inputsToObj());
}

function importSave()
{
    let saveData = prompt("Enter character data: ");
    try
    {
        let parsedData = JSON.parse(saveData);
        fillInputsFromObj(parsedData);
        autosave();
    }
    catch(e)
    {
        alert("ERROR: invalid save data");
    }
}

function reset()
{
    let inputs = document.querySelectorAll("input:not(.dont-save), textarea:not(.dont-save)");
    for(let i of inputs)
    {
        if(i.type == "checkbox")
        {
            i.checked = false;
            continue;
        }
        i.value = "";
    }
}