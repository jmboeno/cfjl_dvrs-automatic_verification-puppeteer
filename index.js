const puppeteer = require('puppeteer');

var dvrs = {
  totalDvrs: 2,
  usuario: 'USER',
  senha: 'password',
  dvr1: {
    name: 'DVR1',
    url: 'http://192.168.0.1',
    cams: 6,
    model: 8,
  },
  dvr2: {
    name: 'DVR2',
    url: 'http://192.168.0.2',
    cams: 13,
    model: 16,
  },
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  for (i = 0; i < dvrs.totalDvrs; i++) {
    function delay(n) {
      return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
      });
    }

    var dvrName = '';
    var dvrCams,
      dvrModel = 0;

    switch (i) {
      case 0: {
        await page.goto(dvrs.dvr1.url);
        dvrName = dvrs.dvr1.name;
        dvrCams = dvrs.dvr1.cams;
        dvrModel = dvrs.dvr1.model;
        break;
      }
      case 1: {
        await page.goto(dvrs.dvr2.url);
        dvrName = dvrs.dvr2.name;
        dvrCams = dvrs.dvr2.cams;
        dvrModel = dvrs.dvr2.model;
        break;
      }
      case 2: {
        await page.goto(dvrs.dvr3.url);
        dvrName = dvrs.dvr3.name;
        dvrCams = dvrs.dvr3.cams;
        dvrModel = dvrs.dvr3.model;
        break;
      }
      case 3: {
        await page.goto(dvrs.dvr4.url);
        dvrName = dvrs.dvr4.name;
        dvrCams = dvrs.dvr4.cams;
        dvrModel = dvrs.dvr4.model;
        break;
      }
      case 4: {
        await page.goto(dvrs.dvr5.url);
        dvrName = dvrs.dvr5.name;
        dvrCams = dvrs.dvr5.cams;
        dvrModel = dvrs.dvr5.model;
        break;
      }
      default: {
        return console.log('Finalizado');
      }
    }

    // - Faz Login
    switch (dvrModel) {
      case 8: {
        await page.waitForSelector('#loginUsername-inputEl');
        await page.type('#loginUsername-inputEl', dvrs.usuario);
        await page.waitForSelector('#loginPassword-inputEl');
        await page.type('#loginPassword-inputEl', dvrs.senha);
        await page.click('#loginButton');
        break;
      }
      case 16: {
        await page.waitForSelector('#username');
        await page.type('#username', dvrs.usuario);
        await page.waitForSelector('#password');
        await page.type('#password', dvrs.senha);
        await page.click(
          '#l > div.login-container > div.login-content > div.login-inputbox.fn-clear > form > div.ui-button-box.login-btnbox.general-btnbox > a.ui-button.fn-width80.login_confirm',
        );
      }
    }

    // - Printa a tela inicial
    // await delay(2);
    // await page.waitForSelector('#desktop-1017');
    // await page.screenshot({ path: `${dvrName}_home.png` });

    // - Pega o total de cameras
    //await delay(2);
    /* await page.waitForSelector('#ext-comp-1061-innerCt');
    const totalCams = await page.evaluate(() => {
      return document.querySelector('#ext-comp-1061-innerCt').childNodes.length;
    }); */

    // - Seleciona layout de uma imagem
    //await delay(2);
    await page.waitForSelector('#button-1236');
    await page.click('#button-1236');

    let countCam = 2;
    let countPrint = 1;
    for (j = 0; j < dvrCams; j++) {
      // Abre Camera [i]
      //await delay(2);
      await page.waitForSelector('#splitbutton-129' + countCam);
      await page.click('#splitbutton-129' + countCam);
      // Estende Camera [i]
      //await delay(2);
      await page.waitForSelector('#button-1235');
      await page.click('#button-1235');
      // - Printa a Camera [i]
      await delay(2);
      //await page.waitForSelector('#canvasplayer_0', { visible: true });
      await page.screenshot({
        path: `${dvrName}_camera${countPrint}.png`,
      });
      // - Fecha a Camera [i]
      await page.keyboard.press('Escape');
      countCam++;
      countPrint++;
    }

    //Abre o Menu Principal
    //await delay(2);
    await page.waitForSelector('#button-1044');
    await page.click('#button-1044');
    //Abre Menu de Gravações
    await page.click('#dataview-1046>div>div:nth-child(2)');

    let countCamRec = 5;
    let countPrintRec = 1;
    for (k = 1; k <= dvrCams; k++) {
      if (k > 1) {
        // Desliga a camera atual
        //await delay(2);
        await page.waitForSelector(`#ext-gen${1950 + countCamRec} > div > div`);
        await page.click(`#ext-gen${1950 + countCamRec} > div > div`);
        // Liga a próxima câmera
        //await delay(2);
        await page.waitForSelector(
          `#ext-gen${1950 + (countCamRec + 3)} > div > div`,
        );
        await page.click(`#ext-gen${1950 + (countCamRec + 3)} > div > div`);
        countCamRec += 3;
        countPrintRec++;
      }

      // Da play na gravação
      await delay(1);
      await page.click('#button-1307');

      // Printa a tela
      await delay(2);
      //await page.waitForSelector('#canvasplayer_0', { visible: true });
      await page.screenshot({
        path: `${dvrName}_camera${countPrintRec}_gravações.png`,
      });

      // Da pause na gravação
      await delay(1);
      await page.click('#button-1308');
    }
  }
  //await browser.close();
})();
