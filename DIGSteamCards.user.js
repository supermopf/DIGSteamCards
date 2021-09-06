// ==UserScript==
// @name         Show Steam Cards for DIG Game Bundles
// @namespace    https://victor-lange.de/
// @version      1.0
// @description  Shows a Emoji depending on Cards Status and Region Lock
// @author       Victor Lange
// @updateURL    https://github.com/supermopf/DIGSteamCards/raw/master/DIGSteamCards.user.js
// @downloadURL  https://github.com/supermopf/DIGSteamCards/raw/master/DIGSteamCards.user.js
// @match        https://dailyindiegame.com/site_weeklybundle*
// @icon         https://www.google.com/s2/favicons?domain=dailyindiegame.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

(function() {


    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function GetAllBundleGames(){
        var games = getElementByXpath("/html/body/table/tbody/tr[2]/td/table[1]/tbody/tr/td/table/tbody/tr/td[2]/table[2]/tbody").getElementsByTagName("td")
        for (const [key, value] of Object.entries(games)) {
            var sAppID = value.children[2].href.replace("https://store.steampowered.com/app/","")

            UpdateGameBySteamAppDetails(sAppID, value.children[2].children[0])
        }
    }

    function UpdateGameBySteamAppDetails(id,htmlobj)
    {
        $.ajax ( {
            type:       'GET',
            url:        'https://store.steampowered.com/api/appdetails?appids=' + id,
            dataType:   'JSON',
            success:    function (apiJson) {
                if(apiJson[id].success){
                    var bhasCards = false;
                    for (const [key, value] of Object.entries(apiJson[id].data.categories)) {
                        if(value.id === 29){
                            bhasCards = true;
                        }
                    }
                    if(bhasCards){
                        htmlobj.innerText = htmlobj.innerText + "✔️"
                    }else{
                        htmlobj.innerText = htmlobj.innerText + "❌"
                    }
                }
                else
                {
                    //Region locked
                    htmlobj.innerText = htmlobj.innerText + "🚧"
                }
            }
        } );

    }

    GetAllBundleGames()

})();