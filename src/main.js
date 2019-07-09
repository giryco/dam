// Resources
const cities = require('../resources/json/cities');

// Vendors
var fs = require('fs');
var pdf = require('html-pdf');
const xmlToJson = require('xml-js');

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

const setDam = (object, xmlNfse) => {
    return new Promise((resolve, reject) => {
        try {
            xmlNfse = xmlNfse.replace(/ns3:/g, '').replace(/ns4:/g, ''); console.log(xmlNfse, 10);
            const descricaoDoServico = '';
            const xmlSplitToString = xmlNfse.split('<InfNfse')[1].replace(/\n/g, '');
            const xmlSplitted = xmlSplitToString.split(/>(.+)/)[1].split('</InfNfse>')[0];
            console.log(xmlSplitted, 15);
            // TO-DO
            // if (resQuery.result.return.rows.length > 0) {
            //     descricaoDoServico = resQuery['result']['return']['rows'][0]['DSC_SERVICO'];
            // }
            const principal = {};
            const prestadorServico = {
                identificacaoPrestador: {
                    cpfCnpj: {}
                },
                endereco: {},
                contato: {}
            };
            const tomadorServico = {
                identificacaoTomador: {
                    cpfCnpj: {}
                },
                endereco: {},
                contato: {}
            }
            const servico = {
                valores: {}
            };
            const parseXmlToJson = {
                nfse: JSON.parse(xmlToJson.xml2json('<InfNfse>' + xmlSplitted + '</InfNfse>', {
                    compact: true
                })),
                logoEmpresa: object['logoEmpresa'],
                codigoMunicipal: object['codigoMunicipio']
            };
            console.log(parseXmlToJson.nfse.InfNfse, 50);
            const objNotaFiscal = parseXmlToJson['nfse'];

            objNotaFiscal.InfNfse.NaturezaOperacao ? principal['naturezaOperacao'] = setInvoiceType(objNotaFiscal.InfNfse.NaturezaOperacao._text) : principal['naturezaOperacao'] = '';
            principal['numero'] = objNotaFiscal['InfNfse']['Numero']['_text'];
            principal['dataEmissao'] = objNotaFiscal['InfNfse']['DataEmissao']['_text'];
            principal['codigoVerificacao'] = objNotaFiscal['InfNfse']['CodigoVerificacao']['_text'];

            const city = setCityDataByItsIbgeCode((objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text : ' ');

            if (city.nfseKeyword != 'catalao') {
                prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj._text : '';
                prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf._text : '';
            } else {
                prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cnpj && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cnpj._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cnpj._text : '';
                prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cpf && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cpf._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.CpfCnpj.Cpf._text : '';
            }
            prestadorServico['identificacaoPrestador']['inscricaoMunicipal'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal._text : '';
            prestadorServico['razaoSocial'] = (objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial && objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial._text : ' ';
            prestadorServico['endereco']['endereco'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco._text : ' ';
            prestadorServico['endereco']['numero'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero._text : ' ';
            prestadorServico['endereco']['bairro'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro._text : ' ';
            prestadorServico['endereco']['codigoMunicipio'] = city.cityCode;
            prestadorServico['endereco']['uf'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf._text : ' ';
            prestadorServico['endereco']['cep'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep._text : ' ';
            prestadorServico['endereco']['municipio'] = city.name;
            prestadorServico['contato']['telefone'] = (objNotaFiscal.InfNfse.PrestadorServico.Contato && objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone && objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone._text : ' ';
            prestadorServico['contato']['email'] = (objNotaFiscal.InfNfse.PrestadorServico.Contato && objNotaFiscal.InfNfse.PrestadorServico.Contato.Email && objNotaFiscal.InfNfse.PrestadorServico.Contato.Email._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Contato.Email._text : ' ';

            if (city.nfseKeyword != 'catalao') {
                tomadorServico['identificacaoTomador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj._text != '') ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj._text : '';
                tomadorServico['identificacaoTomador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf._text != '') ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf._text : '';
                tomadorServico['identificacaoTomador']['inscricaoMunicipal'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text != '' && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text != 0) ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text : '';
                tomadorServico['razaoSocial'] = (objNotaFiscal.InfNfse.TomadorServico.RazaoSocial && objNotaFiscal.InfNfse.TomadorServico.RazaoSocial._text != '') ? objNotaFiscal.InfNfse.TomadorServico.RazaoSocial._text : ' ';
                tomadorServico['endereco']['endereco'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco && objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco._text : ' ';
                tomadorServico['endereco']['numero'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero && objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero._text : ' ';
                tomadorServico['endereco']['bairro'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro && objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro._text : ' ';
                tomadorServico['endereco']['codigoMunicipio'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text : ' ';
                tomadorServico['endereco']['uf'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf && objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf._text : ' ';
                tomadorServico['endereco']['cep'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep && objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep._text : ' ';
                tomadorServico['endereco']['municipio'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text != '') ? setCityDataByItsIbgeCode(objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text).name : ' ';
                tomadorServico['contato']['telefone'] = (objNotaFiscal.InfNfse.TomadorServico.Contato && objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone && objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone._text : ' ';
                tomadorServico['contato']['email'] = (objNotaFiscal.InfNfse.TomadorServico.Contato && objNotaFiscal.InfNfse.TomadorServico.Contato.Email && objNotaFiscal.InfNfse.TomadorServico.Contato.Email._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Contato.Email._text : ' ';
            } else {
                tomadorServico['identificacaoTomador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cnpj && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cnpj._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cnpj._text : '';
                tomadorServico['identificacaoTomador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cpf && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cpf._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cpf._text : '';
                tomadorServico['identificacaoTomador']['inscricaoMunicipal'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.InscricaoMunicipal && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.InscricaoMunicipal._text != '' && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.InscricaoMunicipal._text != 0) ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.InscricaoMunicipal._text : '';
                tomadorServico['razaoSocial'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.RazaoSocial && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.RazaoSocial._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.RazaoSocial._text : ' ';
                tomadorServico['endereco']['endereco'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Endereco && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Endereco._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Endereco._text : ' ';
                tomadorServico['endereco']['numero'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Numero && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Numero._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Numero._text : ' ';
                tomadorServico['endereco']['bairro'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Bairro && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Bairro._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Bairro._text : ' ';
                tomadorServico['endereco']['codigoMunicipio'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio._text : ' ';
                tomadorServico['endereco']['uf'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Uf && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Uf._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Uf._text : ' ';
                tomadorServico['endereco']['cep'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Cep && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Cep._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.Cep._text : ' ';
                tomadorServico['endereco']['municipio'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio._text != '') ? setCityDataByItsIbgeCode(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Endereco.CodigoMunicipio._text).name : ' ';
                tomadorServico['contato']['telefone'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Telefone && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Telefone._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Telefone._text : ' ';
                tomadorServico['contato']['email'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Email && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Email._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.Contato.Email._text : ' ';
            }

            if (city.nfseKeyword != 'catalao') {
                servico['discriminacao'] = (objNotaFiscal.InfNfse.Servico.Discriminacao && objNotaFiscal.InfNfse.Servico.Discriminacao._text != '') ? objNotaFiscal.InfNfse.Servico.Discriminacao._text : ' ';
                servico['codigoTributacaoMunicipio'] = (objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio && objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio._text, 2) : '';
                servico['valores']['baseCalculo'] = (objNotaFiscal.InfNfse.Servico.Valores.BaseCalculo && objNotaFiscal.InfNfse.Servico.Valores.BaseCalculo._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.BaseCalculo._text, 2) : 0;
                servico['valores']['descontoIncondicionado'] = (objNotaFiscal.InfNfse.Servico.Valores.DescontoIncondicionado && objNotaFiscal.InfNfse.Servico.Valores.DescontoIncondicionado._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.DescontoIncondicionado._text, 2) : 0;
                servico['valores']['descontoCondicionado'] = (objNotaFiscal.InfNfse.Servico.Valores.DescontoCondicionado && objNotaFiscal.InfNfse.Servico.Valores.DescontoCondicionado._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.DescontoCondicionado._text, 2) : 0;
                servico['valores']['issRetido'] = objNotaFiscal.InfNfse.Servico.Valores.IssRetido._text;
                servico['valores']['aliquota'] = (objNotaFiscal.InfNfse.Servico.Valores.Aliquota && objNotaFiscal.InfNfse.Servico.Valores.Aliquota._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.Servico.Valores.Aliquota._text)) : 0;
                servico['valores']['valorLiquidoNfse'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorLiquidoNfse && objNotaFiscal.InfNfse.Servico.Valores.ValorLiquidoNfse._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorLiquidoNfse._text)) : 0;
                servico['valores']['valorDeducoes'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorDeducoes && objNotaFiscal.InfNfse.Servico.Valores.ValorDeducoes._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorDeducoes._text)) : 0;
                servico['valores']['valorIss'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorIss && objNotaFiscal.InfNfse.Servico.Valores.ValorIss._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorIss._text)) : 0;
                servico['valores']['valorCsll'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorCsll && objNotaFiscal.InfNfse.Servico.Valores.ValorCsll._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorCsll._text, 2) : 0;
                servico['valores']['valorPis'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorPis && objNotaFiscal.InfNfse.Servico.Valores.ValorPis._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorPis._text, 2) : 0;
                servico['valores']['valorCofins'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorCofins && objNotaFiscal.InfNfse.Servico.Valores.ValorCofins._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorCofins._text, 2) : 0;
                servico['valores']['valorIr'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorIr && objNotaFiscal.InfNfse.Servico.Valores.ValorIr._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorIr._text, 2) : 0;
                servico['valores']['valorInss'] = (objNotaFiscal.InfNfse.Servico.Valores.ValorInss && objNotaFiscal.InfNfse.Servico.Valores.ValorInss._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.Valores.ValorInss._text, 2) : 0;
            } else {
                servico['discriminacao'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Discriminacao && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Discriminacao._text != '') ? objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Discriminacao._text : ' ';
                servico['codigoTributacaoMunicipio'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.CodigoTributacaoMunicipio && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.CodigoTributacaoMunicipio._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.CodigoTributacaoMunicipio._text, 2) : '';
                servico['valores']['baseCalculo'] = (objNotaFiscal.InfNfse.ValoresNfse.BaseCalculo && objNotaFiscal.InfNfse.ValoresNfse.BaseCalculo._text != '') ? parseFloat(objNotaFiscal.InfNfse.ValoresNfse.BaseCalculo._text, 2) : 0;
                servico['valores']['descontoIncondicionado'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoIncondicionado && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoIncondicionado._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoIncondicionado._text, 2) : 0;
                servico['valores']['descontoCondicionado'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoCondicionado && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoCondicionado._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.DescontoCondicionado._text, 2) : 0;
                servico['valores']['issRetido'] = objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.IssRetido._text;
                servico['valores']['aliquota'] = (objNotaFiscal.InfNfse.ValoresNfse.Aliquota && objNotaFiscal.InfNfse.ValoresNfse.Aliquota._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.ValoresNfse.Aliquota._text)) : 0;
                servico['valores']['valorLiquidoNfse'] = (objNotaFiscal.InfNfse.ValoresNfse.ValorLiquidoNfse && objNotaFiscal.InfNfse.ValoresNfse.ValorLiquidoNfse._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.ValoresNfse.ValorLiquidoNfse._text)) : 0;
                servico['valores']['valorDeducoes'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorDeducoes && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorDeducoes._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorDeducoes._text)) : 0;
                servico['valores']['valorIss'] = (objNotaFiscal.InfNfse.ValoresNfse.ValorIss && objNotaFiscal.InfNfse.ValoresNfse.ValorIss._text != '') ? formatCash(parseFloat(objNotaFiscal.InfNfse.ValoresNfse.ValorIss._text)) : 0;
                servico['valores']['valorCsll'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCsll && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCsll._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCsll._text, 2) : 0;
                servico['valores']['valorPis'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorPis && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorPis._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorPis._text, 2) : 0;
                servico['valores']['valorCofins'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCofins && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCofins._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorCofins._text, 2) : 0;
                servico['valores']['valorIr'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorIr && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorIr._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorIr._text, 2) : 0;
                servico['valores']['valorInss'] = (objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorInss && objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorInss._text != '') ? parseFloat(objNotaFiscal.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Servico.Valores.ValorInss._text, 2) : 0;
            }

            var somaDesconto = servico['valores']['descontoCondicionado'] + servico['valores']['descontoIncondicionado'];
            var somaRetencoesFederais = servico['valores']['valorCsll'] + servico['valores']['valorPis'] + servico['valores']['valorCofins'] + servico['valores']['valorIr'] + servico['valores']['valorInss'];

            var desconto = parseFloat(somaDesconto, 2);
            var retencaoCalculo = somaRetencoesFederais * servico['valores']['baseCalculo'];
            var retencaoFederal = parseFloat(retencaoCalculo, 2);

            // var servicoCodigoMunicipio = '';
            // var servicoDescricaoMunicipio = '';
            // if (servico['valores']['issRetido'] === 1) {
            //     servicoCodigoMunicipio = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio']['_text'] : ' ';
            //     servicoDescricaoMunicipio = city.name;
            // } else {
            //     console.log(city.nfseKeyword, 145);
            //     if (city.nfseKeyword != 'catalao') {
            //         servicoCodigoMunicipio = (objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio'] && objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio']['_text'] != '') ? objNotaFiscal['InfNfse']['TomadorServico']['Endereco']['CodigoMunicipio']['_text'] : ' ';
            //     } else {
            //         servicoCodigoMunicipio = (objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio'] && objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio']['_text'] != '') ? tomadorServico['endereco']['codigoMunicipio'] : ' ';    
            //     }

            //     servicoDescricaoMunicipio = city.name;
            // }

            const result = {
                providerId: prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj'] ? prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj'] : prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf'],
                nfseNumber: principal['numero'],
                html: html
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

const setCityDataByItsIbgeCode = (cityCode) => {
    for (let i = 0; i < cities.length; i++) {
        const element = cities[i];
        if (element['cityCode'] == cityCode) {
            return element;
        }
    }
}

const setInvoiceType = (typeCode) => {
    const code = Number(typeCode);
    const types = ['Tributação no Município', 'Tributação Fora do Município', 'Isenção', 'Imunidade', 'Exigibilidade Suspensa', 'Exigibilidade Suspensa'];

    for (let i = 0; i < types.length; i++) {
        const element = types[i];

        if ((code - 1) === i) {
            return element;
        }
    }
}

const formatCash = (n) => {
    return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

const formatDate = (data, formato) => {
    if (formato == 'pt-br') {
        return (data.substr(0, 10).split('-').reverse().join('/'));
    } else {
        return (data.substr(0, 10).split('/').reverse().join('-'));
    }
}

module.exports = {
    dam
};