# SimpleJsonDiff
Simple Json Diff

Simple Javascript Tool for Comparing Json Files.

the goal of the script is to scan the first json,
and comparing it to the second one,
the tool will notify if there any changes:
    *if the value of the key isnt exsits
    *if the value between them two diffrent(type or value)

the tool use very simple logic of scaning
if comparing the two objects key by key

for example:
    
    json1 = {
        'key1':'value1'
    }

    json2 = {
        'key1':'value2'
    }

will notifiy
    key1 not Equal, old value:value1 new value:value2 
