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
[X] 1.4.1 - parse methods & config for backend
[X] 1.4.2 - send/receive JSON via backend api
[X] 1.4.3 - Bugfixes (refresh DocumentProvider when changing files)
[X] 1.4.4 - send/receive 2 JSONs (for comparison, first is applied config, second is without any config, compare them)
[X] 1.4.5 - button to change software system
1.5 - apply response
[X] - 1.5.1 - apply Respose data to each method
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
[ ] - 1.7.1 - Bugfix: execute 'press refresh button' command aka greenIDE.run correctly when changing files & clicking
              on webview buttons so methods and config get refreshed without pressing the button in home-segment
[ ] - 1.7.2 - Refactoring / outsource functionalities to new classes
[ ] - 1.7.3 - rename all kanzi occurences to genereic method names
[ ] - 1.7.4 - Remove test cases / comments
