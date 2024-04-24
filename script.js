let money = 0;
let totalMoney = 0;
let totalSpend = 0;
let moneyPerClick = 1;
let clickCounter = 0;
let price = 10;
let OMEGAPRICE = 1000;

$(document).ready(function() {
    const button = $(".Big_button");
    save();
    buttonVerification();

    button.click(function() {
        money += moneyPerClick;
        clickCounter++;
        totalMoney += moneyPerClick;
        show_money();
        show_money_per_click();
        $(this).addClass('animate');
        $(this).one('animationend', function() {
            $(this).removeClass('animate');
        });
        save();
        buttonVerification();
    });

    $(".increase_income").click(function() {
        if (money >= price) {
            money -= price;
            totalSpend += price;
            price += price;
            if (price > 100) {
                moneyPerClick = moneyPerClick * 1.2;
            }
            else {
                moneyPerClick += 1;
            }
            show_money();
            show_money_per_click();
        }
        save();
        buttonVerification();
    });
    
    $(".statistics_button").click(function() {
        alert("Total money earned: " + totalMoney + "$\n" + "Total money spend: " + totalSpend + "$\n" + "Total clicks: " + clickCounter)
    });

    $(".upgrade_button").click(function() {
        if (money >= OMEGAPRICE) {
            money -= OMEGAPRICE;
            totalSpend += OMEGAPRICE;
            OMEGAPRICE += OMEGAPRICE*100;
            moneyPerClick += moneyPerClick*20;
            price += price*20;
            show_money();
            show_money_per_click();
        }
        else {
            alert("You poor XD");
        }
        save();
    });
});

async function save() {
    localStorage.setItem("money", money);
    localStorage.setItem("totalMoney", totalMoney);
    localStorage.setItem("totalSpend", totalSpend);
    localStorage.setItem("moneyPerClick", moneyPerClick);
    localStorage.setItem("clickCounter", clickCounter);
    localStorage.setItem("price", price);
    localStorage.setItem("OMEGAPRICE", OMEGAPRICE);
};

async function show_money(){
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

async function show_money_per_click(){
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

async function load() {
    money = parseFloat(localStorage.getItem("money"));
    totalMoney = parseFloat(localStorage.getItem("totalMoney"));
    totalSpend = parseFloat(localStorage.getItem("totalSpend"));
    moneyPerClick = parseFloat(localStorage.getItem("moneyPerClick"));
    clickCounter = parseFloat(localStorage.getItem("clickCounter"));
    price = parseFloat(localStorage.getItem("price"));
    OMEGAPRICE = parseFloat(localStorage.getItem("OMEGAPRICE"));
    show_money();
    show_money_per_click();
};

async function buttonVerification() {
        let button = $(".increase_income");
        if (money < price) {
            button.addClass('disabled');
            button.css('background-image', 'url("Images/Upgrade_increase_income_disable.svg")');
        }
        else {
            button.removeClass('disabled');
            button.css('background-image', 'url("Images/Upgrade_increase_income.svg")');
        }
};