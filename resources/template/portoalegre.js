// Resources
const cities = require('../../resources/json/cities');

//Vendors
const xmlToJson = require('xml-js');

const setDam = (object, xmlNfse) => {
    return new Promise((resolve, reject) => {
        try {
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
        
            const html = `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                    <title>Document</title>
                                    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                                
                                    <style>
                                        /**
                                         * RESET: start
                                         */
                                        html, body, div, span, applet, object, iframe,
                                        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
                                        a, abbr, acronym, address, big, cite, code,
                                        del, dfn, em, img, ins, kbd, q, s, samp,
                                        small, strike, strong, sub, sup, tt, var,
                                        b, u, i, center,
                                        dl, dt, dd, ol, ul, li,
                                        fieldset, form, label, legend,
                                        table, caption, tbody, tfoot, thead, tr, th, td,
                                        article, aside, canvas, details, embed, 
                                        figure, figcaption, footer, header, hgroup, 
                                        menu, nav, output, ruby, section, summary,
                                        time, mark, audio, video {
                                            margin: 0;
                                            padding: 0;
                                            border: 0;
                                            font-size: 100%;
                                            font: inherit;
                                            vertical-align: baseline;
                                        }
                                        /* HTML5 display-role reset for older browsers */
                                        article, aside, details, figcaption, figure, 
                                        footer, header, hgroup, menu, nav, section {
                                            display: block;
                                        }
                                        html { zoom: 0.65 }
                                        body {
                                            line-height: 1;
                                        }
                                        ol, ul {
                                            list-style: none;
                                        }
                                        blockquote, q {
                                            quotes: none;
                                        }
                                        blockquote:before, blockquote:after,
                                        q:before, q:after {
                                            content: '';
                                            content: none;
                                        }
                                        table {
                                            border-collapse: collapse;
                                            border-spacing: 0;
                                        }
                                        /**
                                         * RESET: end
                                         */
                                        
                                        body {
                                            font-family: 'Open Sans', sans-serif;
                                            font-size: 14px;
                                            height: 100%;
                                            border: solid 1px rgb(104, 136, 167);
                                        }
                                
                                        #main {
                                            width: 100%;
                                            margin: auto;
                                        }
                                
                                        #top-bar {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 16px;
                                            padding: 10px 0;
                                            background-clip: border-box;
                                            background: rgb(226, 226, 226);
                                        }
                                
                                        #nfse-area {
                                            width: 100%;
                                            display: -webkit-flex;
                                        }
                                
                                        #nfse-number {
                                            width: 40%;
                                            font-size: 22px;
                                            padding: 5px 0 5px 10px;
                                            border-right: solid 1px rgb(104, 136, 167);
                                        }
                                
                                        #nfse-date {
                                            width: 20%;
                                            padding: 0 0 0 10px;
                                            border-right: solid 1px rgb(104, 136, 167);
                                        }
                                
                                        #nfse-date p:nth-child(1) {
                                            margin: 5px 0 0 0;
                                            font-size: 10px;
                                            line-height: 10px;
                                        }
                                
                                        #nfse-date span:nth-child(1) {
                                            font-size: 10px;
                                        }
                                
                                        #nfse-competence {
                                            width: 20%;
                                            padding: 0 0 0 10px;
                                            border-right: solid 1px rgb(104, 136, 167);
                                        }
                                
                                        #nfse-competence p:nth-child(1) {
                                            margin: 5px 0 0 0;
                                            font-size: 10px;
                                            line-height: 10px;
                                        }
                                
                                        #nfse-code {
                                            width: 20%;
                                            padding: 0 0 0 10px;
                                        }
                                
                                        #nfse-code p:nth-child(1) {
                                            margin: 5px 0 0 0;
                                            font-size: 10px;
                                            line-height: 10px;
                                        }
                                
                                        #emitter-area {
                                            margin-top: 5px;
                                            width: 100%;
                                            display: -webkit-flex;
                                            border: solid 1px rgb(104, 136, 167);
                                            border-radius: 15px;
                                        }
                                
                                        #emitter-picture {
                                            width: 25%;
                                            padding: 10px 0 10px 10px;
                                        }
            
                                        #emitter-picture img {
                                            height: 100px;
                                            max-width: 200px;
                                        }
                                
                                        #emitter-data {
                                            padding: 10px 0 10px 10px;
                                            display: -webkit-flex;
                                            -webkit-flex-wrap: wrap;
                                            width: 75%;
                                        }
                                
                                        #emmiter-company-name {
                                            width: 100%;
                                            font-weight: bolder;
                                        }
                                
                                        #emmiter-cnpj-cpf {
                                            width: 50%;
                                            font-weight: bolder;
                                        }
                                
                                        #emmiter-municipal-registration {
                                            width: 50%;
                                            font-weight: bolder;
                                        }
                                
                                        #emmiter-full-address {
                                            width: 100%;
                                        }
                                
                                        #emmiter-phone {
                                            width: 50%;
                                        }
                                
                                        #emmiter-email {
                                            width: 50%;
                                        }
                                
                                        #taker-area {
                                            width: 100% - 20px;
                                            display: -webkit-flex;
                                            -webkit-flex-wrap: wrap;
                                            padding: 10px;
                                            border: solid 1px rgb(104, 136, 167);
                                            border-radius: 15px;
                                            margin-top: 5px;
                                        }
                                
                                        #taker-title {
                                            width: 100%;
                                            font-weight: bolder;
                                            border-bottom: solid 1px rgb(104, 136, 167);
                                            margin-bottom: 5px;
                                        }
                                
                                        #taker-cnpj-cpf {
                                            width: 50%;
                                            font-weight: bolder;
                                            margin-bottom: 5px;
                                        }
                                
                                        #taker-municipal-registration {
                                            width: 50%;
                                            font-weight: bolder;
                                            margin-bottom: 5px;
                                        }
                                
                                        #taker-company-name {
                                            width: 50%;
                                            font-weight: bolder;
                                            margin-bottom: 5px;
                                        }
                                
                                        #taker-full-address {
                                            width: 100%;
                                            margin-bottom: 5px;
                                        }
                                
                                        #taker-phone {
                                            width: 50%;
                                        }
                                
                                        #taker-email {
                                            width: 50%;
                                        }
                                
                                        #service-area {
                                            width: 100% - 20px;
                                            display: -webkit-flex;
                                            -webkit-flex-wrap: wrap;
                                            padding: 10px;
                                            border: solid 1px rgb(104, 136, 167);
                                            border-radius: 15px;
                                            margin-top: 5px;
                                        }
                                
                                        #service-title {
                                            width: 100%;
                                            font-weight: bolder;
                                            border-bottom: solid 1px rgb(104, 136, 167);
                                            margin-bottom: 5px;
                                        }
                                
                                        #municipal-tax-code {
                                            width: 100% - 20px;
                                            padding: 10px;
                                            margin-top: 5px;
                                            background: rgb(226, 226, 226);
                                        }
                                
                                        #municipal-tax-code p:nth-child(1) {
                                            font-weight: bolder;
                                        }
                                
                                        #lc11603-and-description {
                                            width: 100% - 20px;
                                            padding: 10px;
                                            margin-top: 5px;
                                        }
                                
                                        #lc11603-and-description p:nth-child(1) {
                                            font-weight: bolder;
                                        }
                                
                                        #city-and-code {
                                            width: 100% - 20px;
                                            padding: 10px;
                                            margin-top: 5px;
                                            background: rgb(226, 226, 226);
                                        }
                                
                                        #city-and-code p:nth-child(1) {
                                            font-weight: bolder;
                                        }
                                
                                        #operation-type {
                                            width: 100% - 20px;
                                            float: left;
                                            padding: 10px;
                                            margin-top: 5px;
                                        }
                                
                                        #operation-type p:nth-child(1) {
                                            font-weight: bolder;
                                        }
                                
                                        #tax-area {
                                            width: 100%;
                                            margin-top: 5px;
                                        }
                                
                                        #tax-area-left {
                                            float: left;
                                            margin-right: inherit;
                                            min-width: 45%;
                                            padding: 10px;
                                            border: 1px solid rgb(104, 136, 167);
                                            border-radius: 15px;
                                            height: 120px;
                                        }
                                
                                        #tax-left-title {
                                            font-weight: bolder;
                                        }
                                
                                        #tax-left-title span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-left-title span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #tax-discount span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-discount span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #tax-federal-retention span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-federal-retention span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #tax-iss-taken span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-iss-taken span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #net-value span:nth-child(1) {
                                            float: left;
                                            color: rgb(122, 13, 13);
                                            font-weight: bolder;
                                        }
                                
                                        #net-value span:nth-child(2) {
                                            float: right;
                                            color: rgb(122, 13, 13);
                                            font-weight: bolder;
                                        }
                                        
                                        #tax-area-right {
                                            float: right;
                                            min-width: 45%;
                                            padding: 10px;
                                            border: 1px solid rgb(104, 136, 167);
                                            border-radius: 15px;
                                            height: 120px;
                                        }
                                
                                        #tax-right-title {
                                            font-weight: bolder;
                                        }
                                
                                        #tax-right-title span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-right-title span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #tax-deduction span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #tax-deduction span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #unconditional-discount span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #unconditional-discount span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #calculation-basis span:nth-child(1) {
                                            float: left;
                                            font-weight: bolder;
                                        }
                                
                                        #calculation-basis span:nth-child(2) {
                                            float: right;
                                            font-weight: bolder;
                                        }
                                
                                        #aliquot span:nth-child(1) {
                                            float: left;
                                        }
                                
                                        #aliquot span:nth-child(2) {
                                            float: right;
                                        }
                                
                                        #iss-value span:nth-child(1) {
                                            float: left;
                                            font-weight: bolder;
                                            color: rgb(122, 13, 13);
                                        }
                                
                                        #iss-value span:nth-child(2) {
                                            float: right;
                                            font-weight: bolder;
                                            color: rgb(122, 13, 13);
                                        }
                                
                                        #others-area {
                                            width: 100% - 20px;            
                                            padding: 10px;
                                            border: solid 1px rgb(104, 136, 167);
                                            border-radius: 15px;
                                            margin-top: 5px;
                                        }
                                
                                        #others-area p:nth-child(1) {
                                            font-weight: bolder;
                                        }
                                
                                        #footer-area {
                                            margin-top: 5px;
                                            width: 100%;
                                            display: -webkit-flex;
                                        }
                                
                                        #footer-picture {
                                            width: 15%;
                                            padding: 10px 0 10px 10px;
                                        }
                                
                                        #footer-data {
                                            padding: 10px 0 10px 10px;
                                            display: -webkit-flex;
                                            -webkit-flex-wrap: wrap;
                                            width: 85%;
                                        }
                                
                                        .clear {
                                            clear: both;
                                        }
                                
                                        .row {
                                            border-bottom: 1px solid rgb(104, 136, 167);
                                            margin-bottom: 5px;
                                        }
                                
                                        @page {
                                            size: A4;
                                            margin: 0;
                                        }
                                
                                        @media print {
                                            div#footer-area {
                                                position: fixed;
                                                bottom: 0;
                                            }
                                            html,
                                            body {
                                                width: 210mm;
                                                height: 297mm;
                                                margin: 0.8cm;
                                            }
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div id="main">        
                                        <div id="top-bar">NFS-e - NOTA FISCAL DE SERVIÇOS ELETRÔNICA</div>
                                    
                                        <div id="nfse-area">
                                            <div id="nfse-number">Nº:${principal['numero']}</div>
                                            <div id="nfse-date">
                                                <p>Emitida em:</p>
                                                <p>${formatDate(principal['dataEmissao'].split('T')[0], 'pt-br')} <span>às ${principal['dataEmissao'].split('T')[1].substr(0, 5)}</span></p>
                                            </div>
                                            <div id="nfse-competence">
                                                <p>Competência:</p>
                                                <p>${formatDate(principal['dataEmissao'].split('T')[0], 'pt-br')}</p>
                                            </div>
                                            <div id="nfse-code">
                                                <p>Código de verificação:</p>
                                                <p>${principal['codigoVerificacao']}</p>
                                            </div>
                                        </div>
                                        <div id="emitter-area">
                                            <div id="emitter-picture"><img src="${object.logoEmpresa}" alt="Logo"></div>
                                            <div id="emitter-data">
                                                <div id="emmiter-company-name">${prestadorServico['razaoSocial']}</div>
                                                <div id="emmiter-cnpj-cpf"> 
                                                    CPF/CNPJ: ${prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj']} ${prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf']}
                                                </div>
                                                <div id="emmiter-municipal-registration">
                                                    Inscrição Municipal: ${prestadorServico['identificacaoPrestador']['inscricaoMunicipal']}
                                                </div>
                                                <div id="emmiter-full-address">
                                                    ${prestadorServico['endereco']['endereco']}, ${prestadorServico['endereco']['numero']} - ${prestadorServico['endereco']['bairro']} - CEP: ${prestadorServico['endereco']['cep']}
                                                </div>
                                                <div id="emmiter-phone">Telefone: ${prestadorServico['contato']['telefone']}</div>
                                                <div id="emmiter-email">Email: ${prestadorServico['contato']['email']}</div>
                                            </div>
                                        </div>
                                    
                                        <div id="taker-area">
                                            <div id="taker-title">Tomador do Serviço</div>
                                            <div id="taker-cnpj-cpf">CPF/CNPJ: ${tomadorServico['identificacaoTomador']['cpfCnpj']['cnpj']} ${tomadorServico['identificacaoTomador']['cpfCnpj']['cpf']}</div>
                                            <div id="taker-municipal-registration">Inscrição Municipal: ${tomadorServico['identificacaoTomador']['inscricaoMunicipal']}</div>
                                            <div id="taker-company-name">${tomadorServico['razaoSocial']}</div>
                                            <div id="taker-full-address">
                                                ${tomadorServico['endereco']['endereco']}, ${tomadorServico['endereco']['numero']} - ${tomadorServico['endereco']['bairro']} - CEP: ${tomadorServico['endereco']['cep']} - ${tomadorServico['endereco']['municipio']} / ${tomadorServico['endereco']['uf']}
                                            </div>
                                            <div id="taker-phone">Telefone: ${tomadorServico['contato']['telefone']}</div>
                                            <div id="taker-email">Email: ${tomadorServico['contato']['email']}</div>
                                        </div>
                                    
                                        <div id="service-area">
                                            <div id="service-title">Discriminação do serviço</div>
                                            <div id="service-discrimination">${servico['discriminacao']}</div>
                                        </div>
                                    
                                        <div id="municipal-tax-code">
                                            <p>Código de Tributação Municipal:</p>
                                            <p>${servico['codigoTributacaoMunicipio']}</p>
                                        </div>
                                    
                                        <div id="lc11603-and-description">
                                            <p>Subitem Lista de Serviços LC 116/03 / Descrição:</p>
                                            <p>${descricaoDoServico}</p>
                                        </div>
                                        
                                        <div id="city-and-code">
                                            <p>Cód/Município da incidência do ISSQN</p>
                                            <p>${prestadorServico['endereco']['codigoMunicipio']} / ${prestadorServico['endereco']['municipio']}</p>
                                        </div>
                                        
                                        <div id="operation-type">
                                            <p>Natureza da operação</p>
                                            <p>${principal['naturezaOperacao']}</p>
                                        </div>
                                        <div class="clear"></div>
                                        
                                        <div id="tax-area">
                                            <div id="tax-area-left">
                                                <div id="tax-left-title"><span>Valor do serviço:</span> <span>R$ ${formatCash(parseFloat(servico['valores']['baseCalculo']))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="tax-discount"><span>(-) Descontos: </span> <span>R$ ${formatCash(parseFloat(desconto))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="tax-federal-retention"><span>() Retenções Federais: </span> <span>R$ ${formatCash(parseFloat(retencaoFederal))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="tax-iss-taken"><span>(-) ISS Retido na Fonte: </span> <span>R$ ${(servico['valores']['issRetido'] === 1) ? servico['valores']['valorIss'] : formatCash(parseFloat(0))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="net-value"><span>Valor Liquido: </span> <span>R$ ${servico['valores']['valorLiquidoNfse']}</span></div>
                                                <div class="clear row"></div>
                                            </div>
                                            <div id="tax-area-right">
                                                <div id="tax-right-title"><span>Valor do serviço:</span> <span>R$ ${formatCash(parseFloat(servico['valores']['baseCalculo']))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="tax-deduction"><span>(-) Deduções: </span> <span>R$ ${formatCash(parseFloat(servico['valores']['valorDeducoes']))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="unconditional-discount"><span>(-) Desconto Incondicionado: </span> <span>R$ ${formatCash(parseFloat(servico['valores']['descontoIncondicionado']))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="calculation-basis"><span>(=) Base de Cálculo: </span> <span>R$ ${formatCash(parseFloat(servico['valores']['baseCalculo']))}</span></div>
                                                <div class="clear row"></div>
                                                <div id="aliquot"><span>(x) Alíquota: </span> <span>${(Number((servico['valores']['aliquota']).replace(',', '.')) < 1) ? (Number((servico['valores']['aliquota']).replace(',', '.')) * 100).toFixed(2) : servico['valores']['aliquota']}%</span></div>
                                                <div class="clear row"></div>
                                                <div id="iss-value"><span>(=) Valor do ISS: </span> <span>R$ ${servico['valores']['valorIss']}</span></div>
                                                <div class="clear row"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                
                                        <div id="footer-area">
                                            <div id="footer-picture">
                                                <img src="file://${__dirname + '/../../resources/img/brasoes-municipios/' + object['codigoMunicipio']}.png" alt="Brasão da prefeitura" height="80px">
                                            </div>
                                
                                            <div id="footer-data">
                                                <div id="emmiter-company-name">${city.prefeitura.name} - ${city.prefeitura.secretaria.name}</div>
                                                <div id="emmiter-full-address">
                                                    ${city.prefeitura.secretaria.endereco.endereco}, ${city.prefeitura.secretaria.endereco.numero}, ${city.prefeitura.secretaria.endereco.complemento}, ${city.prefeitura.secretaria.endereco.bairro} - CEP: ${city.prefeitura.secretaria.endereco.cep} - ${city.name} / ${city.stateInitials}
                                                </div>
                                                <div id="emmiter-phone">Telefone: ${city.prefeitura.secretaria.contato.telefone[0].numero}</div>
                                                <div id="emmiter-email">Email: ${city.prefeitura.secretaria.contato.email[0].descricao}</div>
                                            </div>
                                        </div>
                                    </div>
                                </body>
                                </html>`;
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
    setDam
};