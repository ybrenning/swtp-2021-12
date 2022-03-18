# TODO: Patchlist / History

[X] 1.0 - MVP
[X] 1.1 - further functional things
1.2 - side panel basics (show methods, toggle highlighting, select configuration)
[X] 1.2.1 - kanzi locator
[X] 1.2.2 - side panel show all found methods
[X] 1.2.3 - click on side panel method to jump to location
    [X] 1.2.3.1 - reset list of methods when opening new file
[X] 1.2.4 - toggle highlighting at specific / all methods (generic color yellow)
[X] 1.2.5 - complete side panel
1.3 - Configs Side Panel
[X] 1.3.1 - Select and save config in JSON
[X] 1.3.2 - save and manage favorites (0 is default, 1+ saved favs)
[X] 1.3.3 - see current config from JSON in side panel
[X] 1.3.4 - See List of Saved Configs
[X] 1.3.5 - Settings Section, Edit configItems.json (any checkboxable Items) and locatorItems.json (which methods to find)
1.4 - Backend Communication
[X] 1.4.0 - Bugfixes
[ ] 1.4.1 - pressing button in home segment --> save methods with config in JSON to send
[ ] 1.4.2 - send/receive JSON via backend api
[ ] 1.4.3 - send/receive 2 JSONs (for comparison, default send 2 with second set to 0 if no comparison wanted)
            (will be used later in overview webview)
1.5 - apply response
[ ] - 1.5.1 - apply Respose data to each method
[ ] - 1.5.2 - color code depending on method data
[ ] - 1.5.3 - bugfixes with highlight
    [ ] - 1.5.3.1 - reset highlights when clicking on item again / or maybe 'reset'-button
    [ ] - 1.5.3.2 - reset methods in side panel when switching already opened files
[ ] - 1.5.4 - Hover text with data
1.6 - Overview webview
[ ] - 1.6.1 - display all results in webview from side panel
[ ] - 1.6.2 - display diagrams with distribution in webview
[ ] - 1.6.3 - apply different configs to methods in webview
1.7 - Cleanup and minor issues / tuning
[ ] - 1.7.0 - Minor Fixes (Refresh found methods, reset highlighting, ...)
[ ] - 1.7.1 - Parse into configList.json / locatorList.json from .csv file
[ ] - 1.7.2 - Refactoring / outsource functionalities to new classes
[ ] - 1.7.3 - rename all kanzi occurences to genereic method names
[ ] - 1.7.4 - Remove test cases / comments

## TODO: open ISSUES

[ ] - refresh methods when switching file
[ ] - display configs in webview on startup / without button, or only one print when button pressed
[X] - click multiple items in webview without reloading
[X] - webview buttons cause exponential buffer (see debug printing)
[ ] - refactoring

## TODO: tune highlighting

[X] - make new colors / borders, experiment with decoration
[ ] - reset for every new item (maybe highlight.reset() option at beginning of each item/clickevent), Maybe reset context.subscriptions
[X] - parse complete functions[i] from home.ts, not only name,line,char
[X] - use property symbolkind.method or symbolkind.object to identify proper range (to end of name) 
