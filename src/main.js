// Resources
const cities = require('../resources/json/cities');

// Vendors
var pdf = require('html-pdf');

const dam = (object, xmlNfse, pathToPfd) => {
    const cityCode = object.codigoMunicipio;
    const options = { format: 'A4' };

    for (let i = 0; i < cities.length; i++) {
        const c = cities[i];
        if (c.cityCode && (c.cityCode == cityCode)) {
            city = c;
        }
    }

    chooseTemplate(city.nfseKeyword, object, xmlNfse)
        .then(res => {
            pdf.create(res.html, options).toFile(pathToPfd + '/' + res.nfseNumber + '.pdf', (error, response) => {
                if (error) {
                    return error;
                }
                const result = {
                    status: 200,
                    message: `PDF criado em ${pathToPfd + '/' + res.nfseNumber}`,
                    result: response
                }
                console.log(result);
                return result;
            })
        })
        .catch(rej => {
            console.log(rej);
        });
}

const chooseTemplate = (nfseKeyword, object, xmlNfse) => {
    return new Promise((resolve, reject) => {
        try {
            const template = require('../resources/template/' + nfseKeyword);

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