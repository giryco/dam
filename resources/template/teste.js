const populateDam = (populateTemplate, object, city) => {
    return new Promise((resolve, reject) => {
        try {
            var somaDesconto = populateTemplate.servico['valores']['descontoCondicionado'] + populateTemplate.servico['valores']['descontoIncondicionado'];
            var somaRetencoesFederais = populateTemplate.servico['valores']['valorCsll'] + populateTemplate.servico['valores']['valorPis'] + populateTemplate.servico['valores']['valorCofins'] + populateTemplate.servico['valores']['valorIr'] + populateTemplate.servico['valores']['valorInss'];

            var desconto = parseFloat(somaDesconto, 2);
            var retencaoCalculo = somaRetencoesFederais * populateTemplate.servico['valores']['baseCalculo'];
            var retencaoFederal = parseFloat(retencaoCalculo, 2);

            const html = ``;
            resolve(html);
        } catch (error) {
            reject(error);
        }
    })
}

const formatDate = (data, formato) => {
    if (formato == 'pt-br') {
        return (data.substr(0, 10).split('-').reverse().join('/'));
    } else {
        return (data.substr(0, 10).split('/').reverse().join('-'));
    }
}

const formatCash = (n) => {
    return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

module.exports = {
    populateDam
};