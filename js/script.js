const nav = $('nav');
const leftBar = $('.leftBar');
const navLinks = $('.navLink li');

const search = $('.search');
const boxMealData = $('.boxMealData');
const contactData = $('.contactData');


// ===========================================> navigation
function openNav() {
    nav.animate({
        left:0
    }, 500)
    $('.toggleBtn i').removeClass("fa-solid fa-bars fa-2x");
    $('.toggleBtn i').addClass("fa-solid fa-xmark fa-2x");

    for (let i = 0; i < navLinks.length; i++) {
        navLinks.eq(i).delay(80 * i).animate({
            top: 0
        }, 700);
    }
}

nav.css("left", -leftBar.innerWidth());

function closeNav() {
    nav.animate({
        left: -leftBar.innerWidth()
    }, 500);
    $('.toggleBtn i').removeClass("fa-solid fa-xmark fa-2x");
    $('.toggleBtn i').addClass("fa-solid fa-bars fa-2x");
    navLinks.animate({
        top: "300px"
    }, 500);
}

//  ======> close open navigation
$(".toggleBtn").on("click", function () {
    if (nav.css("left") === "0px") {
        closeNav();
    } else {
        openNav();
    }
});


// ===========================================> Redirection between links
navLinks.eq(0).on("click", function () {
    boxMealData.html("");
    contactData.html("");
    closeNav();
    searchForMeal();
  });

navLinks.eq(1).on("click", function () {
    boxMealData.html("");
    contactData.html("");
    search.html("");
    closeNav();
    getCategory();
});

navLinks.eq(2).on("click", function () {
    boxMealData.html("");
    contactData.html("");
    search.html("");
    closeNav();
    getArea();
});

navLinks.eq(3).on("click", function () {
    boxMealData.html("");
    contactData.html("");
    search.html("");
    closeNav();
    getIngredients();
});

navLinks.eq(4).on("click", function () {
    boxMealData.html("");
    search.html("");
    closeNav();
    getContacts();
});
// ================================================> API Section 

let meals = [];

async function getMeals(){
    let getMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let response = await getMealsApi.json();
    meals = response.meals;
    displayMeals();
}

getMeals();

// ================================================> Meal display 

function displayMeals(){
    let mealsBox = ``;
    for (let i = 0; i < meals.length; i++) {
        // console.log(meals[i].idMeal)
        mealsBox +=`
        <div class="col-md-3">
            <div class="item" myID="${meals[i].idMeal}">
                <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}" class="w-100">
                <div class="layer"><h3 class="ps-2">${meals[i].strMeal}</h3></div>
            </div>
        </div>
        `;
    }
    boxMealData.html(mealsBox);

    $('.item').on('click', function(){
        getMealById($(this).attr("myID"));
        // console.log($(this).attr("myID"));
    });
    
}

// // ================================================> Meal Details

function displayMealDetails(meal){
    let recipes = ``;
    for (let i = 1; i <=20; i++) {
        if(meal[`strIngredient${i}`]){
            recipes +=
                `
                <li class="alert alert-info m-2 p-1">
                ${meal[`strMeasure${i}`]} 
                ${meal[`strIngredient${i}`]}
                </li>
                `;
        }
    }

    let getTag = meal.strTags?.split(",")
    
    if (!getTag) getTag = []

    let tags = ''
    for (let i = 0; i < getTag.length; i++) {
        tags += `
        <li class="alert alert-danger m-2 p-1">${getTag[i]}</li>`
    }

    let mealDetails =
    `
    <div class="col-md-4">
    <img src="${meal.strMealThumb}" alt="" class="rounded-2 mb-2 w-100">
    <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
    <h2 >Instructions</h2>
    <p>${meal.strInstructions}</p>
    <h3><span >Area: </span>${meal.strArea}</h3>
    <h3><span >Category: </span>${meal.strCategory}</h3>
    <h3><span >Recipes : </span></h3>
    <ul class="list-unstyled d-flex flex-wrap g-3">${recipes}</ul>
    <h3><span >Tags: </span></h3>
    <ul class="list-unstyled d-flex flex-wrap g-3">${tags}</ul>
    <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
    <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">YouTube</a>    
    </div>
    `

    boxMealData.html(`${mealDetails}`)
}

async function getMealById(id){
    let getMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let response = await getMealsApi.json();
    meals = response.meals[0];
    displayMealDetails(meals);
}

// ================================================> search

// ========> search section by name
async function getMealByName(name) {
    let getMealApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let response = await getMealApi.json();
    meals = response.meals;
    displayMeals();
}

// ========> search section by letter
async function getMealByLetter(letter) {
    let getMealApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let response = await getMealApi.json();
    meals = response.meals;
    displayMeals();
}

function searchForMeal(){
    let search =
        `
        <div class="col-md-6">
        <input type="text" position-relative z-3 placeholder="Search By Name" class=" searchByName form-control text-white bg-transparent" id="searchByName">
        </div>
        <div class="col-md-6">
        <input type="text" position-relative z-3 placeholder="Search By First Letter"class=" form-control text-white bg-transparent" id="searchByLetter"  maxlength="1">
        </div>
        `;
    $('.search').html(`${search}`);

    $("#searchByName").on("input", function () {
        let mealName = $(this).val();
        getMealByName(mealName);
    });
    $("#searchByLetter").on("input", function () {
        let letter = $(this).val();
        getMealByLetter(letter);
    });
}

// ================================================> Category section 

async function getCategory() {
    let getCategoryApi = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let response = await getCategoryApi.json();
    meals = response.categories;
    displayCategory();
}

function displayCategory(){
    let categoriesBox = ``;
    for (let i = 0; i < meals.length; i++)
    //splite string to array of words take first 20 word then covert it to string using join
    categoriesBox +=
        `
        <div class="col-md-3" >
            <div class="item text-center" >
                <img src="${meals[i].strCategoryThumb}" alt="${meals[i].strCategory}" class="w-100">
                <div class="layercate p-2">
                <h3 class="ps-2">${meals[i].strCategory}</h3>
                <p>${meals[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
                
            </div>
        </div>
        `
    boxMealData.html(`${categoriesBox}`);

    $(".item").on("click", function () {
        let mealCategory = $(this).find("h3").html();
        displayMealsByCategory(mealCategory);
    });
}

async function displayMealsByCategory(mealCategory) {
    let getCategoryApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealCategory}`);
    let response = await getCategoryApi.json();
    meals = response.meals;
    displayMeals();
}

// =====> Area section =================================

async function getArea(){
    let getAreaApi = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let response = await getAreaApi.json();
    meals = response.meals;
    displayAreas();
}

function displayAreas(){
    let areaBox = ``;
    for (let i = 0; i < meals.length; i++){
        areaBox +=
            `
            <div class="state col-md-3 text-center">
            <i class="fa-solid fa-house-laptop fa-4x m-3"></i>
            <h3>${meals[i].strArea}</h3>
            </div>
            `;
    }
    boxMealData.html(`${areaBox}`);

    $('.state').on('click', function(){
        getMealByArea($(this).find('h3').html());
    });
}

async function getMealByArea(area){
    let getMealApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let response = await getMealApi.json();
    meals = response.meals;
    displayMeals();
}

// ========getIngredients section =================================

async function getIngredients(){
    let getIngredientsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await getIngredientsApi.json();
    meals = response.meals;
    displayIngredients();
}

function displayIngredients(){
    let IngredientsBox = ``;
    for (let i = 0; i <20; i++){
        IngredientsBox +=
            `
            <div class="ingredients col-md-3 text-center">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${meals[i].strIngredient}</h3>
            <p>${meals[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
            `;
    }
    boxMealData.html(`${IngredientsBox}`);

    $('.ingredients').on('click', function(){
        getMealByIngredients($(this).find('h3').html());
    });
}

async function getMealByIngredients(ingredients){
    let getMealApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    let response = await getMealApi.json();
    meals = response.meals;
    displayMeals();
}


// =====> contact information =====
function getContacts(){

    let contact =`
            <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div class="row w-75 g-3">

            <div class="col-md-6">
                <input
                type="text"
                placeholder="Enter Your Name"
                class="nameInput form-control  text-black"
                />
                <p class="mt-3  d-none  alert alert-danger" id="nameWarning">
                Special characters and numbers not allowed
                </p>
            </div>

            <div class="col-md-6">
                <input
                type="email"
                placeholder="Enter Your Email"
                class="emailInput form-control  text-black"
                />
                <p class="mt-3  d-none  alert alert-danger" id="emailWarning">
                Email not valid! *exemple@yyy.zzz
                </p>
            </div>

            <div class="col-md-6">
                <input
                type="text"
                placeholder="Enter Your Phone"
                class="phoneInput form-control  text-black"
                />
                <p class="mt-3 d-none  alert alert-danger" id="phoneWarning">
                Enter valid Phone Number
                </p>
            </div>

            <div class="col-md-6">
                <input
                type="number"
                placeholder="Enter Your Age"
                class="ageInput form-control  text-black"
                />
                <p class="mt-3  d-none  alert alert-danger" id="ageWarning">
                Enter valid age
                </p>
            </div>


            <div class="col-md-6">
                <input
                type="password"
                placeholder="Enter Your Password"
                class="passwordInput form-control  text-black"
                />
                <p class="mt-3  d-none  alert alert-danger" id="passwordWarning">
                Enter valid password *Minimum 8 characters, at least 1
                letter and 1 number*
                </p>
            </div>

            <div class="col-md-6">
                <input
                type="password"
                placeholder="Re-Enter Your Password"
                class="repasswordInput form-control  text-black"
                />
                <p class="mt-3  d-none text-danger alert alert-danger" id="repasswordWarning">
                Enter valid repassword
                </p>
            </div>
            </div>

            <button disabled="true" id="submitBtn" class="btn btn-outline-danger mt-3 px-4">
            Submit
        </button>
        </div>
        `;



        contactData.html(`${contact}`);

        const nameInput = $(".nameInput");
        const emailInput = $(".emailInput");
        const phoneInput = $(".phoneInput");
        const ageInput = $(".ageInput");
        const passwordInput = $(".passwordInput");
        const repasswordInput = $(".repasswordInput");

        const submitBtn = $("#submitBtn");

        const nameWarning = $("#nameWarning");
        const emailWarning = $("#emailWarning");
        const phoneWarning = $("#phoneWarning");
        const ageWarning = $("#ageWarning");
        const passwordWarning = $("#passwordWarning");
        const repasswordWarning = $("#repasswordWarning");

        nameInput.on("input", function () {
            if (nameValidation(nameInput.val())) {
            allValidationsPass();
            nameWarning.addClass("d-none");
            } else {
            nameWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        emailInput.on("input", function () {
            if (emailValidation(emailInput.val())) {
            allValidationsPass();
            emailWarning.addClass("d-none");
            } else {
            emailWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        phoneInput.on("input", function () {
            if (phoneValidation(phoneInput.val())) {
            allValidationsPass();
            phoneWarning.addClass("d-none");
            } else {
            phoneWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        ageInput.on("input", function () {
            if (ageValidation(ageInput.val())) {
            allValidationsPass();
            ageWarning.addClass("d-none");
            } else {
            ageWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        passwordInput.on("input", function () {
            if (passwordValidation(passwordInput.val())) {
            allValidationsPass();
            passwordWarning.addClass("d-none");
            } else {
            passwordWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        repasswordInput.on("input", function () {
            if (repasswordValidation(repasswordInput.val())) {
            allValidationsPass();
            repasswordWarning.addClass("d-none");
            } else {
            repasswordWarning.removeClass("d-none");
            submitBtn.attr("disabled", true);
            }
        });

        function allValidationsPass() {
            if (
                nameValidation(nameInput.val()) &&
                emailValidation(emailInput.val()) &&
                phoneValidation(phoneInput.val()) &&
                ageValidation(ageInput.val()) &&
                passwordValidation(passwordInput.val()) &&
                repasswordValidation(repasswordInput.val())
            )
            {
                submitBtn.attr("disabled", false);
            } else {
                submitBtn.attr("disabled", true);
            }
            }

        
        // Validation functions
        function nameValidation(name) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            return nameRegex.test(name);
        }
        
        function emailValidation(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function phoneValidation(phone) {
            const phoneRegex = /^\d{11}$/;
            return phoneRegex.test(phone);
        }
        
        function ageValidation(age) {
            return !isNaN(age) && age > 0;
        }
        
        function passwordValidation(password) {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            return passwordRegex.test(password);
        }
        
        function repasswordValidation(repassword) {
            return repassword === passwordInput.val();
        }

}