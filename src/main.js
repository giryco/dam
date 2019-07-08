// Resources
const cities = require('../resources/json/cities');

// Vendors
var fs = require('fs');
var pdf = require('html-pdf');

const dam = (object, xmlNfse, pathToPfd) => {
    return new Promise((resolve, reject) => {
        try {
            const cityCode = object.codigoMunicipio;
            const options = {
                format: 'A4'
            };

            for (let i = 0; i < cities.length; i++) {
                const c = cities[i];
                if (c.cityCode && (c.cityCode == cityCode)) {
                    city = c;
                }
            }

            chooseTemplate(city.nfseKeyword, object, xmlNfse)
                .then(res => {
                    if (!fs.existsSync(pathToPfd)) {
                        const result = {
                            status: 200,
                            message: 'Diretório para gravação de arquivo .pdf inexistente',
                            result: pathToPfd
                        }
                        console.log(result);
                        resolve(result);
                    }

                    (pathToPfd.substr(-1) === '/') ? pathToPfd = pathToPfd: pathToPfd = pathToPfd + '/';

                    pdf.create(res.html, options).toFile(pathToPfd + 'dam_' + res.providerId.replace(/\s{2,}/g, '') + '_' + res.nfseNumber.replace(/\s{2,}/g, '') + '.pdf', (error, response) => {
                        if (error) {
                            resolve(error);
                        }
                        const result = {
                            status: 200,
                            message: 'PDF criado em ' + pathToPfd + 'dam_' + res.providerId.replace(/\s{2,}/g, '') + '_' + res.nfseNumber.replace(/\s{2,}/g, '') + '.pdf',
                            result: response
                        }
                        console.log(result);
                        resolve(result);
                    })

                })
                .catch(rej => {
                    const result = {
                        status: 500,
                        message: 'Erro na definição de template para a DAM',
                        result: rej
                    }
                    console.error(rej);
                    reject(result);
                });
        } catch (error) {
            reject(error);
        }
    })
}

const chooseTemplate = (nfseKeyword, object, xmlNfse) => {
    return new Promise((resolve, reject) => {
        try {
            nfseKeyword ? nfseKeyword = nfseKeyword : nfseKeyword = 'portoalegre';
            let path = '../resources/template/' + nfseKeyword;
            fs.existsSync(path) ? path = path : path = '../resources/template/portoalegre';
            const template = require(path);

            template.setDam(object, xmlNfse)
                .then(res => {
                    resolve(res);
                })
                .catch(rej => {
                    reject(rej);
                })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    dam
};