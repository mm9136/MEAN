/**
 * Funkcionalni testi
 */
(async function EduGeoCache() {
    // Knjižnice
    const { exec } = require("child_process");
    const { describe, it, after, before } = require("mocha");
    const { Builder, By, until } = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const expect = require("chai").expect;

    // Parametri
    let aplikacijaUrl = "https://sp-mestmovies.herokuapp.com/";
    let seleniumStreznikUrl = "http://localhost:4445/wd/hub";
    let brskalnik, jwtZeton;

    const axios = require('axios').create({
        baseURL: aplikacijaUrl + "api/",
        timeout: 5000
    });

    // Obvladovanje napak
    process.on("unhandledRejection", (napaka) => {
        console.log(napaka);
    });

    // Počakaj določeno število sekund na zahtevani element na strani
    let pocakajStranNalozena = async (brskalnik, casVS, xpath) => {
        await brskalnik.wait(() => {
            return brskalnik.findElements(By.xpath(xpath)).then(elementi => {
                return elementi[0];
            });
        }, casVS * 1000, `Stran se ni naložila v ${casVS} s.`);
    };

    try {

        before(() => {
            brskalnik = new Builder()
                .forBrowser("chrome")
                .setChromeOptions(new chrome.Options()
                    .addArguments("start-maximized")
                    .addArguments("disable-infobars")
                    .addArguments("allow-insecure-localhost")
                    .addArguments("allow-running-insecure-content")
                )
                .usingServer(seleniumStreznikUrl)
                .build();
        });

        describe("Search",  function() {
            this.timeout(30 * 1000);
            before(function() { brskalnik.get(aplikacijaUrl); });
            it("Make a search",  async function() {
                await pocakajStranNalozena(brskalnik, 10, "//h5");
                let searchField =  await  brskalnik.findElement(By.css("input[name='search']"));
                expect(searchField).to.not.be.empty;
                searchField.sendKeys("Titanic");
                //await  brskalnik.findElement(By.css("option:nth-child(11)")).click();
                await brskalnik.findElement(
                    By.xpath("//button[contains(text(), 'Search')]")).click();

            });

            context("Search context", function() {
                it("Check search",   async function() {
                  await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), ' Titanic ')]");
                  let naslov =   await brskalnik.findElement( By.xpath("//button[contains(text(), ' Titanic ')]"));
                  expect(naslov).to.not.be.empty;
                });
                it("Check search", async function() {
                    await pocakajStranNalozena(brskalnik, 20, "//button[contains(text(), ' Titanic ')]");
                    let naslov =   await brskalnik.findElement(By.xpath("//p[contains(text(), ' Titanic is a 1997 American epic romance and disaster film directed, written, co-produced, and co-edited by James Cameron ')]"));
                    expect(naslov).to.not.be.empty;
                });
            })

        });

        describe("Registracija novega uporabnika", function() {
            this.timeout(30 * 1000);
            before(async function () {
                await brskalnik.get(aplikacijaUrl);
            });


            //da li postoji link na stranici glavnoj koji sadrzi Log in
            it("prijava uporabnika", async function () {
                 let povezava = await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'Log in')]"));
                expect(povezava).to.not.be.empty;
                await povezava.click();
            });

            it("izbira registracije", async function () {
                await pocakajStranNalozena(brskalnik, 10,
                    "//a[contains(text(), 'Register now!')]");
                let povezava = await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'Register now!')]"));
                expect(povezava).to.not.be.empty;
                await povezava.click();
            });
            it("vnos podatkov uporabnika", async function () {
                await pocakajStranNalozena(brskalnik, 10,
                    "//h2[contains(text(), 'Register')]");
                let firstname = await brskalnik.findElement(By.css("input[name='firstnameR']"));
                expect(firstname).to.not.be.empty;
                firstname.sendKeys("Janez");
                let lastname = await brskalnik.findElement(By.css("input[name='lastnameR']"));
                expect(lastname).to.not.be.empty;
                lastname.sendKeys("Kranjski");
                let email = await brskalnik.findElement(
                    By.css("input[name='emailR']"));
                expect(email).to.not.be.empty;
                email.sendKeys("janez@student.uni-lj.si");
                let password = await brskalnik.findElement(By.css("input[name='passwordR']"));
               expect(password).to.not.be.empty;
                password.sendKeys("test");
                let confirm = await brskalnik.findElement(By.css("input[name='confirmR']"));
                expect(confirm).to.not.be.empty;
                confirm.sendKeys("test");
                await brskalnik.findElement(
                    By.xpath("//button[contains(text(), 'Register')]")).click();
            });



            context("Login context", function() {
                it("prijava uporabnika nakon registracije", async function () {
                    await pocakajStranNalozena(brskalnik, 10,
                        "//h2[contains(text(), 'Register')]");
                    let povezava = await brskalnik.findElement(
                        By.xpath("//a[contains(text(), 'Log in')]"));
                    expect(povezava).to.not.be.empty;
                    await povezava.click();
                });


                it("vnos podatkov login", async function () {
                    await pocakajStranNalozena(brskalnik, 2000, "//h2[contains(text(), 'Login')]");
                    let email = await brskalnik.findElement(
                        By.css("input[name='email']"));
                    expect(email).to.not.be.empty;
                    email.sendKeys("janez@student.uni-lj.si");
                    let password = await brskalnik.findElement(By.css("input[name='password']"));
                    expect(password).to.not.be.empty;
                    password.sendKeys("test");
                    await brskalnik.findElement(
                        By.xpath("//button[contains(text(), 'Log in')]")).click();
                });


                it("preveri ali je uporabnik prijavljen", async function () {
                    await pocakajStranNalozena(brskalnik, 2000, "//h5");
                    let uporabnik = await brskalnik.findElement(
                        By.xpath("//button[contains(text(), 'Janez Kranjski')]"));
                    await expect(uporabnik).to.not.be.empty;
                });

                it("pridobi JWT žeton", async function () {
                    jwtZeton = await brskalnik.executeScript(function () {
                        return localStorage.getItem("token");
                    });
                    expect(jwtZeton).to.not.be.empty;
                });
            });


        });
        describe("Genre page", function() {
            it("go to genre", async function () {
                await pocakajStranNalozena(brskalnik, 10,
                    "//a[contains(text(), 'Genre')]");
                await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'Genre')]")).click();
            });

            context("data on genre page", function () {

                it("naslov strani", async function () {
                    await  pocakajStranNalozena(brskalnik, 10, "//h5");
                    let naslov =  await brskalnik.findElement(By.css("h5"));
                    expect(naslov).to.not.be.empty;
                    naslov.getText().then(function (vsebina) {
                        expect(vsebina).to.be.equal("Choose your favourite genre...");
                    });
                });


                it("genre crime",   async function() {
                    await pocakajStranNalozena(brskalnik, 1000, "//button[contains(text(), ' Crime ')]");
                    let naslov =   await brskalnik.findElement( By.xpath("//button[contains(text(), ' Crime ')]"));
                    expect(naslov).to.not.be.empty;
                });
            });
        });

        describe("DVD page", function() {
            it("go to dvd", async function () {
                await pocakajStranNalozena(brskalnik, 20,
                    "//a[contains(text(), 'DVD')]");
                await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'DVD')]")).click();
            });

            context("data on dvd", function () {
                it("naslov strani", async function () {
                    await pocakajStranNalozena(brskalnik, 10, "//h2");
                    let naslov =  await brskalnik.findElement(By.css("h2"));
                    expect(naslov).to.not.be.empty;
                     naslov.getText().then(function (vsebina) {
                        expect(vsebina).to.be.equal("DVD");
                    });
                });

                it("dvds TIG", async function () {
                    await pocakajStranNalozena(brskalnik, 1000, "//button[contains(text(), ' The Imitation game ')]");
                    let naslov =   await brskalnik.findElement( By.xpath("//button[contains(text(), ' The Imitation game ')]"));
                    expect(naslov).to.not.be.empty;
                });
                it("dvds T", async function () {
                    await pocakajStranNalozena(brskalnik, 1000, "//button[contains(text(), ' Titanic ')]");
                    let naslov =   await brskalnik.findElement( By.xpath("//button[contains(text(), ' Titanic ')]"));
                    expect(naslov).to.not.be.empty;
                });

            });
        });

        describe("Shopping cart", function() {

            it("Add to cart", async function () {
                await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), ' Titanic ')]");
                let dvd1 =  await brskalnik.findElement
                (By.css("#filmlist > .card:nth-child(1) > .card-header > h2 > .price > button"));
                expect(dvd1).to.not.be.empty;
                await dvd1.click();
                await dvd1.click();

                let dvd2 =  await brskalnik.findElement
                (By.css("#filmlist > .card:nth-child(2) > .card-header > h2 > .price > button"));
                expect(dvd2).to.not.be.empty;
                await dvd2.click();


            });

            it("go to shopping cart",async function () {
                await brskalnik.findElement(
                    By.css("#navbarNavDropdown > ul > li:nth-child(5) > a")).click();
            });

            it("proveri cart", async function () {
                cart = await brskalnik.executeScript(function () {
                    return localStorage.getItem("cart");
                });
                expect(cart).to.not.be.empty;
            });

            context("data on shopping cart page", function () {
                it("naslov strani",  async function () {
                    await pocakajStranNalozena(brskalnik, 100, "//h3");
                    let naslov =  await brskalnik.findElement(By.css("h3"));

                    expect(naslov).to.not.be.empty;
                    naslov.getText().then(function (vsebina) {
                       expect(vsebina).to.be.equal("Your orders:");
                    });
                });
                it("Titanic dvd in cart", async function () {
                    let naslov =  await brskalnik.findElement(By.css("#table-cart > tbody > tr:nth-child(1) > td:nth-child(1) > p"));
                    expect(naslov).to.not.be.empty;
                });
                it("Twlight dvd in cart", async function () {
                    let naslov =  await brskalnik.findElement(By.css("#table-cart > tbody > tr:nth-child(2) > td:nth-child(1) > p"));
                    expect(naslov).to.not.be.empty;
                });

                it("total", async function () {
                    await pocakajStranNalozena(brskalnik, 10, "//h3");
                    let total = await brskalnik.findElement(
                        By.css("#table-cart > tbody > tr:nth-child(1) > td:nth-child(3) > p"));
                    expect(await total.getText()).to.have.string("20,00€");
                });

                it("Remove", async function () {
                    await pocakajStranNalozena(brskalnik, 10, "//h3");
                    let remove = await brskalnik.findElement(
                        By.css("#table-cart > tbody > tr:nth-child(1) > td:nth-child(2) > div > button:nth-child(1)"));
                    expect(remove).to.not.be.empty;
                    await remove.click();
                });

                it("total updated", async function () {
                    await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), '+')]");
                    let total = await brskalnik.findElement(
                        By.css("#table-cart > tbody > tr:nth-child(1) > td:nth-child(3) > p"));
                    await expect(await total.getText()).to.have.string("10,00€");
                });

                it("Remove Twilight", async function () {
                    await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), '+')]");
                    let remove =  await brskalnik.findElement
                    (By.css("#table-cart > tbody > tr:nth-child(2) > td:nth-child(4) > button"));
                    expect(remove).to.not.be.empty;
                    await remove.click();

                });

            });
        });


        describe("Odjava uporabnika", async function() {
            this.timeout(30 * 1000);
            before(function() { brskalnik.get(aplikacijaUrl); });

            it("preveri ali je uporabnik prijavljen", async function() {
                await pocakajStranNalozena(brskalnik, 10, "//button[contains(text(), 'Janez Kranjski')]");
                let uporabnik = await brskalnik.findElement(
                    By.xpath("//button[contains(text(), 'Janez Kranjski')]"));
                expect(uporabnik).to.not.be.empty;
            });

            it("zahtevaj odjavo", async function() {
                let uporabnik = await brskalnik.findElement(
                    By.xpath("//button[contains(text(), 'Janez Kranjski')]"));
                expect(uporabnik).to.not.be.empty;
                await uporabnik.click();
                let odjava = await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'Sign out')]"));
                expect(odjava).to.not.be.empty;
                await odjava.click();
            });

            it("preveri ali je uporabnik odjavljen", async function() {
                let prijava = await brskalnik.findElement(
                    By.xpath("//a[contains(text(), 'Log in')]"));
                expect(prijava).to.not.be.empty;
            });

            it("izbriši uporabnika iz podatkovne baze", async function () {
                let dockerAtlasBrisiUporabnika =
                    "docker exec -i sp-mestmovies-mongodb bash -c " + "\"mongo " +
                    "\\\"mongodb+srv://mestmovies.9zkis.mongodb.net/MESTmovies\\\" " +
                    "--username admin --password secure-access --eval " +
                    "'db.Users.remove({email: \\\"janez@student.uni-lj.si\\\"})'" + "\"";
                exec(dockerAtlasBrisiUporabnika).on("close", (koda) => {
                    expect(koda).to.be.equal(0);
                });
            });

        });

        after( () => {
            brskalnik.quit();
        });

    } catch (napaka) {
        console.log("Med testom je prišlo do napake!");
    }
})();
