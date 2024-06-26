import { getMoneyPerSecond, setMoneyPerSecond, getSpeedCursor, setSpeedCursor, instantiateCursor,moneyPerCycle,cursorPerLV,createCursor } from "./addCursor.js";

let money = 0;                                                                              // Current money of the player
let totalMoney = 0;                                                                         // Total money earned by the player
let totalSpend = 0;                                                                         // Total money spent by the player
let moneyPerClick = 1;                                                                      // Money earned per click
let clickCounter = 0;
let price_income = 150;
let price_add_cursor = 300;
let price_merge_cursor = 1200;
let price_cursor_income = 750;
let price_cursor_speed = 600;
let currentMoneyPerSecond = getMoneyPerSecond();                                            // Money earned per second imported from the addCursor.js
let currentSpeedCursor = getSpeedCursor();                                                  // Speed of the cursor imported from the addCursor.js         

let level = 1;
let counterLevel = 0;                                                                       // Counter level to increase the progress bar
let decreaseInterval;                                                                       // Interval to decrease the progress bar
let isMouseDown = false;
const button = $(".Big_button");
let progressContainer = $(".progress_bar");
let progressBar = $("<div>").addClass("progress-bar-ui");
let backgroundBarWrapper = $("<div>").addClass("background-bar-wrapper");
let backgroundBar = $("<div>").addClass("backgroundBar").attr("id", "backgroundBar");
let barWrapper = $("<div>").addClass("bar-wrapper");
let bar = $("<div>").addClass("bar").attr("id", "bar");
let levelDisplay = $("<div>").addClass("level").attr("id", "level").text("Level 1");
let wrapper = $('.wrapper');
                                                                                            // Sounds
let buttonClickSound = new Audio ('assets/sounds/click.mp3');
let backgroundSound = new Audio ('assets/sounds/background.mp3');
let levelUpSound = new Audio('assets/sounds/levelUp.mp3');
let shopSound = new Audio('assets/sounds/shop.mp3');
backgroundSound.volume = 0.5;
backgroundSound.loop = true;
buttonClickSound.playbackRate = 2;
let musicEnabledByUser = false;
let sfxEnabledByUser = false

backgroundBarWrapper.append(backgroundBar);
barWrapper.append(bar);
progressBar.append(backgroundBarWrapper);
progressBar.append(barWrapper);
progressBar.append(levelDisplay);
progressContainer.append(progressBar);
let mouseDownTimer;
let smallButtons = [];                                                                          // Array to store the bonus buttons

export async function updateScore(type) {                                                           // Function to update the score based on the type of click and change the UI based on the level
    if (type == "click") {
        money += moneyPerClick;
        buttonClickSound.play();
        clickCounter++;
        totalMoney += moneyPerClick;
        if (level<6){
            button.addClass('animate-Big-Button1');
            button.one('animationend', function() {
                button.removeClass('animate-Big-Button1');
            });
        }
        else if (level>=6 && level<11){
            wrapper.css('background-image', 'url(../assets/images/background.svg)')
            button.css('background-image', 'url(../assets/images/Button_yellow.svg)');
            button.addClass('animate-Big-Button2');
            button.one('animationend', function() {
                button.removeClass('animate-Big-Button2');
            });
        }
        else if (level>=11){
            button.css('background-image', 'url(../assets/images/Button_white.svg)');
            wrapper.css('background-image', 'url(../assets/images/background2.svg)')
            button.addClass('animate-Big-Button3');
            button.one('animationend', function() {
                button.removeClass('animate-Big-Button3');
            });
        }
    }
    else if (type == "auto"){
        let nbCursors = cursorPerLV[0] + cursorPerLV[1] + cursorPerLV[2] + cursorPerLV[3] + cursorPerLV[4];
        money += moneyPerCycle / nbCursors;
        totalMoney += moneyPerCycle / nbCursors;
    }
    show_money();
    show_money_per_click();
    show_money_per_second();
    save();
    buttonVerification();
}
async function checkMusicEnabled() {                                                                // Function to check if the music is enabled
    const musicEnabled = await localStorage.getItem("musicEnabled");
    if (musicEnabled === "true" || musicEnabledByUser) {
      if (!backgroundSound.playing) {
        backgroundSound.play();
      }
    } else {
      backgroundSound.pause();
    }
  }

  async function checkSfxEnabled() {                                                                // Function to check if the SFX is enabled
    const sfxEnabled = await localStorage.getItem("sfxnabled");
    if (sfxEnabled === "true" || sfxEnabledByUser) {
      if (!buttonClickSound && !shopSound && levelUpSound) {
        buttonClickSound.volume = 1;
        shopSound.volume = 1;
        levelUpSound.volume = 1;
      }
    } else {
      buttonClickSound.volume = 0;
      shopSound.volume = 0;
      levelUpSound.volume = 0;
    }
  }

  $(document).mousedown(function() {
    checkMusicEnabled();
    checkSfxEnabled();
    save();
  });

//$(document).ready(function() {

    export function main() {                                                                        // Main function to run the game
        // load();
        save();
        buttonVerification();
        showPriceUpgrade();

        button.mousedown(function() {                                                               // Function to handle the mousedown event
            isMouseDown = true;
            mouseDownTimer = setTimeout(function() {
                if (isMouseDown) {
                    startDecreaseInterval();
                }
            }, 500); 
        });

        button.mouseup(function() {                                                                 // Function to handle the mouseup event
            isMouseDown = false;
            clearInterval(decreaseInterval);
            startDecreaseInterval();
            increaseCounterLevel();
            updateProgressBar();
        });

        button.click(function() {
            updateScore("click");
        });
        
        $(".increase_income").click(function() {                                                    // Function to handle the click event on the increase income button
            if (money >= price_income) {
                shopSound.play();
                money -= price_income;
                totalSpend += price_income;
                price_income += price_income;
                if (price_income > 150) {
                    moneyPerClick = moneyPerClick * 1.2;
                }
                else {
                    moneyPerClick += 1;
                }
                show_money();
                show_money_per_click();
                shopSound.play();
            }
            save();
            buttonVerification();
            showPriceUpgrade();
        });
        
        $(".add_cursor").click(function() {                                                         // Function to handle the click event on the add cursor button
            if (money >= price_add_cursor && createCursor() !== false){
                shopSound.play();
                money -= price_add_cursor;
                totalSpend += price_add_cursor;
                price_add_cursor += price_add_cursor*1.2;
                show_money();
                show_money_per_second();
                shopSound.play();
            }
            save();
            buttonVerification();
            showPriceUpgrade();
        });

        $(".merge_cursors").click(function() {                                                      // Function to handle the click event on the merge cursors button
            if (money >= price_merge_cursor && merge_cursors()){
                shopSound.play();
                money -= price_merge_cursor;
                totalSpend += price_merge_cursor;
                price_merge_cursor += price_merge_cursor*0.2;
                show_money();
                show_money_per_second();
                shopSound.play();
            }
            save();
            buttonVerification();
            showPriceUpgrade();
        });
        
        $(".cursor_income").click(function() {                                                      // Function to handle the click event on the cursor income button
            if (money >= price_cursor_income) {
                shopSound.play();
                money -= price_cursor_income;
                totalSpend += price_cursor_income;
                price_cursor_income += price_cursor_income*0.7;
                currentMoneyPerSecond = getMoneyPerSecond();
                setMoneyPerSecond(currentMoneyPerSecond*1.1);
                show_money();
                show_money_per_second();
            }
            save();
            buttonVerification();
            showPriceUpgrade();
        });

        $(".cursor_speed").click(function() {                                                       // Function to handle the click event on the cursor speed button
            if (money >= price_cursor_speed) {
                shopSound.play();
                money -= price_cursor_speed;
                totalSpend += price_cursor_speed;
                price_cursor_speed += price_cursor_speed*0.8;
                currentSpeedCursor = getSpeedCursor();
                console.log(currentSpeedCursor);
                setSpeedCursor(currentSpeedCursor*0.99);
                let newSpeed = getSpeedCursor();
                console.log(newSpeed);
                show_money();
                show_money_per_second();
            }
            save();
            buttonVerification();
            showPriceUpgrade();
        });

        $(".statistics_button").click(function() {                                                  // Function to handle the click event on the statistics button
            shopSound.play();
            let totalMoneyFormatted = formatMoney(totalMoney);
            let totalSpendFormatted = formatMoney(totalSpend);
            
            var message = "Total money earned: " + totalMoneyFormatted + "<br>" + "Total money spend: " + totalSpendFormatted + "<br>" + "Total clicks: " + clickCounter;
            $("#dialog").html(message).dialog({
                modal: true,
                title: "Statistics"
            });
        });
        
        $(".settings_button").click(function() {                                                    // Function to handle the click event on the settings button
            shopSound.play();
            var message = '<div><input type="checkbox" id="checkbox1" ' + (localStorage.getItem("musicEnabled") === "true" ? 'checked' : '') + '> <label for="checkbox1">Music</label></div>' +
                        '<div><input type="checkbox" id="checkbox2" ' + (localStorage.getItem("sfxEnabled") === "true" ? 'checked' : '') + '> <label for="checkbox2">SFX</label></div>';
            $("#dialog").html(message).dialog({
            modal: true,
            title: "Settings"

            });
            $("#checkbox1").change(function() {
            if ($(this).is(":checked")) {
                backgroundSound.play();
            } else {
                backgroundSound.pause();
            }
            localStorage.setItem("musicEnabled", $(this).is(":checked") ? "true" : "false");            // Save the state of the music checkbox after user choice
            musicEnabledByUser = $(this).is(":checked");                                                // Update musicEnabledByUser based on user interaction
            });
            $("#checkbox2").change(function() {
                if ($(this).is(":checked")) {
                buttonClickSound.volume = 1;
                shopSound.volume = 1;
                levelUpSound.volume = 1;
                } else {
                buttonClickSound.volume = 0;
                shopSound.volume =0;
                levelUpSound.volume =0;
                }
                localStorage.setItem("sfxEnabled", $(this).is(":checked") ? "true" : "false");          // Save the state of the SFX checkbox after user choice
                sfxEnabledByUser = $(this).is(":checked");                                              // Update sfxEnabledByUser based on user interaction
            });
        });
        
        function formatMoney(money) {                                                               // Function to format the money
            let suffix = "";
            let divisor = 1;
        
            if (money >= 1000000000000) {
                suffix = "T";
                divisor = 1000000000000;
            } else if (money >= 1000000000) {
                suffix = "B";
                divisor = 1000000000;
            } else if (money >= 1000000) {
                suffix = "M";
                divisor = 1000000;
            } else if (money >= 1000) {
                suffix = "k";
                divisor = 1000;
            }
        
            return (money / divisor).toFixed(1) + suffix;
        }
    }
//});

function merge_cursors() {                                                                          // Function to merge the cursors based on the cursor level                                                              
    if ($('.lv1').length >= 3) {
        $('.lv1').slice(0,3).remove();
        cursorPerLV[0] -= 3;
        cursorPerLV[1] += 1;
        instantiateCursor();
        return true;
    }
    else if ($('.lv2').length >= 3) {
        $('.lv2').slice(0,3).remove();
        cursorPerLV[1] -= 3;
        cursorPerLV[2] += 1;
        instantiateCursor();
        return true;
    }
    else if ($('.lv3').length >= 3) {
        $('.lv3').slice(0,3).remove();
        cursorPerLV[2] -= 3;
        cursorPerLV[3] += 1;
        instantiateCursor();
        return true;
    }
    else if ($('.lv4').length >= 3) {
        $('.lv4').slice(0,3).remove();
        cursorPerLV[3] -= 3;
        cursorPerLV[4] += 1;
        instantiateCursor();
        return true;
    }
    else {
        return false;
    }
}

async function save() {                                                                             // Function to save the game state in the local storage
    localStorage.setItem("level", level);
    localStorage.setItem("totalMoney", totalMoney);
    localStorage.setItem("totalSpend", totalSpend);
    localStorage.setItem("clickCounter", clickCounter);
    localStorage.setItem("money", money);
    localStorage.setItem("moneyPerClick", moneyPerClick);
    localStorage.setItem("moneyPerSecond", currentMoneyPerSecond);
    localStorage.setItem("cursorLV1", cursorPerLV[0]);
    localStorage.setItem("cursorLV2", cursorPerLV[1]);
    localStorage.setItem("cursorLV3", cursorPerLV[2]);
    localStorage.setItem("cursorLV4", cursorPerLV[3]);
    localStorage.setItem("cursorLV5", cursorPerLV[4]);
    localStorage.setItem("price_income", price_income);
    localStorage.setItem("price_add_cursor", price_add_cursor);
    localStorage.setItem("price_merge_cursor", price_merge_cursor);
    localStorage.setItem("price_cursor_income", price_cursor_income);
    localStorage.setItem("price_cursor_speed", price_cursor_speed);
    localStorage.setItem("musicEnabled", $("#checkbox1").is(":checked") ? "true" : "false");
    localStorage.setItem("sfxEnabled", $("#checkbox2").is(":checked") ? "true" : "false");
};

async function show_money(){                                                                        // Function to show the money in the UI in a formatted way to make it more readable
    let money_to_show = money;
    if (money_to_show < 1000) {
        $("#money").text(money_to_show.toFixed(1) + " $");
    }
    else if (money_to_show > 1000 && money_to_show < 1000000) {
        money_to_show = (money_to_show / 1000).toFixed(1) + "k";
        $("#money").text(money_to_show + " $");
    }
    else if (money_to_show > 1000000 && money_to_show < 1000000000) {
        money_to_show = (money_to_show / 1000000).toFixed(1) + "M";
        $("#money").text(money_to_show + " $");
    }
    else if (money_to_show > 1000000000 && money_to_show < 1000000000000) {
        money_to_show = (money_to_show / 1000000000).toFixed(1) + "B";
        $("#money").text(money_to_show + " $");
    }
    else if (money_to_show > 1000000000000){
        money_to_show = (money_to_show / 1000000000000).toFixed(1) + "T";
        $("#money").text(money_to_show + " $");
    }
};

async function show_money_per_click(){                                                              // Function to show the money per click in the UI in a formatted way to make it more readable
    let moneyPerClick_to_show = moneyPerClick;
    if (moneyPerClick_to_show < 1000) {
        $("#moneyPerClick").text(moneyPerClick_to_show.toFixed(1) + " $/click");
    }
    else if (moneyPerClick_to_show > 1000 && moneyPerClick_to_show < 1000000) {
        moneyPerClick_to_show = (moneyPerClick_to_show / 1000).toFixed(1) + "k";
        $("#moneyPerClick").text(moneyPerClick_to_show + " $/click");
    }
    else if (moneyPerClick_to_show > 1000000 && moneyPerClick_to_show < 1000000000) {
        moneyPerClick_to_show = (moneyPerClick_to_show / 1000000).toFixed(1) + "M";
        $("#moneyPerClick").text(moneyPerClick_to_show + " $/click");
    }
    else if (moneyPerClick_to_show > 1000000000 && moneyPerClick_to_show < 1000000000000) {
        moneyPerClick_to_show = (moneyPerClick_to_show / 1000000000).toFixed(1) + "B";
        $("#moneyPerClick").text(moneyPerClick_to_show + " $/click");
    }
    else if (moneyPerClick_to_show > 1000000000000){
        moneyPerClick_to_show = (moneyPerClick_to_show / 1000000000000).toFixed(1) + "T";
        $("#moneyPerClick").text(moneyPerClick_to_show + " $/click");
    }
};

async function show_money_per_second(){                                                             // Function to show the money per second in the UI in a formatted way to make it more readable
    let moneyPerSecond_to_show = getMoneyPerSecond();
    if (moneyPerSecond_to_show < 1000) {
        $("#moneyPerSecond").text(moneyPerSecond_to_show.toFixed(1) + " $/s");
    }
    else if (moneyPerSecond_to_show > 1000 && moneyPerSecond_to_show < 1000000) {
        moneyPerSecond_to_show = (moneyPerSecond_to_show / 1000).toFixed(1) + "k";
        $("#moneyPerSecond").text(moneyPerSecond_to_show + " $/s");
    }
    else if (moneyPerSecond_to_show > 1000000 && moneyPerSecond_to_show < 1000000000) {
        moneyPerSecond_to_show = (moneyPerSecond_to_show / 1000000).toFixed(1) + "M";
        $("#moneyPerSecond").text(moneyPerSecond_to_show + " $/s");
    }
    else if (moneyPerSecond_to_show > 1000000000 && moneyPerSecond_to_show < 1000000000000) {
        moneyPerSecond_to_show = (moneyPerSecond_to_show / 1000000000).toFixed(1) + "B";
        $("#moneyPerSecond").text(moneyPerSecond_to_show + " $/s");
    }
    else if (moneyPerSecond_to_show > 1000000000000){
        moneyPerSecond_to_show = (moneyPerSecond_to_show / 1000000000000).toFixed(1) + "T";
        $("#moneyPerSecond").text(moneyPerSecond_to_show + " $/s");
    }
};

async function load() {                                                                             // Function to load the game state from the local storage
    level = parseFloat(localStorage.getItem("level"));
    money = parseFloat(localStorage.getItem("money"));
    totalMoney = parseFloat(localStorage.getItem("totalMoney"));
    totalSpend = parseFloat(localStorage.getItem("totalSpend"));
    moneyPerClick = parseFloat(localStorage.getItem("moneyPerClick"));
    clickCounter = parseFloat(localStorage.getItem("clickCounter"));
    price_income = parseFloat(localStorage.getItem("price_income"));
    price_add_cursor = parseFloat(localStorage.getItem("price_add_cursor"));
    price_merge_cursor = parseFloat(localStorage.getItem("price_merge_cursor"));
    price_cursor_income = parseFloat(localStorage.getItem("price_cursor_income"));
    price_cursor_speed = parseFloat(localStorage.getItem("price_cursor_speed"));
    currentMoneyPerSecond = parseFloat(localStorage.getItem("moneyPerSecond"));
    cursorPerLV[0] = parseFloat(localStorage.getItem("cursorLV1"));
    cursorPerLV[1] = parseFloat(localStorage.getItem("cursorLV2"));
    cursorPerLV[2] = parseFloat(localStorage.getItem("cursorLV3"));
    cursorPerLV[3] = parseFloat(localStorage.getItem("cursorLV4"));
    cursorPerLV[4] = parseFloat(localStorage.getItem("cursorLV5"));
    setMoneyPerSecond(currentMoneyPerSecond);
    instantiateCursor();
    show_money();
    show_money_per_click();
    levelDisplay.text("Level " + level);
};

async function buttonVerification() {                                                               // Function to verify the state of the buttons
    buttonIncomeVerification();
    buttonAddCursorVerification();
    buttonMergeCursorVerification();
    buttonCursorIncomeVerification();
    buttonCursorSpeedVerification();
};

async function buttonIncomeVerification() {                                                         // Function to verify the state of the increase income button, disable it if the player doesn't have enough money
    const buttonIncome = $(".increase_income");
    if (money < price_income) {
        buttonIncome.addClass('disabled');
        buttonIncome.css('background-image', 'url("assets/images/Upgrade_increase_income_disable.svg")');
        $("#price_income").css('color', "grey");

    }
    else {
        buttonIncome.removeClass('disabled');
        buttonIncome.css('background-image', 'url("assets/images/Upgrade_increase_income.svg")');
        $("#price_income").css('color', "white");

    }
};

async function buttonAddCursorVerification() {                                                      // Function to verify the state of the add cursor button, disable it if the player doesn't have enough money
    const buttonAddCursor = $(".add_cursor");
    if (money < price_add_cursor) {
        buttonAddCursor.addClass('disabled');
        buttonAddCursor.css('background-image', 'url("assets/images/Upgrade_add_cursor_disable.svg")');
        $("#price_add_cursor").css('color', "grey");

    }
    else {
        buttonAddCursor.removeClass('disabled');
        buttonAddCursor.css('background-image', 'url("assets/images/Upgrade_add_cursor.svg")');
        $("#price_add_cursor").css('color', "white");

    }
};

async function buttonMergeCursorVerification() {                                                    // Function to verify the state of the merge cursors button, disable it if the player doesn't have enough money
    const buttonMergeCursor = $(".merge_cursors");
    if (money < price_merge_cursor) {
        buttonMergeCursor.addClass('disabled');
        buttonMergeCursor.css('background-image', 'url("assets/images/Upgrade_merge_cursors_disable.svg")');
        $("#price_merge_cursor").css('color', "grey");

    }
    else {
        buttonMergeCursor.removeClass('disabled');
        buttonMergeCursor.css('background-image', 'url("assets/images/Upgrade_merge_cursors.svg")');
        $("#price_merge_cursor").css('color', "white");
    }
};

async function buttonCursorIncomeVerification() {                                                   // Function to verify the state of the cursor income button, disable it if the player doesn't have enough money
    const buttonCursorIncome = $(".cursor_income");
    if (money < price_cursor_income) {
        buttonCursorIncome.addClass('disabled');
        buttonCursorIncome.css('background-image', 'url("assets/images/Upgrade_cursor_income_disable.svg")');
        $("#price_cursor_income").css('color', "grey");
    }
    else {
        buttonCursorIncome.removeClass('disabled');
        buttonCursorIncome.css('background-image', 'url("assets/images/Upgrade_cursor_income.svg")');
        $("#price_cursor_income").css('color', "white");

    }
};

async function buttonCursorSpeedVerification() {                                                    // Function to verify the state of the cursor speed button, disable it if the player doesn't have enough money
    const buttonCursorSpeed = $(".cursor_speed");
    if (money < price_cursor_speed) {
        buttonCursorSpeed.addClass('disabled');
        buttonCursorSpeed.css('background-image', 'url("assets/images/Upgrade_cursor_speed_disable.svg")');
        $("#price_cursor_speed").css('color', "grey");
    }
    else {
        buttonCursorSpeed.removeClass('disabled');
        buttonCursorSpeed.css('background-image', 'url("assets/images/Upgrade_cursor_speed.svg")');
        $("#price_cursor_speed").css('color', "white");
    }
};

function updateProgressBar() {                                                                      // Function to update the progress bar based on the level of the player
    const percentage = counterLevel + '%';
    bar.css('width', percentage);
    const hue = counterLevel * 1.2; 
    bar.css('background-color', `hsl(${hue}, 100%, 50%)`); 
    if (counterLevel >= 100) {
      button.attr('disabled', true);
      decreaseLevelUp();
      spawnBonusButtons();
    }
};

function increaseCounterLevel() {                                                                   // Function to increase the counter level 
    if (counterLevel < 100) {
        counterLevel += 2;
        updateProgressBar();
    }
};

function updateLevel() {
    if (counterLevel >= 100) {
        levelUpSound.play();
        level++;
        levelUpSound.play();
        levelDisplay.text("Level " + level);
    }
};

function startDecreaseInterval() {                                                                  // Function to start the decrease interval if the player doesn't click on the button
    clearInterval(decreaseInterval);
    const totalDuration = 8000;
    const decreaseIntervalDuration = 100; 
    let decreaseStep = 100 / (totalDuration / decreaseIntervalDuration);
    decreaseInterval = setInterval(function() {
        if (!isMouseDown) {
            counterLevel -= decreaseStep;
            if (counterLevel >= 0) {
                updateProgressBar();
            } else {
                clearInterval(decreaseInterval);
                counterLevel = 0;
                updateProgressBar();
                button.attr('disabled', false);
            }
        }
    }, decreaseIntervalDuration);
};

function decreaseLevelUp() {                                                                        // Function to decrease the level up
    updateLevel();
    button.attr('disabled', true);
    const remainingTime = 8000; // 4 seconds
    const decreaseStepLevelUp = (counterLevel / (remainingTime / 100));
    (function() {
        function decreaseLevelUpRecursive() {
            if (!isMouseDown) {
                counterLevel -= decreaseStepLevelUp;
                if (counterLevel >= 0) {
                    updateProgressBar();
                    setTimeout(decreaseLevelUpRecursive, 100);
                } else {
                    updateProgressBar();
                    button.attr('disabled', false);
                }
            }
        }
        decreaseLevelUpRecursive();
    })();
};

function spawnBonusButtons() {                                                                      // Function to spawn the bonus buttons after the player level up
    const playingArea = $('.playing_area');
    const playingAreaWidth = playingArea.width();
    const playingAreaHeight = playingArea.height();
    for (let i = 0; i < 4; i++){
        const randomX = Math.floor(Math.random() * (playingAreaWidth - 37 - 200) + 100);
        const randomY = Math.floor(Math.random() * (playingAreaHeight - 45 - 200) + 100);

        if (randomX + 37 > playingAreaWidth - 100) {                                                // Check if the button is out of the playing area
            randomX = playingAreaWidth - 137;
        }
        if (randomY + 45 > playingAreaHeight - 100) {
            randomY = playingAreaHeight - 145;
        }                                                                                           // Create the button
        let smallButton = $("<img>").addClass("small_button").attr("src", "assets/images/Small_button.svg").css({
            top: randomY + 'px',
            left: randomX + 'px',
            position: "absolute",
            width: "37px",
            height: "45px"
        });
        playingArea.append(smallButton);

        smallButton.click(function () {                                                             // Function to handle the click event on the bonus button
            money += moneyPerClick * 10;
            totalMoney += moneyPerClick * 10;
            show_money();
            $(this).addClass("small-button-press");
            setTimeout(function () {
                $(this).removeClass("small-button-press");
            }.bind(this), 150);
            $(this).remove();
            const index = smallButtons.indexOf($(this));
            if (index !== -1) {
                smallButtons.splice(index, 1);
            }
        });
        setTimeout(function () {                                                                    // Function to remove the button after 4 seconds
            smallButton.remove();
            const index = smallButtons.indexOf(smallButton);
            if (index !== -1) {
                smallButtons.splice(index, 1);
            }
        }, 4000);
    }
};

function showPriceUpgrade(){                                                                        // Function to show the price of the upgrades in a formatted way to make it more readable
    formatPriceIncome();
    formatPriceAddCursor();
    formatPriceMergeCursor();
    formatPriceCursorIncome();
    formatPriceCursorSpeed();
};

function formatPriceIncome(){                                                                       // Function to format the price of the increase income upgrade
    let price_income_to_show = price_income;
    if (price_income_to_show < 1000) {
        $("#price_income").text(price_income_to_show.toFixed(0) + "$");
    }
    else if (price_income_to_show > 1000 && price_income_to_show < 1000000) {
        price_income_to_show = (price_income_to_show / 1000).toFixed(1) + "k";
        $("#price_income").text(price_income_to_show + "$");
    }
    else if (price_income_to_show > 1000000 && price_income_to_show < 1000000000) {
        price_income_to_show = (price_income_to_show / 1000000).toFixed(1) + "M";
        $("#price_income").text(price_income_to_show + "$");
    }
    else if (price_income_to_show > 1000000000 && price_income_to_show < 1000000000000) {
        price_income_to_show = (price_income_to_show / 1000000000).toFixed(1) + "B";
        $("#price_income").text(price_income_to_show + "$");
    }
    else if (price_income_to_show > 1000000000000){
        price_income_to_show = (price_income_to_show / 1000000000000).toFixed(1) + "T";
        $("#price_income").text(price_income_to_show + "$");
    }
};

function formatPriceAddCursor(){                                                                    // Function to format the price of the add cursor upgrade
    let price_add_cursor_to_show = price_add_cursor;
    if (price_add_cursor_to_show < 1000) {
        $("#price_add_cursor").text(price_add_cursor_to_show.toFixed(0) + "$");
    }
    else if (price_add_cursor_to_show > 1000 && price_add_cursor_to_show < 1000000) {
        price_add_cursor_to_show = (price_add_cursor_to_show / 1000).toFixed(1) + "k";
        $("#price_add_cursor").text(price_add_cursor_to_show + "$");
    }
    else if (price_add_cursor_to_show > 1000000 && price_add_cursor_to_show < 1000000000) {
        price_add_cursor_to_show = (price_add_cursor_to_show / 1000000).toFixed(1) + "M";
        $("#price_add_cursor").text(price_add_cursor_to_show + "$");
    }
    else if (price_add_cursor_to_show > 1000000000 && price_add_cursor_to_show < 1000000000000) {
        price_add_cursor_to_show = (price_add_cursor_to_show / 1000000000).toFixed(1) + "B";
        $("#price_add_cursor").text(price_add_cursor_to_show + "$");
    }
    else if (price_add_cursor_to_show > 1000000000000){
        price_add_cursor_to_show = (price_add_cursor_to_show / 1000000000000).toFixed(1) + "T";
        $("#price_add_cursor").text(price_add_cursor_to_show + "$");
    }
};

function formatPriceMergeCursor(){                                                                  // Function to format the price of the merge cursor upgrade
    let price_merge_cursor_to_show = price_merge_cursor;
    if (price_merge_cursor_to_show < 1000) {
        $("#price_merge_cursor").text(price_merge_cursor_to_show.toFixed(0) + "$");
    }
    else if (price_merge_cursor_to_show > 1000 && price_merge_cursor_to_show < 1000000) {
        price_merge_cursor_to_show = (price_merge_cursor_to_show / 1000).toFixed(1) + "k";
        $("#price_merge_cursor").text(price_merge_cursor_to_show + "$");
    }
    else if (price_merge_cursor_to_show > 1000000 && price_merge_cursor_to_show < 1000000000) {
        price_merge_cursor_to_show = (price_merge_cursor_to_show / 1000000).toFixed(1) + "M";
        $("#price_merge_cursor").text(price_merge_cursor_to_show + "$");
    }
    else if (price_merge_cursor_to_show > 1000000000 && price_merge_cursor_to_show < 1000000000000) {
        price_merge_cursor_to_show = (price_merge_cursor_to_show / 1000000000).toFixed(1) + "B";
        $("#price_merge_cursor").text(price_merge_cursor_to_show + "$");
    }
    else if (price_merge_cursor_to_show > 1000000000000){
        price_merge_cursor_to_show = (price_merge_cursor_to_show / 1000000000000).toFixed(1) + "T";
        $("#price_merge_cursor").text(price_merge_cursor_to_show + "$");
    }
};

function formatPriceCursorIncome(){                                                                 // Function to format the price of the cursor income upgrade
    let price_cursor_income_to_show = price_cursor_income;
    if (price_cursor_income_to_show < 1000) {
        $("#price_cursor_income").text(price_cursor_income_to_show.toFixed(0) + "$");
    }
    else if (price_cursor_income_to_show > 1000 && price_cursor_income_to_show < 1000000) {
        price_cursor_income_to_show = (price_cursor_income_to_show / 1000).toFixed(1) + "k";
        $("#price_cursor_income").text(price_cursor_income_to_show + "$");
    }
    else if (price_cursor_income_to_show > 1000000 && price_cursor_income_to_show < 1000000000) {
        price_cursor_income_to_show = (price_cursor_income_to_show / 1000000).toFixed(1) + "M";
        $("#price_cursor_income").text(price_cursor_income_to_show + "$");
    }
    else if (price_cursor_income_to_show > 1000000000 && price_cursor_income_to_show < 1000000000000) {
        price_cursor_income_to_show = (price_cursor_income_to_show / 1000000000).toFixed(1) + "B";
        $("#price_cursor_income").text(price_cursor_income_to_show + "$");
    }
    else if (price_cursor_income_to_show > 1000000000000){
        price_cursor_income_to_show = (price_cursor_income_to_show / 1000000000000).toFixed(1) + "T";
        $("#price_cursor_income").text(price_cursor_income_to_show + "$");
    }
};

function formatPriceCursorSpeed(){                                                                  // Function to format the price of the cursor speed upgrade
    let price_cursor_speed_to_show = price_cursor_speed;
    if (price_cursor_speed_to_show < 1000) {
        $("#price_cursor_speed").text(price_cursor_speed_to_show.toFixed(0) + "$");
    }
    else if (price_cursor_speed_to_show > 1000 && price_cursor_speed_to_show < 1000000) {
        price_cursor_speed_to_show = (price_cursor_speed_to_show / 1000).toFixed(1) + "k";
        $("#price_cursor_speed").text(price_cursor_speed_to_show + "$");
    }
    else if (price_cursor_speed_to_show > 1000000 && price_cursor_speed_to_show < 1000000000) {
        price_cursor_speed_to_show = (price_cursor_speed_to_show / 1000000).toFixed(1) + "M";
        $("#price_cursor_speed").text(price_cursor_speed_to_show + "$");
    }
    else if (price_cursor_speed_to_show > 1000000000 && price_cursor_speed_to_show < 1000000000000) {
        price_cursor_speed_to_show = (price_cursor_speed_to_show / 1000000000).toFixed(1) + "B";
        $("#price_cursor_speed").text(price_cursor_speed_to_show + "$");
    }
    else if (price_cursor_speed_to_show > 1000000000000){
        price_cursor_speed_to_show = (price_cursor_speed_to_show / 1000000000000).toFixed(1) + "T";
        $("#price_cursor_speed").text(price_cursor_speed_to_show + "$");
    }
};
