// Resources
const cities = require('../../resources/json/cities');

//Vendors
const xmlToJson = require('xml-js');

const setDam = (object, xmlNfse) => {
    return new Promise((resolve, reject) => {
        try {
            const descricaoDoServico = ''; // TO-DO
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
                nfse: JSON.parse(xmlToJson.xml2json(xmlNfse, {
                    compact: true
                }))['S:Envelope']['S:Body']['ns2:ConsultarLoteRpsResponse']['outputXML']['ConsultarLoteRpsResposta']['ListaNfse']['CompNfse']['Nfse'],
                logoEmpresa: object['logoEmpresa'],
                codigoMunicipal: object['codigoMunicipio']
            }

            const objNotaFiscal = parseXmlToJson['nfse'];

            principal['naturezaOperacao'] = setInvoiceType(objNotaFiscal.InfNfse.NaturezaOperacao._text);
            principal['numero'] = objNotaFiscal['InfNfse']['Numero']['_text'];
            principal['dataEmissao'] = objNotaFiscal['InfNfse']['DataEmissao']['_text'];
            principal['codigoVerificacao'] = objNotaFiscal['InfNfse']['CodigoVerificacao']['_text'];

            prestadorServico['identificacaoPrestador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj._text : '';
            prestadorServico['identificacaoPrestador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.Cpf._text : '';
            prestadorServico['identificacaoPrestador']['inscricaoMunicipal'] = (objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal && objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal._text : '';
            prestadorServico['razaoSocial'] = (objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial && objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.RazaoSocial._text : ' ';
            prestadorServico['endereco']['endereco'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Endereco._text : ' ';
            prestadorServico['endereco']['numero'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Numero._text : ' ';
            prestadorServico['endereco']['bairro'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Bairro._text : ' ';
            prestadorServico['endereco']['codigoMunicipio'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text : ' ';
            prestadorServico['endereco']['uf'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Uf._text : ' ';
            prestadorServico['endereco']['cep'] = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep && objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Endereco.Cep._text : ' ';
            prestadorServico['endereco']['municipio'] = setCityDataByItsIbgeCode(prestadorServico['endereco']['codigoMunicipio']).name;
            prestadorServico['contato']['telefone'] = (objNotaFiscal.InfNfse.PrestadorServico.Contato && objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone && objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Contato.Telefone._text : ' ';
            prestadorServico['contato']['email'] = (objNotaFiscal.InfNfse.PrestadorServico.Contato && objNotaFiscal.InfNfse.PrestadorServico.Contato.Email && objNotaFiscal.InfNfse.PrestadorServico.Contato.Email._text != '') ? objNotaFiscal.InfNfse.PrestadorServico.Contato.Email._text : ' ';

            tomadorServico['identificacaoTomador']['cpfCnpj']['cnpj'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj._text != '') ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj._text : '';
            tomadorServico['identificacaoTomador']['cpfCnpj']['cpf'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf._text != '') ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf._text : '';
            tomadorServico['identificacaoTomador']['inscricaoMunicipal'] = (objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal && objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text != '') ? objNotaFiscal.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text : '';
            tomadorServico['razaoSocial'] = (objNotaFiscal.InfNfse.TomadorServico.RazaoSocial && objNotaFiscal.InfNfse.TomadorServico.RazaoSocial._text != '') ? objNotaFiscal.InfNfse.TomadorServico.RazaoSocial._text : ' ';
            tomadorServico['endereco']['endereco'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco && objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Endereco._text : ' ';
            tomadorServico['endereco']['numero'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero && objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Numero._text : ' ';
            tomadorServico['endereco']['bairro'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro && objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Bairro._text : ' ';
            tomadorServico['endereco']['codigoMunicipio'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text : ' ';
            tomadorServico['endereco']['uf'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf && objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Uf._text : ' ';
            tomadorServico['endereco']['cep'] = (objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep && objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Endereco.Cep._text : ' ';
            tomadorServico['endereco']['municipio'] = setCityDataByItsIbgeCode(tomadorServico['endereco']['codigoMunicipio']).nome;
            tomadorServico['contato']['telefone'] = (objNotaFiscal.InfNfse.TomadorServico.Contato && objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone && objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Contato.Telefone._text : ' ';
            tomadorServico['contato']['email'] = (objNotaFiscal.InfNfse.TomadorServico.Contato && objNotaFiscal.InfNfse.TomadorServico.Contato.Email && objNotaFiscal.InfNfse.TomadorServico.Contato.Email._text != '') ? objNotaFiscal.InfNfse.TomadorServico.Contato.Email._text : ' ';


            servico['discriminacao'] = (objNotaFiscal.InfNfse.Servico.Discriminacao && objNotaFiscal.InfNfse.Servico.Discriminacao._text != '') ? objNotaFiscal.InfNfse.Servico.Discriminacao._text : ' ';
            servico['codigoTributacaoMunicipio'] = (objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio && objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio._text != '') ? parseFloat(objNotaFiscal.InfNfse.Servico.CodigoTributacaoMunicipio._text, 2) : 0;
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

            var somaDesconto = servico['valores']['descontoCondicionado'] + servico['valores']['descontoIncondicionado'];
            var somaRetencoesFederais = servico['valores']['valorCsll'] + servico['valores']['valorPis'] + servico['valores']['valorCofins'] + servico['valores']['valorIr'] + servico['valores']['valorInss'];

            var desconto = parseFloat(somaDesconto, 2);
            var retencaoCalculo = somaRetencoesFederais * servico['valores']['baseCalculo'];
            var retencaoFederal = parseFloat(retencaoCalculo, 2);

            var servicoCodigoMunicipio = '';
            var servicoDescricaoMunicipio = '';
            if (servico['valores']['issRetido'] === 1) {
                servicoCodigoMunicipio = (objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio && objNotaFiscal.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text != '') ? objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio']['_text'] : ' ';
                servicoDescricaoMunicipio = setCityDataByItsIbgeCode(servicoCodigoMunicipio).nome;
            } else {
                servicoCodigoMunicipio = (objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio'] && objNotaFiscal['InfNfse']['PrestadorServico']['Endereco']['CodigoMunicipio']['_text'] != '') ? objNotaFiscal['InfNfse']['TomadorServico']['Endereco']['CodigoMunicipio']['_text'] : ' ';
                servicoDescricaoMunicipio = setCityDataByItsIbgeCode(servicoCodigoMunicipio).nome;
            }

            const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
                <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
            
                
            </head>
            <body>
                <div id="main">        
                    <div id="top-bar">NFS-e - NOTA FISCAL DE SERVIÇOS ELETRÔNICA</div>
                
                    <div id="nfse-area">
                        <div id="nfse-number">Nº:${principal['numero']}</div>
                        <div id="nfse-date">
                            <p>Emitida em:</p>
                            <p>${formatDate(principal['dataEmissao'].split('T')[0], 'pt-br')} <span>às ${objNotaFiscal['InfNfse']['DataEmissao']['_text'].split('T')[1].substr(0, 5)}</span></p>
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
                        <div id="emitter-picture"><img src="data:${ObjectNota['mimetype']};base64,${ObjectNota['base64']}" alt="Logo" height="100px"></div>
                        <div id="emitter-data">
                            <div id="emmiter-company-name">${prestador['nomeRazaoSocial']}</div>
                            <div id="emmiter-cnpj-cpf"> 
                                CPF/CNPJ: ${prestador['cnpjCpf']}
                            </div>
                            <div id="emmiter-municipal-registration">
                                Inscrição Municipal: ${prestador['InscricaoMunicipal']}
                            </div>
                            <div id="emmiter-full-address">
                                ${prestador['endereco']}, ${prestador['numero']} - ${prestador['bairro']} - CEP: ${prestador['cep']}
                            </div>
                            <div id="emmiter-phone">Telefone: ${prestador['telefone']}</div>
                            <div id="emmiter-email">Email: ${prestador['email']}</div>
                        </div>
                    </div>
                
                    <div id="taker-area">
                        <div id="taker-title">Tomador do Serviço</div>
                        <div id="taker-cnpj-cpf">CPF/CNPJ: ${tomador['cnpjCpf']}</div>
                        <div id="taker-municipal-registration">Inscrição Municipal: ${tomador['InscricaoMunicipal']}</div>
                        <div id="taker-company-name">${tomador['nomeRazaoSocial']}</div>
                        <div id="taker-full-address">
                            ${tomador['endereco']}, ${tomador['numero']} - ${tomador['bairro']} - CEP: ${tomador['cep']} - ${title['municipioTomador']} / ${title['ufTomador']}
                        </div>
                        <div id="taker-phone">Telefone: ${tomador['telefone']}</div>
                        <div id="taker-email">Email: ${tomador['email']}</div>
                    </div>
                
                    <div id="service-area">
                        <div id="service-title">Discriminação do serviço</div>
                        <div id="service-discrimination">${objNotaFiscal['InfNfse']['Servico']['Discriminacao']['_text']}</div>
                    </div>
                
                    <div id="municipal-tax-code">
                        <p>Código de Tributação Municipal:</p>
                        <p>TRATAR NO OBJETO O CÓDIGO / TRATAR NO OBJETO A DESCRIÇÃO</p>
                    </div>
                
                    <div id="lc11603-and-description">
                        <p>Subitem Lista de Serviços LC 116/03 / Descrição:</p>
                        <p>${resQuery['result']['return']['rows'][0]['DSC_SERVICO']} / TRATAR NO OBJETO A DESCRIÇÃO</p>
                    </div>
                
                    <div id="city-and-code">
                        <p>Cód/Município da incidência do ISSQN</p>
                        <p>TRATAR NO OBJETO O CÓDIGO / TRATAR NO OBJETO A DESCRIÇÃO</p>
                    </div>
                
                    <div id="operation-type">
                        <p>Natureza da operação</p>
                        <p>TRATAR NO OBJETO A DESCRIÇÃO</p>
                    </div>
                    <div class="clear"></div>
                    <div id="tax-area">
                        <div id="tax-area-left">
                            <div id="tax-left-title"><span>Valor do serviço:</span> <span>R$ ${baseCalculo}</span></div>
                            <div class="clear row"></div>
                            <div id="tax-discount"><span>(-) Descontos: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                            <div id="tax-federal-retention"><span>() Retenções Federais: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                            <div id="tax-iss-taken"><span>(-) ISS Retido na Fonte: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                            <div id="net-value"><span>Valor Liquido: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                        </div>
                
                        <div id="tax-area-right">
                            <div id="tax-right-title"><span>Valor do serviço:</span> <span>R$ ${baseCalculo}</span></div>
                            <div class="clear row"></div>
                            <div id="tax-deduction"><span>(-) Deduções: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                            <div id="unconditional-discount"><span>(-) Desconto Incondicionado: </span> <span>R$ TRATAR AQUI</span></div>
                            <div class="clear row"></div>
                            <div id="calculation-basis"><span>(=) Base de Cálculo: </span> <span>R$ ${baseCalculo}</span></div>
                            <div class="clear row"></div>
                            <div id="aliquot"><span>(x) Alíquota: </span> <span>${aliquota}%</span></div>
                            <div class="clear row"></div>
                            <div id="iss-value"><span>(=) Valor do ISS: </span> <span>R$ ${valorIss}</span></div>
                            <div class="clear row"></div>
                        </div>
                    </div>
                    <div class="clear"></div>
            
                    <div id="others-area">
                        <p>Outras informações</p>
                        TRATAR AQUI
                        <p>NFS-e gerada em ambiente de teste. NÃO TEM VALOR JURÍDICO NEM FISCAL.</p>
                    </div>
            
                    <div id="footer-area">
                        <div id="footer-picture">
                            <img src="../png/brasoes/rio-de-janeiro.png" alt="Brasão da prefeitura" height="80px">
                        </div>
            
                        <div id="footer-data">
                            <div id="emmiter-company-name">Prefeitura de Porto Alegre - Secretaria da Fazenda</div>
                            <div id="emmiter-full-address">
                                Rua Siqueira Campos, 1300, 4º andar, Centro Histórico - CEP: 90010-907 - Porto Alegre / RS
                            </div>
                            <div id="emmiter-phone">Telefone:</div>
                            <div id="emmiter-email">Email:</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
            const result = {
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